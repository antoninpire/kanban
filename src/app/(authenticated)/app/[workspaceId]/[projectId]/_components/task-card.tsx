"use client";

import type { Task } from "@/lib/db/schema";
import { Draggable } from "react-beautiful-dnd";

type TaskCardProps = {
  task: Task;
  index: number;
};

export default function TaskCard(props: TaskCardProps) {
  const { task, index } = props;
  const dragId = `task-${task.id}`;

  return (
    <Draggable draggableId={dragId} index={index}>
      {(dragProvided) => (
        <div
          ref={dragProvided.innerRef}
          {...dragProvided.draggableProps}
          {...dragProvided.dragHandleProps}
          className="w-full rounded-md border border-neutral-600 h-[110px] p-2 !left-auto !top-auto"
        >
          {task.title}
        </div>
      )}
    </Draggable>
  );
}
