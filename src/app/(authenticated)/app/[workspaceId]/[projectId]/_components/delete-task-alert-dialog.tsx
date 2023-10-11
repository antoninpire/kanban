"use client";

import { deleteTask } from "@/app/(authenticated)/app/[workspaceId]/[projectId]/actions";
import { editTaskAtom } from "@/app/(authenticated)/app/[workspaceId]/[projectId]/atoms";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useSetAtom } from "jotai";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { experimental_useFormStatus as useFormStatus } from "react-dom";
import { toast } from "sonner";

type DeleteTaskAlertDialogProps = {
  workspaceId: string;
  projectId: string;
  columnId: string;
  taskId: string;
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button isLoading={pending} type="submit">
      Continue
    </Button>
  );
}

export default function DeleteTaskAlertDialog(
  props: DeleteTaskAlertDialogProps
) {
  const [open, setOpen] = useState(false);
  const setTask = useSetAtom(editTaskAtom);

  const { workspaceId, projectId, columnId, taskId } = props;

  async function handleAction(formData: FormData) {
    const res = await deleteTask(formData);
    if (res.error || res.result?.error) {
      toast.error(res.result?.error ?? res.error);
      setOpen(false);
      setTask(null);
      return;
    }
    toast.success("Task deleted !");
    setOpen(false);
    setTask(null);
  }

  return (
    <>
      <Button
        onClick={() => {
          setOpen(true);
        }}
        type="submit"
        variant="ghost"
        size="xs"
        className="ml-2"
      >
        <div className="w-full flex items-center gap-2">
          <Trash2 size={16} />
          Delete
        </div>
      </Button>
      <AlertDialog
        open={open}
        onOpenChange={(o) => {
          setOpen(o);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              task and all the data linked to it.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction>
              <form action={handleAction}>
                <input type="hidden" value={workspaceId} name="workspaceId" />
                <input type="hidden" value={projectId} name="projectId" />
                <input type="hidden" value={columnId} name="columnId" />
                <input type="hidden" value={taskId} name="taskId" />
                <SubmitButton />
              </form>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
