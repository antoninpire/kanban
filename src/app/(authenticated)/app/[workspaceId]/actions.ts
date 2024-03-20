"use server";

import { db } from "@/lib/db";
import {
  columns,
  projects,
  tags,
  workspaces,
  workspacesByUsers,
} from "@/lib/db/schema";
import { serverAction } from "@/lib/server-action";
import { createId } from "@paralleldrive/cuid2";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export const createProject = serverAction({
  input: z.object({
    name: z.string().min(1, "Project name must be at least 1 character"),
    workspaceId: z.string().min(1),
    withDefaultColumns: z.literal("on").or(z.undefined()),
    withDefaultTags: z.literal("on").or(z.undefined()),
  }),
  handler: async ({ input }) => {
    try {
      const projectId = `prj_${createId()}`;
      const promises = [];
      promises.push(
        db.insert(projects).values({
          id: projectId,
          name: input.name,
          workspaceId: input.workspaceId,
        })
      );

      if (input.withDefaultColumns === "on")
        promises.push(
          db.insert(columns).values([
            {
              projectId,
              name: "Backlog",
              color: "#8ba899",
              order: 0,
            },
            {
              projectId,
              name: "Pending",
              color: "#cc6133",
              order: 1,
            },
            {
              projectId,
              name: "In Progress",
              color: "#1ac5db",
              order: 2,
            },
            {
              projectId,
              name: "In Review",
              color: "#25e52e",
              order: 3,
            },
            {
              projectId,
              name: "Finished",
              color: "#ff2e2e",
              order: 4,
            },
          ])
        );
      if (input.withDefaultTags === "on")
        promises.push(
          db.insert(tags).values([
            {
              projectId,
              label: "bug",
              color: "#ef4444",
            },
            {
              projectId,
              label: "feature",
              color: "#3b82f6",
            },
            {
              projectId,
              label: "ui",
              color: "#f472b6",
            },
            {
              projectId,
              label: "doc",
              color: "#15803d",
            },
            {
              projectId,
              label: "test",
              color: "#eab308",
            },
            {
              projectId,
              label: "refacto",
              color: "#64748b",
            },
          ])
        );
      await Promise.all(promises);
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
  handler: async ({ input, session }) => {
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

export const createWorkspace = serverAction({
  input: z.object({
    name: z.string().min(1, "Workspace name must be at least 1 character"),
  }),
  handler: async ({ input, session }) => {
    try {
      const workspaceId = `ws_${createId()}`;
      await Promise.all([
        db.insert(workspaces).values({
          id: workspaceId,
          name: input.name,
        }),
        db.insert(workspacesByUsers).values({
          workspaceId: workspaceId,
          userId: session.user.userId,
          role: "OWNER",
        }),
      ]);
      return {
        workspaceId,
      };
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
      return {
        error: "Unknown error while creating workspace",
      };
    }
  },
});
