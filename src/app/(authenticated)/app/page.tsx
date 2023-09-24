import { db } from "@/lib/db";
import { getPageSession } from "@/lib/get-page-session";
import { redirect } from "next/navigation";

export default async function AppPage() {
  const session = await getPageSession();
  if (!session) redirect("/sign-in");

  const workspaceByUser = await db.query.workspacesByUsers.findFirst({
    where: (table, { eq }) => eq(table.userId, session.user.userId),
  });

  if (workspaceByUser) redirect(`/app/${workspaceByUser.workspaceId}`);

  return <div>App Page</div>;
}
