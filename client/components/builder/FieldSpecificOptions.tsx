import { useBuilderStore } from "@/hooks/use-builder-store";
import {
  ChatBlockNode,
  ConventionalFields,
  Node,
  Page,
} from "@/types/builder.types";
import {
  OptionalInput,
  NumberInput,
  ConvertToFieldOptions,
} from "./CommonOptions";
import { assertInputFieldNode } from "@/lib/helper";

type FieldSpecificOptionsProps = {
  pageId: Page["id"];
  nodeId: Node["id"];
};

export function FieldSpecificOptions({
  pageId,
  nodeId,
}: FieldSpecificOptionsProps) {
  const node = useBuilderStore((s) => s.pages[pageId]?.nodes[nodeId]);
  const updateField = useBuilderStore((s) => s.updateField);
  const convertToField = useBuilderStore((s) => s.convertToField);
  if (!node) return null;

  function handleFieldConversion(toType: ConventionalFields["type"]) {
    console.log("inside handleFieldConversion", toType);
    convertToField(pageId, nodeId, toType);
  }

  switch (node.type) {
    case "single-line-input":
      return (
        <>
          {/* Description */}
          <OptionalInput
            label="Description"
            value={!!node.description ? node.description : ""}
            onChange={(value) =>
              updateField(pageId, nodeId, { description: value })
            }
          />
          <OptionalInput
            label="Placeholder"
            value={!!node.placeholder ? node.placeholder : ""}
            onChange={(value) =>
              updateField(pageId, nodeId, { placeholder: value })
            }
          />
          <NumberInput
            label="Min Length"
            value={node.minLength}
            min={1}
            max={256}
            onChange={(value) =>
              updateField(pageId, nodeId, { minLength: value })
            }
          />
          <NumberInput
            label="Max Length"
            value={node.maxLength}
            min={1}
            max={256}
            onChange={(value) =>
              updateField(pageId, nodeId, { maxLength: value })
            }
          />
        </>
      );
    case "single-line-hidden-input":
      return (
        <>
          {/* Description */}
          <OptionalInput
            label="Description"
            value={!!node.description ? node.description : ""}
            onChange={(value) =>
              updateField(pageId, nodeId, { description: value })
            }
          />
          <OptionalInput
            label="Placeholder"
            value={!!node.placeholder ? node.placeholder : ""}
            onChange={(value) =>
              updateField(pageId, nodeId, { placeholder: value })
            }
          />
          <NumberInput
            label="Min Length"
            value={node.minLength}
            min={1}
            max={256}
            onChange={(value) =>
              updateField(pageId, nodeId, { minLength: value })
            }
          />
          <NumberInput
            label="Max Length"
            value={node.maxLength}
            min={1}
            max={256}
            onChange={(value) =>
              updateField(pageId, nodeId, { maxLength: value })
            }
          />
        </>
      );
    case "multi-line-input":
      return (
        <>
          {/* Description */}
          <OptionalInput
            label="Description"
            value={!!node.description ? node.description : ""}
            onChange={(value) =>
              updateField(pageId, nodeId, { description: value })
            }
          />
          <OptionalInput
            label="Placeholder"
            value={!!node.placeholder ? node.placeholder : ""}
            onChange={(value) =>
              updateField(pageId, nodeId, { placeholder: value })
            }
          />
          <NumberInput
            label="Min Length"
            value={node.minLength}
            min={1}
            max={256}
            onChange={(value) =>
              updateField(pageId, nodeId, { minLength: value })
            }
          />
          <NumberInput
            label="Max Length"
            value={node.maxLength}
            min={1}
            max={1024}
            onChange={(value) =>
              updateField(pageId, nodeId, { maxLength: value })
            }
          />
        </>
      );
    case "number-input":
      return (
        <>
          {/* Description */}
          <OptionalInput
            label="Description"
            value={!!node.description ? node.description : ""}
            onChange={(value) =>
              updateField(pageId, nodeId, { description: value })
            }
          />
          <OptionalInput
            label="Placeholder"
            value={!!node.placeholder ? node.placeholder : ""}
            onChange={(value) =>
              updateField(pageId, nodeId, { placeholder: value })
            }
          />
          <NumberInput
            label="Min"
            value={node.min}
            onChange={(value) => updateField(pageId, nodeId, { min: value })}
          />
          <NumberInput
            label="Max"
            value={node.max}
            onChange={(value) => updateField(pageId, nodeId, { max: value })}
          />
        </>
      );

    case "chat-block": {
      return (
        <div className="flex flex-col gap-1">
          <ChatBlockResponseFieldOptions node={node} pageId={pageId} />
          {/* extra options */}
          {/* <div className="mt-2">
            <label htmlFor="convertToField" className="text-sm">
              Convert To Field
            </label>
            <Select>
              <SelectTrigger className="w-full" id="convertToField">
                field type
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="single-line-input">
                  Single Line Input
                </SelectItem>
                <SelectItem value="multi-line-input">
                  Multi Line Input
                </SelectItem>
                <SelectItem value="number-input">Number Input</SelectItem>
              </SelectContent>
            </Select>
          </div> */}
          <ConvertToFieldOptions
            node={node.response}
            value={node.response.type}
            onSelect={handleFieldConversion}
          />
        </div>
      );
    }
    default:
      return null;
  }
}

type ChatBlockResponseFieldOptionsProps = {
  node: ChatBlockNode;
  pageId: string;
};

function ChatBlockResponseFieldOptions({
  node,
  pageId,
}: ChatBlockResponseFieldOptionsProps) {
  const updateField = useBuilderStore((s) => s.updateField);
  const response = node.response;
  const nodeId = node.id;
  assertInputFieldNode(response);
  switch (response.type) {
    case "single-line-input":
      return (
        <>
          <OptionalInput
            label="Placeholder"
            value={response.placeholder || ""}
            onChange={(value) => {
              console.log("placeholder value ", { value });
              updateField(pageId, nodeId, {
                response: { ...response, placeholder: value },
              });
            }}
          />
          <NumberInput
            label="Min Length"
            value={response.minLength || 1}
            min={1}
            max={256}
            onChange={(value) =>
              updateField(pageId, nodeId, {
                response: { ...response, minLength: value },
              })
            }
          />
          <NumberInput
            label="Max Length"
            value={response.maxLength || 256}
            min={1}
            max={256}
            onChange={(value) =>
              updateField(pageId, nodeId, {
                response: { ...response, maxLength: value },
              })
            }
          />
        </>
      );
    case "single-line-hidden-input":
      return (
        <>
          <OptionalInput
            label="Placeholder"
            value={!!response.placeholder ? response.placeholder : ""}
            onChange={(value) =>
              updateField(pageId, nodeId, {
                response: { ...response, placeholder: value },
              })
            }
          />
          <NumberInput
            label="Min Length"
            value={response.minLength}
            min={1}
            max={256}
            onChange={(value) =>
              updateField(pageId, nodeId, {
                response: { ...response, minLength: value },
              })
            }
          />
          <NumberInput
            label="Max Length"
            value={response.maxLength}
            min={1}
            max={256}
            onChange={(value) =>
              updateField(pageId, nodeId, {
                response: { ...response, maxLength: value },
              })
            }
          />
        </>
      );
    case "multi-line-input":
      return (
        <>
          <OptionalInput
            label="Placeholder"
            value={!!response.placeholder ? response.placeholder : ""}
            onChange={(value) =>
              updateField(pageId, nodeId, {
                response: { ...response, placeholder: value },
              })
            }
          />
          <NumberInput
            label="Min Length"
            value={response.minLength}
            min={1}
            max={256}
            onChange={(value) =>
              updateField(pageId, nodeId, {
                response: { ...response, minLength: value },
              })
            }
          />
          <NumberInput
            label="Max Length"
            value={response.maxLength}
            min={1}
            max={1024}
            onChange={(value) =>
              updateField(pageId, nodeId, {
                response: { ...response, maxLength: value },
              })
            }
          />
        </>
      );
    case "number-input":
      return (
        <>
          <OptionalInput
            label="Placeholder"
            value={!!response.placeholder ? response.placeholder : ""}
            onChange={(value) =>
              updateField(pageId, nodeId, {
                response: { ...response, placeholder: value },
              })
            }
          />
          <NumberInput
            label="Min"
            value={response.min}
            onChange={(value) =>
              updateField(pageId, nodeId, {
                response: { ...response, min: value },
              })
            }
          />
          <NumberInput
            label="Max"
            value={response.max}
            onChange={(value) =>
              updateField(pageId, nodeId, {
                response: { ...response, max: value },
              })
            }
          />
        </>
      );
    default:
      return null;
  }
}
