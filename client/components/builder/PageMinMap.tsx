import { useBuilderStore } from "@/hooks/use-builder-store";
import { ActivePage } from "@/store/builder.store";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { useRef, useState } from "react";

export default function PagesMinMap() {
  //   const dummyPages = [
  //     {
  //       id: 1,
  //       label: "Introduction",
  //     },
  //     {
  //       id: 2,
  //       label: "Contact",
  //     },
  //     {
  //       id: 3,
  //       label: "About",
  //     },
  //     {
  //       id: 4,
  //       label: "Pricing",
  //     },
  //     {
  //       id: 5,
  //       label: "Contact",
  //     },
  //     {
  //       id: 6,
  //       label: "testing some lengthy lable asdfasf ",
  //     },
  //     {
  //       id: 6,
  //       label: "testing some lengthy lable asdfasf ",
  //     },
  //     {
  //       id: 6,
  //       label: "testing some lengthy lable asdfasf ",
  //     },
  //     {
  //       id: 6,
  //       label: "testing some lengthy lable asdfasf ",
  //     },
  //     {
  //       id: 6,
  //       label: "testing some lengthy lable asdfasf ",
  //     },
  //     {
  //       id: 6,
  //       label: "testing some lengthy lable asdfasf ",
  //     },
  //   ];
  const [isOver, setIsOver] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const pages = useBuilderStore((s) => s.pages);
  const active = useBuilderStore((s) => s.active);
  const setActivePage = useBuilderStore((s) => s.setActivePage);

  function navigateToPage(nextActivePage: NonNullable<ActivePage>) {
    if (active.page?.id === nextActivePage.id) return;
    setActivePage(nextActivePage);
    const element = document.getElementById(nextActivePage.id);
    element?.scrollIntoView({ behavior: "smooth", block: "start" });
  }
  return (
    <Popover open={isOver}>
      <PopoverTrigger
        onMouseOver={() => setIsOver(true)}
        className="outline-none hover:bg-slate-100">
        <div ref={containerRef}>
          <div className="w-5 h-fit flex flex-col gap-3">
            {Object.values(pages).map((page) => (
              <div
                key={`pages_min_map:${page.id}`}
                className={cn("w-full border border-slate-200 rounded", {
                  "border-slate-600": page.id === active.page?.id,
                })}
              />
            ))}
          </div>
        </div>
      </PopoverTrigger>
      <PopoverContent
        className={cn("w-52 max-h-80 p-4")}
        side="left"
        align="center"
        sideOffset={-20}
        onMouseLeave={() => setIsOver(false)}>
        <div className="h-fit flex flex-col gap-2  overflow-auto">
          {Object.values(pages).map((page) => (
            <div
              key={`pages_min_map:${page.id}`}
              onClick={() => navigateToPage({ id: page.id })}>
              <div
                title={page.label}
                className={cn(
                  "w-full max-w-full whitespace-nowrap text-xs cursor-pointer text-slate-400 hover:bg-muted px-1 py-[0.15rem] rounded text-ellipsis overflow-hidden",
                  {
                    "text-indigo-600 font-medium": page.id === active.page?.id,
                    "hover:text-slate-800": "page.id" !== active.page?.id,
                  },
                )}>
                {page.label}
              </div>
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
