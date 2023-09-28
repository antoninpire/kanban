"use client";

import { createWorkspace } from "@/app/(authenticated)/app/[workspaceId]/actions";
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
import { useRouter } from "next/navigation";
import { useState } from "react";
import { experimental_useFormStatus as useFormStatus } from "react-dom";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button isLoading={pending} type="submit">
      Save changes
    </Button>
  );
}

export default function CreateWorkspaceDialog() {
  const [open, setOpen] = useState(false);

  const { toast } = useToast();
  const router = useRouter();

  async function handleAction(formData: FormData) {
    const res = await createWorkspace(formData);
    if (res.error || res.result?.error || !res.result?.workspaceId) {
      toast({
        title: "Error",
        description: res.result?.error ?? res.error,
        variant: "destructive",
      });
      return;
    }
    toast({
      title: "Success",
      description: "Workspace created !",
    });
    setOpen(false);
    router.push("/app/" + res.result.workspaceId);
  }

  return (
    <>
      <Button
        variant="ghost"
        className="w-full text-left"
        onClick={() => {
          setOpen(true);
        }}
      >
        <Plus className="w-4 h-4" />
        Create workspace
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
              <DialogTitle>Create a Workspace</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  placeholder="Personal Workspace"
                  className="col-span-3"
                  name="name"
                />
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
