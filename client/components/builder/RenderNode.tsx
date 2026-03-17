import { useBuilderStore } from "@/hooks/use-builder-store";
import { Node, Page } from "@/types/builder.types";
import ContainerNode from "./ContainerNode";
import SortableWrapper from "./SortableWrapper";
import FieldNode from "./FieldNode";

type RenderNodeProps = {
  pageId: Page["id"];
  nodeId: Node["id"];
};
export default function RenderNode({ pageId, nodeId }: RenderNodeProps) {
  const page = useBuilderStore((s) => s.pages[pageId]);
  const node = page?.nodes[nodeId];
  if (!node) return null;

  // Containers are DROPPABLE only — they don't get sorted/dragged.
  // Fields are SORTABLE — they can be dragged and reordered.
  if (node.type === "container") {
    return <ContainerNode pageId={pageId} nodeId={nodeId} />;
  }

  return (
    <SortableWrapper id={nodeId}>
      <FieldNode pageId={pageId} nodeId={nodeId} />
    </SortableWrapper>
  );
}
