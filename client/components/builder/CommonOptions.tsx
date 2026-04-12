import { useState } from "react";
import { Input } from "../ui/input";
import { ToggleSwitch } from "../ui/toggle-switch";

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
export function NumberInput({ label, value, min, max, onChange }: NumberInputProps) {
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
