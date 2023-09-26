import { db } from "@/lib/db";
import { tasks } from "@/lib/db/schema";
import { auth } from "@/lib/lucia";
import { eq } from "drizzle-orm";
import * as context from "next/headers";
import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";

const schema = z.object({
  sourceOrders: z.record(z.string(), z.number().int().min(0)),
  sourceColumnId: z.string().min(1),
  destinationOrders: z.record(z.string(), z.number().int().min(0)).optional(),
  destinationColumnId: z.string().optional(),
  taskId: z.string().min(1),
});

export async function PUT(request: NextRequest) {
  const authRequest = auth.handleRequest("PUT", context);
  const session = await authRequest.validate();

  if (!session)
    return NextResponse.json({
      error: "You must be logged in to reorder tasks",
    });

  const body = await request.json();

  const parsedBody = schema.safeParse(body);

  if (!parsedBody.success) {
    return NextResponse.json({
      error: "Invalid request body",
    });
  }

  //   console.log(parsedBody.data);
  const {
    sourceColumnId,
    sourceOrders,
    destinationColumnId,
    destinationOrders,
    taskId,
  } = parsedBody.data;

  try {
    const promises = [
      ...Object.entries(sourceOrders).map(([id, order]) =>
        db
          .update(tasks)
          .set({ order, updatedAt: new Date() })
          .where(eq(tasks.id, id))
      ),
      ,
    ];

    if (destinationOrders)
      promises.push(
        ...Object.entries(destinationOrders ?? []).map(([id, order]) =>
          db
            .update(tasks)
            .set({ order, updatedAt: new Date() })
            .where(eq(tasks.id, id))
        )
      );

    if (
      sourceColumnId !== destinationColumnId &&
      !!destinationColumnId &&
      !!taskId
    )
      promises.push(
        db
          .update(tasks)
          .set({ columnId: destinationColumnId })
          .where(eq(tasks.id, taskId))
      );

    await Promise.all(promises);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    return NextResponse.json({
      error: "Failed to reorder tasks",
    });
  }

  return NextResponse.json({
    success: true,
  });
}
