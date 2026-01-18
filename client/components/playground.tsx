import { Textarea } from "@/components/ui/textarea";
import InlineEdit from "./custom/InlineEdit";
import { Button } from "./ui/button";
import Show from "./utils/Show";
import type { Column, Form, FormElement } from "@/types/form-builder.types";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import SortableItem from "./sortable-item";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";
import {
  ArrowRight,
  ChevronRight,
  Hexagon,
  ListChecks,
  LucideClock,
  LucideText,
  LucideType,
  Palette,
  PanelTop,
  X,
} from "lucide-react";
import { useCallback, useState, type ChangeEvent } from "react";
import { useDndContext, useDroppable } from "@dnd-kit/core";
import {
  useActivePage,
  // useMultiPageFormBuilder,
} from "@/store/form-builder.store";
import { useMultiPageFormStore } from "@/context/MultiPageFormProvider";
import Switch from "./utils/Switch";
import { Bs123, BsCalendar2Date } from "react-icons/bs";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { getPageActionButtonId } from "@/lib/helper";
type PlaygroundProps = {
  column: Column;
  items: FormElement[];
  formRef: React.Ref<HTMLDivElement>;
};

export default function Playground({
  column,
  items,
  formRef,
}: PlaygroundProps) {
  const { active } = useDndContext();

  const isDraggingFromStatic =
    active && active?.data?.current?.from === "static";

  const {
    header: activePageHeader,
    id: activePageId,
    action: activePageAction,
  } = useActivePage();

  const pageSettings = useMultiPageFormStore((s) => s.pageSettings);
  const setPageHeader = useMultiPageFormStore((s) => s.setPageHeader);
  const updatePageAction = useMultiPageFormStore((s) => s.updatePageAction);
  const updatePageSettings = useMultiPageFormStore(
    (s) => s.updatePageSettings
  );

  const activeFormElement = useMultiPageFormStore((s) => s.activeFormElement);
  const setActiveFormElement = useMultiPageFormStore(
    (s) => s.setActiveFormElement
  );

  const { setNodeRef } = useDroppable({
    id: column.type,
  });
  const [descriptionOpen, setDescriptionOpen] = useState(false);

  const handleHeaderUpdate = useCallback(
    (fieldName: keyof Form["header"]) =>
      (
        event: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>
      ) => {
        setPageHeader(fieldName, event.target.value);
      },
    [setPageHeader]
  );

  return (
    <div ref={formRef} className="w-full h-full flex flex-col gap-3 p-2">
      {/* header */}
      <div className="w-full h-fit flex flex-col gap-2">
        {/* page cover */}
        <Show
          when={!isDraggingFromStatic && pageSettings.cover}
          fallback={<></>}
        >
          <div className="w-full h-fit relative group">
            <img
              className="w-full aspect-video max-h-40 bg-center object-cover"
              // src={"public/images/sample-banner-2.webp"}
              src={"public/images/smiely_face.png"}
            />
            <Button
              variant={"secondary"}
              className="absolute top-2 right-2 opacity-70 group-hover:opacity-100"
              onClick={() => updatePageSettings({ cover: undefined })}
            >
              <X />
            </Button>
          </div>
        </Show>
        {/* page logo */}
        <Show
          when={!isDraggingFromStatic && pageSettings.logo}
          fallback={<></>}
        >
          <div
            className={cn("w-full h-fit min-h-10 relative", {
              "min-h-20": !pageSettings.cover,
            })}
          >
            {pageSettings.logo && (
              <div
                className={cn(
                  "w-20 h-20 group absolute top-[-100%] ml-[15%] flex justify-center place-items-center p-2 bg-black text-white rounded-full",
                  {
                    "top-0 ml-0": !pageSettings.cover,
                  }
                )}
              >
                <Hexagon size={32} />
                <Button
                  size={"icon"}
                  variant={"secondary"}
                  className={cn(
                    "w-5 h-5 absolute top-0 right-0 cursor-pointer text-primary/70 opacity-70 group-hover:opacity-100"
                  )}
                  onClick={() => updatePageSettings({ logo: undefined })}
                >
                  <X />
                </Button>
              </div>
            )}
          </div>
        </Show>
        {/* Add logo and page cover buttons */}
        <Show when={!isDraggingFromStatic} fallback={<></>}>
          <div className="w-full flex justify-start place-items-center gap-2">
            {!pageSettings.logo && (
              <Button
                variant={"ghost"}
                size={"sm"}
                className="text-primary/60"
                onClick={() => updatePageSettings({ logo: "asdf" })}
              >
                <Hexagon /> Add logo
              </Button>
            )}
            {!pageSettings.cover && (
              <Button
                variant={"ghost"}
                size={"sm"}
                className="text-primary/60"
                onClick={() => updatePageSettings({ cover: "asdf" })}
              >
                <PanelTop /> Add cover
              </Button>
            )}
            <Button
              variant={"ghost"}
              size={"sm"}
              className="w-fit text-primary/60"
              onClick={() => {
                /**
                 * TODO
                 * bring up the page configuration modal or toolkit to set page bg, color, etc
                 */
              }}
            >
              <Palette /> Customize
            </Button>
          </div>
        </Show>

        <InlineEdit
          placeholder="Page title (required)"
          className="w-full h-fit text-2xl!"
          value={activePageHeader.title}
          onChange={handleHeaderUpdate("title")}
        />
        <Collapsible>
          <CollapsibleTrigger
            className="w-full flex gap-2 place-items-center text-sm text-muted-foreground cursor-pointer "
            onClick={() => setDescriptionOpen((prev) => !prev)}
          >
            <ChevronRight
              size={16}
              className={cn("", { "rotate-90": descriptionOpen })}
            />
            <span>Page description (optional)</span>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <Textarea
              autoFocus={descriptionOpen}
              placeholder="Add your page description here..."
              spellCheck={false}
              className="w-full text-sm text-wrap resize-none border-transparent hover:bg-secondary my-2"
              value={activePageHeader.description}
              onChange={handleHeaderUpdate("description")}
            />
          </CollapsibleContent>
        </Collapsible>
      </div>
      {/* content - droppable */}
      <div ref={setNodeRef} className="w-full h-fit">
        <Show
          key={"form-body-show"}
          when={true}
          fallback={<div>empty page</div>}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.05 }}
            className={cn(
              `w-full h-full min-h-40 p-1 flex flex-col gap-2 place-items-center`
            )}
          >
            <ItemsList
              // items={[
              //   {
              //     id: "1",
              //     type: "single-line-input",
              //     properties: {
              //       label: "Single line input",
              //       description: "Single line input",
              //       placeholder: "Single line input",
              //       disabled: false,
              //       required: false,
              //       order: 1,
              //       minLength: 0,
              //       maxLength: 100,
              //     },
              //   },
              // ]}
              items={items}
              column={column}
            />
          </motion.div>
        </Show>
      </div>
      {/* footer */}
      {items.length > 0 && (
        <div className="w-full h-fit p-2">
          <Button
            key={getPageActionButtonId(activePageId)}
            // style={{ background: "url(public/images/smiely_face.png)" }}
            // style={{ background: "url(public/images/sample-banner-image.jpg)" }}
            // style={{ background:  "url(public/images/sample-banner-2.webp)" }}
            // style={{background: generateBackground}}
            // className={cn("w-full ", {
            //   "bg-red-400": activePageAction.cta.background.type === "color",
            // })}
            style={{
              background: activePageAction.cta.background.value,
              color: activePageAction.cta.textColor.value,
            }}
            className={cn("flex", {
              "w-full": activePageAction.cta.alignment === "full",
              "justify-self-center":
                activePageAction.cta.alignment === "center",
              "justify-self-end": activePageAction.cta.alignment === "right",
              "justify-self-start": activePageAction.cta.alignment === "left",
              "ring-2 ring-foreground ring-offset-2":
                activeFormElement?.id === getPageActionButtonId(activePageId),
              "rounded-sm": activePageAction.cta.borderRadius === "small",
              "rounded-md": activePageAction.cta.borderRadius === "medium",
              "rounded-lg": activePageAction.cta.borderRadius === "large",
            })}
            onClick={() =>
              setActiveFormElement(getPageActionButtonId(activePageId), "cta")
            }
          >
            {/* <span
              contentEditable
              className={cn(
                "border-none focus:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
                {
                  "": activePageAction.cta.label.length > 0,
                }
              )}
            >
              {activePageAction.cta.label}
            </span> */}
            <input
              type="text"
              className="w-fit max-w-fit border-none outline-none"
              placeholder="Type here..."
              size={getPageActionButtonWidth(activePageAction.cta.label.length)}
              value={activePageAction.cta.label}
              onChange={(event: ChangeEvent<HTMLInputElement>) => {
                updatePageAction({ label: event.target.value });
              }}
            />
            {activePageAction.cta.hasArrow && <ArrowRight size={16} />}
          </Button>
        </div>
      )}
    </div>
  );
}

type QuickOptionProps = {
  type: FormElement["type"];
  onClick: (type: FormElement["type"]) => void;
};
const QuickOption = ({ type, onClick }: QuickOptionProps) => {
  return (
    <Tooltip delayDuration={200}>
      <TooltipTrigger>
        <Button
          variant={"outline"}
          onClick={() => onClick(type)}
          className="w-full min-h-20"
        >
          <Switch
            when={type}
            cases={{
              "single-line-input": (
                <span className="flex flex-col gap-1 justify-center place-items-center p-2 text-foreground/60">
                  <LucideType /> Short Answer
                </span>
              ),
              "multi-line-input": (
                <span className="flex flex-col gap-1 justify-center place-items-center p-2 text-foreground/60">
                  <LucideText />
                  Long Answer
                </span>
              ),
              "number-input": (
                <span className="flex flex-col gap-1 justify-center place-items-center p-2 text-foreground/60">
                  <Bs123 /> Number
                </span>
              ),
              "date-input": (
                <span className="flex flex-col gap-1 justify-center place-items-center p-2 text-foreground/60">
                  <BsCalendar2Date /> Date
                </span>
              ),
              "time-input": (
                <span className="flex flex-col gap-1 justify-center place-items-center p-2 text-foreground/60">
                  <LucideClock /> Time
                </span>
              ),
              selection: (
                <span className="flex flex-col gap-1 justify-center place-items-center p-2 text-foreground/60">
                  <ListChecks /> Selection
                </span>
              ),
            }}
          />
        </Button>
      </TooltipTrigger>
      <TooltipContent>Click to add</TooltipContent>
    </Tooltip>
  );
};

const ItemsList = ({
  items,
  column,
}: {
  items: FormElement[];
  column: Column;
}) => {
  const { active } = useDndContext();
  const addPageElement = useMultiPageFormStore((s) => s.addPageElement);
  console.log({ active }, active?.data?.current?.from);

  const quickOptions: FormElement["type"][] = [
    "single-line-input",
    "multi-line-input",
    "number-input",
    "date-input",
    "time-input",
    "selection",
  ];

  const showDropHereSection =
    active && active?.data?.current?.from === "static";

  const handleQuickOptionSelect = useCallback(
    (type: FormElement["type"]) => {
      console.log({ type });
      addPageElement(type);
    },
    [addPageElement]
  );

  if (items.length === 0 && !showDropHereSection) {
    return (
      <div className="w-full min-h-96  flex flex-col justify-center place-items-center">
        <div className="w-full flex flex-col justify-center place-items-center">
          <h3 className="text-lg font-medium text-foreground/70">
            Get started by adding an element
          </h3>
          <p className="text-foreground/50">
            or drag and drop from the Elements Panel
          </p>
        </div>
        <div className="w-[70%] my-5 grid grid-cols-3 gap-3">
          {quickOptions.map((option) => (
            <QuickOption type={option} onClick={handleQuickOptionSelect} />
          ))}
        </div>
      </div>
    );
  }
  return (
    <Show
      when={showDropHereSection}
      fallback={
        <div
          className="w-full h-full flex flex-col gap-3"
          // layoutId="sortable-items"
        >
          {/* todo - add exact line where the user wants to dnd to */}
          {/* <div
        className={cn("w-full invisible bg-neutral-200 hover:bg-blue-400 h-1", {
          visible: active,
        })}
      /> */}
          {items.map((item) => (
            <SortableItem item={item} columnName={column.type} />
          ))}
        </div>
      }
    >
      <div
        className={cn(
          "w-full h-full min-h-96 bg-secondary flex justify-center place-items-center text-muted-foreground",
          {
            "outline-2 outline-blue-400 outline-dashed rounded bg-blue-50 text-blue-400 font-medium":
              showDropHereSection,
          }
        )}
      >
        Drop here...
      </div>
    </Show>
  );
};

function getPageActionButtonWidth(len: number): number {
  /** limit to 56 visible characters */
  if (len > 56) return 56;

  /** remove 3 padding characters */
  if (len > 3) return len - 3;

  /**  Make size from 1 <= 3 */
  if (len <= 3 && len > 0) return Math.min(len + 1 - 1, 1);

  /** default to 6 as the minimum placeholder length */
  return 6;
}
