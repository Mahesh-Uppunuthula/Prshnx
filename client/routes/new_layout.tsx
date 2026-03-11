import { CSS } from "@dnd-kit/utilities";
import { createFileRoute } from "@tanstack/react-router";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  pointerWithin,
  useDraggable,
  useDroppable,
} from "@dnd-kit/core";

import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useBuilderStore } from "@/store/new-builder.store";
import { MouseEvent, useState } from "react";
import {
  LuFoldHorizontal,
  LuFoldVertical,
  LuSquareDashed,
  LuTrash,
} from "react-icons/lu";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { cn } from "@/lib/utils";
import { assertContainerNode, assertFieldNode } from "@/lib/helper";

export const Route = createFileRoute("/new_layout")({
  component: RouteComponent,
});

type Node =
  | {
      id: string;
      type: "container";
      direction: "row" | "column";
      parentId: string | null;
      children: string[];
    }
  | {
      id: string;
      type: "field";
      fieldType: string;
      label: string;
      parentId: string;
    };
// export const initialState: {
//   rootId: string;
//   nodes: Record<string, Node>;
// } = {
//   rootId: "root",
//   nodes: {
//     root: {
//       id: "root",
//       type: "container",
//       direction: "column",
//       parentId: null,
//       children: ["row-1", "email", "row-2"],
//     },

//     "row-1": {
//       id: "row-1",
//       type: "container",
//       direction: "row",
//       parentId: "root",
//       children: ["first", "last"],
//     },

//     first: {
//       id: "first",
//       type: "field",
//       fieldType: "text",
//       label: "First Name",
//       parentId: "row-1",
//     },

//     last: {
//       id: "last",
//       type: "field",
//       fieldType: "text",
//       label: "Last Name",
//       parentId: "row-1",
//     },

//     email: {
//       id: "email",
//       type: "field",
//       fieldType: "email",
//       label: "Email",
//       parentId: "root",
//     },

//     "row-2": {
//       id: "row-2",
//       type: "container",
//       direction: "row",
//       parentId: "root",
//       children: ["address-group", "password-group"],
//     },

//     "address-group": {
//       id: "address-group",
//       type: "container",
//       direction: "column",
//       parentId: "row-2",
//       children: ["street", "city"],
//     },

//     street: {
//       id: "street",
//       type: "field",
//       fieldType: "text",
//       label: "Street",
//       parentId: "address-group",
//     },

//     city: {
//       id: "city",
//       type: "field",
//       fieldType: "text",
//       label: "City",
//       parentId: "address-group",
//     },

//     "password-group": {
//       id: "password-group",
//       type: "container",
//       direction: "column",
//       parentId: "row-2",
//       children: ["password", "confirm"],
//     },

//     password: {
//       id: "password",
//       type: "field",
//       fieldType: "password",
//       label: "Password",
//       parentId: "password-group",
//     },

//     confirm: {
//       id: "confirm",
//       type: "field",
//       fieldType: "password",
//       label: "Confirm Password",
//       parentId: "password-group",
//     },
//   },
// };

function RouteComponent() {
  const rootId = useBuilderStore((s) => s.present.rootId);
  const moveNode = useBuilderStore((s) => s.moveNode);
  const addField = useBuilderStore((s) => s.addField);

  const [activeData, setActiveData] = useState<any>(null);

  function handleDragStart(event: any) {
    setActiveData(event.active.data.current);
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    setActiveData(null);

    if (!over) return;

    const activeData = active.data.current;

    const state = useBuilderStore.getState().present;
    const nodes = state.nodes;

    const overNode = nodes[over.id as string];

    if (!overNode) return;

    // 🔥 1. From Palette → Create new field
    if (activeData?.from === "palette") {
      if (overNode.type === "container") {
        // Dropped directly on the container's empty area
        addField(over.id as string, activeData.fieldType, activeData.label);
      } else if (overNode.type === "field" && overNode.parentId) {
        // Dropped on top of an existing field — add to its parent container instead
        addField(overNode.parentId, activeData.fieldType, activeData.label);
      }
      return;
    }

    // 🔥 2. Move Existing Node
    const activeNode = nodes[active.id as string];
    if (!activeNode) return;

    if (overNode?.type === "container") {
      moveNode(active.id as string, over.id as string);
      return;
    }

    moveNode(active.id as string, overNode.parentId!, over.id as string);
  }

  return (
    <div className="w-full h-[600px] flex gap-2 p-4">
      <DndContext
        collisionDetection={pointerWithin}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}>
        <FieldSidebar />
        <RenderNode id={rootId} />

        <ActionPanel />

        <DragOverlay>
          {activeData?.from === "palette" && (
            <div
              style={{
                padding: 10,
                background: "white",
                border: "1px solid #ccc",
              }}>
              {activeData.label}
            </div>
          )}
        </DragOverlay>
      </DndContext>
    </div>
  );
}

function RenderNode({ id }: { id: string }) {
  const node = useBuilderStore((s) => s.present.nodes[id]);

  if (!node) return null;

  // Containers are DROPPABLE only — they don't get sorted/dragged.
  // Fields are SORTABLE — they can be dragged and reordered.
  if (node.type === "container") {
    return <ContainerNode id={id} />;
  }

  return (
    <SortableWrapper id={id}>
      <FieldNode id={id} />
    </SortableWrapper>
  );
}

function SortableWrapper({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

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
function ContainerNode({ id }: { id: string }) {
  const activeNode = useBuilderStore((s) => s.activeNode);
  const setActiveNode = useBuilderStore((s) => s.setActiveNode);
  const node = useBuilderStore((s) => s.present.nodes[id]);

  // assertion
  assertContainerNode(node);

  // useDroppable registers this container as a drop target for fields.
  // We do NOT use useSortable here — containers are not draggable.
  const { setNodeRef } = useDroppable({ id });

  const strategy =
    node.direction === "row"
      ? horizontalListSortingStrategy
      : verticalListSortingStrategy;

  function handleContainerClick(event: MouseEvent<HTMLLegendElement>) {
    console.log("clicked on container");
    event.stopPropagation();
    if (!node) return;
    setActiveNode({ id: node.id, type: node.type, parentId: node.parentId });
  }

  return (
    <fieldset
      ref={setNodeRef}
      className={cn("w-full h-full border border-[#ccc]", {
        "border-2 border-dashed border-indigo-400": activeNode?.id === id,
      })}
      style={{
        display: "flex",
        flexDirection: node.direction,
        gap: 8,
        padding: 12,
        // minHeight: ,
      }}>
      <legend
        className={cn(
          "text-xs text-slate-500 cursor-pointer select-none px-1",
          {
            "bg-indigo-200 text-indigo-600 font-medium px-2 rounded-xs":
              activeNode?.id === id,
          },
        )}
        onClick={handleContainerClick}>
        {node.id}
      </legend>
      <SortableContext items={node.children} strategy={strategy}>
        {node.children.map((childId) => (
          <RenderNode key={childId} id={childId} />
        ))}
      </SortableContext>
    </fieldset>
  );
}

function FieldNode({ id }: { id: string }) {
  const node = useBuilderStore((s) => s.present.nodes[id]);

  // assertion
  assertFieldNode(node);

  return (
    <div
      style={{
        padding: 8,
        border: "1px solid #aaa",
        background: "#fafafa",
        minWidth: 100,
      }}>
      <label>{node.label}</label>
      <input type={node.fieldType} style={{ width: "100%" }} />
    </div>
  );
}

export const FIELD_LIBRARY = [
  { type: "text", label: "Text Input" },
  { type: "email", label: "Email" },
  { type: "number", label: "Number" },
  { type: "password", label: "Password" },
  { type: "textarea", label: "Textarea" },
  { type: "checkbox", label: "Checkbox" },
  { type: "select", label: "Select" },
  { type: "date", label: "Date Picker" },
];

export function DraggableField({
  fieldType,
  label,
}: {
  fieldType: string;
  label: string;
}) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: `palette-${fieldType}`,
    data: {
      from: "palette",
      fieldType,
      label,
    },
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    padding: 10,
    border: "1px solid #ddd",
    background: "#fff",
    marginBottom: 8,
    cursor: "grab",
  };

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
      {label}
    </div>
  );
}

function FieldSidebar() {
  return (
    <div
      style={{
        width: 250,
        padding: 16,
        borderRight: "1px solid #eee",
      }}>
      <h3>Fields</h3>

      {FIELD_LIBRARY.map((field) => (
        <DraggableField
          key={field.type}
          fieldType={field.type}
          label={field.label}
        />
      ))}
    </div>
  );
}

function ActionPanel() {
  const activeNode = useBuilderStore((s) => s.activeNode);
  const addContainer = useBuilderStore((s) => s.addContainer);
  const changeContainerDirection = useBuilderStore(
    (s) => s.changeContainerDirection,
  );
  const deleteNode = useBuilderStore((s) => s.deleteNode);

  console.log({ activeNode });
  if (activeNode?.type !== "container") return null;
  return (
    <div className="fixed bottom-1 left-1/2 translate-x-[-50%]">
      <div className="">
        <ButtonGroup className="shadow-xl">
          <Button
            variant={"outline"}
            onClick={() => addContainer(activeNode.id, "column")}>
            <LuSquareDashed /> Add Container
          </Button>
          <Button
            variant={"outline"}
            onClick={() => changeContainerDirection(activeNode.id, "row")}>
            <LuFoldHorizontal /> Align Horizontal
          </Button>
          <Button
            variant={"outline"}
            onClick={() => changeContainerDirection(activeNode.id, "column")}>
            <LuFoldVertical /> Align Vertical
          </Button>
          <Button
            variant={"outline"}
            disabled={activeNode.id === "root"}
            onClick={() => deleteNode(activeNode.id)}>
            <LuTrash /> Delete
          </Button>
        </ButtonGroup>
      </div>
    </div>
  );
}
