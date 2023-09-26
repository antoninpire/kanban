"use client";

import { createColumn } from "@/app/(authenticated)/app/[workspaceId]/[projectId]/actions";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import type { Column } from "@/lib/db/schema";
import { getRandomColorHex } from "@/lib/utils";
import { Plus } from "lucide-react";
import { useState } from "react";
import { experimental_useFormStatus as useFormStatus } from "react-dom";

type AddColumnDialogProps = {
  columns: Column[];
  projectId: string;
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

export default function AddColumnDialog(props: AddColumnDialogProps) {
  const [open, setOpen] = useState(false);

  const { toast } = useToast();

  async function handleAction(formData: FormData) {
    const res = await createColumn(formData);
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
      description: "Column added !",
    });
    setOpen(false);
  }

  return (
    <>
      <button
        onClick={() => {
          setOpen(true);
        }}
        className="h-[76vh] ml-3 mt-[38px] w-[280px] bg-white/5 opacity-50 rounded-md flex items-center justify-center px-6 hover:opacity-100"
      >
        <div className="flex items-center gap-2">
          <Plus size={18} />
          Add Column
        </div>
      </button>
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
                  placeholder="Pending"
                  className="col-span-3"
                  name="name"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="order" className="text-right">
                  Position
                </Label>
                <Select name="order" defaultValue="0">
                  <SelectTrigger id="order" className="col-span-3">
                    <SelectValue placeholder="Where should it be placed?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">First</SelectItem>
                    {props.columns.map((col, key) => (
                      <SelectItem
                        key={`position-select-${key}`}
                        value={(key + 1).toString()}
                      >
                        After {col.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
                  defaultValue={"#" + getRandomColorHex()}
                />
              </div>
              <input type="hidden" value={props.projectId} name="projectId" />
              <input
                type="hidden"
                value={props.workspaceId}
                name="workspaceId"
              />
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
