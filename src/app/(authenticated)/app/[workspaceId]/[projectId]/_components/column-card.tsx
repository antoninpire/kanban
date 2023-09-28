"use client";

import DeleteColumnAlertDialog from "@/app/(authenticated)/app/[workspaceId]/[projectId]/_components/delete-column-alert-dialog";
import TaskCard from "@/app/(authenticated)/app/[workspaceId]/[projectId]/_components/task-card";
import {
  addTaskColumnIdAtom,
  editColumnAtom,
  type TaskWithRelations,
} from "@/app/(authenticated)/app/[workspaceId]/[projectId]/atoms";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Column } from "@/lib/db/schema";
import { hexToRgb } from "@/lib/utils";
import { useSetAtom } from "jotai";
import { Edit, MoreHorizontal, Plus } from "lucide-react";
import { Draggable, Droppable } from "react-beautiful-dnd";

type ColumnCardProps = {
  column: Column & {
    tasks: TaskWithRelations[];
  };
  index: number;
  workspaceId: string;
  projectId: string;
};

export default function ColumnCard(props: ColumnCardProps) {
  const { column, index, projectId, workspaceId } = props;
  const setColumnId = useSetAtom(addTaskColumnIdAtom);
  const setEditColumn = useSetAtom(editColumnAtom);

  const rgb = hexToRgb(column.color).join(",");

  return (
    <Draggable draggableId={column.id} index={index}>
      {(provided) => (
        <div ref={provided.innerRef} {...provided.draggableProps}>
          <div
            {...provided.dragHandleProps}
            className="flex items-center justify-between pr-1 mb-1"
          >
            <div className="flex items-center gap-2">
              <h4
                className="font-semibold text-white px-5 py-0.5 rounded-full brightness-200"
                style={{
                  backgroundColor: `rgba(${rgb}, 0.07)`,
                }}
              >
                {column.name}
              </h4>
              <span className="text-neutral-300 font-medium">
                {column.tasks.length}
              </span>
            </div>
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
                    <Button
                      variant="ghost"
                      size="xs"
                      onClick={() => {
                        setEditColumn(column);
                      }}
                    >
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
          <Droppable key={column.id} droppableId={column.id} type="TASK">
            {(dropProvided) => (
              <div
                style={{ backgroundColor: `rgba(${rgb}, 0.07)` }}
                className="rounded-md"
              >
                <ScrollArea className="rounded-md pt-1 pb-2">
                  <div
                    className="h-[75vh] flex flex-col w-[280px] p-[10px] gap-3"
                    ref={dropProvided.innerRef}
                    {...dropProvided.droppableProps}
                  >
                    {column.tasks.map((task, index) => (
                      <TaskCard
                        color={column.color}
                        key={task.id}
                        task={task}
                        index={index}
                      />
                    ))}
                    {dropProvided.placeholder}
                  </div>
                </ScrollArea>
              </div>
            )}
          </Droppable>
        </div>
      )}
    </Draggable>
  );
}
