import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DndContext,
  DragOverlay,
  MouseSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import {
  CheckCircle,
  ChevronRight,
  Ellipsis,
  Layers,
  Plus,
  Trash,
  Type,
} from "lucide-react";
import React, { useCallback, useState, type MouseEvent } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import {
  builtInComponentNamesSet,
  builtInStaticFormElements,
} from "@/lib/constants";
import DraggableItem from "@/components/draggable-item";
import Playground from "@/components/playground";
import { Input } from "@/components/ui/input";
import type {
  ComponentVariants,
  DraggableItemData,
  ParentType,
  BaseItemType,
  Column,
  StaticFormElements,
  FormElement,
} from "@/types/form-builder.types";
import { useMultiPageFormStore } from "@/context/MultiPageFormProvider";
import FormStaticElementDragOverlay from "@/components/form-static-element-drag-overlay";
import FormDynamicElementDragOverlay from "@/components/form-dynamic-element-drag-overlay";
import Toolkit from "@/components/toolkit";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Show from "@/components/utils/Show";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const Columns: Record<"staticColumn" | "dynamicColumn", Column> = {
  staticColumn: {
    id: "staticColumn",
    label: "Static",
    type: "static",
  },
  dynamicColumn: {
    id: "dynamicColumn",
    label: "Dynamic",
    type: "dynamic",
  },
} as const;

type FormPlaygroundProps = {
  formRef: React.Ref<HTMLDivElement>;
};

function FormPlayground({ formRef }: FormPlaygroundProps) {
  // const activePageId = useMultiPageFormBuilder((s) => s.activePageId);
  // const activePageId = activePage.id;

  // const elements = useFormBuilder((state) => state.elements);
  // const pages = useMultiPageFormBuilder((s) => s.pages);
  // const elements = pages.get(activePageId)?.body.elements ?? [];

  // const pages = useMultiPageFormBuilder((s) => s.pages);
  // const elements = pages.get(activePageId)?.body.elements ?? [];

  // const formConfig =  // TODO - write a query to fetch if the id is not new

  const activePage = useMultiPageFormStore((s) => {
    const activePageId = s.activePageId;
    return s.pages.get(activePageId)!;
  });
  const elements = activePage.body.elements;

  // const reorder = useFormBuilder((state) => state.reorder);
  const reorderPageElements = useMultiPageFormStore(
    (state) => state.reorderPageElements
  );

  const addPageElement = useMultiPageFormStore((s) => s.addPageElement);
  // const addElement = useFormBuilder((state) => state.addElement);

  const [activeComponent, setActiveComponent] = useState<null | {
    parent: ParentType;
    element: BaseItemType;
  }>(null);

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        delay: 100,
        tolerance: 5,
        distance: 15,
      },
    })
  );

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveComponent({
      element: event.active.data.current?.item,
      parent: event.active.data.current?.from,
    });
  }, []);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    console.log("handleDragEnd", { active, over });

    const activeElement = active.data.current as DraggableItemData;
    if (!activeElement || !over || !over.data || !over.id) return;
    const fromColumn = activeElement.from as ParentType;
    if (fromColumn === "static") {
      const toColumn = over.id as ParentType;
      if (toColumn !== "dynamic") return;
      // const newFormElement = buildFormElement(activeElement.item);
      // if (elements.length === 0) setActiveFormElement(newFormElement.id);
      // appends to form
      // const updatedFormElements = [
      //   ...elements,
      //   { ...newFormElement, order: elements.length },
      // ];
      // setFormElements(updatedFormElements);
      addPageElement(activeElement.id);
    } else if (fromColumn === "dynamic") {
      const overElementId = over.id as ComponentVariants;
      const overElementType = overElementId.split("_")[0] as ComponentVariants;
      if (!builtInComponentNamesSet.has(overElementType)) return;
      console.log("handleDragEnd from dynamic to dynamic");
      const foundFromElementIndex = elements.findIndex(
        (item) => item.id === activeElement.item.id
      );
      const foundToElementIndex = elements.findIndex(
        (item) => item.id === overElementId
      );
      // console.log("handleDragEnd", {
      //   fromColumn,
      //   toColumn: overElementType,
      //   foundFromElementIndex,
      //   foundToElementIndex,
      // });
      if (foundFromElementIndex === -1) {
        // console.log("foundFromElementIndex === -1");
        return;
      }
      if (foundToElementIndex === -1) {
        // console.log("foundToElementIndex === -1");
        return;
      }
      // const updatedPositions = arrayMove(
      //   formElements,
      //   foundFromElementIndex,
      //   foundToElementIndex
      // );
      // setFormElements(updatedPositions);
      // reorder(foundFromElementIndex, foundToElementIndex);
      reorderPageElements(foundFromElementIndex, foundToElementIndex);
    }
  };

  return (
    // <div className="w-full h-[100%]">
    //   {/* skeleton */}
    //   <div className="w-full h-full max-h-full grid grid-cols-5 gap-2">
    //     <div className="w-full h-full overflow-auto col-span-1 border rounded px-3 py-2 flex flex-col gap-4">
    //       <Skeleton className="w-full h-full" />
    //       <Skeleton className="w-full h-full" />
    //       <Skeleton className="w-full h-full" />
    //     </div>
    //     <div className="w-full h-full col-span-3 overflow-auto border-t px-3">
    //       <Skeleton className="w-full h-[6%] my-3" />
    //       <div className="w-full h-[90%] flex flex-col gap-5">
    //         <Skeleton className="w-full h-[25%]" />
    //         <Skeleton className="w-full h-[25%]" />
    //         <Skeleton className="w-full h-[25%]" />
    //       </div>
    //     </div>
    //     <Skeleton className="w-full h-full col-span-1 overflow-auto border-t" />
    //   </div>
    // </div>
    <div className="w-full h-full grid grid-cols-5">
      {/* form elements / pages sidebar */}
      <DndContext
        onDragEnd={handleDragEnd}
        onDragStart={handleDragStart}
        sensors={sensors}>
        <section className="h-full max-h-full overflow-auto col-span-1 border rounded px-1 py-2">
          <ElementsPanel
            column={Columns.staticColumn}
            items={builtInStaticFormElements}
          />
        </section>
        <section className="h-full max-h-full col-span-3 overflow-auto border-t">
          <Playground
            formRef={formRef}
            items={elements}
            column={Columns.dynamicColumn}
          />
        </section>

        <DragOverlay
          dropAnimation={
            activeComponent && activeComponent.parent === "static"
              ? null
              : { duration: 200, easing: "linear" }
          }>
          {activeComponent !== null &&
            (activeComponent.parent === "static" ? (
              <FormStaticElementDragOverlay
                name={activeComponent.element.name}
              />
            ) : (
              // <div>lib component drag overlay</div>
              <FormDynamicElementDragOverlay
                name={activeComponent.element.id}
              />
              // <div>form component drag overlay</div>
            ))}
        </DragOverlay>
      </DndContext>

      {/* settings panel */}
      <section className="col-span-1 h-full max-h-full overflow-y-auto">
        <Toolkit />
      </section>
    </div>
  );
}

export default FormPlayground;

type ElementsPanelProps = {
  column: Column;
  items: StaticFormElements;
};
function ElementsPanel({ items }: ElementsPanelProps) {
  return (
    <div className="w-full h-full">
      <div className="w-full h-full p-2">
        {/* toggle - elements / pages */}
        <Tabs defaultValue="pages" className="w-full">
          <TabsList className="w-full">
            <TabsTrigger value="pages" className="text-sm">
              <Layers />
              pages
            </TabsTrigger>
            <TabsTrigger value="elements" className="text-sm">
              <Type /> Elements
            </TabsTrigger>
          </TabsList>
          <TabsContent value="pages">
            <FormPages />
          </TabsContent>
          <TabsContent value="elements">
            <DraggableElements items={items} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

type DraggableElementsProps = {
  // column: Column;
  items: StaticFormElements;
};
function DraggableElements({ items }: DraggableElementsProps) {
  return (
    <div className="">
      <div className="w-full h-full">
        <div className="w-full h-full flex flex-col gap-3 p-2">
          <Input placeholder="Search" />
          <Accordion
            type="multiple"
            defaultValue={Object.keys(builtInStaticFormElements)}
            className="w-full h-full overflow-hidden">
            <div className="w-full h-full overflow-auto flex flex-col gap-3 place-items-center ">
              {Object.entries(items).map(([category, elements]) => {
                return (
                  <>
                    <AccordionItem value={category} className="w-full">
                      <AccordionTrigger className="w-full text-start text-sm capitalize">
                        {category}
                      </AccordionTrigger>
                      <AccordionContent>
                        <div
                          key={category}
                          className="w-full h-fit px-2 flex flex-col gap-2 my-1">
                          {Object.entries(elements).map(([, item]) => (
                            <DraggableItem key={item.id} item={item} />
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </>
                );
              })}
            </div>
          </Accordion>
        </div>
      </div>
    </div>
  );
}

function renderElement(element: FormElement) {
  switch (element.type) {
    case "single-line-input":
    case "multi-line-input":
    case "number-input":
    case "date-input":
    case "time-input":
      return (
        // <InlineEdit
        //   value={element.properties.placeholder}
        //   placeholder={"Type field placeholder here..."}
        //   className={cn("max-w-[50%] text-xs text-muted-foreground")}
        // />
        <Label className="w-full max-w-[90%] whitespace-nowrap overflow-hidden text-ellipsis font-light text-primary/70">
          {element.properties.placeholder.length
            ? element.properties.placeholder
            : "Type field placeholder here..."}
        </Label>
      );
    // case "checkbox":
    // case "radio-button":
    //   return (
    //     <div className="flex flex-wrap gap-3">
    //       {!!properties.choiceLabels.length &&
    //         [properties.choiceLabels].map((label) => (
    //           <div className="w-fit px-2 py-1 rounded flex gap-2 place-items-center border border-neutral-300">
    //             <span>{label}</span>
    //           </div>
    //         ))}
    //     </div>
    //   );
    case "selection":
      return (
        <div className="">
          {/* <CreateChoiceLabels item={element as SelectionElement} /> */}

          <Label className="">
            <ChevronRight size={16} />
            {"Show options (" + element.properties.choiceLabels.length + ")"}
          </Label>
        </div>
      );
  }
}

// type FormPagesProps = {};
function FormPages() {
  const activePageId = useMultiPageFormStore((s) => s.activePageId);
  const addPage = useMultiPageFormStore((s) => s.addPage);
  // const duplicatePage = useMultiPageFormStore((s) => s.duplicatePage);
  const setActivePageId = useMultiPageFormStore((s) => s.setActivePageId);

  const deletePage = useMultiPageFormStore((s) => s.deletePage);

  const pagesMap = useMultiPageFormStore((s) => s.pages);
  const pages = Array.from(pagesMap.values());

  const handleAddPage = useCallback(() => {
    addPage();
  }, [addPage]);

  const handleSetActivePage = useCallback(
    (id: string) => () => {
      setActivePageId(id);
    },
    [setActivePageId]
  );

  const handlePageAction = useCallback(
    (actionType: "duplicate" | "delete", id: string) => (event: MouseEvent) => {
      event.stopPropagation();
      console.log("action type", actionType, id);
      switch (actionType) {
        case "delete":
          deletePage(id);
          break;

        case "duplicate":
          // duplicatePage(id);
          break;
        default:
          console.error("invalid page action", actionType);
          break;
      }
    },
    [deletePage]
  );

  return (
    // container
    <div className="p-2">
      {/* pages container */}
      <div className="w-full h-full flex flex-col gap-3 place-items-center">
        {pages.map((page, pIdx) => (
          <div
            key={page.id}
            className={cn(
              "w-[100%] aspect-video max-h-fit relative p-2 bg-black/3 hover:shadow-xl hover:bg-secondary transition-all border-2 rounded shadow",
              {
                "border-primary/50": page.id === activePageId,
              }
            )}
            onClick={handleSetActivePage(page.id)}>
            <span
              className={cn(
                "absolute top-1 left-2 text-sm flex gap-2 place-items-center w-[80%]",
                {
                  "font-medium": page.header.title.length > 0,
                  "font-light": page.header.title.length === 0,
                }
              )}>
              <span>{pIdx + 1}.</span>
              <span
                title={page.header.title}
                className="w-fit max-w-full whitespace-nowrap overflow-hidden text-ellipsis">
                {page.header.title.length > 0 ? page.header.title : "Untitled"}
              </span>
            </span>
            <div className="absolute right-1 top-1">
              <DropdownMenu>
                <DropdownMenuTrigger className="p-[2px] hover:bg-primary/10 rounded transition-all">
                  <Ellipsis size={19} />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {/* <DropdownMenuLabel>My Account</DropdownMenuLabel> */}
                  {/* <DropdownMenuSeparator /> */}
                  {/* TODO - add duplicate */}
                  {/* <DropdownMenuItem
                    onClick={handlePageAction("duplicate", page.id)}
                  >
                    <Copy /> Duplicate
                  </DropdownMenuItem> */}
                  <DropdownMenuItem
                    variant="destructive"
                    disabled={pages.length === 1}
                    onClick={handlePageAction("delete", page.id)}>
                    <Trash />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            {/* scaled-down form container */}
            <div className="w-full h-full flex justify-start overflow-hidden">
              <Show
                when={page.body.elements.length > 0}
                fallback={
                  <div className="w-full h-full flex justify-center place-items-center text-sm text-foreground/40">
                    empty page
                  </div>
                }>
                <div className="w-full max-w-full text-ellipsis flex flex-col gap-2 scale-50">
                  {page.body.elements.slice(0, 4).map((element) => (
                    // <div key={element.id} className="scale-50">

                    //   {renderElement(element)}
                    // </div>
                    <div
                      className={cn(
                        `w-full h-full p-2 bg-white rounded flex flex-col gap-4 border`
                      )}>
                      <div className="w-full flex flex-col gap-[2px]">
                        <div className="w-full flex gap-0 place-items-center">
                          <Label className="w-full max-w-[90%] font-medium whitespace-nowrap overflow-hidden text-ellipsis">
                            {element.properties.label}
                          </Label>
                          {element.properties.required && (
                            <span className="text-red-500 font-medium ml-1">
                              *
                            </span>
                          )}
                        </div>
                        <div>
                          {element.properties.showDescription && (
                            <Label className="w-full max-w-[90%] font-light whitespace-nowrap overflow-hidden text-ellipsis">
                              {element.properties.description}
                            </Label>
                          )}
                        </div>
                      </div>
                      {renderElement(element)}
                    </div>
                  ))}
                </div>
              </Show>
            </div>
            {pIdx === pages.length - 1 && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="p-2 absolute bottom-1 right-1">
                    <CheckCircle size={16} className="text-muted-foreground" />
                  </span>
                </TooltipTrigger>
                <TooltipContent side="right">last page</TooltipContent>
              </Tooltip>
            )}
          </div>
        ))}
      </div>
      <div
        className="w-[100%] aspect-video my-2 p-2 hover:shadow-xl hover:bg-secondary transition-all border-2 border-dashed rounded shadow"
        onClick={handleAddPage}>
        <span className="w-full h-full cursor-pointer  text-muted-foreground text-sm flex gap-2 place-items-center justify-center">
          <Plus size={15} />
          Add Page
        </span>
      </div>
    </div>
  );
}
