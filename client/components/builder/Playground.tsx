import { LuPlus } from "react-icons/lu";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { useBuilderStore } from "@/hooks/use-builder-store";

export default function Playground() {
  const pages = useBuilderStore((s) => s.pages);
  const activePage = useBuilderStore((s) => s.activePage);
  const setActivePage = useBuilderStore((s) => s.setActivePage);
  return (
    <section className="w-full h-full py-2 px-4 flex flex-col gap-4 overflow-auto bg-[#cccccc15]">
      {Object.values(pages).map((page, idx) => (
        // page
        <div id={page.id} className="group">
          <span
            className={cn(
              "w-fit text-xs font-light text-slate-400 cursor-pointer px-2 py-1 hover:bg-muted rounded flex gap-2 place-items-center",
            )}
            onClick={() => setActivePage({ id: page.id, label: page.label })}>
            <span>Page-{idx + 1}</span>
            <span
              className={cn("font-medium", {
                "text-slate-600": page.id === activePage?.id,
              })}>
              {page.label}
            </span>
          </span>
          <div
            className={cn(
              "min-h-50 bg-white border-2 outline-slate-400 p-2 rounded my-1",
              {
                "border-slate-600": page.id === activePage?.id,
              },
            )}>
            {page.label}
          </div>
          <div className="invisible group-hover:visible">
            <Button
              variant={"ghost"}
              size={"xs"}
              className="w-fit cursor-pointer text-xs text-slate-400 flex gap-2 items-center px-2 py-1 mt-1 rounded hover:bg-muted">
              <LuPlus /> Insert Page
            </Button>
          </div>
        </div>
      ))}
    </section>
  );
}
