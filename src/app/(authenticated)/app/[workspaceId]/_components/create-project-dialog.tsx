"use client";

import { createProject } from "@/app/(authenticated)/app/[workspaceId]/actions";
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
import { Plus } from "lucide-react";
import { useState } from "react";
import { experimental_useFormStatus as useFormStatus } from "react-dom";

type CreateProjectDialogProps = {
  workspaceId: string;
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button isLoading={pending} type="submit">
      Save changes
    </Button>
  );
}

export default function CreateProjectDialog(props: CreateProjectDialogProps) {
  const [open, setOpen] = useState(false);

  const { workspaceId } = props;
  const { toast } = useToast();

  async function handleAction(formData: FormData) {
    const res = await createProject(formData);
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
      description: "Project created !",
    });
    setOpen(false);
  }

  return (
    <>
      <Button
        onClick={() => {
          setOpen(true);
        }}
        className="flex items-center gap-2 whitespace-nowrap"
      >
        <Plus size={18} />
        Create Project
      </Button>
      <Dialog
        open={open}
        onOpenChange={(o) => {
          setOpen(o);
        }}
      >
        <DialogContent className="sm:max-w-[425px]">
          <form action={handleAction}>
            <DialogHeader>
              <DialogTitle>Create a Project</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  placeholder="My Personal Project"
                  className="col-span-3"
                  name="name"
                />
                <input type="hidden" value={workspaceId} name="workspaceId" />
              </div>
            </div>
            <DialogFooter>
              <SubmitButton />
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
