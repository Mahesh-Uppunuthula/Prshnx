import { useMultiPageFormBuilder } from "@/store/form-builder.store";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";
import type {
  SelectionElement,
  SelectionProperties,
} from "@/types/form-builder.types";
import { Checkbox } from "./ui/checkbox";
import { getAlphabetPrefix } from "@/lib/helper";
import { useCallback, useState } from "react";
import { ChevronRight, Copy, Plus, Trash } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import InlineEdit from "./custom/InlineEdit";

type CreateChoiceLabelsProps = {
  item: SelectionElement;
};

export default function CreateChoiceLabels({ item }: CreateChoiceLabelsProps) {
  const [showOptions, setShowOptions] = useState(false);
  const { choiceLabels, optionPrefix } = item.properties;
  // const updatedFormElements = useFormBuilder((s) => s.updateElementProperties);
  const updatePageElementProperties = useMultiPageFormBuilder(
    (s) => s.updatePageElementProperties
  );

  const addEmptyOption = useCallback(() => {
    console.log("addEmptyOption");

    const existingChoiceLabels = choiceLabels;
    existingChoiceLabels.push("");
    updatePageElementProperties(item.id, {
      choiceLabels: existingChoiceLabels,
    });
  }, [choiceLabels, item.id, updatePageElementProperties]);

  const handleInputChange = useCallback(
    (index: number, newValue: string) => {
      const updatedChoiceLabels = [...choiceLabels];
      updatedChoiceLabels[index] = newValue;
      updatePageElementProperties(item.id, {
        choiceLabels: updatedChoiceLabels,
      });
    },
    [choiceLabels, item.id, updatePageElementProperties]
  );

  return (
    <div>
      {/* collapsible */}
      <Collapsible open={showOptions} onOpenChange={setShowOptions}>
        <CollapsibleTrigger className="cursor-pointer flex gap-2 place-items-center text-sm">
          <ChevronRight
            className={cn("transition-all", { "rotate-90": showOptions })}
            size={19}
          />
          {showOptions ? "Hide" : "Show"} options ({choiceLabels.length})
          {/* add button if collpased */}
        </CollapsibleTrigger>
        <CollapsibleContent>
          <ul>
            {choiceLabels.map((label, idx) => {
              return (
                <li
                  key={idx}
                  className="flex gap-2 justify-between place-items-center my-2 text-xs group hover:bg-secondary"
                >
                  <div className="w-full flex gap-2 place-items-center">
                    <Prefix optionIndex={idx} optionPrefix={optionPrefix} />
                    <InlineEdit
                      className="w-full"
                      placeholder={"Type option label here..."}
                      value={label}
                      onChange={(e) => handleInputChange(idx, e.target.value)}
                      // onChange={(e) => {
                      //   const value = e.target.value;
                      //   const existingChoiceLabels = choiceLabels;
                      //   existingChoiceLabels[idx] = value;
                      //   updatePageElementProperties(item.id, {
                      //     choiceLabels: existingChoiceLabels,
                      //   });
                      // }}
                    />
                  </div>
                  <div className="w-fit flex gap-2 place-items-center">
                    <Button
                      size={"icon"}
                      variant={"ghost"}
                      className="size-6 rounded invisible group-hover:visible"
                      onClick={() => {
                        const existingChoiceLabels = choiceLabels;
                        existingChoiceLabels.splice(idx, 0, choiceLabels[idx]);
                        updatePageElementProperties(item.id, {
                          choiceLabels: existingChoiceLabels,
                        });
                      }}
                    >
                      <Copy />
                    </Button>
                    <Button
                      size={"icon"}
                      variant={"ghost"}
                      className="size-6 rounded text-destructive hover:text-destructive/80 hover:bg-destructive/10 invisible group-hover:visible"
                      onClick={() => {
                        const existingChoiceLabels = choiceLabels;
                        existingChoiceLabels.splice(idx, 1);
                        updatePageElementProperties(item.id, {
                          choiceLabels: existingChoiceLabels,
                        });
                      }}
                    >
                      <Trash />
                    </Button>
                  </div>
                </li>
              );
            })}
          </ul>
          <Button
            size={"sm"}
            className="text-xs my-1"
            variant={"outline"}
            onClick={addEmptyOption}
          >
            <Plus />
            Add option
          </Button>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}

type PrefixProps = {
  optionIndex: number; // index starts from 1
  // selectionType: SelectionProperties["selectionType"];
  optionPrefix: SelectionProperties["optionPrefix"];
};

function Prefix({ optionPrefix, optionIndex }: PrefixProps) {
  switch (optionPrefix) {
    case "none":
      return null;
    case "default":
      return <Checkbox checked />;
    case "number":
      return <FakeToggle content={optionIndex + 1} />;
    case "alphabet":
      return <FakeToggle content={getAlphabetPrefix(optionIndex)} />;
    default:
      return null;
  }
}

type FakeToggleProps = {
  content: string | number;
};
export function FakeToggle({ content }: FakeToggleProps) {
  return (
    <Button
      variant={"outline"}
      size={"sm"}
      className="w-6 h-6 text-xs p-2 rounded flex justify-center place-items-center"
    >
      {content}
    </Button>
  );
}
