"use client";

import TaskCard2 from "@/app/(authenticated)/app/[workspaceId]/test/task-card";
import { Draggable, Droppable } from "react-beautiful-dnd";

type Props = {
  columnId: string;
  column: {
    title: string;
    items: {
      id: string;
      Task: string;
      Due_Date: string;
    }[];
  };
  index: number;
};

export default function ColumnCard2(props: Props) {
  const { columnId, column, index } = props;
  return (
    <Draggable draggableId={columnId} index={index}>
      {(dragProvided) => (
        <div
          ref={dragProvided.innerRef}
          {...dragProvided.draggableProps}
          {...dragProvided.dragHandleProps}
        >
          <span className="mb-2 text-[#10957d] bg-[rgba(16,_149,_125,_0.15)] py-[2px] px-[10px] rounded-[5px] self-start">
            {column.title}
          </span>
          <Droppable key={columnId} droppableId={columnId} type="TASK">
            {(provided) => (
              <div
                className="h-[80vh] flex flex-col w-[280px] rounded-md p-[15px] gap-1 bg-white/5"
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                {column.items.map((item, index) => (
                  <TaskCard2
                    key={JSON.stringify(item)}
                    item={item}
                    index={index}
                  />
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </div>
      )}
    </Draggable>
  );
}
