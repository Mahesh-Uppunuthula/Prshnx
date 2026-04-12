import { useBuilderStore } from "@/hooks/use-builder-store";
import { ButtonGroup } from "../ui/button-group";
import { Button } from "../ui/button";
import {
  LuFoldHorizontal,
  LuFoldVertical,
  LuSettings,
  LuTrash,
} from "react-icons/lu";
import { Node } from "@/types/builder.types";
import { Icon } from "./DraggablePaletteItem";
import { cn } from "@/lib/utils";
import { assertContainerNode } from "@/lib/helper";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { ToggleSwitchOption } from "./CommonOptions";

export default function QuickActionBar() {
  const activeEntity = useBuilderStore((s) => s.active);
  const deleteNode = useBuilderStore((s) => s.deleteNode);
  const updateContainer = useBuilderStore((s) => s.updateContainer);

  const activePage = activeEntity.page;
  const activeNode = activeEntity.node;

  const node = useBuilderStore((s) =>
    activePage?.id && activeNode?.id
      ? s.pages[activePage.id]?.nodes[activeNode.id]
      : null,
  );

  const isRoot = useBuilderStore((s) =>
    activePage?.id && node?.id
      ? s.pages[activePage.id]?.rootId === node.id
      : false,
  );

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
    if (!node) return;
    assertContainerNode(node);
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
            className={cn({
              "bg-indigo-50 text-indigo-900":
                node?.orientation === "horizontal",
            })}
            onClick={() =>
              updateContainer(activePage.id, activeNode.id, {
                orientation: "horizontal",
              })
            }>
            <LuFoldHorizontal
              className={cn({
                "text-indigo-900": node?.orientation === "horizontal",
              })}
            />
            Horizontal
          </Button>
          <Button
            variant={"outline"}
            className={cn({
              "bg-indigo-50 text-indigo-900": node?.orientation === "vertical",
            })}
            onClick={() =>
              updateContainer(activePage.id, activeNode.id, {
                orientation: "vertical",
              })
            }>
            <LuFoldVertical
              className={cn({
                "text-indigo-900": node?.orientation === "vertical",
              })}
            />{" "}
            Vertical
          </Button>
          {/* <Button variant={"outline"} onClick={() => emptyContainer(activePage.id, activeNode.id)}>
            <LuPaintbrush /> Clear
          </Button> */}

          <Popover>
            <PopoverTrigger asChild>
              <Button variant={"outline"}>
                <LuSettings /> Settings
              </Button>
            </PopoverTrigger>
            <PopoverContent align="center" className="w-48 p-3 flex flex-col">
              <ToggleSwitchOption
                label="Scrollable"
                checked={node.isScrollable ?? isRoot}
                onCheckedChange={(checked) =>
                  updateContainer(activePage.id, activeNode.id, {
                    isScrollable: checked,
                  })
                }
              />
            </PopoverContent>
          </Popover>

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
