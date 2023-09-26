"use client";
import ColumnCard2 from "@/app/(authenticated)/app/[workspaceId]/test/column-card-2";
import { columnsData } from "@/app/(authenticated)/app/[workspaceId]/test/data";
import { useEffect, useState } from "react";
import { DragDropContext, Droppable } from "react-beautiful-dnd";

export default function TestPage() {
  const [columns, setColumns] = useState<typeof columnsData>(columnsData);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const { source, destination } = result;
    const columnsCopy = [...columns];

    if (result.type === "COLUMN") {
      const temp = columnsCopy[source.index]!;
      columnsCopy.splice(source.index, 1);
      columnsCopy.splice(destination.index, 0, temp);

      setColumns(columnsCopy);

      return;
    }

    if (source.droppableId !== destination.droppableId) {
      const sourceColumnIndex = columnsCopy.findIndex(
        (col) => col.id === source.droppableId
      );
      const destinationColumnIndex = columnsCopy.findIndex(
        (col) => col.id === destination.droppableId
      );
      const sourceColumn = columnsCopy[sourceColumnIndex];
      const destinationColumn = columnsCopy[destinationColumnIndex];
      const sourceTasks = [...(sourceColumn?.items ?? [])];
      const destinationTasks = [...(destinationColumn?.items ?? [])];
      const [removed] = sourceTasks.splice(source.index, 1);
      destinationTasks.splice(destination.index, 0, removed!);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      columnsCopy[sourceColumnIndex] = {
        ...sourceColumn,
        items: sourceTasks,
      };
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      columnsCopy[destinationColumnIndex] = {
        ...destinationColumn,
        items: destinationTasks,
      };
      setColumns(columnsCopy);
    } else {
      const sourceColumnIndex = columnsCopy.findIndex(
        (col) => col.id === source.droppableId
      );
      const column = columns[sourceColumnIndex];
      const copiedTasks = [...(column?.items ?? [])];
      const [removed] = copiedTasks.splice(source.index, 1);
      copiedTasks.splice(destination.index, 0, removed!);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      columnsCopy[sourceColumnIndex] = {
        ...column,
        items: copiedTasks,
      };
      setColumns(columnsCopy);
    }
  };

  if (!mounted) return null;

  console.log("COLSSS", columns);

  return (
    <DragDropContext onDragEnd={(result) => onDragEnd(result)}>
      <Droppable droppableId="board" type="COLUMN" direction="horizontal">
        {(provided) => (
          <>
            <div
              className="flex"
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              <div className="m-[8px] gap-8 flex w-full min-h-[80vh]">
                {columns.map((column, index) => {
                  return (
                    <ColumnCard2
                      key={column.id}
                      column={column}
                      columnId={column.id}
                      index={index}
                    />
                  );
                })}
              </div>
            </div>
            {provided.placeholder}
          </>
        )}
      </Droppable>
    </DragDropContext>
  );
}
