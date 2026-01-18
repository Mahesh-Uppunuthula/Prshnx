import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export function FormCardSkeleton() {
  return (
    <div
      className={cn(
        "w-80 h-70 rounded ring-1 ring-slate-200 p-2 flex flex-col gap-1",
      )}>
      {/* header */}
      <Skeleton className="w-full h-80 flex-1 bg-slate-100 rounded-sm" />

      {/* title/desc */}
      <div className="flex flex-col gap-1 py-1">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
      </div>

      <div className="border-t my-1" />

      {/* footer */}
      <div className="w-full py-1 flex justify-between place-items-center gap-1">
        <Skeleton className="h-4 w-12 rounded" />
        <Skeleton className="h-4 w-24 rounded" />
      </div>
    </div>
  );
}
