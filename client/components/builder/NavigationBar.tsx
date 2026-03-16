import { useBuilderStore } from "@/hooks/use-builder-store";
import { Page } from "@/types/builder.types";
import { useState } from "react";
import CreatePageModal from "./CreatePageModal";
type NavigationBarProps = {
  //   addPage: () => void;
};

export default function NavigationBar({}: NavigationBarProps) {
  const addPage = useBuilderStore((s) => s.addPage);
  const [openCreatePageModal, setOpenCreatePageModal] = useState(false);
  function handleSubmit(pageLabel: Page["label"]) {
    console.log(pageLabel);
    addPage(pageLabel);
    setOpenCreatePageModal(false);
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
