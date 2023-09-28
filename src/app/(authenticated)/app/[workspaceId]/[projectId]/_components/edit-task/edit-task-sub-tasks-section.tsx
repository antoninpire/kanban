import { editTaskAtom } from "@/app/(authenticated)/app/[workspaceId]/[projectId]/atoms";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { createId } from "@paralleldrive/cuid2";
import { useAtom } from "jotai";
import { CheckSquare, X } from "lucide-react";
import { useMemo } from "react";

type EditTaskSubTasksSectionProps = {
  handleChange: () => void;
};

export default function EditTaskSubTasksSection(
  props: EditTaskSubTasksSectionProps
) {
  const [task, setTask] = useAtom(editTaskAtom);
  const { handleChange } = props;

  const subTasksCompletePercentage = useMemo(() => {
    const percentage = Math.round(
      ((task?.subTasks.filter((s) => s.achieved).length ?? 0) * 100) /
        (task?.subTasks?.length ?? 0)
    );
    if (isNaN(percentage)) return 0;
    return percentage;
  }, [task?.subTasks]);

  return (
    <div>
      <div className="flex items-center justify-between">
        <h4 className="text-lg font-semibold mt-5 mb-2">Todos</h4>
        <span className="text-neutral-300 text-sm">
          {subTasksCompletePercentage}% Completed
        </span>
      </div>
      <Progress value={subTasksCompletePercentage} />
      <Button
        size="xs"
        variant="secondary"
        className="mt-4"
        onClick={() => {
          if (task)
            setTask({
              ...task,
              subTasks: [
                ...task.subTasks,
                {
                  id: "stsk_" + createId(),
                  title: "",
                  achieved: false,
                  createdAt: new Date(),
                  updatedAt: new Date(),
                  order: 0,
                  taskId: task.id,
                },
              ],
            });
          handleChange();
        }}
      >
        <CheckSquare size={16} />
        Add task
      </Button>
      <div className="flex flex-col gap-2 px-3 mt-3 mb-4">
        {task?.subTasks.map((subTask) => (
          <div
            key={"subTask" + subTask.id}
            className="flex items-center justify-between"
          >
            <div className="flex items-center gap-2 w-full">
              <Checkbox
                checked={subTask.achieved}
                id={"subTask" + subTask.id}
                onClick={() => {
                  if (task) {
                    const subTasks = task.subTasks.map((s) => {
                      if (s.id === subTask.id) {
                        return {
                          ...s,
                          achieved: !s.achieved,
                        };
                      } else return s;
                    });

                    setTask({
                      ...task,
                      subTasks,
                    });
                    handleChange();
                  }
                }}
              />
              <label
                htmlFor={"subTask" + subTask.id}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 w-full"
              >
                <input
                  id={"subTask" + subTask.id + "input"}
                  onChange={(e) => {
                    if (task)
                      setTask({
                        ...task,
                        subTasks: task.subTasks.map((st) => {
                          if (st.id === subTask.id) {
                            return {
                              ...st,
                              title: e.target.value,
                            };
                          } else return st;
                        }),
                      });
                    handleChange();
                  }}
                  onKeyDown={async (e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      if (task) {
                        const subTaskId = "stsk_" + createId();
                        setTask({
                          ...task,
                          subTasks: [
                            ...task.subTasks,
                            {
                              id: subTaskId,
                              title: "",
                              achieved: false,
                              createdAt: new Date(),
                              updatedAt: new Date(),
                              order: 0,
                              taskId: task.id,
                            },
                          ],
                        });
                        handleChange();
                        await new Promise((resolve) =>
                          setTimeout(resolve, 100)
                        );
                        const nextInput = document.getElementById(
                          "subTask" + subTaskId + "input"
                        );
                        if (nextInput) {
                          nextInput.focus();
                        }
                      }
                    }
                  }}
                  type="text"
                  defaultValue={subTask.title}
                  className="w-full bg-transparent py-2 outline-none border-none flex-grow"
                  placeholder="Your subtask here..."
                />
              </label>
            </div>
            <Button
              size="xs"
              variant="ghost"
              onClick={() => {
                if (task) {
                  setTask({
                    ...task,
                    subTasks: task.subTasks.filter(
                      (st) => st.id !== subTask.id
                    ),
                  });
                }
                handleChange();
              }}
            >
              <X size={16} />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
