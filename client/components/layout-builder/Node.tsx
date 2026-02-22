import { cn } from "@/lib/utils";
import { layoutBuilderStore, NodeType } from "../../store/layout-builder.store";
import { MouseEvent } from "react";

type NodeProps = {
  id: string;
  type: NodeType;
  children?: NodeProps[];
};
function Node({ id, type, children }: NodeProps) {
  // const selectedNodeId = layoutBuilderStore((s) => s.selectedNodeId);
  const setSelectedNodeId = layoutBuilderStore((s) => s.setSelectedNodeId);
  function handleClick(event: MouseEvent<HTMLDivElement>){
    event.preventDefault();
    event.stopPropagation();
    setSelectedNodeId(id)
  }
  return (
    <div className="w-full">
      <span className="text-xs">{id}</span>
      <div id={id} className={cn("w-full border border-gray-300 p-2", {
        // "border-2 border-blue-200": selectedNodeId
      })} onClick={handleClick}>
        {/* {type} */}
        {/* {id} */}
        {children && children.length > 0 && (
          <div
            className={cn("w-full", {
              "flex gap-2": type === "row",
              "flex flex-col gap-2": type === "column",
            })}
          >
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
