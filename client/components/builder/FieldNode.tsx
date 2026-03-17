import { useBuilderStore } from "@/hooks/use-builder-store";
import { assertFieldNode } from "@/lib/helper";
import { Node, Page } from "@/types/builder.types";

type FieldNodeProps = {
  pageId: Page["id"];
  nodeId: Node["id"];
};
export default function FieldNode({ pageId, nodeId }: FieldNodeProps) {
  const page = useBuilderStore((s) => s.pages[pageId]);
  const node = page?.nodes[nodeId];

  if (!node) return null;

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
      <input
        // TODO change it to correct type
        type={node.type}
        style={{ width: "100%" }}
      />
    </div>
  );
}
