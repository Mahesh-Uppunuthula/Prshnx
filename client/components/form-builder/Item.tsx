import { useSortable } from "@dnd-kit/react/sortable";

type ItemProps = {
  id: string;
  index: number;
  row: string;
};

export function Item({id, index, row}: ItemProps) {
  const {ref, isDragging} = useSortable({
    id,
    index,
    type: 'item',
    accept: 'item',
    group: row
  });

  return (
    <button className="min-w-56 border rounded" ref={ref} data-dragging={isDragging}>
      {id}
    </button>
  );
}