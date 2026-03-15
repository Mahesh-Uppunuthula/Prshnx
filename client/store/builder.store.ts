// const x = {
//   rootId: "root",
//   layout: {
//     root: {
//       parentId: null,
//       children: ["n1", "n2", "n3"],
//     },
//     n1: {
//       parentId: "root",
//       children: ["n4", "n5"],
//     },
//     n2: {
//       parentId: "root",
//       children: [],
//     },
//     n3: {
//       parentId: "root",
//       children: [],
//     },
//     n4: {
//       parentId: "n1",
//       children: [],
//     },
//     n5: {
//       parentId: "n1",
//       children: [],
//     },
//   },
//   nodes: {
//     root: {
//       id: "root",
//       parentId: null,
//       label: "root",
//       type: "container",
//       orientation: "horizontal", // "horizontal" | "vertical",
//     },
//     n1: {
//       id: "n1",
//       parentId: "root",
//       label: "text-field",
//       type: "text-field",
//       category: "input",
//     },
//     n2: {
//       id: "n2",
//       parentId: "root",
//       label: "text-field",
//       type: "text-field",
//       category: "input",
//     },
//     n3: {
//       id: "n3",
//       parentId: "root",
//       label: "text-field",
//       type: "text-field",
//       category: "input",
//     },
//     n4: {
//       id: "n4",
//       parentId: "root",
//       label: "text-field",
//       type: "text-field",
//       category: "input",
//     },
//     n5: {
//       id: "n5",
//       parentId: "root",
//       label: "text-field",
//       type: "text-field",
//       category: "input",
//     },
//   },
// };

import { createDefaultPage, generatePageId } from "@/lib/helper";
import { ContainerNode, Node, Page } from "@/types/builder.types";
import { createStore } from "zustand";

// const pages = {};

// const builder: {
//   pages: ["page1", "page2"];
//   page1: {
//     name: "page1";
//     rootId: "root";
//     layout: {
//       root: {
//         parentId: null;
//         children: ["n1", "n2", "n3"];
//       };
//       n1: {
//         parentId: "root";
//         children: ["n4", "n5"];
//       };
//       n2: {
//         parentId: "root";
//         children: [];
//       };
//       n3: {
//         parentId: "root";
//         children: [];
//       };
//       n4: {
//         parentId: "n1";
//         children: [];
//       };
//       n5: {
//         parentId: "n1";
//         children: [];
//       };
//     };
//     nodes: {
//       root: {
//         id: "root";
//         parentId: null;
//         label: "root";
//         type: "container";
//         orientation: "horizontal"; // "horizontal" | "vertical",
//         styles: {};
//       };
//       n1: {
//         id: "n1";
//         parentId: "root";
//         label: "text-field";
//         type: "text-field";
//         category: "input";
//         styles: {};
//       };
//       n2: {
//         id: "n2";
//         parentId: "root";
//         label: "text-field";
//         type: "text-field";
//         category: "input";
//         styles: {};
//       };
//       n3: {
//         id: "n3";
//         parentId: "root";
//         label: "text-field";
//         type: "text-field";
//         category: "input";
//         styles: {};
//       };
//       n4: {
//         id: "n4";
//         parentId: "root";
//         label: "text-field";
//         type: "text-field";
//         category: "input";
//         styles: {};
//       };
//       n5: {
//         id: "n5";
//         parentId: "root";
//         label: "text-field";
//         type: "text-field";
//         category: "input";
//         styles: {};
//       };
//     };
//   };
//   page2: {};
// };

export type ActivePage = Pick<Page, "id" | "label"> | null;
export type ActiveNode = Pick<Node, "id" | "label" | "type"> | null;

export type BuilderState = {
  pagesOrder: Page["id"][];
  pages: Record<Page["id"], Page>;
  activeNode: ActiveNode;
  activePage: ActivePage;
};

export type BuilderActions = {
  // page actions
  addPage: (pageLabel: Page["label"]) => void;
  deletePage: (pageId: Page["id"]) => void;

  setActivePage: (activePage: ActivePage) => void;

  // // layout actions
  // addContainer: (
  //   pageId: Page["id"],
  //   parentId: NonNullable<Layout["parentId"]>,
  //   orientation?: Orientation,
  // ) => void;
  // addField: (
  //   pageId: Page["id"],
  //   parentId: NonNullable<Layout["parentId"]>,
  // ) => void;
  // deleteNode: (pageId: Page["id"], nodeId: Node["id"]) => void;
  // // extended functionality
  // setActiveNode: (nodeId: Node["id"]) => void;
};
export type InitialBuilderState = Pick<BuilderState, "pages" | "pagesOrder">;
export type BuilderStore = BuilderState & BuilderActions;

const defaultRootNode: ContainerNode = {
  id: "root",
  type: "container",
  label: "main",
  orientation: "vertical",
  children: [],
};

const defaultPage = createDefaultPage("Introduction");
const defaultInitialBuilderState: InitialBuilderState = {
  pages: { [defaultPage.id]: defaultPage },
  pagesOrder: [defaultPage.id],
};

export function createBuilderStore(
  initialBuilderState = defaultInitialBuilderState,
) {
  const store = createStore<BuilderStore>((set, get) => ({
    activeNode: null,
    pages: initialBuilderState.pages,
    pagesOrder: initialBuilderState.pagesOrder,
    activePage: {
      id: defaultPage.id,
      label: defaultPage.label,
    },
    addPage: (pageLabel) => {
      const page = createDefaultPage(pageLabel);
      set((state) => ({
        pages: {
          ...state.pages,
          [page.id]: page,
        },
        pagesOrder: [...state.pagesOrder, page.id],
        activePage: {
          id: page.id,
          label: page.label,
        },
      }));
    },
    deletePage: (pageId) => {
      set((state) => {
        const numberOfPages = Object.keys(state.pages).length;
        if (numberOfPages === 1) return state;
        const newPages = structuredClone(state.pages);
        delete newPages[pageId];
        const newPagesOrder = state.pagesOrder.filter((id) => id !== pageId);
        return {
          pages: newPages,
          pagesOrder: newPagesOrder,
          activePage: state.activePage?.id === pageId ? null : state.activePage,
        };
      });
    },
    setActivePage: (activePage) => {
      set({
        activePage,
      });
    },
  }));

  return store;
}

