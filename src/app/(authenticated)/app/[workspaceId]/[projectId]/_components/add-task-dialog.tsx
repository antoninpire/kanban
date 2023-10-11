"use client";

import { createTask } from "@/app/(authenticated)/app/[workspaceId]/[projectId]/actions";
import { addTaskColumnIdAtom } from "@/app/(authenticated)/app/[workspaceId]/[projectId]/atoms";
import { Badge } from "@/components/ui/badge";
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
import { Textarea } from "@/components/ui/textarea";
import type { Tag } from "@/lib/db/schema";
import { hexToRgb } from "@/lib/utils";
import { useAtom } from "jotai";
import { useState } from "react";
import { experimental_useFormStatus as useFormStatus } from "react-dom";
import { toast } from "sonner";

type AddTaskDialogProps = {
  projectId: string;
  workspaceId: string;
  tags: Tag[];
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button isLoading={pending} type="submit">
      Save changes
    </Button>
  );
}

export default function AddTaskDialog(props: AddTaskDialogProps) {
  const [columnId, setColumnId] = useAtom(addTaskColumnIdAtom);
  const [priority, setPriority] = useState<
    "low" | "medium" | "high" | undefined
  >();
  const [currentTagIds, setCurrentTagIds] = useState<string[]>([]);

  const { projectId, workspaceId, tags } = props;

  async function handleAction(formData: FormData) {
    const res = await createTask(formData);
    if (res.error || res.result?.error) {
      toast.error(res.result?.error ?? res.error);
      return;
    }
    toast.success("Column added !");
    setCurrentTagIds([]);
    setPriority(undefined);
    setColumnId(null);
  }

  return (
    <Dialog
      open={columnId !== null}
      onOpenChange={() => {
        setColumnId(null);
      }}
    >
      <DialogContent className="sm:max-w-[425px]">
        <form action={handleAction}>
          <DialogHeader>
            <DialogTitle>Create a Task</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4 my-5">
            <div className="flex flex-col gap-2">
              <Label htmlFor="title">Title*</Label>
              <Input id="title" placeholder="BUG: Fix the bug" name="title" />
            </div>
            <hr />
            <div className="flex flex-col gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Whenever I click on the button, the app crashes"
                rows={3}
                style={{ height: `${3 * 45}px` }}
                name="description"
              />
            </div>
            <hr />
            <div className="flex flex-col gap-2">
              <Label>Priority</Label>
              <div className="flex items-center justify-center">
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    size="xs"
                    variant={priority === "low" ? "default" : "outline"}
                    onClick={() => {
                      setPriority("low");
                    }}
                  >
                    Low
                  </Button>
                  <Button
                    type="button"
                    size="xs"
                    variant={priority === "medium" ? "default" : "outline"}
                    onClick={() => {
                      setPriority("medium");
                    }}
                  >
                    Medium
                  </Button>
                  <Button
                    type="button"
                    size="xs"
                    variant={priority === "high" ? "default" : "outline"}
                    onClick={() => {
                      setPriority("high");
                    }}
                  >
                    High
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="xs"
                    onClick={() => {
                      setPriority(undefined);
                    }}
                  >
                    Reset
                  </Button>
                </div>
              </div>
            </div>
            <hr />
            {!!tags.length && (
              <div className="flex flex-col gap-2">
                <Label>Tags</Label>
                <div className="flex items-center gap-2 justify-center flex-wrap px-4 mt-1">
                  {tags.map((tag) => {
                    const checked = !!currentTagIds.includes(tag.id);
                    return (
                      <Badge
                        key={"tag-" + tag.id}
                        variant="outline"
                        style={{
                          backgroundColor: checked
                            ? `rgba(${hexToRgb(tag.color).join(",")},0.4)`
                            : undefined,
                          borderColor: checked
                            ? `rgba(${hexToRgb(tag.color).join(",")},0.4)`
                            : undefined,
                        }}
                        onClick={() => {
                          if (checked) {
                            setCurrentTagIds((curr) =>
                              curr.filter((id) => id !== tag.id)
                            );
                          } else {
                            setCurrentTagIds((curr) => [...curr, tag.id]);
                          }
                        }}
                        className="hover:cursor-pointer hover:bg-white/5"
                      >
                        {tag.label}
                      </Badge>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <SubmitButton />
          </DialogFooter>
          <input type="hidden" value={columnId ?? ""} name="columnId" />
          <input type="hidden" value={projectId} name="projectId" />
          <input type="hidden" value={workspaceId} name="workspaceId" />
          <input type="hidden" value={priority} name="priority" />
          <input type="hidden" value={currentTagIds.join("|")} name="tags" />
        </form>
      </DialogContent>
    </Dialog>
  );
}
