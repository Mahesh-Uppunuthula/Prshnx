import { LuPlus } from "react-icons/lu";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { useBuilderStore } from "@/hooks/use-builder-store";
import { Page as PageType } from "@/types/builder.types";
export default function Page({ children }: { children: React.ReactNode }) {
  return <div className="group">{children}</div>;
}

export function PageContent({ page }: { page: PageType }) {
  const activePage = useBuilderStore((s) => s.activePage);
  return (
    <div
      className={cn(
        "min-h-50 bg-white border-2 outline-slate-400 p-2 rounded my-1",
        {
          "border-slate-600": page.id === activePage?.id,
        },
      )}>
      {page.label}
    </div>
  );
}

type PageHeaderProps = {
  page: PageType;
  idx: number;
};
export function PageHeader({ page, idx }: PageHeaderProps) {
  const activePage = useBuilderStore((s) => s.activePage);
  const setActivePage = useBuilderStore((s) => s.setActivePage);
  return (
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
  );
}

export function PageFooter() {
  return (
    <div className="invisible group-hover:visible">
      <Button
        variant={"ghost"}
        size={"xs"}
        className="w-fit cursor-pointer text-xs text-slate-400 flex gap-2 items-center px-2 py-1 mt-1 rounded hover:bg-muted">
        <LuPlus /> Insert Page
      </Button>
    </div>
  );
}
