import { useBuilderStore } from "@/hooks/use-builder-store";
import { assertContainerNode } from "@/lib/helper";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  horizontalListSortingStrategy,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { MouseEvent } from "react";
import { cn } from "@/lib/utils";
import RenderNode from "./RenderNode";
import { Node, Page } from "@/types/builder.types";
import { DroppableComponent } from "./Layout";

type ContainerNodeProps = {
  pageId: Page["id"];
  nodeId: Node["id"];
};
export default function ContainerNode({ pageId, nodeId }: ContainerNodeProps) {
  const active = useBuilderStore((s) => s.active);
  // const activeNode = active.node;
  // console.log({ activeNode });
  const setActive = useBuilderStore((s) => s.setActive);
  const page = useBuilderStore((s) => s.pages[pageId]);
  const node = page?.nodes[nodeId];

  if (!node) return null;

  // assertion
  assertContainerNode(node);

  // const [isDragging, setIsDragging] = useState(false);
  // useDndMonitor({
  //   onDragStart: () => setIsDragging(true),
  //   onDragEnd: () => setIsDragging(false),
  //   onDragCancel: () => setIsDragging(false),
  // });

  // useDroppable registers this container as a drop target for fields.
  // We do NOT use useSortable here — containers are not draggable.
  const { setNodeRef, isOver } = useDroppable({
    id: nodeId,
    data: {
      to: "playground",
      componentType: "container",
      pageId,
      nodeId,
    } satisfies DroppableComponent,
  });

  const strategy =
    node.orientation === "horizontal"
      ? horizontalListSortingStrategy
      : verticalListSortingStrategy;

  function handleContainerClick(event: MouseEvent<HTMLFieldSetElement>) {
    console.log("clicked on container");
    event.stopPropagation();
    if (!node) return;
    setActive({ page: { id: pageId }, node: { id: node.id, type: node.type } });
  }

  return (
    <fieldset
      onClick={handleContainerClick}
      ref={setNodeRef}
      className={cn(
        "w-full h-full border-2 border-slate-400/30 rounded-xs",
        {
          "border-indigo-400": active.node?.id === nodeId,
          "border-emerald-400": isOver,
          "overflow-auto": node.isScrollable ?? (page?.rootId === nodeId),
        },
      )}
      style={{
        display: "flex",
        flexDirection: node.orientation === "horizontal" ? "row" : "column",
        gap: 8,
        padding: 15,
      }}>
      <legend
        className={cn(
          "text-[0.6rem] text-slate-500 cursor-pointer select-none px-2 rounded-xs",
          {
            "bg-indigo-200 text-indigo-600 font-medium":
              active.node?.id === nodeId,
            "bg-emerald-200 text-emerald-600 font-medium": isOver,
          },
        )}>
        {node.label}
      </legend>
      {
        <SortableContext items={node.children} strategy={strategy}>
          {node.children.map((childId) => (
            <RenderNode key={childId} pageId={pageId} nodeId={childId} />
          ))}
        </SortableContext>
      }
    </fieldset>
  );
}
