import { cn } from "@/lib/utils";
import { NodeAlign } from "@/store/layout-builder.store";
import { useDroppable } from "@dnd-kit/react";

type DroppableProps = {
  id: string;
  align: NodeAlign;
};
function Droppable({ id, align, ...props }: DroppableProps) {
  console.log({ props });
  const { ref, droppable, isDropTarget } = useDroppable({
    id: id,
    data: {
      align: align,
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
      })}></div>
  );
}

export default Droppable;
