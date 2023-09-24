import { authSchema } from "@/common/auth-schema";
import { auth } from "@/lib/lucia";
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
        error: "Invalid email or password",
      },
      {
        status: 400,
      }
    );

  const { email, password } = parsedBody.data;

  try {
    const key = await auth.useKey("email", email.toLowerCase(), password);
    const session = await auth.createSession({
      userId: key.userId,
      attributes: {
        email,
      },
    });
    const authRequest = auth.handleRequest(request.method, context);
    authRequest.setSession(session);
    return new Response(null, {
      status: 302,
      headers: {
        Location: "/app",
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
