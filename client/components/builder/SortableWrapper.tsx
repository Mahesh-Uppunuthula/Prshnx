import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";

export default function SortableWrapper({
  id,
  pageId,
  children,
}: {
  id: string;
  pageId: string;
  children: React.ReactNode;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id,
      data: {
        from: "playground",
        nodeId: id,
        pageId,
      },
    });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      className="w-full"
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}>
      {children}
    </div>
  );
}
