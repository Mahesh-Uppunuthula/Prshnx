import * as Switch from "@radix-ui/react-switch";
import { cn } from "@/lib/utils"; // optional utility (or use template strings)

type ToggleSize = "sm" | "md" | "lg";

interface ToggleProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  size?: ToggleSize;
  disabled?: boolean;
}

const sizeStyles = {
  sm: {
    root: "w-9 h-5",
    thumb: "w-4 h-4 translate-x-0.5 data-[state=checked]:translate-x-4",
  },
  md: {
    root: "w-11 h-6",
    thumb: "w-5 h-5 translate-x-0.5 data-[state=checked]:translate-x-5",
  },
  lg: {
    root: "w-14 h-7",
    thumb: "w-6 h-6 translate-x-0.5 data-[state=checked]:translate-x-7",
  },
};

export function ToggleSwitch({
  checked,
  onCheckedChange,
  size = "md",
  disabled,
}: ToggleProps) {
  const styles = sizeStyles[size];

  return (
    <Switch.Root
      checked={checked}
      onCheckedChange={onCheckedChange}
      disabled={disabled}
      className={cn(
        "relative inline-flex shrink-0 cursor-pointer items-center rounded-full transition-colors",
        "bg-gray-300 data-[state=checked]:bg-indigo-400",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2",
        "disabled:cursor-not-allowed disabled:opacity-50",
        styles.root,
      )}>
      <Switch.Thumb
        className={cn(
          "pointer-events-none block rounded-full bg-white shadow-lg transition-transform",
          styles.thumb,
        )}
      />
    </Switch.Root>
  );
}
