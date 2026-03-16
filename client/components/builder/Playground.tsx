import Page, { PageContent, PageFooter, PageHeader } from "./Page";
import { useBuilderStore } from "@/hooks/use-builder-store";

export default function Playground() {
  const pages = useBuilderStore((s) => s.pages);
  return (
    <section className="w-full h-full py-2 px-4 flex flex-col gap-4 overflow-auto bg-[#cccccc15]">
      {Object.values(pages).map((page, idx) => (
        <Page key={page.id}>
          <PageHeader page={page} idx={idx} />
          <PageContent page={page} />
          <PageFooter />
        </Page>
      ))}
    </section>
  );
}
