export const BRAND = {
  name: "Prshnx",
} as const;

import type {
  ComponentVariants,
  Page,
  StaticFormElements,
} from "@/types/form-builder.types";
import { generatePageId } from "./helper";
import { FieldTypes } from "@/types/builder.types";
import { From } from "@/components/builder/Layout";

export const builtInStaticFormElements: StaticFormElements = {
  text: {
    "single-line-input": {
      id: "single-line-input",
      name: "Single Line",
      variant: "text",
      parentType: "static",
    },
    "multi-line-input": {
      id: "multi-line-input",
      name: "Multi Line",
      variant: "text",
      parentType: "static",
    },
    "number-input": {
      id: "number-input",
      name: "Number",
      variant: "text",
      parentType: "static",
    },
  },
  "date & time": {
    "date-input": {
      id: "date-input",
      name: "Date",
      variant: "date & time",
      parentType: "static",
    },
    "time-input": {
      id: "time-input",
      name: "Time",
      variant: "date & time",
      parentType: "static",
    },
  },
  // "selection choice": {
  //   "radio-button": {
  //     id: "radio-button",
  //     name: "Radio Button",
  //     variant: "selection choice",
  //     parentType: "static",
  //   },
  //   checkbox: {
  //     id: "checkbox",
  //     name: "Checkbox",
  //     variant: "selection choice",
  //     parentType: "static",
  //   },
  // },
  "selection choice": {
    selection: {
      id: "selection",
      name: "Selection",
      variant: "selection choice",
      parentType: "static",
    },
  },
};

export const builtInComponentNamesSet = new Set<ComponentVariants>([
  "single-line-input",
  "multi-line-input",
  "number-input",
  // "checkbox",
  "date-input",
  // "radio-button",
  "time-input",
]);

export const QUERY_KEYS = {
  forms: {
    getFormConfigurationById: (formId: string) => [
      "forms",
      "getFormConfigurationById",
      formId,
    ],
    getAllForms: ["forms"],
    saveForm: ["forms", "saveForm"],
    updateForm: ["forms", "updateForm"],
    deleteForm: ["forms", "deleteForm"],
  },
  embed: {
    getFormConfigurationByPublicLink: (publicLink: string) => [
      "embed",
      "getFormConfigurationByPublicLink",
      publicLink,
    ],
  },
};

export const NEW_FORM_ID = "new";

export const emptyPage: Page = {
  id: generatePageId(),
  action: {
    cta: {
      type: "cta",
      actionType: "submit",
      label: "Submit",
      hasArrow: false,
      background: {
        type: "color",
        value: "#000000",
      },
      textColor: {
        type: "color",
        value: "#ffffff",
      },
      borderRadius: "small",
      alignment: "right",
    },
  },
  header: {
    title: "Untitled Page",
    description: "",
  },
  body: {
    elements: [],
    // orderedElementIds: [],
  },
};

export type PaletteFieldCategory = "text" | "date&time" | "choice" | "layout";

export type PaletteElement = {
  id: string;
  type: FieldTypes;
  label: string;
  category: PaletteFieldCategory;
  from: From;
};

export const paletteElements: PaletteElement[] = [
  {
    id: "palette:container",
    type: "container",
    label: "Container",
    category: "layout",
    from: "palette",
  },
  {
    id: "palette:single-line-input",
    type: "single-line-input",
    label: "Text Box",
    category: "text",
    from: "palette",
  },
  {
    id: "palette:single-line-hidden-input",
    type: "single-line-hidden-input",
    label: "Password",
    category: "text",
    from: "palette",
  },
  {
    id: "palette:multi-line-input",
    type: "multi-line-input",
    label: "Text Area",
    category: "text",
    from: "palette",
  },
  {
    id: "palette:number-input",
    type: "number-input",
    label: "Number",
    category: "text",
    from: "palette",
  },
  // {
  //   id: "palette:date-input",
  //   type: "date-input",
  //   label: "Date",
  //   category: "date&time",
  // },
  // {
  //   id: "palette:time-input",
  //   type: "time-input",
  //   label: "Time",
  //   category: "date&time",
  // },
  // {
  //   id: "palette:selection",
  //   type: "selection",
  //   label: "Selection",
  //   category: "choice",
  // },
];

type PaletteKind = "field" | "container";
type PaletteFieldsMap = { [K in FieldTypes]: PaletteKind };

export const ALL_PALETTE_FIELDS_MAP: PaletteFieldsMap = {
  container: "container",
  "single-line-input": "field",
  "single-line-hidden-input": "field",
  "multi-line-input": "field",
  "number-input": "field",
};
