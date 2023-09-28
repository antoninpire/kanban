import DeleteProjectAlertDialog from "@/app/(authenticated)/app/[workspaceId]/_components/delete-project-alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { db } from "@/lib/db";
import dayjs from "dayjs";
import Link from "next/link";

type ProjectsListProps = {
  workspaceId: string;
};

export function ProjectsListSkeleton() {
  return (
    <div className="flex items-center gap-y-4 gap-x-2 flex-wrap">
      <Skeleton className="rounded w-[290px] h-[110px]" />
      <Skeleton className="rounded w-[290px] h-[110px]" />
      <Skeleton className="rounded w-[290px] h-[110px]" />
      <Skeleton className="rounded w-[290px] h-[110px]" />
    </div>
  );
}

export async function ProjectsList(props: ProjectsListProps) {
  const { workspaceId } = props;

  const projects = await db.query.projects.findMany({
    where: (table, { eq }) => eq(table.workspaceId, workspaceId),
    orderBy: (table, { desc }) => desc(table.createdAt),
  });

  if (!projects.length)
    return (
      <div className="w-full h-[75vh] flex justify-center items-center">
        <p className="text-neutral-300 text-lg font-light">
          No projects found.
        </p>
      </div>
    );

  return (
    <div className="flex items-center gap-y-4 gap-x-2 flex-wrap mt-4">
      {projects.map((project) => (
        <Card key={project.id} className="w-[290px] bg-white/5">
          <CardHeader className="py-4 pl-4 pr-1.5">
            <CardTitle className="text-lg flex items-center justify-between w-full">
              {project.name}
              <div className="flex items-center">
                <DeleteProjectAlertDialog
                  workspaceId={workspaceId}
                  projectId={project.id}
                />
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mt-2.5">
              <p className="text-xs text-neutral-300">
                {dayjs(project.createdAt).format("MMMM D, YYYY")}
              </p>
              <Link href={`/app/${workspaceId}/${project.id}`}>
                <Button size="xs">Open</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
