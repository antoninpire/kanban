import { editTaskAtom } from "@/app/(authenticated)/app/[workspaceId]/[projectId]/atoms";
import { Button } from "@/components/ui/button";
import { useAtom } from "jotai";

type EditTaskPrioritySectionProps = {
  handleChange: () => void;
};

export default function EditTaskPrioritySection(
  props: EditTaskPrioritySectionProps
) {
  const [task, setTask] = useAtom(editTaskAtom);
  const { handleChange } = props;

  return (
    <div className="mb-5">
      <h4 className="text-lg font-semibold mt-5 mb-2">Priority</h4>
      <div className="flex items-center gap-2">
        <Button
          size="xs"
          className={task?.priority === "low" ? "bg-yellow-500" : ""}
          variant={task?.priority === "low" ? "default" : "outline"}
          onClick={() => {
            if (task) setTask({ ...task, priority: "low" });
            handleChange();
          }}
        >
          Low
        </Button>
        <Button
          size="xs"
          className={task?.priority === "medium" ? "bg-orange-500" : ""}
          variant={task?.priority === "medium" ? "default" : "outline"}
          onClick={() => {
            if (task) setTask({ ...task, priority: "medium" });
            handleChange();
          }}
        >
          Medium
        </Button>
        <Button
          size="xs"
          className={task?.priority === "high" ? "bg-red-500" : ""}
          variant={task?.priority === "high" ? "default" : "outline"}
          onClick={() => {
            if (task) setTask({ ...task, priority: "high" });
            handleChange();
          }}
        >
          High
        </Button>
        <Button
          variant="ghost"
          size="xs"
          onClick={() => {
            if (task) setTask({ ...task, priority: null });
            handleChange();
          }}
        >
          Reset
        </Button>
      </div>
    </div>
  );
}
