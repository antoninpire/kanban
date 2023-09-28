import { editTaskAtom } from "@/app/(authenticated)/app/[workspaceId]/[projectId]/atoms";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Tag as TTag, TagByTask } from "@/lib/db/schema";
import { hexToRgb } from "@/lib/utils";
import { useAtom } from "jotai";
import { Check, Tag, Tags } from "lucide-react";
import { useEffect, useState } from "react";

type EditTaskTagsSectionProps = {
  tags: TTag[];
  handleChange: () => void;
};

export default function EditTaskTagsSection(props: EditTaskTagsSectionProps) {
  const [task, setTask] = useAtom(editTaskAtom);
  const [activeTags, setActiveTags] = useState<
    (TagByTask & {
      tag: TTag;
    })[]
  >([]);
  const { tags, handleChange } = props;

  useEffect(() => {
    if (task?.tagsByTask) setActiveTags(task.tagsByTask);
  }, [task?.tagsByTask]);

  if (!tags.length) return null;

  function handleClickTag(tag: TTag) {
    if (!task) return;
    const hasTag = !!activeTags.find((t) => t.tagId === tag.id);
    setActiveTags((t) =>
      hasTag
        ? [...t.filter((t) => t.tagId !== tag.id)]
        : [
            ...t,
            {
              createdAt: new Date(),
              tagId: tag.id,
              taskId: task.id,
              tag,
            },
          ]
    );
  }

  return (
    <div className="mb-5">
      <h4 className="text-lg font-semibold mt-5 mb-2">Tags</h4>
      <div className="flex items-center gap-3">
        <Popover
          // open={open}
          onOpenChange={(o) => {
            if (task && o === false) {
              setTask({
                ...task,
                tagsByTask: activeTags,
              });
              handleChange();
            }
          }}
        >
          <PopoverTrigger asChild>
            <Button size="xs" variant="secondary">
              <Tags size={16} />
              Edit tags
            </Button>
          </PopoverTrigger>
          <PopoverContent side="left" sideOffset={12} className="w-56 h-80 p-0">
            {!tags.length && (
              <div className="w-full h-full flex justify-center items-center">
                <span className="text-neutral-300 text-sm">
                  No tags for this project
                </span>
              </div>
            )}
            {!!tags.length && (
              <ScrollArea className="w-full h-full">
                {tags.map((tag) => (
                  <div
                    key={tag.id}
                    className="flex items-center justify-between hover:cursor-pointer hover:bg-white/5 px-4 py-2"
                    onClick={() => handleClickTag(tag)}
                  >
                    <div className="flex items-center gap-2">
                      <Tag size={16} color={tag.color} fill={tag.color} />
                      <span style={{ color: tag.color }}>{tag.label}</span>
                    </div>
                    {!!activeTags.find((t) => t.tagId === tag.id) && (
                      <Check size={16} />
                    )}
                  </div>
                ))}
              </ScrollArea>
            )}
          </PopoverContent>
        </Popover>
        <div className="flex items-center flex-wrap gap-1">
          {task?.tagsByTask.map((tagByTask) => (
            <Badge
              style={{
                backgroundColor: `rgba(${hexToRgb(tagByTask.tag.color).join(
                  ","
                )},0.4)`,
              }}
              className="text-neutral-200"
              key={tagByTask.tag.id}
            >
              {tagByTask.tag.label}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
}
