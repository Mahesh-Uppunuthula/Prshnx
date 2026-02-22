import { useSortable } from "@dnd-kit/react/sortable";
import { CollisionPriority } from "@dnd-kit/abstract";
import React from "react";

type RowProps = {
  id: string;
  index: number;
  children: React.ReactNode;
};

export function Row({ children, id, index }: RowProps) {
  // const { isDropTarget, ref } = useDroppable({
  //   id,
  //   type: "row",
  //   accept: "item",
  //   collisionPriority: CollisionPriority.Low,
  // });
  // const style = isDropTarget ? { background: "#00000030" } : undefined;

  const { ref } = useSortable({
    id,
    index,
    type: "row",
    collisionPriority: CollisionPriority.Low,
    accept: ["item", "row"],
  });

  return (
    <div
      ref={ref}
      // style={style}
      className="w-full p-2 border flex flex-col items-start gap-2">
      <div className="bg-primary text-muted p-2 rounded">{id}</div>
      <div className="flex items-center gap-2">{children}</div>
    </div>
  );
}
export default Row;
