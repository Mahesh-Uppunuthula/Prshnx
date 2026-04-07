import { useBuilderStore } from "@/hooks/use-builder-store";
import { ButtonGroup } from "../ui/button-group";
import { Button } from "../ui/button";
import { LuFoldHorizontal, LuFoldVertical, LuTrash } from "react-icons/lu";
import { Node } from "@/types/builder.types";
import { Icon } from "./DraggablePaletteItem";

export default function QuickActionBar() {
  const activeEntity = useBuilderStore((s) => s.active);
  const deleteNode = useBuilderStore((s) => s.deleteNode);
  const updateContainer = useBuilderStore((s) => s.updateContainer);

  const activePage = activeEntity.page;
  const activeNode = activeEntity.node;

  const handleAction = (action: "delete") => () => {
    console.log(
      "handleAction",
      !activePage,
      !activePage?.id,
      !activeNode,
      !activeNode?.id,
    );
    if (!activePage || !activePage.id || !activeNode || !activeNode.id) return;

    if (action === "delete") {
      deleteNode(activePage.id, activeNode.id);
      return;
    }
  };

  if (
    !activePage ||
    !activePage.id ||
    !activeNode ||
    !activeNode.id ||
    !activeNode.type
  )
    return;

  if (activeNode.type === "container") {
    return (
      <div className="w-fit h-fit p-2 rounded flex gap-2 place-items-center">
        <ButtonGroup className="shadow-xl">
          <NodeHighlight type={activeNode.type} />
          {/* <Button
          variant={"outline"}
          onClick={() => addContainer(activeNode.id, "column")}
        >
          <LuSquareDashed /> Add Container
        </Button> */}
          <Button
            variant={"outline"}
            onClick={() =>
              updateContainer(activePage.id, activeNode.id, {
                orientation: "horizontal",
              })
            }>
            <LuFoldHorizontal /> Horizontal
          </Button>
          <Button
            variant={"outline"}
            onClick={() =>
              updateContainer(activePage.id, activeNode.id, {
                orientation: "vertical",
              })
            }>
            <LuFoldVertical /> Vertical
          </Button>
          {/* <Button variant={"outline"} onClick={() => emptyContainer(activePage.id, activeNode.id)}>
            <LuPaintbrush /> Clear
          </Button> */}

          <Button
            variant={"outline"}
            onClick={handleAction("delete")}
            // disabled={areActionsDisabled || isDeleteDisabled}
          >
            <LuTrash /> Delete
          </Button>
        </ButtonGroup>
      </div>
    );
  }
  return (
    <div className="w-fit h-fit p-2 rounded flex gap-2 place-items-center">
      <ButtonGroup className="shadow-xl">
        <NodeHighlight type={activeNode.type} />
        <Button
          variant={"outline"}
          onClick={handleAction("delete")}
          // disabled={areActionsDisabled || isDeleteDisabled}
        >
          <LuTrash />
          Delete
        </Button>
      </ButtonGroup>
    </div>
  );
}

type NodeHighlightProps = {
  type: Node["type"];
};
function NodeHighlight({ type }: NodeHighlightProps) {
  return (
    <div className="w-8 aspect-square p-1 bg-indigo-600 text-white rounded flex justify-center place-items-center">
      <Icon type={type} />
    </div>
  );
}
