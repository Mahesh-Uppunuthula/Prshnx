import { Button } from "@/components/ui/button";
import { Calendar, type CalendarProps } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { type JSX, type ReactNode, useMemo } from "react";
import { DateLib, isDateRange, isDatesArray } from "react-day-picker";
import { cn } from "@/lib/utils"; // Assuming you use this helper

const defaultPlaceholder = (
  <div className="flex items-center gap-2 text-muted-foreground">
    <CalendarIcon className="h-4 w-4" />
    <span>Pick a date</span>
  </div>
);

export type DatePickerProps = CalendarProps & {
  header?: ReactNode;
  placeholder?: JSX.Element | string;
  disableField?: boolean;
  className?: string;
};

export function DatePicker({
  placeholder,
  disableField = false,
  header,
  className,
  ...props
}: DatePickerProps) {
  const { mode, selected } = props as { mode?: string; selected?: unknown };

  const _placeholder = placeholder ? placeholder : defaultPlaceholder;
  const dateDisplay = useMemo(() => {
    if (!mode || !selected) return null;

    if (selected instanceof Date) {
      return format(selected, "LLL dd, yyyy");
    }

    if (isDatesArray(selected, new DateLib())) {
      const [start, end] = [selected[0], selected[selected.length - 1]];
      return `${format(start, "LLL dd, yyyy")} - ${format(end, "LLL dd, yyyy")}`;
    }

    if (isDateRange(selected)) {
      const { from, to } = selected;
      if (!from || !to) return null;
      return `${format(from, "LLL dd, yyyy")} - ${format(to, "LLL dd, yyyy")}`;
    }

    return null;
  }, [mode, selected]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          disabled={disableField}
          data-empty={!dateDisplay}
          className={cn(
            "w-full min-w-fit justify-start text-left font-normal",
            "data-[empty=true]:text-muted-foreground",
            className
          )}
        >
          {dateDisplay ?? _placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-auto p-2"
        sideOffset={6}
        align="start"
        alignOffset={4}
      >
        {header && <section className="mb-2">{header}</section>}
        <Calendar {...props} />
      </PopoverContent>
    </Popover>
  );
}
