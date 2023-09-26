"use client";

import { editTaskAtom } from "@/app/(authenticated)/app/[workspaceId]/[projectId]/atoms";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { type Tag as TTag } from "@/lib/db/schema";
import { createId } from "@paralleldrive/cuid2";
import { useAtom } from "jotai";
import { Check, CheckSquare, Tag, Tags, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

type EditTaskSheetProps = {
  workspaceId: string;
  tags: TTag[];
};

export default function EditTaskSheet(props: EditTaskSheetProps) {
  const [task, setTask] = useAtom(editTaskAtom);
  const [somethingHasChanged, setSomethingHasChanged] = useState(false);

  const { workspaceId, tags } = props;
  const { toast } = useToast();
  const router = useRouter();

  const handleSubmit = async () => {
    const result = await fetch("/api/tasks", {
      method: "PUT",
      body: JSON.stringify({
        taskInput: task,
        workspaceId,
        taskId: task?.id,
        subTasksInput: task?.subTasks,
        tagsByTaskInput: task?.tagsByTask,
      }),
    });

    const json = await result.json();

    if (!result.ok || !json.success) {
      toast({
        variant: "destructive",
        title: "Error",
        description: json.error ?? "Something went wrong",
      });
    } else router.refresh();
  };

  const handleChange = () => {
    if (!somethingHasChanged) setSomethingHasChanged(true);
  };

  const subTasksCompletePercentage = useMemo(() => {
    const percentage = Math.round(
      ((task?.subTasks.filter((s) => s.achieved).length ?? 0) * 100) /
        (task?.subTasks?.length ?? 0)
    );
    if (isNaN(percentage)) return 0;
    return percentage;
  }, [task?.subTasks]);

  return (
    <Sheet
      open={task !== null}
      onOpenChange={async (o) => {
        if (!o) {
          if (somethingHasChanged) {
            await handleSubmit();
            setSomethingHasChanged(false);
          }

          setTask(null);
        }
      }}
    >
      <SheetContent className="!w-[38vw] !max-w-none p-0">
        <SheetHeader className="pt-6 px-6">
          <SheetTitle>Edit Task</SheetTitle>
          <SheetDescription>
            Make changes to your task here. Changes will automatically be saved
            whenever you close the sheet.
          </SheetDescription>
        </SheetHeader>
        <ScrollArea className="h-[92vh] pt-4 pb-6 px-6">
          <div>
            <div className="mx-1">
              <Input
                placeholder="The name of your task here"
                className="text-lg mt-3 mb-5"
                name="title"
                defaultValue={task?.title ?? ""}
                onChange={(e) => {
                  if (task)
                    setTask({
                      ...task,
                      title: e.target.value,
                    });
                }}
              />
            </div>
            <div className="mx-1">
              <Textarea
                placeholder="The description of your task here"
                className="mt-3 mb-5"
                rows={3}
                style={{ height: `${3 * 45}px` }}
                name="description"
                defaultValue={task?.description ?? ""}
                onChange={(e) => {
                  if (task)
                    setTask({
                      ...task,
                      description: e.target.value,
                    });
                  handleChange();
                }}
              />
            </div>
          </div>
          <hr />
          <div className="mb-5">
            <h4 className="text-lg font-semibold mt-5 mb-2">Priority</h4>
            <div className="flex items-center gap-2">
              <Button
                size="xs"
                variant={task?.priority === "low" ? "default" : "outline"}
                onClick={() => {
                  if (task) setTask({ ...task, priority: "low" });
                  handleChange();
                }}
              >
                Low
              </Button>
              <Button
                size="xs"
                variant={task?.priority === "medium" ? "default" : "outline"}
                onClick={() => {
                  if (task) setTask({ ...task, priority: "medium" });
                  handleChange();
                }}
              >
                Medium
              </Button>
              <Button
                size="xs"
                variant={task?.priority === "high" ? "default" : "outline"}
                onClick={() => {
                  if (task) setTask({ ...task, priority: "high" });
                  handleChange();
                }}
              >
                High
              </Button>
              <Button
                variant="ghost"
                size="xs"
                onClick={() => {
                  if (task) setTask({ ...task, priority: null });
                  handleChange();
                }}
              >
                Reset
              </Button>
            </div>
          </div>
          <hr />
          <div className="mb-5">
            <h4 className="text-lg font-semibold mt-5 mb-2">Tags</h4>
            <div className="flex items-center gap-3">
              <Popover>
                <PopoverTrigger asChild>
                  <Button size="xs" variant="secondary">
                    <Tags size={16} />
                    Edit tags
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  side="left"
                  sideOffset={12}
                  className="w-56 h-80 p-0"
                >
                  {!tags.length && (
                    <div className="w-full h-full flex justify-center items-center">
                      <span className="text-neutral-400 text-sm">
                        No tags for this project
                      </span>
                    </div>
                  )}
                  {!!tags.length && (
                    <ScrollArea className="w-full h-full">
                      {tags.map((tag) => (
                        <div
                          key={`tag-${tag.id}`}
                          className="flex items-center justify-between hover:cursor-pointer hover:bg-white/5 px-4 py-2"
                          onClick={(event) => {
                            event.preventDefault();
                            if (task) {
                              const hasTag = !!task?.tagsByTask.find(
                                (t) => t.tagId === tag.id
                              );
                              setTask({
                                ...task,
                                tagsByTask: hasTag
                                  ? task.tagsByTask.filter(
                                      (t) => t.tagId !== tag.id
                                    )
                                  : [
                                      ...task.tagsByTask,
                                      {
                                        createdAt: new Date(),
                                        tagId: tag.id,
                                        taskId: task.id,
                                        tag,
                                      },
                                    ],
                              });
                              handleChange();
                            }
                          }}
                        >
                          <div className="flex items-center gap-2">
                            <Tag size={16} color={tag.color} />
                            <span className="text-neutral-400">
                              {tag.label}
                            </span>
                          </div>
                          {!!task?.tagsByTask.find(
                            (t) => t.tagId === tag.id
                          ) && <Check size={16} />}
                        </div>
                      ))}
                    </ScrollArea>
                  )}
                </PopoverContent>
              </Popover>
              <div className="flex items-center flex-wrap gap-1">
                {task?.tagsByTask.map((tagByTask) => (
                  <Badge
                    style={{ backgroundColor: tagByTask.tag.color }}
                    key={tagByTask.tag.id}
                  >
                    {tagByTask.tag.label}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
          <hr />
          <div className="">
            <div className="flex items-center justify-between">
              <h4 className="text-lg font-semibold mt-5 mb-2">Todos</h4>
              <span className="text-neutral-400 text-sm">
                {subTasksCompletePercentage}% Completed
              </span>
            </div>
            <Progress value={subTasksCompletePercentage} />
            <Button
              size="xs"
              variant="secondary"
              className="mt-4"
              onClick={() => {
                if (task)
                  setTask({
                    ...task,
                    subTasks: [
                      ...task.subTasks,
                      {
                        id: "stsk_" + createId(),
                        title: "",
                        achieved: false,
                        createdAt: new Date(),
                        updatedAt: new Date(),
                        order: 0,
                        taskId: task.id,
                      },
                    ],
                  });
                handleChange();
              }}
            >
              <CheckSquare size={16} />
              Add task
            </Button>
            <div className="flex flex-col gap-2 px-3 mt-3 mb-4">
              {task?.subTasks.map((subTask) => (
                <div
                  key={"subTask" + subTask.id}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={subTask.achieved}
                      id={"subTask" + subTask.id}
                      onClick={() => {
                        if (task) {
                          const subTasks = task.subTasks.map((s) => {
                            if (s.id === subTask.id) {
                              return {
                                ...s,
                                achieved: !s.achieved,
                              };
                            } else return s;
                          });

                          setTask({
                            ...task,
                            subTasks,
                          });
                          handleChange();
                        }
                      }}
                    />
                    <label
                      htmlFor={"subTask" + subTask.id}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      <input
                        id={"subTask" + subTask.id + "input"}
                        onChange={(e) => {
                          if (task)
                            setTask({
                              ...task,
                              subTasks: task.subTasks.map((st) => {
                                if (st.id === subTask.id) {
                                  return {
                                    ...st,
                                    title: e.target.value,
                                  };
                                } else return st;
                              }),
                            });
                          handleChange();
                        }}
                        onKeyDown={async (e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            if (task) {
                              const subTaskId = "stsk_" + createId();
                              setTask({
                                ...task,
                                subTasks: [
                                  ...task.subTasks,
                                  {
                                    id: subTaskId,
                                    title: "",
                                    achieved: false,
                                    createdAt: new Date(),
                                    updatedAt: new Date(),
                                    order: 0,
                                    taskId: task.id,
                                  },
                                ],
                              });
                              handleChange();
                              await new Promise((resolve) =>
                                setTimeout(resolve, 100)
                              );
                              const nextInput = document.getElementById(
                                "subTask" + subTaskId + "input"
                              );
                              if (nextInput) {
                                nextInput.focus();
                              }
                            }
                          }
                        }}
                        type="text"
                        defaultValue={subTask.title}
                        className="w-full bg-transparent py-2 outline-none border-none"
                        placeholder="Your subtask here..."
                      />
                    </label>
                  </div>
                  <Button
                    size="xs"
                    variant="ghost"
                    onClick={() => {
                      if (task) {
                        setTask({
                          ...task,
                          subTasks: task.subTasks.filter(
                            (st) => st.id !== subTask.id
                          ),
                        });
                      }
                      handleChange();
                    }}
                  >
                    <X size={16} />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
