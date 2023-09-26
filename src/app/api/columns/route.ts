import { db } from "@/lib/db";
import { columns } from "@/lib/db/schema";
import { auth } from "@/lib/lucia";
import { eq } from "drizzle-orm";
import * as context from "next/headers";
import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";

const schema = z.object({
  orders: z.record(z.string(), z.number().int().min(0)),
});

export async function PUT(request: NextRequest) {
  const authRequest = auth.handleRequest("PUT", context);
  const session = await authRequest.validate();

  if (!session)
    return NextResponse.json({
      error: "You must be logged in to reorder columns",
    });

  const body = await request.json();

  const parsedBody = schema.safeParse(body);

  if (!parsedBody.success) {
    return NextResponse.json({
      error: "Invalid request body",
    });
  }

  //   console.log(parsedBody.data);
  const { orders } = parsedBody.data;

  try {
    await Promise.all(
      Object.entries(orders).map(([id, order]) =>
        db.update(columns).set({ order }).where(eq(columns.id, id))
      )
    );
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    return NextResponse.json({
      error: "Failed to reorder columns",
    });
  }

  return NextResponse.json({
    success: true,
  });
}
