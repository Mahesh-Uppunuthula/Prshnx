import { useDraggable } from "@dnd-kit/core";
import { PaletteElement } from "@/lib/constants";
import { cn } from "@/lib/utils";
import {
  LuRectangleEllipsis,
  LuRectangleHorizontal,
  LuSquareDashed,
  LuTextQuote,
  LuTrash2,
} from "react-icons/lu";
import { Bs123 } from "react-icons/bs";
import { DraggingComponent } from "./Layout";

type DraggablePaletteItemProps = {
  paletteElement: PaletteElement;
};
export function DraggablePaletteItem({
  paletteElement,
}: DraggablePaletteItemProps) {
  const { setNodeRef, attributes, listeners, isDragging } = useDraggable({
    id: paletteElement.id,
    data: {
      id: paletteElement.id,
      from: paletteElement.from,
      elementType: paletteElement.type,
      label: paletteElement.label,
    } satisfies DraggingComponent,
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
        },
      )}>
      <RenderPaletteItem paletteElement={paletteElement} />
    </div>
  );
}

type RenderPaletteItemProps = {
  paletteElement: PaletteElement;
};
function RenderPaletteItem({ paletteElement }: RenderPaletteItemProps) {
  switch (paletteElement.type) {
    case "single-line-input":
    case "multi-line-input":
    case "number-input":
    case "single-line-hidden-input":
    case "container":
      return (
        <div className="w-full h-fit text-sm flex gap-2 place-items-center">
          <span>
            <Icon type={paletteElement.type} />
          </span>
          <span>{paletteElement.label}</span>
        </div>
      );
    default:
      return <div className="text-sm">{paletteElement.label}</div>;
  }
}

export const Icon = ({ type }: { type: PaletteElement["type"] }) => {
  switch (type) {
    case "single-line-input":
      return <LuRectangleHorizontal size={19} strokeWidth={1} />;
    case "single-line-hidden-input":
      return <LuRectangleEllipsis size={19} strokeWidth={1} />;
    case "multi-line-input":
      return <LuTextQuote size={19} strokeWidth={1} />;
    case "number-input":
      return <Bs123 size={19} />;
    case "container":
      return <LuSquareDashed size={19} strokeWidth={1} />;
    // case "date-input":
    //   return <BsCalendar2Date size={19} />;
    // case "time-input":
    //   return <LuClock size={19} />;
    // case "selection":
    //   return <LuListChecks size={19} />;
    // case "radio-button":
    //   return <IoMdRadioButtonOn size={19} />;
    // case "checkbox":
    //   return <IoCheckboxOutline size={19} />;
    default:
      return <LuTrash2 size={19} />;
  }
};
