import { ButtonGroup } from "@/components/ui/button-group";
import { Button } from "../ui/button";
import {
  SquareSplitHorizontal,
  SquareSplitVertical,
  Trash,
} from "lucide-react";
import { Tooltip, TooltipTrigger, TooltipContent } from "../ui/tooltip";
import { LayoutBuilderState } from "@/store/layout-builder.store";
type Action =
  | { type: "split_horizontal" | "split_vertical"; payload: { id: string } }
  | { type: "delete"; payload: { id: string } };

export type ActionBarDispatcher = (action: Action) => void;

type ActionBarProps = {
  selectedNode: LayoutBuilderState["selectedNode"];
  dispatch: ActionBarDispatcher;
};
function ActionBar({ dispatch, selectedNode }: ActionBarProps) {
  console.log("actionbar- selectedNode", selectedNode?.id, selectedNode?.align);
  const handleAction = (actionType: Action["type"]) => () => {
    if (!selectedNode) return;
    dispatch({ type: actionType, payload: { id: selectedNode.id } });
  };
  return (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 shadow-lg">
      <ButtonGroup>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={
                selectedNode?.align === "horizontal" ? "default" : "outline"
              }
              onClick={handleAction("split_horizontal")}>
              <SquareSplitHorizontal />
            </Button>
          </TooltipTrigger>
          <TooltipContent>split horizontally</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={
                selectedNode?.align === "vertical" ? "default" : "outline"
              }
              onClick={handleAction("split_vertical")}>
              <SquareSplitVertical />
            </Button>
          </TooltipTrigger>
          <TooltipContent>split vertically</TooltipContent>
        </Tooltip>
        <Button variant="outline" onClick={handleAction("delete")}>
          <Trash />
        </Button>
      </ButtonGroup>
    </div>
  );
}

export default ActionBar;
