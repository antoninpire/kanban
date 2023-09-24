import { Button } from "@/components/ui/button";
import { db } from "@/lib/db";
import { getPageSession } from "@/lib/get-page-session";
import { Plus, Tags, Users } from "lucide-react";
import { notFound, redirect } from "next/navigation";

export default async function BoardPage({
  params,
}: {
  params: {
    workspaceId: string;
    projectId: string;
  };
}) {
  const session = await getPageSession();
  if (!session) redirect("/sign-in");

  const project = await db.query.projects.findFirst({
    where: (table, { eq }) => eq(table.id, params.projectId),
  });

  if (!project) notFound();

  return (
    <div className="w-full h-[100vh] overflow-hidden">
      <div className="h-[15vh] mx-5 pt-6 pb-1.5 border-b border-b-neutral-600">
        <h1 className="text-3xl font-semibold">{project.name}</h1>
        <h4 className="font-light text-neutral-400">Manage {project.name}</h4>
        <div className="h-12 flex items-end gap-2">
          <Button size="xs" variant="outline">
            <Plus size={18} />
            Add Task
          </Button>
          <Button size="xs" variant="outline">
            <Tags size={18} />
            Manage Tags
          </Button>
          <Button size="xs" variant="outline">
            <Users size={18} />
            Manage Collaborators
          </Button>
        </div>
      </div>

      <div className="flex overflow-x-scroll items-center h-[85vh] overflow-y-hidden">
        <div className="flex flex-nowrap gap-3 px-4">
          <div className="h-[80vh] w-[250px] bg-white/5 rounded-md">Hello</div>
          <div className="h-[80vh] w-[250px] bg-white/5 rounded-md">Hello</div>
          <div className="h-[80vh] w-[250px] bg-white/5 rounded-md">Hello</div>
          <div className="h-[80vh] w-[250px] bg-white/5 rounded-md">Hello</div>
          <div className="h-[80vh] w-[250px] bg-white/5 rounded-md">Hello</div>
          <div className="h-[80vh] w-[250px] bg-white/5 rounded-md">Hello</div>
          <div className="h-[80vh] w-[250px] bg-white/5 rounded-md">Hello</div>
          <div className="h-[80vh] w-[250px] bg-white/5 rounded-md">Hello</div>
        </div>
      </div>
    </div>
  );
}
