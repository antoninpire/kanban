import "@/app/globals.css";
import Sidebar from "@/components/sidebar";
import { getPageSession } from "@/lib/get-page-session";
import { redirect } from "next/navigation";

export default async function AppLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: {
    workspaceId: string;
    projectId: string;
  };
}) {
  const session = await getPageSession();
  if (!session) redirect("/sign-in");

  return (
    <>
      <Sidebar
        user={session.user}
        workspaceId={params.workspaceId}
        projectId={params.projectId}
      />
      <main className="ml-64 w-[calc(100vw-16rem)] h-full">{children}</main>
    </>
  );
}
