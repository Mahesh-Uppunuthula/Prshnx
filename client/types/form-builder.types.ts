import type { DateRange } from "react-day-picker";

export type PageActionButtonType = "next" | "submit";

export type ParentType = "static" | "dynamic";
export type ElementVariants = "text" | "date & time" | "selection choice";
export type TextComponentsVariants =
  | "single-line-input"
  | "multi-line-input"
  | "number-input";
export type DateComponentsVariants = "date-input" | "time-input";
// export type SelectionComponentsVariants = "radio-button" | "checkbox";
export type SelectionComponentsVariants = "selection";

export type ComponentVariants =
  | TextComponentsVariants
  | DateComponentsVariants
  | SelectionComponentsVariants;

export type BaseElementType = {
  id: ComponentVariants;
  name: string;
  variant: ElementVariants;
  parentType: ParentType;
};

export type TextComponents = {
  text: {
    [key in TextComponentsVariants]: BaseElementType & {
      id: TextComponentsVariants;
    };
  };
};

export type DateComponents = {
  "date & time": {
    [key in DateComponentsVariants]: BaseElementType & {
      id: DateComponentsVariants;
    };
  };
};

export type SelectionComponents = {
  "selection choice": {
    [key in SelectionComponentsVariants]: BaseElementType & {
      id: SelectionComponentsVariants;
    };
  };
};

export type StaticFormElements = TextComponents &
  DateComponents &
  SelectionComponents;

export type PrimitiveFields = Extract<
  ComponentVariants,
  | "single-line-input"
  | "multi-line-input"
  | "number-input"
  | "date-input"
  | "time-input"
>;

export type NonPrimitiveFields = Extract<
  ComponentVariants,
  "radio-button" | "checkbox"
>;

export type BaseFieldProperties = {
  label: string;
  description: string;
  showDescription: boolean;
  required: boolean;
  order: number;
  disabled: boolean;
  placeholder: string;
};

export type PrimitiveFieldProperties<T extends PrimitiveFields> =
  BaseFieldProperties & {
    min: T extends "date-input" | "time-input" ? string : number;
    max: T extends "date-input" | "time-input" ? string : number;
  };

export type NonPrimitiveFieldProperties = BaseFieldProperties & {
  choiceLabels: string[];
};

export type SingleLineInputProperties = BaseFieldProperties & {
  maxLength: number;
  minLength: number;
};

export type MultiLineInputProperties = BaseFieldProperties & {
  maxLength: number;
  minLength: number;
};

export type NumberInputProperties = BaseFieldProperties & {
  min: number;
  max: number;
};

export type DateInputProperties = BaseFieldProperties & {
  restrictDate:
    | "no-restriction"
    | "allow-specific-dates"
    | "exclude-specific-dates";
  dateRange?: DateRange;
};

export type TimeInputProperties = BaseFieldProperties & {
  restrictTime: boolean;
  from?: string;
  to?: string;
};

export type RadioButtonProperties = Omit<BaseFieldProperties, "placeholder"> & {
  choiceLabels: string[];
};

export type CheckboxProperties = Omit<BaseFieldProperties, "placeholder"> & {
  choiceLabels: string[];
};

export type SelectionProperties = BaseFieldProperties & {
  selectionType: "single" | "multiple";
  choiceLabels: string[];
  /**
   * optionPrefix = "none" - no prefix, use background colors to show selection
   * optionPrefix = "default" - use default prefix, if selectionType = "single" - use radio, if selectionType = "multiple" - use checkbox
   * optionPrefix = "alphabet" - use alphabet prefix
   * optionPrefix = "number" - use number prefix
   */
  optionPrefix: "none" | "default" | "alphabet" | "number";
};

export type FieldProperties = SingleLineInputProperties &
  MultiLineInputProperties &
  NumberInputProperties &
  DateInputProperties &
  TimeInputProperties &
  SelectionProperties;
// & RadioButtonProperties &
// CheckboxProperties;

export type FieldPropertyName = keyof FieldProperties;
export type FieldPropertyValueType = FieldProperties[FieldPropertyName];

type BaseElementProperties = {
  id: string;
};
export type SingleLineInputElement = BaseElementProperties & {
  type: "single-line-input";
  properties: SingleLineInputProperties;
};

export type MultiLineInputElement = BaseElementProperties & {
  type: "multi-line-input";
  properties: MultiLineInputProperties;
};

export type NumberInputElement = BaseElementProperties & {
  type: "number-input";
  properties: NumberInputProperties;
};

export type DateInputElement = BaseElementProperties & {
  type: "date-input";
  properties: DateInputProperties;
};

export type TimeInputElement = BaseElementProperties & {
  type: "time-input";
  properties: TimeInputProperties;
};

export type RadioButtonElement = BaseElementProperties & {
  type: "radio-button";
  properties: RadioButtonProperties;
};

export type CheckboxElement = BaseElementProperties & {
  type: "checkbox";
  properties: CheckboxProperties;
};

export type SelectionElement = BaseElementProperties & {
  type: "selection";
  properties: SelectionProperties;
};

export type FormElement =
  | SingleLineInputElement
  | MultiLineInputElement
  | NumberInputElement
  | DateInputElement
  | TimeInputElement
  | SelectionElement;
// | RadioButtonElement
// | CheckboxElement;

export type Form = {
  header: FormHeader;
  body: FormBody;
  // actions: ActionType;
};

export type FormHeader = {
  title: string;
  description: string;
};

export type FormBody = {
  // orderedElementIds: string[];
  elements: FormElement[];
};
export type DraggableItemData = {
  id: ComponentVariants;
  from: ParentType;
  item: BaseItemType;
};
export type BaseItemType = {
  id: ComponentVariants;
  name: string;
  variant: ElementVariants;
  parentType: ParentType;
};
export type Column = {
  id: string;
  label: string;
  type: ParentType;
};
// export type BuiltInElementsType = {
//   text: Record<TextComponentsVariants, BaseItemType>;
//   date: Record<DateComponentsVariants, BaseItemType>;
//   "selection-choice": Record<SelectionComponentsVariants, BaseItemType>;
// };

export type PageCTA = {
  type: "cta";
  actionType: PageActionButtonType;
  label: string;
  background: {
    type: "color" | "gradient" | "image";
    value: string; // converted to string
  };
  textColor: {
    type: "color";
    value: string; // converted to string
  };
  borderRadius: "small" | "medium" | "large";
  alignment: "left" | "center" | "right" | "full";
  hasArrow: boolean;
};

/** TODO
 * let user create their own style guide - custom themes
 * let user select from built-in themes or create their own
 */
export type Page = Form & {
  /** page id */
  id: string;
  action: { cta: PageCTA };
};

export type PageConfiguration = {
  page: {
    theme: "light" | "dark" | "system";
    width: number;
    height: number;
    font: string;
    backgroundColor: string;
    textColor: string;
    baseFontSize: number;
  };
  input: {
    width: WidthType;
    height: number;
    backgroundColor: string;
    placeholderColor: string;
    border: {
      color: string;
      width: number;
      radius: number;
    };
    marginBottom: number;
    horizontalPadding: number;
  };
  button: {
    width: WidthType;
  };
};

export type WidthType = { width: "full" } | { width: "fixed"; value: number };
