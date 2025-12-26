import { Bs123, BsCalendar2Date } from "react-icons/bs";
// import { IoCheckboxOutline } from "react-icons/io5";
// import { IoMdRadioButtonOn } from "react-icons/io";
import type {
  BaseElementType,
  ComponentVariants,
  ParentType,
} from "@/types/form-builder.types";
import {
  ListChecks,
  LucideClock,
  LucideText,
  LucideTrash2,
  LucideType,
} from "lucide-react";
import { useDraggable } from "@dnd-kit/core";
import { cn } from "@/lib/utils";

export type DraggableItemData = {
  id: ComponentVariants;
  from: ParentType;
  item: BaseElementType;
};

export default function DraggableItem({ item }: { item: BaseElementType }) {
  const data: DraggableItemData = {
    id: item.id,
    from: item.parentType,
    item: item,
  };
  const { setNodeRef, listeners, attributes, isDragging } = useDraggable({
    id: item.id,
    data: data,
  });

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className={cn(
        `p-2 text-foreground bg-muted border rounded-md cursor-grab active:cursor-grabbing`,
        `hover:shadow`,
        {
          "opacity-60": isDragging,
        }
      )}
    >
      <Element item={item} />
    </div>
  );
}

const Icon = ({ id }: { id: ComponentVariants }) => {
  switch (id) {
    case "single-line-input":
      return <LucideType size={19} />;
    case "multi-line-input":
      return <LucideText size={19} />;
    case "number-input":
      return <Bs123 size={19} />;
    case "date-input":
      return <BsCalendar2Date size={19} />;
    case "time-input":
      return <LucideClock size={19} />;
    case "selection":
      return <ListChecks size={19} />;
    // case "radio-button":
    //   return <IoMdRadioButtonOn size={19} />;
    // case "checkbox":
    //   return <IoCheckboxOutline size={19} />;
    default:
      return <LucideTrash2 size={19} />;
  }
};

const Element = ({ item }: { item: BaseElementType }) => {
  return (
    <div className="w-full h-fit text-sm flex gap-2 place-items-center">
      <span>
        <Icon id={item.id} />
      </span>
      <span>{item.name}</span>
    </div>
  );
};
