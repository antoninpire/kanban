import CreateProjectDialog from "@/app/(authenticated)/app/[workspaceId]/_components/create-project-dialog";
import {
  ProjectsList,
  ProjectsListSkeleton,
} from "@/app/(authenticated)/app/[workspaceId]/_components/projects-list";
import { Input } from "@/components/ui/input";
import { getPageSession } from "@/lib/get-page-session";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export default async function AppPage({
  params,
}: {
  params: { workspaceId: string };
}) {
  const session = await getPageSession();
  if (!session) redirect("/sign-in");

  return (
    <div className="w-full h-full px-5 py-6">
      <h1 className="text-3xl font-semibold">Projects</h1>
      <h4 className="font-light text-neutral-300">Manage your projects</h4>
      <hr className="mt-12" />
      <div className="mt-6">
        <div className="flex items-center gap-3">
          <Input placeholder="Search projects" />
          <CreateProjectDialog workspaceId={params.workspaceId} />
        </div>
      </div>
      <Suspense fallback={<ProjectsListSkeleton />}>
        <ProjectsList workspaceId={params.workspaceId} />
      </Suspense>
    </div>
  );
}
