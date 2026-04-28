import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import ElementsPanel from "./ElementsPanel";
import PagesMinMap from "./PageMinMap";
import Playground from "./Playground";
import { useState } from "react";
import { InputFieldTypes, Node, Page } from "@/types/builder.types";
import { useBuilderStore } from "@/hooks/use-builder-store";
import { ALL_PALETTE_FIELDS_MAP } from "@/lib/constants";
import { cn } from "@/lib/utils";

export type DraggingComponent = {
  id: Node["id"];
  label?: string;
  elementType?: Node["type"];
  from: "palette" | "playground";
  nodeId?: Node["id"];
  pageId?: Page["id"];
};
// export type DraggingComponent = {
//   label: string;
// } & (
//   | {
//       from: "palette";
//       componentType: "field" | "container";
//     }
//   | {
//       from: "playground";
//       componentType: "field";
//     }
// );

export type DroppableComponent = {
  to: "playground";
  componentType: "container";
  pageId: Page["id"];
  nodeId: Node["id"];
};

export type From = DraggingComponent["from"];

export default function BuilderBodyLayout() {
  //builder store
  const addField = useBuilderStore((s) => s.addField);
  const addContainer = useBuilderStore((s) => s.addContainer);
  const moveNode = useBuilderStore((s) => s.moveNode);

  const [isElementsPanelOpen, setIsElementsPanelOpen] = useState(true);
  const [draggingComponent, setDraggingComponent] =
    useState<DraggingComponent | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 10 },
    }),
  );

  function handleDragStart(e: DragStartEvent) {
    const { active } = e;
    const data = active.data.current as DraggingComponent;
    console.log({ data });
    setDraggingComponent(data);
  }

  function handleDragEnd(e: DragEndEvent) {
    const { over, active } = e;
    console.log({ active, over });

    if (!active || !over) return;

    // to will always be playground
    const activeData = active.data.current as DraggingComponent;
    const droppableData = over.data.current as DroppableComponent;
    const to = droppableData.to;
    const from = activeData.from;

    console.log({ to, from }, droppableData);

    if (from === "palette" && activeData.elementType === "container") {
      console.log("palette");
      addContainer(droppableData.pageId, droppableData.nodeId);
    } else if (
      from === "palette" &&
      activeData.elementType &&
      ALL_PALETTE_FIELDS_MAP[activeData.elementType] === "field"
    ) {
      console.log("add field");
      addField(
        droppableData.pageId,
        droppableData.nodeId,
        activeData.elementType as InputFieldTypes,
      );
    } else if (from === "playground") {
      console.log("playground move");
      // over.id can be a container or another field
      // we need to resolve the pageId
      const pageId = activeData.pageId;
      if (pageId) {
        moveNode(pageId, active.id as string, over.id as string);
      }
    }
    setDraggingComponent(null);
  }

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}>
      <div className="w-full h-full flex">
        <div
          className={cn(
            "p-2 transition-all duration-300",
            isElementsPanelOpen
              ? "w-[18%]"
              : "w-12 bg-[#cccccc20] flex flex-col items-center hover:bg-muted",
          )}>
          <ElementsPanel
            isOpen={isElementsPanelOpen}
            setIsOpen={setIsElementsPanelOpen}
          />
        </div>
        <div
          className={cn(
            "relative flex justify-between",
            isElementsPanelOpen ? "w-[82%]" : "w-[calc(100%-3rem)]",
          )}>
          <div className="w-[96%] border-x rounded rounded-l-none">
            <Playground />
          </div>

          {/* Pages Min Map */}
          <div className="w-[4%] flex justify-center place-items-start">
            <div className="translate-y-20">
              <PagesMinMap />
            </div>
          </div>
        </div>
      </div>

      <DragOverlay>
        {draggingComponent && (
          <div
            style={{
              padding: 10,
              background: "white",
              border: "1px solid #ccc",
              borderRadius: "4px",
              boxShadow: "0px 4px 6px rgba(0,0,0,0.1)",
            }}>
            {draggingComponent.from === "palette"
              ? draggingComponent.label
              : "Moving Field"}
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
}
