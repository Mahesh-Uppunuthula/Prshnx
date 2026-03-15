import { clsx, type ClassValue } from "clsx";
import { toBlob } from "html-to-image";
import { DateTime } from "luxon";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function createFirstPageScreenShot(
  formRef: React.RefObject<HTMLDivElement | null>,
): Promise<{ success: false; error: string } | { success: true; data: Blob }> {
  if (!formRef || !formRef.current)
    return { success: false, error: "Invalid formRef" };
  const screenshot = await toBlob(formRef.current, {
    // const screenshot = await toPng(formRef.current, {
    backgroundColor: "white",
    quality: 0.1,
    pixelRatio: 0.3,
    width: 600,
    height: 500,
    preferredFontFormat: "sans-serif",
  });

  // const lnk = document.createElement("a");

  // lnk.href = screenshot!;
  // lnk.download = `my-file_preview.png`;
  // lnk.click();

  return { success: true, data: screenshot! };
}

// export function toHumanReadableFormat(isoDate: string) {
//   const now = DateTime.now().setZone("UTC");
//   const dateTime = DateTime.fromISO(isoDate);

//   const diff = now
//     .diff(dateTime, ["years", "months", "days", "hours", "minutes"])
//     .rescale();

//   // Handle "just now"
//   if (diff.as("minutes") < 1) return "just now";

//   // Limit to topmost non-zero unit (e.g., show only "2 hours" not "2 hours, 5 min")
//   const parts: Record<string, number> = {
//     years: diff.years,
//     months: diff.months,
//     days: diff.days,
//     hours: diff.hours,
//     minutes: diff.minutes,
//   };

//   const [unit, value] = Object.entries(parts).find(([, v]) => v >= 1) || [
//     "minutes",
//     0,
//   ];

//   const rounded = Math.floor(value);
//   const unitLabel = unit.replace(/s$/, ""); // singular form

//   return `${rounded} ${unitLabel}${rounded !== 1 ? "s" : ""}`;
// }
type ToHumanReadableFormatOptions = {
  addAgo?: boolean;
};
export function toHumanReadableFormat(
  utcDateString: string,
  options?: ToHumanReadableFormatOptions,
) {
  const addAgo = options?.addAgo ?? false;
  console.log("utcDateString", utcDateString);
  const now = DateTime.now().setZone("UTC");
  const dateTime = DateTime.fromSQL(utcDateString, { zone: "UTC" });

  const diff = now
    .diff(dateTime, ["years", "months", "days", "hours", "minutes"])
    .rescale();

  // Handle "just now"
  if (diff.as("minutes") < 1) return "just now";

  // Limit to topmost non-zero unit (e.g., show only "2 hours" not "2 hours, 5 min")
  const parts: Record<string, number> = {
    years: diff.years,
    months: diff.months,
    days: diff.days,
    hours: diff.hours,
    minutes: diff.minutes,
  };

  const [unit, value] = Object.entries(parts).find(([, v]) => v >= 1) || [
    "minutes",
    0,
  ];

  const rounded = Math.floor(value);
  const unitLabel = unit.replace(/s$/, ""); // singular form

  const label = `${rounded} ${unitLabel}${rounded !== 1 ? "s" : ""}`;
  if (addAgo) {
    return `${label} ago`;
  }
  return label;
}

export function copyToClipboard(text: string) {
  try {
    navigator.clipboard.writeText(text);
    console.log("Copied to clipboard", text);
  } catch (error) {
    console.error("Failed to copy to clipboard", error);
  }
}
