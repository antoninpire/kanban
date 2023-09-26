"use client";

import { createTask } from "@/app/(authenticated)/app/[workspaceId]/[projectId]/actions";
import { addTaskColumnIdAtom } from "@/app/(authenticated)/app/[workspaceId]/[projectId]/atoms";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { useAtom } from "jotai";
import { experimental_useFormStatus as useFormStatus } from "react-dom";

type AddTaskSheetProps = {
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

export default function AddTaskSheet(props: AddTaskSheetProps) {
  const [columnId, setColumnId] = useAtom(addTaskColumnIdAtom);

  const { projectId, workspaceId } = props;
  const { toast } = useToast();

  async function handleAction(formData: FormData) {
    const res = await createTask(formData);
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
    setColumnId(null);
  }

  return (
    <Sheet
      open={columnId !== null}
      onOpenChange={(o) => {
        if (!o) setColumnId(null);
      }}
    >
      <SheetContent className="!w-[38vw] !max-w-none">
        <form action={handleAction}>
          <SheetHeader>
            <SheetTitle>Create Task</SheetTitle>
            <SheetDescription>
              Make changes to your profile here. Click save when you&apos;re
              done.
            </SheetDescription>
          </SheetHeader>
          <div>
            <Textarea
              placeholder="The name of your task here"
              className="text-lg mt-3 border-none mb-5"
              name="title"
            />
            <Textarea
              placeholder="The description of your task here"
              className="mt-3 border-none mb-5"
              rows={5}
              style={{ height: `${5 * 45}px` }}
              name="description"
            />
          </div>
          <SheetFooter>
            <SheetClose asChild>
              <SubmitButton />
            </SheetClose>
          </SheetFooter>
          <input type="hidden" value={columnId ?? ""} name="columnId" />
          <input type="hidden" value={projectId} name="projectId" />
          <input type="hidden" value={workspaceId} name="workspaceId" />
        </form>
      </SheetContent>
    </Sheet>
  );
}
