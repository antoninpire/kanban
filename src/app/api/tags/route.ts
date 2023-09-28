import { db } from "@/lib/db";
import { tags, tagsByTasks } from "@/lib/db/schema";
import { auth } from "@/lib/lucia";
import { eq } from "drizzle-orm";
import { createSelectSchema } from "drizzle-zod";
import * as context from "next/headers";
import { NextResponse, type NextRequest } from "next/server";
import z from "zod";

const schema = z.object({
  tags: createSelectSchema(tags)
    .omit({
      createdAt: true,
    })
    .array(),
  projectId: z.string().min(1),
  workspaceId: z.string().min(1),
});

export async function PUT(request: NextRequest) {
  const authRequest = auth.handleRequest("PUT", context);
  const session = await authRequest.validate();

  if (!session)
    return NextResponse.json({
      error: "You must be logged in to edit tags",
    });

  const body = await request.json();

  const parsedBody = schema.safeParse(body);

  if (!parsedBody.success) {
    return NextResponse.json({
      error: "Invalid request body",
    });
  }

  const input = parsedBody.data;

  const workspaces = await db.query.workspacesByUsers.findMany({
    where: (table, { eq }) => eq(table.userId, session.user.userId),
  });

  if (!workspaces.some((ws) => ws.workspaceId === input.workspaceId)) {
    return NextResponse.json({
      error:
        "You must be a member of the workspace to edit tags from a project",
    });
  }

  try {
    const previousTags = await db.query.tags.findMany({
      where: (table, { eq }) => eq(table.projectId, input.projectId),
    });
    const tagsNotInPrevious = input.tags.filter(
      (tag) => !previousTags.some((prevTag) => prevTag.id === tag.id)
    ); // tags to insert
    const tagsMissingFromPrevious = previousTags.filter(
      (prevTag) => !input.tags.some((tag) => tag.id === prevTag.id)
    ); // tags to delete
    const tagsInBoth = input.tags.filter((tag) =>
      previousTags.some((prevTag) => prevTag.id === tag.id)
    ); // tags to update

    await Promise.all([
      ...tagsMissingFromPrevious.map((tag) =>
        db.delete(tags).where(eq(tags.id, tag.id))
      ),
      ...tagsMissingFromPrevious.map((tag) =>
        db.delete(tagsByTasks).where(eq(tagsByTasks.tagId, tag.id))
      ),
      ...tagsNotInPrevious.map((tag) => db.insert(tags).values(tag)),
      ...tagsInBoth.map((tag) =>
        db.update(tags).set(tag).where(eq(tags.id, tag.id))
      ),
    ]);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
    return NextResponse.json({
      error: "Unknown error while editing your tags",
    });
  }
  return NextResponse.json({
    success: true,
  });
}
