import { nanoid } from "nanoid";
import { DateTime } from "luxon";
import type {
  ComponentVariants,
  FormElement,
  Page,
} from "@/types/form-builder.types";
import type { MultiPageForm } from "@/store/form-builder.store";

export function createFormElement(type: ComponentVariants): FormElement {
  const id = `${type}_${nanoid().slice(0, 5)}`;

  switch (type) {
    case "single-line-input":
    case "multi-line-input":
      return {
        id,
        type,
        properties: {
          label: id,
          showDescription: false,
          description: "",
          required: true,
          order: 0,
          disabled: false,
          placeholder: "",
          minLength: 1,
          maxLength: 256,
        },
      };
    case "number-input": {
      return {
        id,
        type,
        properties: {
          label: id,
          showDescription: false,
          description: "",
          required: true,
          order: 0,
          disabled: false,
          placeholder: "",
          min: 0,
          max: 100,
        },
      };
    }
    case "time-input":
      return {
        id,
        type,
        properties: {
          label: id,
          showDescription: false,
          description: "",
          required: true,
          order: 0,
          disabled: false,
          placeholder: "",
          restrictTime: false,
          from: "00:00",
          to: "23:59",
        },
      };

    case "date-input": {
      return {
        id,
        type,
        properties: {
          label: id,
          showDescription: false,
          description: "",
          required: true,
          order: 0,
          disabled: false,
          placeholder: "",
          restrictDate: "no-restriction",
          /** Maintain the order */
          // from: DateTime.now().toFormat("yyyy-MM-dd"), // ISO format
          // to: DateTime.now().toFormat("yyyy-MM-dd"), // ISO format
          dateRange: undefined,
        },
      };
    }

    // case "radio-button":
    // case "checkbox": {
    //   return {
    //     id,
    //     type,
    //     properties: {
    //       label: id,
    //       showDescription: false,
    //       description: "",
    //       required: true,
    //       order: 0,
    //       disabled: false,
    //       choiceLabels: [],
    //     },
    //   };

    case "selection": {
      return {
        id,
        type,
        properties: {
          label: id,
          showDescription: false,
          description: "",
          required: true,
          placeholder: "",
          order: 0,
          disabled: false,
          selectionType: "single",
          optionPrefix: "default",
          choiceLabels: [],
        },
      };
    }

    default: {
      // fallback type
      return {
        id,
        type: "single-line-input",
        properties: {
          label: id,
          showDescription: false,
          description: "",
          required: true,
          order: 0,
          disabled: false,
          placeholder: "",
          minLength: 1,
          maxLength: 256,
        },
      };
    }
  }
}

export function convertISOtoJSDate(
  isoString: string | undefined
): Date | undefined {
  if (!isoString) return undefined;
  return DateTime.fromISO(isoString).toJSDate();
}

export function getAlphabetPrefix(index: number) {
  console.log("main-index", index);

  let prefix = "";

  while (index >= 0) {
    prefix = String.fromCharCode((index % 26) + 65) + prefix;
    index = Math.floor(index / 26) - 1;
  }
  return prefix;
}

export function cloneMapAnd<K, V>(
  map: Map<K, V>,
  fn: (clone: Map<K, V>) => void
) {
  const clone = new Map(map);
  fn(clone);
  return clone;
}

export function getPageActionButtonId(pageId: string) {
  return `page-action-button_${pageId}`;
}

export function toStructuredPages(
  title: MultiPageForm["title"],
  pageSettings: MultiPageForm["pageSettings"],
  pages: Map<string, Page>
): {
  title: string;
  settings: MultiPageForm["pageSettings"];
  pages: Page[];
} {
  return {
    title: title,
    settings: pageSettings,
    pages: [...pages.values()],
  };
}
