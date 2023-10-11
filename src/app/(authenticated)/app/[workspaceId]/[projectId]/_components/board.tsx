"use client";

import ColumnCard from "@/app/(authenticated)/app/[workspaceId]/[projectId]/_components/column-card";
import { type TaskWithRelations } from "@/app/(authenticated)/app/[workspaceId]/[projectId]/atoms";
import type { Column } from "@/lib/db/schema";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  DragDropContext,
  Droppable,
  type DropResult,
} from "react-beautiful-dnd";
import { toast } from "sonner";

type BoardProps = {
  columns: (Column & {
    tasks: TaskWithRelations[];
  })[];
  workspaceId: string;
  projectId: string;
};

export default function Board(props: BoardProps) {
  const [columns, setColumns] = useState(props.columns);
  const [mounted, setMounted] = useState(false);

  const router = useRouter();

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
        {} as Record<string, number>
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
        toast.error(json.error ?? "Something went wrong");
      }

      return;
    }

    if (result.type === "TASK") {
      const sourceColumnIndex = columnsCopy.findIndex(
        (col) => col.id === source.droppableId
      );
      const destinationColumnIndex = columnsCopy.findIndex(
        (col) => col.id === destination.droppableId
      );
      if (source.droppableId !== destination.droppableId) {
        const sourceColumn = columnsCopy[sourceColumnIndex];
        const destinationColumn = columnsCopy[destinationColumnIndex];
        const sourceTasks = [...(sourceColumn?.tasks ?? [])];
        const destinationTasks = [...(destinationColumn?.tasks ?? [])];
        const [removed] = sourceTasks.splice(source.index, 1);
        destinationTasks.splice(destination.index, 0, removed!);
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        columnsCopy[sourceColumnIndex] = {
          ...sourceColumn,
          tasks: sourceTasks,
        };
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        columnsCopy[destinationColumnIndex] = {
          ...destinationColumn,
          tasks: destinationTasks,
        };

        const sourceOrders = sourceTasks.reduce(
          (acc, task, index) => ({
            ...acc,
            [task.id]: index,
          }),
          {} as Record<string, number>
        );
        const destOrders = destinationTasks.reduce(
          (acc, task, index) => ({
            ...acc,
            [task.id]: index,
          }),
          {} as Record<string, number>
        );

        setColumns(columnsCopy);

        const res = await fetch("/api/tasks/order", {
          method: "PUT",
          body: JSON.stringify({
            sourceOrders,
            destinationOrders: destOrders,
            sourceColumnId: sourceColumn!.id,
            destinationColumnId: destinationColumn!.id,
            taskId: removed!.id,
          }),
        });

        const json = await res.json();

        if (!res.ok || !json.success) {
          router.refresh();
          toast.error(json.error ?? "Something went wrong");
        }
        return;
      } else {
        const column = columns[sourceColumnIndex];
        const copiedTasks = [...(column?.tasks ?? [])];
        const [removed] = copiedTasks.splice(source.index, 1);
        copiedTasks.splice(destination.index, 0, removed!);
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        columnsCopy[sourceColumnIndex] = {
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

        const res = await fetch("/api/tasks/order", {
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
          toast.error(json.error ?? "Something went wrong");
        }

        return;
      }
    }
  };

  if (!mounted) return null;

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="board" type="COLUMN" direction="horizontal">
        {(provided) => (
          <>
            <div
              className="flex"
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              <div className="flex-nowrap flex gap-3 pl-4">
                {columns.map((column, index) => (
                  <ColumnCard
                    index={index}
                    key={column.id}
                    column={column}
                    projectId={props.projectId}
                    workspaceId={props.workspaceId}
                  />
                ))}
              </div>
            </div>
            {provided.placeholder}
          </>
        )}
      </Droppable>
    </DragDropContext>
  );
}
