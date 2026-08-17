import { LuPlus, LuTrash } from "react-icons/lu";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { useBuilderStore } from "@/hooks/use-builder-store";
import { Page as PageType } from "@/types/builder.types";
import RenderNode from "./RenderNode";
import { useState } from "react";
import CreatePageModal from "./CreatePageModal";
import { scrollToPage } from "@/lib/helper";
import ConfirmDialog from "@/components/custom/ConfirmDialog";

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
  page: PageType;
  idx: number;
};
export function PageFooter({ page, idx }: PageFooterProps) {
  const addPage = useBuilderStore((s) => s.addPage);
  const deletePage = useBuilderStore((s) => s.deletePage);
  const pagesOrder = useBuilderStore((s) => s.pagesOrder);
  const [open, setOpen] = useState(false);

  const handleSubmit = (label: string) => {
    console.log({ label, idx });
    const pageId = addPage(label, idx + 1);
    setOpen(false);
    scrollToPage(pageId);
  };

  const isDeleteDisabled = pagesOrder.length <= 1;

  return (
    <div className="invisible group-hover:visible flex items-center gap-1">
      <CreatePageModal
        open={open}
        onOpenChange={setOpen}
        onSubmit={handleSubmit}
        title="Add Page"
        buttonText="Add"
        trigger={
          <Button
            variant={"ghost"}
            size={"xs"}
            className="w-fit cursor-pointer text-xs text-slate-600 flex gap-2 items-center px-2 py-1 mt-1 rounded hover:bg-muted">
            <LuPlus /> Add Page
          </Button>
        }
      />
      <ConfirmDialog
        title="Delete page?"
        description={`"${page.label}" and all its fields will be permanently removed. This cannot be undone.`}
        actionText="Delete"
        actionVariant="destructive"
        onAction={() => deletePage(page.id)}
        trigger={
          <Button
            variant="ghost"
            size="xs"
            disabled={isDeleteDisabled}
            className="w-fit cursor-pointer text-xs text-slate-600 flex gap-2 items-center px-2 py-1 mt-1 rounded hover:bg-red-50 hover:text-red-500">
            <LuTrash /> Delete Page
          </Button>
        }
      />
    </div>
  );
}
