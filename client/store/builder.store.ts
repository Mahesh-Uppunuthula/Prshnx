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

import {
  createDefaultField,
  createDefaultPage,
  generateComponentId,
} from "@/lib/helper";
import {
  ContainerNode,
  InputFieldTypes,
  Node,
  Page,
} from "@/types/builder.types";
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

export type ActivePage = Pick<Page, "id"> | null;
export type ActiveNode = Pick<Node, "id" | "type"> | null;

export type BuilderState = {
  pagesOrder: Page["id"][];
  pages: Record<Page["id"], Page>;
  active: {
    node: ActiveNode;
    page: ActivePage;
  };
};

export type Active = {
  page: ActivePage;
  node: ActiveNode;
};

export type BuilderActions = {
  // page actions
  addPage: (pageLabel: Page["label"]) => void;
  deletePage: (pageId: Page["id"]) => void;
  addContainer: (pageId: Page["id"], parentId: Node["id"]) => void;
  updateContainer: (
    pageId: Page["id"],
    containerId: Node["id"],
    updates: Partial<Pick<ContainerNode, "label" | "orientation">>,
  ) => void;
  // emptyContainer: (pageId: Page["id"], containerId: Node["id"]) => void;
  addField: (
    pageId: Page["id"],
    containerId: Node["id"],
    fieldType: InputFieldTypes,
  ) => void;
  deleteNode: (pageId: Page["id"], nodeId: Node["id"]) => void;
  // addField: (pageId: Page["id"], parentId: Node["id"]) => void;

  setActive: (active: Active) => void;
  setActivePage: (activePage: ActivePage) => void;
  // setActiveNode: (activeNode: ActiveNode) => void;
  // setActivePage: (activePage: ActivePage) => void;

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

const defaultPage = createDefaultPage("Introduction");
const defaultInitialBuilderState: InitialBuilderState = {
  pages: { [defaultPage.id]: defaultPage },
  pagesOrder: [defaultPage.id],
};

export function createBuilderStore(
  initialBuilderState = defaultInitialBuilderState,
) {
  const store = createStore<BuilderStore>((set) => ({
    active: {
      node: {
        id: defaultPage.rootId,
        type: defaultPage.nodes[defaultPage.rootId]!.type,
      },
      page: {
        id: defaultPage.id,
      },
    },
    pages: initialBuilderState.pages,
    pagesOrder: initialBuilderState.pagesOrder,
    // core actions
    addPage: (pageLabel) => {
      const page = createDefaultPage(pageLabel);
      set((state) => ({
        pages: {
          ...state.pages,
          [page.id]: page,
        },
        pagesOrder: [...state.pagesOrder, page.id],
        active: {
          page: {
            id: page.id,
          },
          node: {
            id: page.rootId,
            type: page.nodes[page.rootId]!.type,
          },
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
          active: {
            page: state.active.page?.id === pageId ? null : state.active.page,
            node: null,
          },
        };
      });
    },
    addContainer: (pageId, parentId) => {
      console.log("add container");
      set((state) => {
        const page = state.pages[pageId];
        console.log("add container", { page });
        if (!page) return state;
        const newPage = structuredClone(page);

        newPage["containerCount"]++;
        const newContainer: ContainerNode = {
          id: generateComponentId("container"),
          type: "container",
          label: `Container ${newPage["containerCount"]}`,
          orientation: "vertical",
          children: [],
        };
        const parentLayout = newPage.layout[parentId];
        if (!parentLayout) return state;

        // Update layout tree
        parentLayout.children.push(newContainer.id);
        newPage.layout[newContainer.id] = {
          parentId,
          children: [],
        };
        // update parent node children
        const parentContainerNode = newPage.nodes[parentId] as ContainerNode;
        if (parentContainerNode && parentContainerNode.type === "container") {
          parentContainerNode.children.push(newContainer.id);
        }
        newPage.nodes[newContainer.id] = newContainer;
        console.log({ newPage });
        return {
          pages: {
            ...state.pages,
            [pageId]: newPage,
          },
        };
      });
    },
    updateContainer: (pageId, containerId, updates) => {
      set((state) => {
        const page = state.pages[pageId];
        if (!page) return state;

        const newPage = structuredClone(page);
        const containerNode = newPage.nodes[containerId] as ContainerNode;

        if (!containerNode || containerNode.type !== "container") return state;

        containerNode.label = updates.label ?? containerNode.label;
        containerNode.orientation =
          updates.orientation ?? containerNode.orientation;
        return {
          pages: {
            ...state.pages,
            [pageId]: newPage,
          },
        };
      });
    },
    // emptyContainer: (pageId, containerId) => {
    //   set((state) => {
    //     const page = state.pages[pageId];
    //     if (!page) return state;

    //     const newPage = structuredClone(page);
    //     const layoutNode = newPage.layout[containerId];
    //     const node = newPage.nodes[containerId];

    //     if (!node || !layoutNode || node.type !== "container") return state;

    //     // Recursively delete this node and its entire subtree
    //     deleteSubtree(containerId, newPage);

    //     return {
    //       pages: {
    //         ...state.pages,
    //         [pageId]: newPage,
    //       },
    //     };
    //   });
    // },
    addField: (pageId, containerId, fieldType) => {
      console.log("add field");
      set((state) => {
        const page = state.pages[pageId];
        if (!page) return state;
        const newPage = structuredClone(page);
        const containerLayout = newPage.layout[containerId];
        if (!containerLayout) return state;
        newPage["fieldCount"]++;
        const newField = createDefaultField(fieldType, newPage["fieldCount"]);

        // 1. Add field to layout (needed for deleteNode traversal)
        newPage.layout[newField.id] = {
          parentId: containerId,
          children: [],
        };

        // 2. Add field id to the layout's children list
        containerLayout.children.push(newField.id);

        // 3. Add field id to the ContainerNode's node.children — this is what ContainerNode renders
        const containerNode = newPage.nodes[containerId] as ContainerNode;
        if (containerNode?.type === "container") {
          containerNode.children.push(newField.id);
        }

        // 4. Add the field node itself
        newPage.nodes[newField.id] = newField;
        return {
          pages: {
            ...state.pages,
            [pageId]: newPage,
          },
        };
      });
    },
    deleteNode: (pageId, nodeId) => {
      set((state) => {
        const page = state.pages[pageId];
        if (!page) return state;

        const newPage = structuredClone(page);
        const layoutNode = newPage.layout[nodeId];
        const node = newPage.nodes[nodeId];

        if (!node || !layoutNode) return state;

        // Get the actual parent layout entry (not the node itself)
        const parentLayoutNode = newPage.layout[layoutNode.parentId!];
        if (!parentLayoutNode) return state;

        // Remove nodeId from parent's children in layout
        parentLayoutNode.children = parentLayoutNode.children.filter(
          (id) => id !== nodeId,
        );

        // Also remove from parent ContainerNode's node.children (used for rendering)
        const parentNode = newPage.nodes[layoutNode.parentId!];
        if (parentNode?.type === "container") {
          (parentNode as ContainerNode).children = (
            parentNode as ContainerNode
          ).children.filter((id) => id !== nodeId);
        }

        // Recursively delete this node and its entire subtree
        deleteSubtree(nodeId, newPage);

        return {
          pages: {
            ...state.pages,
            [pageId]: newPage,
          },
          active: {
            ...state.active,
            node: state.active.node?.id === nodeId ? null : state.active.node,
          },
        };
      });
    },
    // side actions
    setActive: (active) => {
      set((state) => ({
        active: {
          ...state.active,
          ...active,
        },
      }));
    },
    setActivePage: (activePage) => {
      set((state) => {
        const page = activePage ? state.pages[activePage.id] : null;
        return {
          active: {
            page: activePage,
            node: activePage
              ? {
                  id: page!.rootId,
                  type: page!.nodes[page!.rootId]!.type,
                }
              : null,
          },
        };
      });
    },
    // setActiveNode: (activeNode) => {
    //   set({
    //     activeNode,
    //   });
    // },
  }));

  return store;
}

const deleteSubtree = (id: string, page: Page) => {
  const nodeLayout = page.layout[id];
  if (!nodeLayout) return;
  // Recursively delete all children first
  const children = [...nodeLayout.children];
  children.forEach((childId) => deleteSubtree(childId, page));
  // Delete from both layout and nodes maps
  delete page.layout[id];
  delete page.nodes[id];
};
