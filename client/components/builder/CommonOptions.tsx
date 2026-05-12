import { useEffect, useMemo, useState } from "react";
import { Input } from "../ui/input";
import { ToggleSwitch } from "../ui/toggle-switch";
import { ConventionalFields } from "@/types/builder.types";
import { Select, SelectContent, SelectItem, SelectTrigger } from "../ui/select";

type OptionalInputProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
};
export function OptionalInput({ label, value, onChange }: OptionalInputProps) {
  const [toggle, setToggle] = useState(!!value);
  return (
    <div>
      <div className="flex justify-between place-items-center gap-2 mb-2">
        <span className="text-sm">{label}</span>
        <ToggleSwitch
          size="sm"
          checked={toggle}
          onCheckedChange={(checked) => {
            setToggle(checked);
            if (!checked) {
              onChange("");
            }
          }}
        />
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
export function NumberInput({
  label,
  value,
  min,
  max,
  onChange,
}: NumberInputProps) {
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
export function ToggleSwitchOption({
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

const CONVERTIBLE_FIELD_OPTIONS: Array<{
  id: ConventionalFields["type"];
  label: string;
}> = [
  { id: "single-line-input", label: "Single Line Input" },
  { id: "multi-line-input", label: "Multi Line Input" },
  { id: "number-input", label: "Number Input" },
  { id: "single-line-hidden-input", label: "Single Line Hidden Input" },
];

type ConvertToFieldOptionsProps = {
  node: ConventionalFields;
  value: ConventionalFields["type"];
  onSelect: (toType: ConventionalFields["type"]) => void;
};
export function ConvertToFieldOptions({
  node,
  value,
  onSelect,
}: ConvertToFieldOptionsProps) {
  console.log("node ", node, { value });
  const selectedOption = CONVERTIBLE_FIELD_OPTIONS.find(
    (option) => option.id === value,
  );
  // [node, value],
  // );
  // const filteredOptions = CONVERTIBLE_FIELD_OPTIONS.filter(
  //   (type) => type.id !== node.type,
  // );
  // }, [node]);

  return (
    <div className="mt-2">
      <label htmlFor="convertToField" className="text-sm">
        Convert To Field
      </label>
      <Select value={value} onValueChange={onSelect}>
        <SelectTrigger className="w-full" id="convertToField">
          <span className="capitalize">{selectedOption?.label}</span>
        </SelectTrigger>
        <SelectContent>
          {CONVERTIBLE_FIELD_OPTIONS.map((option) => (
            <SelectItem key={option.id} value={option.id}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
