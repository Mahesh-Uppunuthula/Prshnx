import { DragDropProvider } from "@dnd-kit/react";
import { move } from "@dnd-kit/helpers";
import { createFileRoute } from "@tanstack/react-router";
import Row from "@/components/form-builder/Row";
import { useState } from "react";
import { Item } from "@/components/form-builder/Item";

export const Route = createFileRoute("/_protected/test")({
  component: RouteComponent,
});

function RouteComponent() {
  const [items, setItems] = useState({
    A: ["A0", "A1", "A2"],
    B: ["B0", "B1"],
    C: [],
  });
  const [rowOrder, setRowOrder] = useState(() => Object.keys(items));

  return (
    <DragDropProvider
      onDragOver={(event) => {
        const { source, target } = event.operation;

        if (source?.type === "row") return;

        setItems((items) => move(items, event));
      }}
      onDragEnd={(event) => {
        const { source, target } = event.operation;

        if (event.canceled || source?.type !== "row") return;

        setRowOrder((rows) => move(rows, event));
      }}>
      <div className="w-full flex">
        {rowOrder.map((row, rowIndex) => (
          <Row key={row} id={row} index={rowIndex}>
            {items[row].map((id, index) => (
              <Item key={id} id={id} index={index} row={row} />
            ))}
          </Row>
        ))}
      </div>
    </DragDropProvider>
  );
}
