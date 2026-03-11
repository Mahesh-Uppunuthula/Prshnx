import Node from "@/components/layout-builder/Node";
import ActionBar from "@/components/layout-builder/action-bar";
import type { ActionBarDispatcher } from "@/components/layout-builder/action-bar";
import { createFileRoute } from "@tanstack/react-router";
import { layoutBuilderStore } from "../../store/layout-builder.store";
import { useShallow } from "zustand/react/shallow";
export const Route = createFileRoute("/_protected/test_layout")({
  component: TestLayout,
});

function TestLayout() {
  const nodeStructure = layoutBuilderStore(useShallow((s) => s.structure));
  const selectedNode = layoutBuilderStore(useShallow((s) => s.selectedNode));
  const splitSection = layoutBuilderStore(useShallow((s) => s.splitSection));

  const dispatchActionBarActions: ActionBarDispatcher = (action) => {
    const { type, payload } = action;
    switch (type) {
      case "split_horizontal":
        console.log("split_horizontal", payload);
        splitSection(payload.id, "horizontal");
        return;
      case "split_vertical":
        console.log("split_vertical", payload);
        splitSection(payload.id, "vertical");
        return;
      case "delete":
        console.log("delete", payload);
        return;
    }
  };

  return (
    <div className="bg-[#f5f5f5]/50 h-screen">
      {/* <div
        className={cn("p-4 border rounded", {
          "flex gap-2": data.align === "horizontal",
          "flex-col gap-2": data.align === "vertical",
        })}>
        {data.children?.map((child) => (
          <Node key={child.id} {...child} />
        ))}
      </div> */}
      <Node {...nodeStructure} />
      {selectedNode &&
        (selectedNode.align === "vertical" ||
          selectedNode.align === "horizontal") && (
          <ActionBar
            dispatch={dispatchActionBarActions}
            selectedNode={selectedNode}
          />
        )}
    </div>
  );
}
