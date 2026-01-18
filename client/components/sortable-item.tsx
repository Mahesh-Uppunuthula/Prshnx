import type { ClassValue } from "clsx";
import { useSortable } from "@dnd-kit/sortable";
import { memo, useCallback } from "react";
import { LuGripVertical, LuTrash2 } from "react-icons/lu";
import type { FormElement as FormElementType } from "@/types/form-builder.types";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import FormPlaygroundItem from "./form-playground-item";
import { CSS } from "@dnd-kit/utilities";
import { Button } from "./ui/button";
// import {
//   // useFormBuilder,
//   useMultiPageFormBuilder,
// } from "@/store/form-builder.store";

import { useMultiPageFormStore } from "@/context/MultiPageFormProvider";

function SortabbleItem({
  item,
  columnName,
}: {
  item: FormElementType;
  columnName: string;
  className?: ClassValue;
}) {
  const { setNodeRef, listeners, attributes, transform, transition } =
    useSortable({
      id: item.id,
      data: {
        from: columnName,
        item: item,
      },
    });

  const deletePageElement = useMultiPageFormStore((s) => s.deletePageElement);

  // const activeFormElement = useMultiPageFormStore(
  //   (s) => s.activeFormElement
  // );
  const activeFormElement = useMultiPageFormStore((s) => s.activeFormElement);
  const setActiveFormElement = useMultiPageFormStore(
    (s) => s.setActiveFormElement
  );

  // const activeFormElement = useActiveFormElement(
  //   (state) => state.activeFormElement
  // );

  // const setActiveFormElement = useActiveFormElement(
  //   (state) => state.setActiveFormElement
  // );

  const showOptions = !!activeFormElement && item.id === activeFormElement.id;

  const style = { transition, transform: CSS.Transform.toString(transform) };

  const handleDelete = useCallback(
    (event: React.MouseEvent) => {
      event.stopPropagation();
      // deleteFormElement(item.id);
      deletePageElement(item.id);
    },
    [deletePageElement, item.id]
  );

  return (
    <motion.div
      layout="position"
      exit={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      ref={setNodeRef}
      className={cn(
        // `w-full flex flex-col justify-between place-items-center rounded relative hover:bg-primary-light/20 border-2 border-neutral-200 hover:border-primary-light`,
        `w-full flex flex-col justify-between place-items-center  relative hover:bg-muted/40 `,
        {
          // "bg-muted-foreground/20 border-none": showOptions,
          "bg-secondary": showOptions,
        }
      )}
      onClick={() => setActiveFormElement(item.id, item.type)}>
      {showOptions && (
        <motion.div className="w-fit absolute top-[-40px] self-end p-2 border-foreground flex gap-2 justify-start place-items-center bg-foreground text-muted-foreground rounded-t-md [&>button:hover]:bg-muted [&>button:hover]:text-foreground [&>button]:p-1 [&>button]:rounded [&>button]:size-6">
          {/* <motion.div className="w-fit absolute top-[-40px] self-end p-2 border-primary-regular flex gap-2 justify-start place-items-center bg-primary-regular text-foreground rounded-t-md [&>button:hover]:bg-white [&>button:hover]:text-primary-regular [&>button]:p-1 [&>button]:rounded"> */}
          <Button
            size="icon"
            style={style}
            {...attributes}
            {...listeners}
            className={cn(
              `text-muted-foreground cursor-grab acive:cursor-grabbing`
            )}>
            <LuGripVertical />
          </Button>
          <Button size="icon" className="bg-destructive" onClick={handleDelete}>
            <LuTrash2 />
          </Button>
        </motion.div>
      )}
      <FormPlaygroundItem item={item} showOptions={showOptions} />
    </motion.div>
  );
}

export default memo(SortabbleItem);
