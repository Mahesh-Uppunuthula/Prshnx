import { useMemo } from "react";
import Page, { PageContent, PageFooter, PageHeader } from "./Page";
import { useBuilderStore } from "@/hooks/use-builder-store";
import { Page as PageType } from "@/types/builder.types";

export default function Playground() {
  const pages = useBuilderStore((s) => s.pages);
  const pagesOrder = useBuilderStore((s) => s.pagesOrder);
  const sortedPages: PageType[] = useMemo(() => {
    const _sortedPages: PageType[] = [];
    pagesOrder.forEach((pageId: PageType["id"]) => {
      if (pages[pageId]) {
        _sortedPages.push(pages[pageId]);
      }
    });
    return _sortedPages;
  }, [pagesOrder, pages]);
  return (
    <section className="w-full h-full py-2 px-4 flex flex-col gap-4 overflow-auto bg-[#cccccc15]">
      {sortedPages.map((page, idx) => (
        <Page key={page.id}>
          <PageHeader page={page} idx={idx} />
          <PageContent page={page} />
          <PageFooter page={page} idx={idx} />
        </Page>
      ))}
    </section>
  );
}
