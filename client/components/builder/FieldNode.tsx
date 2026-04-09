import { useBuilderStore } from "@/hooks/use-builder-store";
import { assertInputFieldNode } from "@/lib/helper";
import { cn } from "@/lib/utils";
import { Node, Page } from "@/types/builder.types";
import { MouseEvent, useState } from "react";
import InlineEdit from "../custom/InlineEdit";
import { LuAsterisk, LuSettings, LuTrash2 } from "react-icons/lu";
import { Button } from "../ui/button";
import { ToggleSwitch } from "../ui/toggle-switch";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Input } from "../ui/input";

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
          {
            <div className="-mt-1 mb-1">
              <span className="text-[11px] text-muted-foreground mx-1">
                {node.description}
              </span>
            </div>
          }
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

function FieldOptions({ pageId, nodeId }: FieldOptionsProps) {
  const pages = useBuilderStore((s) => s.pages);
  const updateField = useBuilderStore((s) => s.updateField);
  const deleteNode = useBuilderStore((s) => s.deleteNode);
  const page = pages[pageId];

  if (!page) return null;
  const node = page.nodes[nodeId];
  if (!node) return null;
  assertInputFieldNode(node);

  const [optionsState, setOptionsState] = useState({
    // required: false,
    descriptionToggle: !!node.description?.length,
    placeholderToggle: !!node.placeholder?.length,
  });

  const handleToggle =
    (key: "required" | "descriptionToggle" | "placeholderToggle") =>
    (checked: boolean) => {
      setOptionsState((prev) => ({ ...prev, [key]: checked }));
      switch (key) {
        case "descriptionToggle":
          if (!checked) {
            updateField(pageId, nodeId, { description: "" });
          }
          break;
        case "placeholderToggle":
          if (!checked) {
            updateField(pageId, nodeId, { placeholder: "" });
          }
          break;
        case "required":
          updateField(pageId, nodeId, { required: checked });
      }
    };

  function renderFieldSpecificOptions() {
    switch (node?.type) {
      case "single-line-input":
        return (
          <>
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

      default:
        return null;
    }
  }
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
          {/* Description */}
          <OptionalInput
            label="Description"
            value={!!node.description ? node.description : ""}
            onChange={(value) =>
              updateField(pageId, nodeId, { description: value })
            }
          />
          {/* Field Specific Options */}
          <div className="flex flex-col gap-2">
            {renderFieldSpecificOptions()}
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

type OptionalInputProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
};
function OptionalInput({ label, value, onChange }: OptionalInputProps) {
  const [toggle, setToggle] = useState(!!value);
  return (
    <div>
      <div className="flex justify-between place-items-center gap-2 mb-2">
        <span className="text-sm">{label}</span>
        <ToggleSwitch size="sm" checked={toggle} onCheckedChange={setToggle} />
      </div>
      {toggle && (
        <Input
          placeholder={`Enter ${label}`}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
    </div>
  );
}

type NumberInputProps = {
  label: string;
  value: number;
  min?: number;
  max?: number;
  onChange: (value: number) => void;
};
function NumberInput({ label, value, min, max, onChange }: NumberInputProps) {
  return (
    <div>
      <div className="flex justify-between place-items-center gap-2 mb-1">
        <span className="text-sm">{label}</span>
      </div>
      <Input
        type="number"
        min={min}
        max={max}
        placeholder={`Enter ${label}`}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </div>
  );
}

type ToggleSwitchOptionProps = {
  label: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
};
function ToggleSwitchOption({
  label,
  checked,
  onCheckedChange,
}: ToggleSwitchOptionProps) {
  return (
    <div className="flex justify-between place-items-center gap-2 mb-2">
      <span className="text-sm">{label}</span>
      <ToggleSwitch
        size="sm"
        checked={checked}
        onCheckedChange={onCheckedChange}
      />
    </div>
  );
}
