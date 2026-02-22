import { cn } from "@/lib/utils";
import { NodeType } from "@/routes/_protected/test_layout";
import { useDroppable } from "@dnd-kit/react";

type DroppableProps = {
  id: string;
  type: NodeType;
};
function Droppable({ id, type, ...props }: DroppableProps) {
  console.log({ props });
  const { ref, droppable, isDropTarget } = useDroppable({
    id: id,
    data: {
      type: type,
    },
  });
  console.log({ droppable, isDropTarget });
  return (
    <div
      ref={ref}
      id={id}
      className={cn("p-2", {
        "bg-green-200": isDropTarget,
        "bg-gray-200": !isDropTarget,
      })}
    ></div>
  );
}

export default Droppable;
