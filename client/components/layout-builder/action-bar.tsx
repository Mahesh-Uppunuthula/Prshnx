import { ButtonGroup } from "@/components/ui/button-group";
import { Button } from "../ui/button";
import {
  SquareSplitHorizontal,
  SquareSplitVertical,
  Trash,
} from "lucide-react";
import { Tooltip, TooltipTrigger, TooltipContent } from "../ui/tooltip";
import { ActionBarDispatcher } from "@/routes/_protected/test_layout";
type ActionBarProps = {
  dispatch: ActionBarDispatcher;
};
function ActionBar({ dispatch }: ActionBarProps) {
  return (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
      <ButtonGroup>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" onClick={() => dispatch({type: "split_horizontal", payload: { parentId: "root"}})}>
              <SquareSplitHorizontal />
            </Button>
          </TooltipTrigger>
          <TooltipContent>split horizontally</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" onClick={() => dispatch({type: "split_vertical", payload: {parentId: "root"}})}>
              <SquareSplitVertical />
            </Button>
          </TooltipTrigger>
          <TooltipContent>split vertically</TooltipContent>
        </Tooltip>
        <Button variant="outline" onClick={() => dispatch({type: "delete", payload: {id: "field1"}})}>
          <Trash />
        </Button>
      </ButtonGroup>
    </div>
  );
}

export default ActionBar;
