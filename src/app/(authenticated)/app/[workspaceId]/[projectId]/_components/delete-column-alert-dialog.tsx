"use client";

import { deleteColumn } from "@/app/(authenticated)/app/[workspaceId]/[projectId]/actions";
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
import { useToast } from "@/components/ui/use-toast";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { experimental_useFormStatus as useFormStatus } from "react-dom";

type DeleteColumnAlertDialogProps = {
  workspaceId: string;
  projectId: string;
  columnId: number;
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button isLoading={pending} type="submit">
      Continue
    </Button>
  );
}

export default function DeleteColumnAlertDialog(
  props: DeleteColumnAlertDialogProps
) {
  const [open, setOpen] = useState(false);

  const { workspaceId, projectId, columnId } = props;
  const { toast } = useToast();

  async function handleAction(formData: FormData) {
    const res = await deleteColumn(formData);
    if (res.error || res.result?.error) {
      toast({
        title: "Error",
        description: res.result?.error ?? res.error,
        variant: "destructive",
      });
      setOpen(false);
      return;
    }
    toast({
      title: "Success",
      description: "Column removed !",
    });
    setOpen(false);
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
              column and all the data linked to it.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction>
              <form action={handleAction}>
                <input type="hidden" value={workspaceId} name="workspaceId" />
                <input type="hidden" value={projectId} name="projectId" />
                <input type="hidden" value={columnId} name="columnId" />
                <SubmitButton />
              </form>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
