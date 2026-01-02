export const BRAND = {
  name: "Prshnx",
} as const;

import type {
  ComponentVariants,
  StaticFormElements,
} from "@/types/form-builder.types";

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
  embed: {
    getFormConfigById: (publicFormId: string) => [
      "embed",
      "getFormConfigById",
      publicFormId,
    ],
  },
};
