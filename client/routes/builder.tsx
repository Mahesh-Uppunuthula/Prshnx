import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { BuilderProvider } from "@/context/BuilderProvider";
import { useBuilderStore } from "@/hooks/use-builder-store";
import { cn } from "@/lib/utils";
import { Page } from "@/types/builder.types";
import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { LuPlus, LuTrash } from "react-icons/lu";
import { ActivePage } from "@/store/builder.store";

export const Route = createFileRoute("/builder")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <BuilderProvider initialBuilderState={undefined}>
      <Builder />
    </BuilderProvider>
  );
}

function Builder() {
  //   const [openCreatePageModal, setOpenCreatePageModal] = useState(false);
  //   function handleSubmit(pageLabel: Page["label"]) {
  //     console.log(pageLabel);
  //   }
  return (
    <div className="w-screen h-screen p-1">
      {/* header */}
      <BuilderHeader
      //   addPage={() => setOpenCreatePageModal(true)}
      />
      {/* body */}
      <BuilderBody />

      {/* quick action menu */}
      <div className="fixed bottom-1 left-[50%] translate-x-[-50%] translate-y-[-50%]">
        <QuickActionMenu />
      </div>
      {/* <div className="fixed top-1 right-1">
        <CreatePageModal
          open={openCreatePageModal}
          onOpenChange={setOpenCreatePageModal}
          onSubmit={handleSubmit}
        />
      </div> */}
    </div>
  );
}

type BuilderHeaderProps = {
  //   addPage: () => void;
};
function BuilderHeader({}: BuilderHeaderProps) {
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

function BuilderBody() {
  return (
    <div className="w-full h-[92%] flex">
      <div className="w-[18%]">
        <ElementsPanel />
      </div>
      <div className="w-[82%] relative  flex justify-between">
        <div className="w-[95%]">
          <Playground />
        </div>

        {/* Pages Min Map */}
        <div className="w-[5%] flex justify-center place-items-start">
          <div className="translate-y-20">
            <PagesMinMap />
          </div>
        </div>
      </div>
    </div>
  );
}

function ElementsPanel() {
  return (
    <section className="w-full h-full bg-green-200">elements panel</section>
  );
}
function Playground() {
  const pages = useBuilderStore((s) => s.pages);
  const activePage = useBuilderStore((s) => s.activePage);
  const setActivePage = useBuilderStore((s) => s.setActivePage);
  return (
    <section className="w-full h-full py-2 px-4 flex flex-col gap-4 overflow-auto">
      {Object.values(pages).map((page) => (
        // page
        <div id={page.id} className="group">
          <span
            className={cn(
              "text-xs text-slate-400 cursor-pointer px-2 py-1 hover:bg-muted rounded",
              {
                "text-slate-600": page.id === activePage?.id,
              },
            )}
            onClick={() => setActivePage({ id: page.id, label: page.label })}>
            {page.label}
          </span>
          <div
            className={cn("border-2 outline-slate-400 p-2 rounded my-1", {
              "border-slate-600": page.id === activePage?.id,
            })}>
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

function QuickActionMenu() {
  const activePage = useBuilderStore((s) => s.activePage);
  const deletePage = useBuilderStore((s) => s.deletePage);
  console.log({ activePage });

  const areActionsDisabled = !activePage || !activePage.id;

  const handleAction = (action: "delete") => () => {
    if (!activePage || !activePage.id) return;
    if (action === "delete") deletePage(activePage.id);
  };

  return (
    <div className="w-fit h-fit p-2 rounded">
      <ButtonGroup className="shadow-xl">
        {/* <Button
          variant={"outline"}
          onClick={() => addContainer(activeNode.id, "column")}
        >
          <LuSquareDashed /> Add Container
        </Button> */}
        {/* <Button
            variant={"outline"}
            onClick={() => changeContainerDirection(activeNode.id, "row")}>
            <LuFoldHorizontal /> Align Horizontal
          </Button>
          <Button
            variant={"outline"}
            onClick={() => changeContainerDirection(activeNode.id, "column")}>
            <LuFoldVertical /> Align Vertical
          </Button>
          <Button variant={"outline"} onClick={() => deleteNode(activeNode.id)}>
            <LuPaintbrush /> Clear All Fields
          </Button>
          */}
        <Button
          variant={"outline"}
          onClick={handleAction("delete")}
          disabled={areActionsDisabled}>
          <LuTrash /> Delete
        </Button>
      </ButtonGroup>
    </div>
  );
}

type CreatePageModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (pageLabel: Page["label"]) => void;
};
function CreatePageModal({
  open,
  onOpenChange,
  onSubmit,
}: CreatePageModalProps) {
  const pageLabelRef = useRef<HTMLInputElement>(null);
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button size={"sm"} variant={"outline"}>
          <LuPlus /> Page
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Page</DialogTitle>
          <DialogDescription>Enter the name of the new page.</DialogDescription>
        </DialogHeader>
        <div>
          <Input ref={pageLabelRef} placeholder="Example: Contact Page" />
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button
            onClick={() => onSubmit(pageLabelRef.current?.value ?? "New Page")}>
            Create Page
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function PagesMinMap() {
  const dummyPages = [
    {
      id: 1,
      label: "Introduction",
    },
    {
      id: 2,
      label: "Contact",
    },
    {
      id: 3,
      label: "About",
    },
    {
      id: 4,
      label: "Pricing",
    },
    {
      id: 5,
      label: "Contact",
    },
    {
      id: 6,
      label: "testing some lengthy lable asdfasf ",
    },
    {
      id: 6,
      label: "testing some lengthy lable asdfasf ",
    },
    {
      id: 6,
      label: "testing some lengthy lable asdfasf ",
    },
    {
      id: 6,
      label: "testing some lengthy lable asdfasf ",
    },
    {
      id: 6,
      label: "testing some lengthy lable asdfasf ",
    },
    {
      id: 6,
      label: "testing some lengthy lable asdfasf ",
    },
  ];
  const [isOver, setIsOver] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const pages = useBuilderStore((s) => s.pages);
  const activePage = useBuilderStore((s) => s.activePage);
  const setActivePage = useBuilderStore((s) => s.setActivePage);

  function navigateToPage(nextActivePage: NonNullable<ActivePage>) {
    if (activePage?.id === nextActivePage.id) return;
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
                  "border-slate-600": page.id === activePage?.id,
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
              onClick={() =>
                navigateToPage({ id: page.id, label: page.label })
              }>
              <div
                title={page.label}
                className={cn(
                  "w-full max-w-full whitespace-nowrap text-xs cursor-pointer text-slate-400 hover:bg-muted px-1 py-[0.15rem] rounded text-ellipsis overflow-hidden",
                  {
                    "text-indigo-600 font-medium": page.id === activePage?.id,
                    "hover:text-slate-800": "page.id" !== activePage?.id,
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
