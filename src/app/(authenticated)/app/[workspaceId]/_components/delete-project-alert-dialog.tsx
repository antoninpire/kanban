"use client";

import { deleteProject } from "@/app/(authenticated)/app/[workspaceId]/actions";
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
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { experimental_useFormStatus as useFormStatus } from "react-dom";
import { toast } from "sonner";

type DeleteProjectDialogProps = {
  workspaceId: string;
  projectId: string;
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button isLoading={pending} type="submit">
      Continue
    </Button>
  );
}

export default function DeleteProjectAlertDialog(
  props: DeleteProjectDialogProps
) {
  const [open, setOpen] = useState(false);

  const { workspaceId, projectId } = props;

  async function handleAction(formData: FormData) {
    const res = await deleteProject(formData);
    if (res.error || res.result?.error) {
      toast.error(res.result?.error ?? res.error);
      setOpen(false);
      return;
    }
    toast.success("Project deleted !");
    setOpen(false);
  }

  return (
    <>
      <Button
        onClick={() => {
          setOpen(true);
        }}
        variant="ghost"
        size="sm"
        className="text-neutral-300 px-2"
      >
        <Trash2 size={18} />
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
              project and all the data linked to it.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction>
              <form action={handleAction}>
                <input type="hidden" value={workspaceId} name="workspaceId" />
                <input type="hidden" value={projectId} name="projectId" />
                <SubmitButton />
              </form>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
