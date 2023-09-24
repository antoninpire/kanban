import { authSchema } from "@/common/auth-schema";
import { db } from "@/lib/db";
import { workspaces, workspacesByUsers } from "@/lib/db/schema";
import { auth } from "@/lib/lucia";
import { createId } from "@paralleldrive/cuid2";
import * as context from "next/headers";
import { NextResponse, type NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const data = await request.formData();
  const body = {
    email: data.get("email"),
    password: data.get("password"),
  };
  const parsedBody = authSchema.safeParse(body);

  if (!parsedBody.success)
    return NextResponse.json(
      {
        error:
          parsedBody.error.issues[0]?.message ?? "Invalid email or password",
      },
      {
        status: 400,
      }
    );

  const { email, password } = parsedBody.data;

  try {
    const user = await auth.createUser({
      key: {
        providerId: "email",
        providerUserId: email.toLowerCase(),
        password,
      },
      attributes: {
        email,
      },
    });
    const session = await auth.createSession({
      userId: user.userId,
      attributes: {
        email,
      },
    });
    const workspaceId = `ws_${createId()}`;
    await Promise.all([
      db.insert(workspaces).values({
        name: "Personal Workspace",
        id: workspaceId,
      }),
      db.insert(workspacesByUsers).values({
        userId: user.userId,
        workspaceId,
      }),
    ]);
    const authRequest = auth.handleRequest(request.method, context);
    authRequest.setSession(session);
    return new Response(null, {
      status: 302,
      headers: {
        Location: `/app/${workspaceId}`,
      },
    });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    return NextResponse.json(
      {
        error: "An unknown error occurred",
      },
      {
        status: 500,
      }
    );
  }
}
