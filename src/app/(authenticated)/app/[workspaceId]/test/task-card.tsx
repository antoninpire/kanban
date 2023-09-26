import { Draggable } from "react-beautiful-dnd";

export default function TaskCard2(props: {
  item: {
    id: string;
    Task: string;
    Due_Date: string;
  };
  index: number;
}) {
  const { item, index } = props;

  return (
    <Draggable key={item.id} draggableId={item.id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <div className="flex flex-col justify-center items-start py-0 px-[15px] min-h-[106px] rounded-[5px] max-w-[311px]">
            <p>{item.Task}</p>
            <div className="flex justify-between items-center w-full text-[12px] font-[400px] text-[#7d7d7d]">
              <p>
                <span>
                  {new Date(item.Due_Date).toLocaleDateString("en-us", {
                    month: "short",
                    day: "2-digit",
                  })}
                </span>
              </p>
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
}
