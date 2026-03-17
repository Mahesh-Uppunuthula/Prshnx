import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
} from "@dnd-kit/core";
import ElementsPanel from "./ElementsPanel";
import PagesMinMap from "./PageMinMap";
import Playground from "./Playground";
import { useState } from "react";

export type DraggingComponent = {
  label: string;
} & (
  | {
      from: "palette";
      componentType: "field";
    }
  | {
      from: "playground";
      componentType: "field";
    }
);

export type From = DraggingComponent["from"];

export default function BuilderBodyLayout() {
  const [draggingComponent, setDraggingComponent] =
    useState<DraggingComponent | null>(null);

  function handleDragStart(e: DragStartEvent) {
    const { active } = e;
    console.log({ active });
    const data = active.data.current as DraggingComponent;
    console.log({ data });
    setDraggingComponent({
      label: data.label,
      from: data.from,
      componentType: data.componentType,
    });
  }

  function handleDragEnd(e: DragEndEvent) {
    const { over } = e;
    if (over) {
      console.log({ over });
    }
    setDraggingComponent(null);
  }

  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
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
