import { useBuilderStore } from "@/hooks/use-builder-store";
import { ButtonGroup } from "../ui/button-group";
import { Button } from "../ui/button";
import { LuTrash } from "react-icons/lu";

export default function QuickActionBar() {
  const pages = useBuilderStore((s) => s.pages);
  const activePage = useBuilderStore((s) => s.activePage);
  const deletePage = useBuilderStore((s) => s.deletePage);
  console.log({ activePage });

  const isDeleteDisabled = Object.keys(pages).length === 1;
  const areActionsDisabled = !activePage || !activePage.id;

  const handleAction = (action: "delete") => () => {
    if (!activePage || !activePage.id) return;
    if (action === "delete") deletePage(activePage.id);
  };

  return (
    <div className="w-fit h-fit p-2 rounded">
      <ButtonGroup className="shadow-xl">
        {/* <Button
          variant={"outline"}
          onClick={() => addContainer(activeNode.id, "column")}
        >
          <LuSquareDashed /> Add Container
        </Button> */}
        {/* <Button
            variant={"outline"}
            onClick={() => changeContainerDirection(activeNode.id, "row")}>
            <LuFoldHorizontal /> Align Horizontal
          </Button>
          <Button
            variant={"outline"}
            onClick={() => changeContainerDirection(activeNode.id, "column")}>
            <LuFoldVertical /> Align Vertical
          </Button>
          <Button variant={"outline"} onClick={() => deleteNode(activeNode.id)}>
            <LuPaintbrush /> Clear All Fields
          </Button>
          */}
        <Button
          variant={"outline"}
          onClick={handleAction("delete")}
          disabled={areActionsDisabled || isDeleteDisabled}>
          <LuTrash /> Delete
        </Button>
      </ButtonGroup>
    </div>
  );
}
