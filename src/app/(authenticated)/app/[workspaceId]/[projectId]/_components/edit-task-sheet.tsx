"use client";

import DeleteTaskAlertDialog from "@/app/(authenticated)/app/[workspaceId]/[projectId]/_components/delete-task-alert-dialog";
import EditTaskPrioritySection from "@/app/(authenticated)/app/[workspaceId]/[projectId]/_components/edit-task/edit-task-priority-section";
import EditTaskSubTasksSection from "@/app/(authenticated)/app/[workspaceId]/[projectId]/_components/edit-task/edit-task-sub-tasks-section";
import EditTaskTagsSection from "@/app/(authenticated)/app/[workspaceId]/[projectId]/_components/edit-task/edit-task-tags-section";
import { editTaskAtom } from "@/app/(authenticated)/app/[workspaceId]/[projectId]/atoms";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { type Tag as TTag } from "@/lib/db/schema";
import { useAtom } from "jotai";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

type EditTaskSheetProps = {
  workspaceId: string;
  projectId: string;
  tags: TTag[];
};

export default function EditTaskSheet(props: EditTaskSheetProps) {
  const [task, setTask] = useAtom(editTaskAtom);
  const [somethingHasChanged, setSomethingHasChanged] = useState(false);

  const { workspaceId, tags, projectId } = props;
  const router = useRouter();

  const handleSubmit = async () => {
    const result = await fetch("/api/tasks", {
      method: "PUT",
      body: JSON.stringify({
        taskInput: task,
        workspaceId,
        taskId: task?.id,
        subTasksInput: task?.subTasks,
        tagsByTaskInput: task?.tagsByTask,
      }),
    });

    const json = await result.json();

    if (!result.ok || !json.success) {
      toast.error(json.error ?? "Something went wrong");
    } else router.refresh();
  };

  const handleChange = () => {
    if (!somethingHasChanged) setSomethingHasChanged(true);
  };

  return (
    <Sheet
      open={task !== null}
      onOpenChange={async (o) => {
        if (!o) {
          if (somethingHasChanged) {
            await handleSubmit();
            setSomethingHasChanged(false);
          }
          setTask(null);
        }
      }}
    >
      <SheetContent className="!w-[38vw] !max-w-none p-0">
        <SheetHeader className="pt-6 px-6">
          <SheetTitle>
            Edit Task
            {!!task && (
              <DeleteTaskAlertDialog
                taskId={task.id}
                columnId={task.columnId}
                projectId={projectId}
                workspaceId={workspaceId}
              />
            )}
          </SheetTitle>
          <SheetDescription>
            Make changes to your task here. Changes will automatically be saved
            whenever you close the sheet.
          </SheetDescription>
        </SheetHeader>
        <ScrollArea className="h-[92vh] pt-4 pb-6 px-6">
          <div>
            <div className="mx-1">
              <Input
                placeholder="The name of your task here"
                className="text-lg mt-3 mb-5"
                name="title"
                defaultValue={task?.title ?? ""}
                onChange={(e) => {
                  if (task)
                    setTask({
                      ...task,
                      title: e.target.value,
                    });
                  handleChange();
                }}
              />
            </div>
            <div className="mx-1">
              <Textarea
                placeholder="The description of your task here"
                className="mt-3 mb-5"
                rows={3}
                style={{ height: `${3 * 45}px` }}
                name="description"
                defaultValue={task?.description ?? ""}
                onChange={(e) => {
                  if (task)
                    setTask({
                      ...task,
                      description: e.target.value,
                    });
                  handleChange();
                }}
              />
            </div>
          </div>
          <hr />
          <EditTaskPrioritySection handleChange={handleChange} />
          <hr />
          <EditTaskTagsSection tags={tags} handleChange={handleChange} />
          <hr />
          <EditTaskSubTasksSection handleChange={handleChange} />
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
