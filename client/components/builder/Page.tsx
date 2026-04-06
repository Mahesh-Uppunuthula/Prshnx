import { LuPlus } from "react-icons/lu";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { useBuilderStore } from "@/hooks/use-builder-store";
import { Page as PageType } from "@/types/builder.types";
import RenderNode from "./RenderNode";
import { useState } from "react";
import CreatePageModal from "./CreatePageModal";
import { scrollToPage } from "@/lib/helper";

export default function Page({ children }: { children: React.ReactNode }) {
  return <div className="group min-h-full">{children}</div>;
}

export function PageContent({ page }: { page: PageType }) {
  // const active = useBuilderStore((s) => s.active);
  console.log({ page }, page.rootId);
  return (
    <div
      className={cn(
        "w-full h-[90%] bg-white my-1",
        // "w-full h-[90%] bg-white border-2 outline-slate-400 p-1 rounded my-1",
        // {
        // "border-slate-600": page.id === activePage?.id,
        // "border-emerald-400": isOver,
        // },
      )}>
      <RenderNode pageId={page.id} nodeId={page.rootId} />
    </div>
  );
}

type PageHeaderProps = {
  page: PageType;
  idx: number;
};
export function PageHeader({ page, idx }: PageHeaderProps) {
  const active = useBuilderStore((s) => s.active);
  const setActivePage = useBuilderStore((s) => s.setActivePage);
  return (
    <div
      id={page.id}
      className={cn(
        "w-fit text-xs font-light text-slate-400 cursor-pointer px-2 py-1 hover:bg-muted rounded flex gap-2 place-items-center",
      )}
      onClick={() => setActivePage({ id: page.id })}>
      <span>Page-{idx + 1}</span>
      <span
        className={cn("font-medium", {
          "text-indigo-600": page.id === active.page?.id,
        })}>
        {page.label}
      </span>
    </div>
  );
}

type PageFooterProps = {
  idx: number;
};
export function PageFooter({ idx }: PageFooterProps) {
  const addPage = useBuilderStore((s) => s.addPage);
  const [open, setOpen] = useState(false);

  const handleSubmit = (label: string) => {
    console.log({ label, idx });
    const pageId = addPage(label, idx + 1);
    setOpen(false);
    scrollToPage(pageId);
  };

  return (
    <div className="invisible group-hover:visible">
      <CreatePageModal
        open={open}
        onOpenChange={setOpen}
        onSubmit={handleSubmit}
        title="Insert Page"
        buttonText="Insert"
        trigger={
          <Button
            variant={"ghost"}
            size={"xs"}
            className="w-fit cursor-pointer text-xs text-slate-400 flex gap-2 items-center px-2 py-1 mt-1 rounded hover:bg-muted">
            <LuPlus /> Insert Page
          </Button>
        }
      />
    </div>
  );
}
