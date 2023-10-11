"use client";

import { createProject } from "@/app/(authenticated)/app/[workspaceId]/actions";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { useState } from "react";
import { experimental_useFormStatus as useFormStatus } from "react-dom";
import { toast } from "sonner";

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

  async function handleAction(formData: FormData) {
    const res = await createProject(formData);
    if (res.error || res.result?.error) {
      toast.error(res.result?.error ?? res.error);
      return;
    }
    toast.success("Project created !");
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
              </div>
              <div className="flex items-center space-x-2 mt-2.5">
                <Checkbox id="withDefaultColumns" name="withDefaultColumns" />
                <label
                  htmlFor="withDefaultColumns"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Include default columns
                </label>
              </div>
              <div className="flex items-center space-x-2 mt-2.5">
                <Checkbox id="withDefaultTags" name="withDefaultTags" />
                <label
                  htmlFor="withDefaultTags"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Include default tags
                </label>
              </div>
            </div>
            <input type="hidden" value={workspaceId} name="workspaceId" />

            <DialogFooter>
              <SubmitButton />
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
