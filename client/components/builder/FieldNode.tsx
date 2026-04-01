import { useBuilderStore } from "@/hooks/use-builder-store";
import { assertFieldNode } from "@/lib/helper";
import { cn } from "@/lib/utils";
import { Node, Page } from "@/types/builder.types";
import { MouseEvent } from "react";

type FieldNodeProps = {
  pageId: Page["id"];
  nodeId: Node["id"];
};
export default function FieldNode({ pageId, nodeId }: FieldNodeProps) {
  const page = useBuilderStore((s) => s.pages[pageId]);
  const active = useBuilderStore((s) => s.active);
  const setActive = useBuilderStore((s) => s.setActive);
  const node = page?.nodes[nodeId];

  if (!node) return null;

  // assertion
  assertFieldNode(node);

  function handleOnClick(event: MouseEvent<HTMLLabelElement>) {
    event.stopPropagation();
    console.log("clicked");
    if (!node || !node.id || !node.type) return;
    setActive({ page: { id: pageId }, node: { id: node.id, type: node.type } });
  }

  return (
    <div
      className={cn(
        "min-w-[100px] p-2 border-2 rounded-xs",
        active.node?.id === nodeId && active.page?.id === pageId
          ? "border-indigo-400"
          : "hover:border-muted-foreground/50 border-border",
      )}>
      <label onClick={handleOnClick}>{node.label}</label>
      <input
        // TODO change it to correct input type
        type={node.type}
        style={{ width: "100%" }}
      />
    </div>
  );
}
