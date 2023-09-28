"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";
import type { Tag } from "@/lib/db/schema";
import { getRandomColorHex } from "@/lib/utils";
import { createId } from "@paralleldrive/cuid2";
import { Plus, Tags, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type ManageTagsDialogProps = {
  tags: Tag[];
  projectId: string;
  workspaceId: string;
};

/* <
| typeof props.tags
| Omit<(typeof props.tags)[number], "id" | "createdAt" | "projectId">[]
> */
export default function ManageTagsDialog(props: ManageTagsDialogProps) {
  const [open, setOpen] = useState(false);
  const [tags, setTags] = useState(props.tags);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setTags(props.tags);
  }, [props.tags, open]);

  const { toast } = useToast();
  const router = useRouter();

  async function handleSave() {
    setIsLoading(true);
    const response = await fetch("/api/tags", {
      method: "PUT",
      body: JSON.stringify({
        tags,
        projectId: props.projectId,
        workspaceId: props.workspaceId,
      }),
    });
    const json = await response.json();
    if (!response.ok || json.error) {
      toast({
        title: "Error",
        description: json.error || "Something went wrong",
        variant: "destructive",
      });
    } else {
      router.refresh();
      setOpen(false);
    }
    setIsLoading(false);
  }

  return (
    <>
      <Button
        onClick={() => {
          setOpen(true);
        }}
        size="xs"
        variant="outline"
      >
        <Tags size={18} />
        Manage Tags
      </Button>
      <Dialog
        open={open}
        onOpenChange={(o) => {
          setOpen(o);
        }}
      >
        <DialogContent className="sm:max-w-[425px] max-h-[75vh] px-0">
          <DialogHeader className="pt-6 px-6 pb-0">
            <DialogTitle>Edit Tags</DialogTitle>
          </DialogHeader>
          <ScrollArea className="px-6">
            <div className="flex flex-col gap-2 pt-4 pb-4 max-h-[60vh]">
              {tags.map((tag, index) => (
                <div
                  key={"tag-" + tag.id}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <Input
                      defaultValue={tag.color}
                      type="color"
                      className="w-[40px] h-[40px] rounded-full p-0"
                      onChange={(event) => {
                        const copy = [...tags];
                        copy[index]!.color = event.target.value;
                        setTags(copy);
                      }}
                    />
                    <Input
                      defaultValue={tag.label}
                      placeholder="Tag label"
                      className="flex-grow"
                      onChange={(event) => {
                        const copy = [...tags];
                        copy[index]!.label = event.target.value;
                        setTags(copy);
                      }}
                    />
                  </div>
                  <Button
                    type="button"
                    onClick={() => {
                      const tagsCopy = [...tags];
                      tagsCopy.splice(index, 1);
                      setTags(tagsCopy);
                    }}
                    size="xs"
                    variant="outline"
                  >
                    <X size={18} />
                  </Button>
                </div>
              ))}
              <div className="flex items-center justify-center mt-4">
                <Button
                  type="button"
                  onClick={() => {
                    setTags((curr) => [
                      ...curr,
                      {
                        id: "tag_" + createId(),
                        label: "",
                        color: "#" + getRandomColorHex(),
                        createdAt: new Date(),
                        projectId: props.projectId,
                      },
                    ]);
                  }}
                  size="sm"
                  variant="ghost"
                >
                  <Plus size={18} />
                  Add Tag
                </Button>
              </div>
            </div>
          </ScrollArea>
          <DialogFooter className="px-6 pt-2">
            <Button onClick={handleSave} isLoading={isLoading}>
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
