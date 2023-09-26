"use client";

import type { Task } from "@/lib/db/schema";
import { Draggable } from "react-beautiful-dnd";

type TaskCardProps = {
  task: Task;
  index: number;
};

export default function TaskCard(props: TaskCardProps) {
  const { task, index } = props;

  return (
    <Draggable key={task.id} draggableId={task.id} index={index}>
      {(dragProvided) => (
        <div
          // className="!left-auto !top-auto"
          ref={dragProvided.innerRef}
          {...dragProvided.draggableProps}
          {...dragProvided.dragHandleProps}
        >
          <div className="w-full rounded-md border border-neutral-600 h-[110px] p-2">
            {task.title}
          </div>
        </div>
      )}
    </Draggable>
  );
}
