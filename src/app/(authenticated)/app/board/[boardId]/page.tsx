import { getPageSession } from "@/lib/get-page-session";
import { redirect } from "next/navigation";

export default async function BoardPage() {
  const session = await getPageSession();
  if (!session) redirect("/sign-in");

  return <div>Board Page</div>;
}
