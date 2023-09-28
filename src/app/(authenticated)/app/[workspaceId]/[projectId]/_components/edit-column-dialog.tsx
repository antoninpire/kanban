"use client";

import { editColumn } from "@/app/(authenticated)/app/[workspaceId]/[projectId]/actions";
import { editColumnAtom } from "@/app/(authenticated)/app/[workspaceId]/[projectId]/atoms";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { useAtom } from "jotai";
import { experimental_useFormStatus as useFormStatus } from "react-dom";

type EditColumnDialogProps = {
  workspaceId: string;
  projectId: string;
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button isLoading={pending} type="submit">
      Save changes
    </Button>
  );
}

export default function EditColumnDialog(props: EditColumnDialogProps) {
  const [column, setColumn] = useAtom(editColumnAtom);

  const { toast } = useToast();

  async function handleAction(formData: FormData) {
    const res = await editColumn(formData);
    if (res.error || res.result?.error) {
      toast({
        title: "Error",
        description: res.result?.error ?? res.error,
        variant: "destructive",
      });
      return;
    }
    toast({
      title: "Success",
      description: "Column updated !",
    });
    setColumn(null);
  }

  return (
    <Dialog
      open={column !== null}
      onOpenChange={() => {
        setColumn(null);
      }}
    >
      <DialogContent className="sm:max-w-[425px]">
        <form action={handleAction}>
          <DialogHeader>
            <DialogTitle>Edit Column</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                placeholder="Pending"
                className="col-span-3"
                name="name"
                defaultValue={column?.name}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="color" className="text-right">
                Color
              </Label>
              <input
                type="color"
                name="color"
                id="color"
                className="col-span-3"
                defaultValue={column?.color}
              />
            </div>
          </div>
          <DialogFooter>
            <SubmitButton />
          </DialogFooter>
          <input type="hidden" value={column?.id} name="columnId" />
          <input type="hidden" value={props.projectId} name="projectId" />
          <input type="hidden" value={props.workspaceId} name="workspaceId" />
        </form>
      </DialogContent>
    </Dialog>
  );
}
