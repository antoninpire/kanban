"use server";

import { db } from "@/lib/db";
import { projects } from "@/lib/db/schema";
import { auth } from "@/lib/lucia";
import { serverAction } from "@/lib/server-action";
import { createId } from "@paralleldrive/cuid2";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import * as context from "next/headers";
import { z } from "zod";

export const createProject = serverAction({
  input: z.object({
    name: z.string().min(1, "Project name must be at least 1 character"),
    workspaceId: z.string().min(1),
  }),
  handler: async ({ input }) => {
    const authRequest = auth.handleRequest("POST", context);
    const session = await authRequest.validate();

    if (!session) {
      return {
        error: "You must be logged in to create a project",
      };
    }
    try {
      const projectId = `prj_${createId()}`;
      await db.insert(projects).values({
        id: projectId,
        name: input.name,
        workspaceId: input.workspaceId,
      });
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
      return {
        error: "Unknown error while creating project",
      };
    }

    revalidatePath("/app/" + input.workspaceId);
  },
});

export const deleteProject = serverAction({
  input: z.object({
    projectId: z.string().min(1),
    workspaceId: z.string().min(1),
  }),
  handler: async ({ input }) => {
    const authRequest = auth.handleRequest("POST", context);
    const session = await authRequest.validate();

    if (!session) {
      return {
        error: "You must be logged in to delete a project",
      };
    }

    const workspaces = await db.query.workspacesByUsers.findMany({
      where: (table, { eq }) => eq(table.userId, session.user.userId),
    });

    if (!workspaces.some((ws) => ws.workspaceId === input.workspaceId)) {
      return {
        error: "You must be a member of the workspace to delete a project",
      };
    }

    try {
      await db.delete(projects).where(eq(projects.id, input.projectId));
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
      return {
        error: "Unknown error while deleting project",
      };
    }

    revalidatePath("/app/" + input.workspaceId);
  },
});
