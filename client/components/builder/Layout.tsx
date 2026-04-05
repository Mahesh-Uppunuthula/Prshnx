import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  MouseSensor,
  TouchSensor,
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

export type DraggingComponent = {
  id: Node["id"];
  label: Node["label"];
  elementType: Node["type"];
  from: "palette" | "playground";
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

  const [draggingComponent, setDraggingComponent] =
    useState<DraggingComponent | null>(null);

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: { delay: 50, tolerance: 5 },
    }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 50, tolerance: 5 },
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
      ALL_PALETTE_FIELDS_MAP[activeData.elementType] === "field"
    ) {
      console.log("add field");
      addField(
        droppableData.pageId,
        droppableData.nodeId,
        activeData.elementType as InputFieldTypes,
      );
    }
    setDraggingComponent(null);
  }

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="w-full h-[92%] flex">
        <div className="w-[18%]">
          <ElementsPanel />
        </div>
        <div className="w-[82%] relative  flex justify-between">
          <div className="w-[95%]">
            <Playground />
          </div>

          {/* Pages Min Map */}
          <div className="w-[5%] flex justify-center place-items-start">
            <div className="translate-y-20">
              <PagesMinMap />
            </div>
          </div>
        </div>
      </div>

      <DragOverlay>
        {draggingComponent?.from === "palette" && (
          <div
            style={{
              padding: 10,
              background: "white",
              border: "1px solid #ccc",
            }}>
            {draggingComponent.label}
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
}
