import type {
  FieldProperties,
  FormElement,
  SelectionElement,
} from "@/types/form-builder.types";
import { cn } from "@/lib/utils";
import InlineEdit from "./custom/InlineEdit";
// import { useMultiPageFormBuilder } from "@/store/form-builder.store";
import { useMultiPageFormStore } from "@/context/MultiPageFormProvider";
import type { ChangeEvent } from "react";
import { motion } from "framer-motion";
import CreateChoiceLabels from "./create-choice-labels";

type FormPlaygroundItemProps = {
  showOptions: boolean;
  item: FormElement;
};
const FormPlaygroundItem: React.FC<FormPlaygroundItemProps> = ({
  item,
  showOptions,
}) => {
  const { properties, type } = item;

  // const updateElementProperties = useFormBuilder(
  //   (state) => state.updateElementProperties
  // );
  const updatePageElementProperties = useMultiPageFormStore(
    (state) => state.updatePageElementProperties
  );

  function renderElementSpecificProperties() {
    switch (type) {
      case "single-line-input":
      case "multi-line-input":
      case "number-input":
      case "date-input":
      case "time-input":
        return (
          // <div className="w-full min-h-6 px-2 py-1 text-sm rounded bg-secondary text-muted-foreground flex place-items-center justify-start">
          //   <span>
          //     {properties.placeholder.length > 0
          //       ? properties.placeholder
          //       : "Field Placeholder"}
          //   </span>
          // </div>
          <InlineEdit
            value={item.properties.placeholder}
            placeholder={"Type field placeholder here..."}
            className={cn("w-full text-sm text-muted-foreground")}
            onChange={handleUpdateElementProperties("placeholder")}
          />
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
            <InlineEdit
              value={item.properties.placeholder}
              placeholder={"Type field placeholder here..."}
              className={cn("w-full text-sm text-muted-foreground")}
              onChange={handleUpdateElementProperties("placeholder")}
            />
            <CreateChoiceLabels item={item as SelectionElement} />
          </div>
        );
    }
  }

  const handleUpdateElementProperties =
    (propertyName: keyof FieldProperties) =>
    (event: ChangeEvent<HTMLInputElement>) => {
      const eventValue = event.target.value;
      updatePageElementProperties(item.id, {
        [propertyName]: eventValue,
      });
    };

  if (!properties) return;

  return (
    <div
      className={cn(
        `w-full h-full p-2 flex flex-col gap-4 border`,
        { "border-foreground rounded-b-md rounded-l-md": showOptions },
        { "rounded-md": !showOptions }
      )}
    >
      <div className="w-full flex flex-col gap-[2px]">
        <div className="flex gap-0 place-items-center">
          <InlineEdit
            // value={
            //   properties.label.length > 0 ? properties.label : "Field Name"
            // }
            value={item.properties.label}
            placeholder={"Type your question here..."}
            className="w-fit! text-base! max-w-[36ch] text-foreground"
            onChange={handleUpdateElementProperties("label")}
          />
          {properties.required && (
            <span className="text-red-500 font-medium ml-1">*</span>
          )}
        </div>
        <motion.div>
          {properties.showDescription && (
            <InlineEdit
              value={item.properties.description}
              placeholder={"Describe this field..."}
              className="w-full text-xs! text-muted-foreground "
              onChange={handleUpdateElementProperties("description")}
            />
          )}
        </motion.div>
      </div>
      {renderElementSpecificProperties()}
    </div>
  );
};

export default FormPlaygroundItem;
