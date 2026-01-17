export const BRAND = {
  name: "Prshnx",
} as const;

import type {
  ComponentVariants,
  Page,
  StaticFormElements,
} from "@/types/form-builder.types";
import { generatePageId } from "./helper";

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
