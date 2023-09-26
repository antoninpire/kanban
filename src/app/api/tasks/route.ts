import { db } from "@/lib/db";
import { subTasks, tagsByTasks, tasks } from "@/lib/db/schema";
import { auth } from "@/lib/lucia";
import { and, eq } from "drizzle-orm";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import * as context from "next/headers";
import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";

const schema = z.object({
  taskInput: createInsertSchema(tasks).omit({
    createdAt: true,
    updatedAt: true,
    id: true,
  }),
  taskId: z.string().min(1),
  workspaceId: z.string().min(1),
  subTasksInput: createSelectSchema(subTasks)
    .omit({
      createdAt: true,
      updatedAt: true,
    })
    .array()
    .optional(),
  tagsByTaskInput: createSelectSchema(tagsByTasks)
    .omit({
      createdAt: true,
    })
    .array()
    .optional(),
});

export async function PUT(request: NextRequest) {
  const authRequest = auth.handleRequest("PUT", context);
  const session = await authRequest.validate();

  if (!session)
    return NextResponse.json({
      error: "You must be logged in to edit tasks",
    });

  const body = await request.json();

  const parsedBody = schema.safeParse(body);

  if (!parsedBody.success) {
    return NextResponse.json({
      error: "Invalid request body",
    });
  }

  //   console.log(parsedBody.data);
  const { taskInput, workspaceId, taskId, subTasksInput, tagsByTaskInput } =
    parsedBody.data;

  const workspaces = await db.query.workspacesByUsers.findMany({
    where: (table, { eq }) => eq(table.userId, session.user.userId),
  });

  if (!workspaces.some((ws) => ws.workspaceId === workspaceId)) {
    return NextResponse.json({
      error: "You must be a member of the workspace to delete a project",
    });
  }

  try {
    const task = await db.query.tasks.findFirst({
      where: (table, { eq }) => eq(table.id, taskId),
      with: {
        subTasks: true,
        tagsByTask: true,
      },
    });

    if (!task) {
      return NextResponse.json({
        error: "Task doesn't exist",
      });
    }

    await Promise.all([
      db
        .update(tasks)
        .set({
          ...taskInput,
          updatedAt: new Date(),
        })
        .where(eq(tasks.id, taskId)),
      // Delete subtasks not present anymore
      ...(
        task.subTasks.filter(
          (s) => !subTasksInput?.find((st) => st.id === s.id)
        ) ?? []
      ).map((st) => db.delete(subTasks).where(eq(subTasks.id, st.id))),
      // Update and insert new / updated subtasks
      ...(subTasksInput?.map((subTask) => {
        const previous = task.subTasks.find((t) => t.id === subTask.id);
        if (
          previous &&
          (previous.title !== subTask.title ||
            previous.achieved !== subTask.achieved)
        ) {
          return db
            .update(subTasks)
            .set({
              title: subTask.title,
              achieved: subTask.achieved,
              updatedAt: new Date(),
            })
            .where(eq(subTasks.id, subTask.id));
        }
        if (!previous) {
          return db.insert(subTasks).values({
            ...subTask,
            taskId: task.id,
          });
        }
      }) ?? []),
      // Delete tags not present anymore
      ...(
        task.tagsByTask.filter(
          (t) => !tagsByTaskInput?.find((tbt) => tbt.tagId === t.tagId)
        ) ?? []
      ).map((t) =>
        db
          .delete(tagsByTasks)
          .where(
            and(eq(tagsByTasks.tagId, t.tagId), eq(tagsByTasks.taskId, task.id))
          )
      ),
      // Insert new tags
      ...(
        tagsByTaskInput?.filter(
          (t) => !task.tagsByTask.find((tbt) => tbt.tagId === t.tagId)
        ) ?? []
      ).map((t) =>
        db.insert(tagsByTasks).values({
          tagId: t.tagId,
          taskId: task.id,
        })
      ),
    ]);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    return NextResponse.json({
      error: "Failed to edit task",
    });
  }

  return NextResponse.json({
    success: true,
  });
}
