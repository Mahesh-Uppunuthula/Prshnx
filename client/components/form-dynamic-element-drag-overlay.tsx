type FormDynamicElementDragOverlayProps = {
  name: string;
  // columnName: ComponentType;
};
export default function FormDynamicElementDragOverlay({
  name,
}: FormDynamicElementDragOverlayProps) {
  return (
    <div className="w-fit min-w-52 h-20 px-4 py-2 rounded flex justify-center place-items-center bg-neutral-100 outline outliine-2 outline-neutral-300 shadow-md cursor-grabbing">
      <span className="text-neutral-700 font-medium ">{name}</span>
    </div>
  );
}
