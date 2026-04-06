import { useBuilderStore } from "@/hooks/use-builder-store";
import { Page } from "@/types/builder.types";
import { useState } from "react";
import CreatePageModal from "./CreatePageModal";
import { scrollToPage } from "@/lib/helper";
type NavigationBarProps = {
  //   addPage: () => void;
};

export default function NavigationBar({}: NavigationBarProps) {
  const addPage = useBuilderStore((s) => s.addPage);
  const [openCreatePageModal, setOpenCreatePageModal] = useState(false);
  function handleSubmit(pageLabel: Page["label"]) {
    console.log(pageLabel);
    const pageId = addPage(pageLabel);
    setOpenCreatePageModal(false);
    scrollToPage(pageId);
  }
  return (
    <header className="w-full h-[8%] flex justify-between place-items-center">
      <div>Form 1</div>
      <div>
        <CreatePageModal
          open={openCreatePageModal}
          onOpenChange={setOpenCreatePageModal}
          onSubmit={handleSubmit}
        />
      </div>
    </header>
  );
}
