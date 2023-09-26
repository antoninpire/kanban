"use client";

import ColumnCard from "@/app/(authenticated)/app/[workspaceId]/[projectId]/_components/column-card";
import { useToast } from "@/components/ui/use-toast";
import type { Column, Task } from "@/lib/db/schema";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  DragDropContext,
  Droppable,
  type DropResult,
} from "react-beautiful-dnd";

type BoardProps = {
  columns: (Column & {
    tasks: Task[];
  })[];
  workspaceId: string;
  projectId: string;
};

export default function Board(props: BoardProps) {
  const [columns, setColumns] = useState(props.columns);
  const [mounted, setMounted] = useState(false);

  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    setColumns(props.columns);
  }, [props.columns]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const onDragEnd = async (result: DropResult) => {
    // dropped nowhere
    if (!result.destination) {
      return;
    }

    const { source, destination } = result;

    // did not move anywhere - can bail early
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    const columnsCopy = [...columns];

    // reordering column
    if (result.type === "COLUMN") {
      const temp = columnsCopy[source.index]!;
      columnsCopy.splice(source.index, 1);
      columnsCopy.splice(destination.index, 0, temp);

      const orders = columnsCopy.reduce(
        (acc, col, index) => ({
          ...acc,
          [col.id]: index,
        }),
        {} as Record<number, number>
      );

      setColumns(columnsCopy);

      const res = await fetch("/api/columns", {
        method: "PUT",
        body: JSON.stringify({
          orders,
        }),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        router.refresh();
        toast({
          title: json.error ?? "Something went wrong",
          variant: "destructive",
        });
      }

      return;
    }

    if (result.type === "TASK") {
      if (source.droppableId !== destination.droppableId) {
        const sourceColumn = columnsCopy[Number(source.droppableId)];
        const destinationColumn = columnsCopy[Number(destination.droppableId)];
        const sourceTasks = [...(sourceColumn?.tasks ?? [])];
        const destinationTasks = [...(destinationColumn?.tasks ?? [])];
        const [removed] = sourceTasks.splice(source.index, 1);
        destinationTasks.splice(destination.index, 0, removed!);
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        columnsCopy[Number(source.droppableId)] = {
          ...sourceColumn,
          tasks: sourceTasks,
        };
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        columnsCopy[Number(destination.droppableId)] = {
          ...destinationColumn,
          tasks: destinationTasks,
        };

        const sourceOrders = sourceTasks.reduce(
          (acc, task, index) => ({
            ...acc,
            [task.id]: index,
          }),
          {} as Record<number, number>
        );
        const destOrders = destinationTasks.reduce(
          (acc, task, index) => ({
            ...acc,
            [task.id]: index,
          }),
          {} as Record<number, number>
        );

        setColumns(columnsCopy);

        const res = await fetch("/api/tasks", {
          method: "PUT",
          body: JSON.stringify({
            sourceOrders,
            destOrders,
            sourceColumnId: sourceColumn!.id,
            destColumnId: destinationColumn!.id,
            taskId: removed!.id,
          }),
        });

        const json = await res.json();

        if (!res.ok || !json.success) {
          router.refresh();
          toast({
            title: json.error ?? "Something went wrong",
            variant: "destructive",
          });
        }

        return;
      } else {
        const column = columns[Number(source.droppableId)];
        const copiedTasks = [...(column?.tasks ?? [])];
        const [removed] = copiedTasks.splice(source.index, 1);
        copiedTasks.splice(destination.index, 0, removed!);
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        columnsCopy[Number(source.droppableId)] = {
          ...column,
          tasks: copiedTasks,
        };

        const orders = copiedTasks.reduce(
          (acc, task, index) => ({
            ...acc,
            [task.id]: index,
          }),
          {} as Record<number, number>
        );

        setColumns(columnsCopy);

        const res = await fetch("/api/tasks", {
          method: "PUT",
          body: JSON.stringify({
            sourceOrders: orders,
            sourceColumnId: column!.id,
            taskId: removed!.id,
          }),
        });

        const json = await res.json();

        if (!res.ok || !json.success) {
          router.refresh();
          toast({
            title: json.error ?? "Something went wrong",
            variant: "destructive",
          });
        }

        return;
      }
    }
  };

  return (
    <>
      {mounted && (
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="board" type="COLUMN" direction="horizontal">
            {(provided) => (
              <div
                className="flex flex-nowrap gap-3 px-4"
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                {columns.map((column, index) => (
                  <ColumnCard
                    index={index}
                    key={`column-${column.id}`}
                    column={column}
                    projectId={props.projectId}
                    workspaceId={props.workspaceId}
                  />
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      )}
    </>
  );
}
