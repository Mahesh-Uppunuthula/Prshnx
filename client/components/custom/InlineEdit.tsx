import { cn } from "@/lib/utils";
import React from "react";

type InlineEditType = Omit<React.ComponentProps<"input">, "type"> & {
  type?: "number" | "text" | "email" | "password" | "tel" | "url";
};

function InlineEdit({
  className,
  type = "text",
  disabled,
  ...props
}: InlineEditType) {
  return (
    <input
      type={type}
      aria-label="Inline editable input"
      aria-disabled={disabled}
      className={cn(
        // classes
        "bg-transparent p-1 text-base truncate min-h-[32px] leading-none rounded border border-transparent placeholder:text-muted-foreground  flex field-sizing-content transition-[color,box-shadow] outline-none ",
        // psuedo classes
        "hover:bg-secondary focus-visible:border-ring focus-visible:ring-ring/50 focus:border-foreground disabled:cursor-not-allowed disabled:opacity-50  aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30  focus-visible:ring-[3px] md:text-sm",
        className
      )}
      {...props}
    />
  );
}

export default InlineEdit;
