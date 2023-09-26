"use client";

import DeleteColumnAlertDialog from "@/app/(authenticated)/app/[workspaceId]/[projectId]/_components/delete-column-alert-dialog";
import TaskCard from "@/app/(authenticated)/app/[workspaceId]/[projectId]/_components/task-card";
import { addTaskColumnIdAtom } from "@/app/(authenticated)/app/[workspaceId]/[projectId]/atoms";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Column, Task } from "@/lib/db/schema";
import { hexToRgb } from "@/lib/utils";
import { useSetAtom } from "jotai";
import { Edit, MoreHorizontal, Plus } from "lucide-react";
import { Draggable, Droppable } from "react-beautiful-dnd";

type ColumnCardProps = {
  column: Column & {
    tasks: Task[];
  };
  index: number;
  workspaceId: string;
  projectId: string;
};

export default function ColumnCard(props: ColumnCardProps) {
  const { column, index, projectId, workspaceId } = props;
  const setColumnId = useSetAtom(addTaskColumnIdAtom);

  const dragId = `column-${column.id}`;

  const rgb = hexToRgb(column.color).join(",");

  return (
    <Draggable draggableId={dragId} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className="h-[80vh] w-[280px] rounded-md flex flex-col gap-1 brightness-200"
          style={{
            ...provided.draggableProps.style,
            backgroundColor: `rgba(${rgb}, 0.2)`,
          }}
        >
          <div
            {...provided.dragHandleProps}
            className="flex items-center justify-between pl-2.5 pr-1 pt-1.5 mb-1"
          >
            <h4 className="font-semibold">{column.name}</h4>
            <div className="flex items-center">
              <Button
                onClick={() => {
                  setColumnId(column.id);
                }}
                variant="ghost"
                size="xs"
                className="px-1"
              >
                <Plus size={18} />
              </Button>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="xs" className="px-1">
                    <MoreHorizontal size={18} />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-40 p-0">
                  <div className="flex flex-col gap-1 w-full p-1">
                    <Button variant="ghost" size="xs">
                      <div className="w-full flex items-center gap-2">
                        <Edit size={16} />
                        Edit
                      </div>
                    </Button>
                    <DeleteColumnAlertDialog
                      columnId={column.id}
                      workspaceId={workspaceId}
                      projectId={projectId}
                    />
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <ScrollArea className="pt-2 pl-2 pr-4">
            <Droppable droppableId={index.toString()} type="TASK">
              {(dropProvided) => (
                <>
                  <div
                    ref={dropProvided.innerRef}
                    className="flex flex-col gap-3.5"
                    {...dropProvided.droppableProps}
                  >
                    {column.tasks.map((task, index) => (
                      <TaskCard
                        key={`task-${task.id}`}
                        task={task}
                        index={index}
                      />
                    ))}
                  </div>
                  {dropProvided.placeholder}
                </>
              )}
            </Droppable>
          </ScrollArea>
        </div>
      )}
    </Draggable>
  );
}
