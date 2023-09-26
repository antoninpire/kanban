"use server";

import { db } from "@/lib/db";
import { columns, tagsByTasks, tasks } from "@/lib/db/schema";
import { auth } from "@/lib/lucia";
import { serverAction } from "@/lib/server-action";
import { createId } from "@paralleldrive/cuid2";
import { eq, gt, gte } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import * as context from "next/headers";
import { z } from "zod";

export const createColumn = serverAction({
  input: z.object({
    projectId: z.string().min(1),
    workspaceId: z.string().min(1),
    name: z.string().min(1, "Name cannot be empty"),
    color: z.string().min(1),
    order: z.union([z.string(), z.number()]).transform(Number),
  }),
  handler: async ({ input }) => {
    const authRequest = auth.handleRequest("POST", context);
    const session = await authRequest.validate();

    if (!session) {
      return {
        error: "You must be logged in to add a column to a project",
      };
    }

    const workspaces = await db.query.workspacesByUsers.findMany({
      where: (table, { eq }) => eq(table.userId, session.user.userId),
    });

    if (!workspaces.some((ws) => ws.workspaceId === input.workspaceId)) {
      return {
        error:
          "You must be a member of the workspace to add a column to a project",
      };
    }

    try {
      const [existingColumns] = await Promise.all([
        db.query.columns.findMany({
          where: (table, { eq, and }) =>
            and(
              eq(table.projectId, input.projectId),
              gte(table.order, input.order)
            ),
          orderBy: (table, { asc }) => asc(table.order),
        }),
        db.insert(columns).values({
          color: input.color,
          name: input.name,
          order: input.order,
          projectId: input.projectId,
        }),
      ]);

      let maxOrder = input.order;
      for (const col of existingColumns) {
        if (col.order === maxOrder) maxOrder++;
        else break;
      }

      // Reorder columns
      if (maxOrder !== input.order)
        await Promise.all(
          existingColumns
            .filter((col) => col.order <= maxOrder)
            .map((col) =>
              db
                .update(columns)
                .set({ order: col.order + 1 })
                .where(eq(columns.id, col.id))
            )
        );
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
      return {
        error: "Unknown error while adding a column",
      };
    }
    revalidatePath("/app/" + input.workspaceId + "/" + input.projectId);
  },
});

export const deleteColumn = serverAction({
  input: z.object({
    columnId: z.string().min(1),
    projectId: z.string().min(1),
    workspaceId: z.string().min(1),
  }),
  handler: async ({ input }) => {
    const authRequest = auth.handleRequest("POST", context);
    const session = await authRequest.validate();

    if (!session) {
      return {
        error: "You must be logged in to delete a column from a project",
      };
    }

    const workspaces = await db.query.workspacesByUsers.findMany({
      where: (table, { eq }) => eq(table.userId, session.user.userId),
    });

    if (!workspaces.some((ws) => ws.workspaceId === input.workspaceId)) {
      return {
        error:
          "You must be a member of the workspace to delete a column from a project",
      };
    }

    try {
      const column = await db.query.columns.findFirst({
        where: (table, { eq }) => eq(table.id, input.columnId),
      });

      if (!column)
        return {
          error: "Column not found",
        };

      const prevColumns = await db.query.columns.findMany({
        where: (table, { and, eq }) =>
          and(
            eq(table.projectId, input.projectId),
            gt(table.order, column.order)
          ),
      });
      await Promise.all([
        db.delete(columns).where(eq(columns.id, input.columnId)),
        prevColumns.map((col) =>
          db
            .update(columns)
            .set({ order: col.order - 1 })
            .where(eq(columns.id, col.id))
        ),
      ]);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
      return {
        error: "Unknown error while colunm from project",
      };
    }

    revalidatePath("/app/" + input.workspaceId + "/" + input.projectId);
  },
});

export const createTask = serverAction({
  input: z.object({
    projectId: z.string().min(1),
    columnId: z.string().min(1),
    workspaceId: z.string().min(1),
    title: z.string().min(1, "Name cannot be empty"),
    description: z.string(),
    priority: z.enum(["low", "medium", "high"]).optional(),
    tags: z.string(),
  }),
  handler: async ({ input }) => {
    const authRequest = auth.handleRequest("POST", context);
    const session = await authRequest.validate();

    if (!session) {
      return {
        error: "You must be logged in to add a task to a project",
      };
    }

    const workspaces = await db.query.workspacesByUsers.findMany({
      where: (table, { eq }) => eq(table.userId, session.user.userId),
    });

    if (!workspaces.some((ws) => ws.workspaceId === input.workspaceId)) {
      return {
        error:
          "You must be a member of the workspace to add a task to a project",
      };
    }

    try {
      const latestTask = await db.query.tasks.findFirst({
        where: (table, { eq }) => eq(table.columnId, input.columnId),
        orderBy: (table, { desc }) => desc(table.order),
      });

      const order = latestTask ? latestTask.order + 1 : 0;
      const id = `tsk_${createId()}`;
      await Promise.all([
        db.insert(tasks).values({
          title: input.title,
          description: input.description,
          columnId: input.columnId,
          priority: input.priority,
          order,
          id,
        }),
        ...(input.tags.length
          ? input.tags.split("|").map((tagId) =>
              db.insert(tagsByTasks).values({
                tagId: Number(tagId),
                taskId: id,
              })
            )
          : []),
      ]);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
      return {
        error: "Unknown error while adding a task",
      };
    }
    revalidatePath("/app/" + input.workspaceId + "/" + input.projectId);
  },
});
