import { NodeAlign } from "@/store/layout-builder.store";
import { useDraggable } from "@dnd-kit/react";

type DraggableProps = {
  id: string;
  align: NodeAlign;
};
function Draggable({ id, align }: DraggableProps) {
  const { ref, isDragging } = useDraggable({
    id,
    data: { align },
  });
  return (
    <div ref={ref} className={isDragging ? "opacity-50" : "opacity-100"}>
      Draggable
    </div>
  );
}

export default Draggable;
