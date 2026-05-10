import { useBuilderStore } from "@/hooks/use-builder-store";
import { FieldOptions } from "../builder/FieldNode";
import { assertChatBlockNode } from "@/lib/helper";
import { LuAsterisk, LuSettings } from "react-icons/lu";
import InlineEdit from "./InlineEdit";
import { MouseEvent, useState } from "react";
import { cn } from "@/lib/utils";
import ImportImage from "../ImportImage";

type ChatBlockProps = {
  nodeId: string;
  pageId: string;
};
function ChatBlock({ nodeId, pageId }: ChatBlockProps) {
  const page = useBuilderStore((s) => s.pages[pageId]);
  const updateField = useBuilderStore((s) => s.updateField);
  const active = useBuilderStore((s) => s.active);
  const setActive = useBuilderStore((s) => s.setActive);
  const node = page?.nodes[nodeId];
  if (!node) return null;

  assertChatBlockNode(node);

  // states
  const [importImageOpen, setImportImageOpen] = useState<
    "questioner" | "respondent" | null
  >(null);

  // callbacks
  const handleTextChange =
    (type: "question") => (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      if (type === "question") {
        updateField(pageId, nodeId, { question: value });
      }
    };

  function handleOnClick(event: MouseEvent<HTMLDivElement>) {
    event.stopPropagation();
    if (!node || !node.id || !node.type) return;
    setActive({ page: { id: pageId }, node: { id: node.id, type: node.type } });
  }

  const { questioner, respondent, question, response } = node;

  function handleAvatarChange(
    fieldKey: "questioner" | "respondent",
    url: string,
  ) {
    const target = fieldKey === "questioner" ? questioner : respondent;
    console.log({ fieldKey, target, url });

    updateField(pageId, nodeId, {
      [fieldKey]: { ...target, avatar: url },
    });
  }

  function closeImportImageModal() {
    setImportImageOpen(null);
  }

  return (
    <div
      className={cn(
        "w-full min-w-[100px] h-fit text-sm rounded border-2 border-black/10",
        active.node?.id === nodeId && active.page?.id === pageId
          ? "border-indigo-400"
          : "hover:border-muted-foreground/50 border-border",
      )}
      onClick={handleOnClick}>
      {/* question and questioner */}
      <div className="w-full p-2 flex gap-3">
        <div onPointerDown={(e) => e.stopPropagation()}>
          <ImportImage
            key={"questioner"}
            trigger={
              <img
                className="rounded-full size-10 cursor-pointer hover:opacity-80 transition-opacity"
                src={questioner.avatar}
                alt={questioner.name}
              />
            }
            onImport={(url) => handleAvatarChange("questioner", url)}
            open={importImageOpen === "questioner"}
            onOpenChange={(open) =>
              setImportImageOpen(open ? "questioner" : null)
            }
            onClose={closeImportImageModal}
          />
        </div>
        <div className="w-full flex flex-col justify-start gap-0 bg-red-20">
          <div className="w-full flex justify-between bg-blue-20">
            <span className="w-fit font-medium flex gap-2 place-items-center">
              {questioner.name}
              {node.required && (
                <div className="bg-muted rounded-full">
                  <LuAsterisk className="scale-90 text-muted-foreground" />
                </div>
              )}
            </span>
            <FieldOptions pageId={pageId} nodeId={nodeId} />
          </div>
          <InlineEdit
            value={question}
            onChange={handleTextChange("question")}
          />
        </div>
      </div>
      <div className="w-full border-t" />
      {/* respondent and response */}
      <div className="w-full p-2 flex gap-3">
        <div onPointerDown={(e) => e.stopPropagation()}>
          <ImportImage
            key={"respondent"}
            trigger={
              <img
                className="rounded-full size-10 cursor-pointer hover:opacity-80 transition-opacity"
                src={respondent.avatar}
                alt={respondent.name}
              />
            }
            onImport={(url) => handleAvatarChange("respondent", url)}
            open={importImageOpen === "respondent"}
            onOpenChange={(open) =>
              setImportImageOpen(open ? "respondent" : null)
            }
            onClose={closeImportImageModal}
          />
        </div>
        <div className="w-full flex flex-col">
          <span className="w-fit font-medium ">{respondent.name}</span>
          {/* <span>{response.type}</span> */}
          <div className="mt-1">
            <div className="w-full min-h-[36px] bg-white border border-input rounded-md px-3 py-1 flex items-center shadow-sm">
              <span className="text-sm text-muted-foreground truncate">
                {response.placeholder || (
                  <span className="flex place-items-center gap-2">
                    Click on
                    <LuSettings className="scale-90 text-primary" />
                    to add <b>placeholder</b>
                  </span>
                )}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatBlock;
