import { nanoid } from "nanoid";
import { DateTime } from "luxon";
import type {
  ComponentVariants,
  FormElement,
  Page,
} from "@/types/form-builder.types";
import {
  MultiPageFormState,
  type MultiPageForm,
} from "@/store/form-builder.store";
import { FormConfiguration } from "@/types/form.types";
// import {
//   BuilderNode,
//   ContainerNode,
//   FieldNode,
// } from "@/types/new-form-builder.types";
import {
  Page as BuilderPage,
  ContainerNode,
  FieldNode,
  InputFields,
  InputFieldTypes,
  Node,
} from "@/types/builder.types";

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
  isoString: string | undefined,
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
  fn: (clone: Map<K, V>) => void,
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
  pages: Map<string, Page>,
): FormConfiguration {
  return {
    title: title,
    settings: pageSettings,
    pages: [...pages.values()],
  };
}

export function isFormEmpty(pages: MultiPageForm["pages"]) {
  for (const page of pages.values()) {
    if (page.body.elements.length > 0) return false;
  }
  return true;
}
export function generatePageId() {
  return `page-${nanoid()}`;
}
export function updateMap<K, V>(map: Map<K, V>, id: K, fn: (value: V) => V) {
  const clone = new Map(map);
  const val = clone.get(id);
  if (val === undefined) return clone;
  return clone.set(id, fn(val));
}
export function pageArraytoMap(pages: Page[]): MultiPageForm["pages"] {
  const map = new Map() as MultiPageForm["pages"];
  for (const page of pages) {
    map.set(page.id, page);
  }
  return map;
}

export function toMultiPageForm(
  multiFormConfiguration: FormConfiguration,
): Omit<MultiPageFormState, "isDirty" | "lastSavedForm"> {
  return {
    title: multiFormConfiguration.title,
    pages: pageArraytoMap(multiFormConfiguration.pages),
    activePageId: multiFormConfiguration.pages[0]?.id!, // guranteed to have at least one page
    activeFormElement: null,
    pageSettings: multiFormConfiguration.settings,
  };
}

// export function assertContainerNodeLegacy(
//   node: BuilderNode | undefined | null,
// ): asserts node is ContainerNode {
//   if (!node) throw new Error("Node not found");
// }

// export function assertFieldNode(
//   node: BuilderNode | undefined | null,
// ): asserts node is FieldNode {
//   if (!node) throw new Error("Node not found");
// }

export function createDefaultPage(pageLabel: BuilderPage["label"]) {
  const pageId = generatePageId();
  const rootContainerId = generateComponentId("container");
  const containerCount = 1;
  const fieldCount = 0;
  const page: BuilderPage = {
    id: pageId,
    label: pageLabel,
    rootId: rootContainerId,
    layout: {
      [rootContainerId]: {
        parentId: null,
        children: [],
      },
    },
    nodes: {
      [rootContainerId]: {
        id: rootContainerId,
        label: `Container ${containerCount}`,
        type: "container",
        orientation: "vertical",
        children: [],
      },
    },
    containerCount,
    fieldCount,
  };
  return page;
}

export function generateComponentId(component: "page" | "container" | "field") {
  switch (component) {
    case "page":
    case "container":
    case "field":
      return `${component}-${nanoid()}`;
    default:
      throw new Error("Invalid component type");
  }
}

export function assertContainerNode(
  node: Node | undefined | null,
): asserts node is ContainerNode {
  if (!node) throw new Error("Node not found");
}

export function assertFieldNode(
  node: Node | undefined | null,
): asserts node is FieldNode {
  if (!node) throw new Error("Node not found");
}

export function createDefaultField(
  fieldType: InputFieldTypes,
  fieldCount: number,
): InputFields {
  const fieldId = generateComponentId("field");
  switch (fieldType) {
    case "single-line-input": {
      return {
        id: fieldId,
        label: `Field ${fieldCount}`,
        type: "single-line-input",
        description: "",
        required: false,
        disabled: false,
        placeholder: "Enter text",
        minLength: 1,
        maxLength: 256,
      };
    }
    case "single-line-hidden-input": {
      return {
        id: fieldId,
        label: `Field ${fieldCount}`,
        type: "single-line-hidden-input",
        description: "",
        required: false,
        disabled: false,
        placeholder: "Enter text",
        minLength: 1,
        maxLength: 256,
      };
    }
    case "number-input": {
      return {
        id: fieldId,
        label: `Field ${fieldCount}`,
        type: "number-input",
        description: "",
        required: false,
        disabled: false,
        placeholder: "Enter number",
        min: 0,
        max: 100,
      };
    }
    case "multi-line-input": {
      return {
        id: fieldId,
        label: `Field ${fieldCount}`,
        type: "multi-line-input",
        description: "",
        required: false,
        disabled: false,
        placeholder: "Enter text",
        minLength: 1,
        maxLength: 256,
      };
    }
    default:
      throw new Error("Invalid field type");
  }
}
