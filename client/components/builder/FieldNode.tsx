import { useBuilderStore } from "@/hooks/use-builder-store";
import { assertChatBlockNode, assertInputFieldNode } from "@/lib/helper";
import { cn } from "@/lib/utils";
import { Node, Page } from "@/types/builder.types";
import { MouseEvent } from "react";
import InlineEdit from "../custom/InlineEdit";
import { LuAsterisk, LuSettings, LuTrash2 } from "react-icons/lu";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

import { ToggleSwitchOption } from "./CommonOptions";
import ChatBlock from "../custom/ChatBlock";
import { FieldSpecificOptions } from "./FieldSpecificOptions";

type FieldNodeProps = {
  pageId: Page["id"];
  nodeId: Node["id"];
};
export default function FieldNode({ pageId, nodeId }: FieldNodeProps) {
  const page = useBuilderStore((s) => s.pages[pageId]);
  const active = useBuilderStore((s) => s.active);
  const setActive = useBuilderStore((s) => s.setActive);
  const updateField = useBuilderStore((s) => s.updateField);
  const node = page?.nodes[nodeId];

  if (!node) return null;

  // assertion
  assertInputFieldNode(node);

  function handleOnClick(event: MouseEvent<HTMLDivElement>) {
    event.stopPropagation();
    if (!node || !node.id || !node.type) return;
    setActive({ page: { id: pageId }, node: { id: node.id, type: node.type } });
  }
  if (node.type === "chat-block") {
    assertChatBlockNode(node);
    return <ChatBlock nodeId={nodeId} pageId={pageId} />;
  }
  return (
    <div
      onClick={handleOnClick}
      className={cn(
        "min-w-[100px] p-2 border-2 rounded",
        active.node?.id === nodeId && active.page?.id === pageId
          ? "border-indigo-400"
          : "hover:border-muted-foreground/50 border-border",
      )}>
      <div>
        <div>
          <div className="w-full flex justify-between place-items-center">
            <div className="w-full flex gap-2 place-items-center">
              <InlineEdit
                // style={{ width: "100%" }}
                value={node.label}
                onChange={(event) => {
                  console.log("value ", event.target.value);
                  updateField(pageId, nodeId, { label: event.target.value });
                }}
              />
              {node.required && (
                <div className="bg-muted rounded-full">
                  <LuAsterisk className="scale-90 text-muted-foreground" />
                </div>
              )}
            </div>
            {/* options */}
            <FieldOptions pageId={pageId} nodeId={nodeId} />
          </div>
          {node.description && (
            <div className="-mt-1 mb-1">
              <span className="text-[11px] text-muted-foreground mx-1">
                {node.description}
              </span>
            </div>
          )}
          <div className="mt-1">
            <div className="w-full min-h-[36px] bg-white border border-input rounded-md px-3 py-1 flex items-center shadow-sm">
              <span className="text-sm text-muted-foreground truncate">
                {node.placeholder || "Enter text..."}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

type FieldOptionsProps = {
  pageId: Page["id"];
  nodeId: Node["id"];
};

export function FieldOptions({ pageId, nodeId }: FieldOptionsProps) {
  const pages = useBuilderStore((s) => s.pages);
  const updateField = useBuilderStore((s) => s.updateField);
  const deleteNode = useBuilderStore((s) => s.deleteNode);
  const page = pages[pageId];

  if (!page) return null;
  const node = page.nodes[nodeId];
  if (!node) return null;
  assertInputFieldNode(node);

  const handleToggle = (key: "required") => (checked: boolean) => {
    console.log({ pageId, nodeId }, "key ", key, " checked ", checked);
    switch (key) {
      case "required":
        updateField(pageId, nodeId, { required: checked });
    }
  };

  return (
    <div className="w-fit flex place-items-center">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"ghost"}
            size={"icon-sm"}
            className="text-muted-foreground hover:text-foreground hover:bg-muted">
            <LuSettings />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          align="end"
          className="w-fit min-w-72 flex flex-col gap-1">
          {/* Required */}
          <ToggleSwitchOption
            label="Required"
            checked={node.required}
            onCheckedChange={handleToggle("required")}
          />
          {/* Field Specific Options */}
          <div className="flex flex-col gap-2">
            <FieldSpecificOptions pageId={pageId} nodeId={nodeId} />
          </div>
        </PopoverContent>
      </Popover>
      <Button
        size={"icon-sm"}
        variant={"ghost"}
        className="text-muted-foreground hover:text-red-600 hover:bg-red-100"
        onClick={() => deleteNode(pageId, nodeId)}>
        <LuTrash2 />
      </Button>
    </div>
  );
}
