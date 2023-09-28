import AddColumnDialog from "@/app/(authenticated)/app/[workspaceId]/[projectId]/_components/add-column-dialog";
import AddTaskDialog from "@/app/(authenticated)/app/[workspaceId]/[projectId]/_components/add-task-dialog";
import Board from "@/app/(authenticated)/app/[workspaceId]/[projectId]/_components/board";
import EditColumnDialog from "@/app/(authenticated)/app/[workspaceId]/[projectId]/_components/edit-column-dialog";
import EditTaskSheet from "@/app/(authenticated)/app/[workspaceId]/[projectId]/_components/edit-task-sheet";
import ManageTagsDialog from "@/app/(authenticated)/app/[workspaceId]/[projectId]/_components/manage-tags-dialog";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/db";
import { getPageSession } from "@/lib/get-page-session";
import { Plus, Users } from "lucide-react";
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

  const [project, columns, tags] = await Promise.all([
    db.query.projects.findFirst({
      where: (table, { eq }) => eq(table.id, params.projectId),
    }),
    db.query.columns.findMany({
      where: (table, { eq }) => eq(table.projectId, params.projectId),
      orderBy: (table, { asc }) => asc(table.order),
      with: {
        tasks: {
          orderBy: (table, { asc }) => asc(table.order),
          with: {
            tagsByTask: {
              with: {
                tag: true,
              },
            },
            subTasks: true,
          },
        },
      },
    }),
    db.query.tags.findMany({
      where: (table, { eq }) => eq(table.projectId, params.projectId),
    }),
  ]);

  if (!project) notFound();

  return (
    <>
      <div className="w-full h-[100vh] overflow-hidden">
        <div className="h-[15vh] mx-5 pt-6 pb-1.5 border-b border-b-neutral-600">
          <h1 className="text-3xl font-semibold">{project.name}</h1>
          <h4 className="font-light text-neutral-300">Manage {project.name}</h4>
          <div className="h-12 flex items-end gap-2">
            <Button size="xs" variant="outline">
              <Plus size={18} />
              Add Task
            </Button>
            <ManageTagsDialog
              tags={tags}
              projectId={params.projectId}
              workspaceId={params.workspaceId}
            />
            <Button size="xs" variant="outline">
              <Users size={18} />
              Manage Collaborators
            </Button>
          </div>
        </div>

        <div className="flex overflow-x-scroll items-center h-[85vh] overflow-y-hidden">
          <Board
            columns={columns}
            workspaceId={params.workspaceId}
            projectId={params.projectId}
          />
          <AddColumnDialog
            columns={columns}
            projectId={params.projectId}
            workspaceId={params.workspaceId}
          />
        </div>
      </div>
      <AddTaskDialog
        workspaceId={params.workspaceId}
        projectId={params.projectId}
        tags={tags}
      />
      <EditTaskSheet
        workspaceId={params.workspaceId}
        projectId={params.projectId}
        tags={tags}
      />
      <EditColumnDialog
        workspaceId={params.workspaceId}
        projectId={params.projectId}
      />
    </>
  );
}
