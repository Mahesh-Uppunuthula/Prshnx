import { cn } from "@/lib/utils";
import {
  layoutBuilderStore,
  NodeAlign,
} from "../../store/layout-builder.store";
import { useShallow } from "zustand/react/shallow";
import { MouseEvent } from "react";

type NodeProps = {
  id: string;
  align:  NodeAlign;
  children: NodeProps[];
};
function Node({ id, align, children }: NodeProps) {
  const { selectedNode, setSelectedNode } = layoutBuilderStore(
    useShallow((s) => ({
      selectedNode: s.selectedNode,
      setSelectedNode: s.setSelectedNode,
    })),
  );

  function handleClick(event: MouseEvent<HTMLDivElement>) {
    console.log("Node clicked:", id, align, selectedNode);
    event.preventDefault();
    event.stopPropagation();
    setSelectedNode({ id, align });
  }
  return (
    <div className="w-full h-full" onClick={handleClick}>
      <span className="text-xs">{id}</span>
      <div
        id={id}
        className={cn("w-full border-2 border-gray-300 p-2", {
          "border-2 border-blue-200": selectedNode?.id === id,
        })}>
        {/* {align} */}
        {/* {id} */}
        {children && children.length > 0 && (
          <div
            className={cn("w-full h-full", {
              "flex gap-2": align === "horizontal",
              "flex flex-col gap-2": align === "vertical",
            })}>
            {children.map((child) => (
              <Node key={child.id} {...child} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Node;
