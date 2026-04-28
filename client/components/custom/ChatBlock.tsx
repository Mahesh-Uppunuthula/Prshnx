import { useBuilderStore } from "@/hooks/use-builder-store";
import { FieldOptions } from "../builder/FieldNode";
import { assertChatBlockNode } from "@/lib/helper";
import { LuAsterisk } from "react-icons/lu";

type ChatBlockProps = {
  nodeId: string;
  pageId: string;
};
function ChatBlock({ nodeId, pageId }: ChatBlockProps) {
  const page = useBuilderStore((s) => s.pages[pageId]);
  const node = page?.nodes[nodeId];
  if (!node) return null;

  assertChatBlockNode(node);

  const { questioner, respondent, question, response } = node;
  return (
    <div className="w-full h-fit text-sm rounded-lg border border-black/10 shadow-sm">
      {/* question and questioner */}
      <div className="w-full p-2 flex gap-3">
        <img
          className="rounded-full size-10"
          src={questioner.avatar}
          alt={questioner.name}
        />
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
          <span>{question}</span>
        </div>
      </div>
      <div className="w-full border-t" />
      {/* respondent and response */}
      <div className="w-full p-2 flex gap-3">
        <img
          className="rounded-full size-10"
          src={respondent.avatar}
          alt={respondent.name}
        />
        <div className="w-full flex flex-col">
          <span className="w-fit font-medium ">{respondent.name}</span>
          {/* <span>{response.type}</span> */}
          <div className="mt-1">
            <div className="w-full min-h-[36px] bg-white border border-input rounded-md px-3 py-1 flex items-center shadow-sm">
              <span className="text-sm text-muted-foreground truncate">
                {response.placeholder || "Enter text..."}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatBlock;
