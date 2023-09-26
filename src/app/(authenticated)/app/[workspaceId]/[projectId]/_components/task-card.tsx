"use client";

import {
  editTaskAtom,
  type TaskWithRelations,
} from "@/app/(authenticated)/app/[workspaceId]/[projectId]/atoms";
import { Badge } from "@/components/ui/badge";
import { useSetAtom } from "jotai";
import { Tag } from "lucide-react";
import { useMemo } from "react";
import { Draggable } from "react-beautiful-dnd";

type TaskCardProps = {
  task: TaskWithRelations;
  index: number;
};

export default function TaskCard(props: TaskCardProps) {
  const setTask = useSetAtom(editTaskAtom);
  const { task, index } = props;

  const amountOfAchievedSubtasks = useMemo(() => {
    return task.subTasks.filter((subTask) => subTask.achieved).length;
  }, [task.subTasks]);

  return (
    <Draggable key={task.id} draggableId={task.id} index={index}>
      {(dragProvided) => (
        <div
          onClick={() => {
            setTask(task);
          }}
          ref={dragProvided.innerRef}
          {...dragProvided.draggableProps}
          {...dragProvided.dragHandleProps}
        >
          <div className="w-full rounded-md border border-neutral-600 min-h-[60px] max-h-[150px] p-2">
            <p className="text-sm">{task.title}</p>
            <div className="flex items-center gap-x-1 flex-wrap gap-y-0.5 mt-2">
              {!!task.priority && <Badge>{task.priority}</Badge>}
              {!!task.tagsByTask.length && (
                <>
                  {task.tagsByTask.map((tag) => (
                    <Tag
                      key={"tag-" + tag.tagId}
                      color={tag.tag.color}
                      size={16}
                      fill={tag.tag.color}
                    />
                  ))}
                </>
              )}
            </div>
            <div className="mt-1.5 flex justify-end">
              {!!task.subTasks.length && (
                <p className="text-xs text-neutral-400">
                  {amountOfAchievedSubtasks} / {task.subTasks.length} subtasks
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
}
