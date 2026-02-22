import { NodeType } from "@/routes/_protected/test_layout";
import { useDraggable } from "@dnd-kit/react";

type DraggableProps = {
  id: string;
  type: NodeType;
};
function Draggable({ id, type }: DraggableProps) {
  const { ref, isDragging } = useDraggable({
    id,
    data: { type },
  });
  return (
    <div ref={ref} className={isDragging ? "opacity-50" : "opacity-100"}>
      Draggable
    </div>
  );
}

export default Draggable;
