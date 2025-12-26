import { create, type StateCreator } from "zustand";
import { arrayMove } from "@dnd-kit/sortable";
import type {
  ComponentVariants,
  FieldProperties,
  Form,
  FormElement,
  Page,
} from "@/types/form-builder.types";
import { cloneMapAnd, createFormElement } from "@/lib/helper";
import { nanoid } from "nanoid";

export const useActiveFormElement = create<{
  activeFormElementId: string | null;
  setActiveFormElementId: (id: string | null) => void;
}>((set) => ({
  activeFormElementId: null,
  setActiveFormElementId: (id) => set({ activeFormElementId: id }),
}));

type FormHeaderActions = {
  setField: <k extends keyof Form["header"]>(
    fieldName: k,
    value: Form["header"][k]
  ) => void;
};
const createFormHeaderSlice: StateCreator<
  Form["header"] & FormHeaderActions
> = (set) => ({
  title: "",
  description: "",
  setField(fieldName, value) {
    set((state) => ({
      ...state,
      [fieldName]: value,
    }));
  },
});

type FormBodyActions = {
  reorder: (sourceIndex: number, destinationIndex: number) => void;
  addElement: (type: ComponentVariants) => void;
  deleteElement: (id: string) => void;
  updateElementProperties: (
    id: string,
    updatedFields: Partial<FieldProperties>
  ) => void;
};
const createFormBodySlice: StateCreator<Form["body"] & FormBodyActions> = (
  set
) => ({
  orderedElementIds: [],
  elements: [],

  reorder: (sourceIndex: number, destinationIndex: number) => {
    set((state) => ({
      // orderedElementIds: arrayMove(
      //   state.orderedElementIds,
      //   sourceIndex,
      //   destinationIndex
      // ),
      elements: arrayMove(state.elements, sourceIndex, destinationIndex),
    }));
  },
  addElement: (type: ComponentVariants) => {
    const newElement: FormElement = createFormElement(type);
    set((state) => ({
      // orderedElementIds: [...state.orderedElementIds, newElement.id],
      elements: [...state.elements, newElement],
    }));
  },
  deleteElement: (id: string) => {
    set((state) => ({
      // orderedElementIds: state.orderedElementIds.filter((item) => item !== id),
      elements: state.elements.filter((item) => item.id !== id),
    }));
  },
  updateElementProperties: (
    id: string,
    updatedFields: Partial<FieldProperties>
  ) => {
    set((state) => {
      const updatedElements = state.elements.map((element) => {
        if (element.id !== id) return element;
        switch (element.type) {
          case "single-line-input": {
            return {
              ...element,
              properties: {
                ...element.properties,
                ...updatedFields,
              },
            };
          }
          case "multi-line-input": {
            return {
              ...element,
              properties: {
                ...element.properties,
                ...updatedFields,
              },
            };
          }
          case "number-input": {
            return {
              ...element,
              properties: {
                ...element.properties,
                ...updatedFields,
              },
            };
          }
          case "date-input": {
            return {
              ...element,
              properties: {
                ...element.properties,
                ...updatedFields,
              },
            };
          }
          case "time-input": {
            return {
              ...element,
              properties: {
                ...element.properties,
                ...updatedFields,
              },
            };
          }
          // case "checkbox": {
          //   return {
          //     ...element,
          //     properties: {
          //       ...element.properties,
          //       ...updatedFields,
          //     },
          //   };
          // }
          // case "radio-button": {
          //   return {
          //     ...element,
          //     properties: {
          //       ...element.properties,
          //       ...updatedFields,
          //     },
          //   };
          // }
          case "selection": {
            return {
              ...element,
              properties: {
                ...element.properties,
                ...updatedFields,
              },
            };
          }
          default:
            return element;
        }
      });
      return { elements: updatedElements };
    });
  },
});

// export const useSingleFormBuilder = create<
export const useFormBuilder = create<
  Form["header"] & Form["body"] & FormHeaderActions & FormBodyActions
>()((...props) => ({
  ...createFormHeaderSlice(...props),
  ...createFormBodySlice(...props),
}));

const emptyPage: Page = {
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
export type MultiPageForm = {
  title: string;
  pages: Map<string, Page>;
  activePageId: Page["id"];
  activeFormElement: {
    id: FormElement["id"];
    type: "cta" | FormElement["type"];
  } | null;

  pageSettings: {
    logo?: string;
    cover?: string;
    /** Thank you page is the last page that respondents will see after submitting the form */
    thankYouPageId?: Page["id"];
  };

  // generic page actions
  addPage: () => void;
  // duplicatePage: (id: string) => void;
  deletePage: (id: string) => void;
  setActivePageId: (id: string) => void;
  setActiveFormElement: (
    id: string,
    type: "cta" | FormElement["type"] | "cta"
  ) => void;

  // page specific actions
  reorderPageElements: (sourceIndex: number, destinationIndex: number) => void;
  setPageHeader: <k extends keyof Page["header"]>(
    fieldName: k,
    value: Page["header"][k]
  ) => void;

  addPageElement: (type: ComponentVariants) => void;
  deletePageElement: (id: string) => void;
  updatePageElementProperties: (
    id: string,
    updatedFields: Partial<FieldProperties>
  ) => void;

  // page action
  updatePageAction: (updatedFields: Partial<Page["action"]["cta"]>) => void;

  updatePageSettings: (
    updatedFields: Partial<MultiPageForm["pageSettings"]>
  ) => void;

  setTitle: (title: string) => void;
};

/**
 * This store is used to create a multi-page form
 * Assumes that the first page is always the active page by default
 * Has at least one page
 */
export const useMultiPageFormBuilder = create<MultiPageForm>()((set, get) => ({
  title: "Untitled Form",
  pages: new Map([[emptyPage.id, emptyPage]]),
  activePageId: emptyPage.id,
  activeFormElement: null,

  pageSettings: {
    cover: undefined,
    logo: undefined,
    thankYouPageId: undefined,
  },
  setActivePageId: (pageId: string) => {
    set((state) => {
      if (!state.pages.has(pageId)) return state;
      return {
        activePageId: pageId,
      };
    });
  },
  setActiveFormElement: (
    id: FormElement["id"],
    type: "cta" | FormElement["type"]
  ) => {
    set({
      activeFormElement: {
        id: id,
        type: type,
      },
    });
  },
  /** TODO
   * When a page is added make the new page the last page and make the page action as submit
   * and rest cta's as next unless there is a custom cta name
   */
  addPage: () => {
    const pageId = generatePageId();
    const newPage = structuredClone(emptyPage);
    newPage.id = pageId;
    set((state) => {
      const newPages = new Map<string, Page>();
      state.pages.forEach((page) => {
        const updatedPage = structuredClone(page);
        /** update all page cta to Next with hasArrow true if there is no custom cta name */
        if (
          !updatedPage.action.cta.label ||
          updatedPage.action.cta.label === "Submit"
        ) {
          updatedPage.action.cta.label = "Next";
          updatedPage.action.cta.hasArrow = true;
        }
        newPages.set(updatedPage.id, updatedPage);
      });
      newPages.set(pageId, newPage);
      return {
        pages: newPages,
        activePageId: pageId,
      };
    });
  },

  // duplicatePage: (pageId: string) => {
  //   const duplicatePage = structuredClone(get().pages.get(pageId)!);
  //   const newPageId = generatePageId();
  //   duplicatePage.id = newPageId;
  //   /**
  //    * TODO
  //    * depending on the page's index in the list adjust the CTA
  //    * add the duplicate page right after the current page in the list
  //    * think about the element id's, cannot clone element with same ids
  //    */
  //   set((state) => {
  //     const newPages = new Map<string, Page>();
  //     // update page CTA's
  //     state.pages.forEach((page) => {
  //       const updatedPage = structuredClone(page);
  //       /** update all page cta to Next with hasArrow true if there is no custom cta name */
  //       if (
  //         !updatedPage.action.cta.label ||
  //         updatedPage.action.cta.label === "Submit"
  //       ) {
  //         updatedPage.action.cta.label = "Next";
  //         updatedPage.action.cta.hasArrow = true;
  //       }
  //       newPages.set(updatedPage.id, updatedPage);
  //     });

  //     // set the new page as the last page
  //     newPages.set(newPageId, duplicatePage);
  //     return {
  //       pages: newPages,
  //       activePageId: newPageId,
  //     };
  //   });
  // },

  deletePage: (pageId: string) => {
    set((state) => {
      /** don't delete the last page */
      if (state.pages.size === 1) return state;
      const postDeletePages = cloneMapAnd(state.pages, (pages) =>
        pages.delete(pageId)
      );
      const [lastEntryKey, lastEntryValue] = [...postDeletePages].pop()!;

      console.log({ lastEntryKey, lastEntryValue });

      // make the last page CTA as submit
      const updatedPages = cloneMapAnd(postDeletePages, (pages) => {
        pages.set(lastEntryKey, {
          ...lastEntryValue,
          action: {
            ...lastEntryValue.action,
            cta: {
              ...lastEntryValue.action.cta,
              label: (() => {
                if (
                  postDeletePages.size > 1 &&
                  lastEntryValue.action.cta.label &&
                  lastEntryValue.action.cta.label !== "Submit"
                ) {
                  // don't make the last page CTA as submit
                  return lastEntryValue.action.cta.label;
                }
                // make the last page CTA or fallback as submit
                return "Submit";
              })(),
              hasArrow: false,
            },
          },
        });
      });
      return {
        pages: updatedPages,
        /** default to first page */
        activePageId: updatedPages.keys().next().value,
      };
    });
  },
  setPageHeader: <k extends keyof Page["header"]>(
    fieldName: k,
    value: Page["header"][k]
  ) => {
    set((state) => ({
      pages: updateMap(state.pages, get().activePageId, (page) => ({
        ...page,
        header: {
          ...page.header,
          [fieldName]: value,
        },
      })),
    }));
  },

  reorderPageElements: (sourceIndex: number, destinationIndex: number) => {
    set((state) => ({
      pages: updateMap(state.pages, get().activePageId, (page) => ({
        ...page,
        body: {
          ...page.body,
          elements: arrayMove(
            page.body.elements,
            sourceIndex,
            destinationIndex
          ),
          // orderedElementIds: arrayMove(
          //   page.body.orderedElementIds,
          //   sourceIndex,
          //   destinationIndex
          // ),
        },
      })),
    }));
  },
  addPageElement: (type: ComponentVariants) => {
    const newElement: FormElement = createFormElement(type);
    set((state) => ({
      pages: updateMap(state.pages, get().activePageId, (page) => ({
        ...page,
        body: {
          elements: [...page.body.elements, newElement],
          // orderedElementIds: [...page.body.orderedElementIds, newElement.id],
        },
      })),
      activeFormElement: { id: newElement.id, type: newElement.type },
    }));
  },
  deletePageElement: (elementId: string) => {
    set((state) => {
      const activePageElements = get().pages.get(get().activePageId)!.body
        .elements;
      const filteredPageElements = activePageElements.filter(
        (item) => item.id !== elementId
      );
      console.log(
        "activePageElements.length > 0",
        activePageElements,
        activePageElements.length
      );

      return {
        pages: updateMap(state.pages, get().activePageId, (page) => ({
          ...page,
          body: {
            elements: page.body.elements.filter(
              (item) => item.id !== elementId
            ),
            // orderedElementIds: page.body.orderedElementIds.filter(
            //   (item) => item !== elementId
            // ),
          },
        })),
        /** default to first element */
        activeFormElement:
          filteredPageElements.length > 0
            ? {
                id: filteredPageElements[0].id,
                type: filteredPageElements[0].type,
              }
            : null,
      };
    });
  },
  updatePageElementProperties: (
    elementId: string,
    updatedFields: Partial<FieldProperties>
  ) => {
    set((state) => ({
      pages: updateMap(state.pages, get().activePageId, (page) => ({
        ...page,
        body: {
          ...page.body,
          elements: page.body.elements.map((element) => {
            console.log("element.id", element.id, elementId);

            if (element.id !== elementId) return element;
            switch (element.type) {
              case "single-line-input":
                return {
                  ...element,
                  properties: {
                    ...element.properties,
                    ...updatedFields,
                  },
                };
              case "multi-line-input":
                return {
                  ...element,
                  properties: {
                    ...element.properties,
                    ...updatedFields,
                  },
                };
              case "number-input":
                return {
                  ...element,
                  properties: {
                    ...element.properties,
                    ...updatedFields,
                  },
                };
              case "date-input":
                return {
                  ...element,
                  properties: {
                    ...element.properties,
                    ...updatedFields,
                  },
                };
              case "time-input":
                return {
                  ...element,
                  properties: {
                    ...element.properties,
                    ...updatedFields,
                  },
                };
              case "selection":
                return {
                  ...element,
                  properties: {
                    ...element.properties,
                    ...updatedFields,
                  },
                };

              default:
                return element;
            }
          }),
        },
      })),
    }));
  },
  updatePageAction: (updatedField: Partial<Page["action"]["cta"]>) => {
    set((state) => ({
      pages: updateMap(state.pages, get().activePageId, (page) => ({
        ...page,
        action: {
          ...page.action,
          cta: {
            ...page.action.cta,
            ...updatedField,
          },
        },
      })),
    }));
  },
  updatePageSettings: (
    updatedField: Partial<MultiPageForm["pageSettings"]>
  ) => {
    set((state) => ({
      pageSettings: {
        ...state.pageSettings,
        ...updatedField,
      },
    }));
  },
  setTitle: (title: string) =>
    set({
      title,
    }),
}));

export const useActivePage = () =>
  useMultiPageFormBuilder((state) => {
    const page = state.pages.get(state.activePageId)!;
    return page;
  });

function updateMap<K, V>(map: Map<K, V>, id: K, fn: (value: V) => V) {
  const clone = new Map(map);
  const val = clone.get(id);
  if (val === undefined) return clone;
  return clone.set(id, fn(val));
}

function generatePageId() {
  return `page-${nanoid()}`;
}

// const x: <k extends keyof Page>(id: string, options?: { [P in k]: true }) => void = ("asdf", {}) => {

// }
// const x: { [k in keyof Page]?: true } = {
//   id: true,
// };

// export type MultiPageForm = {
//   pages: Map<string, Page>;
//   activePageId: Page["id"];

//   // generic page actions
//   addPage: () => void;
//   deletePage: (id: string) => void;
//   setActivePageId: (id: string) => void;
//   // getPage: <k extends keyof Page>(
//   //   id: string,
//   //   options?: { [k in keyof Page]?: boolean }
//   // ) => Page | Record<k, Page[k]> | undefined;
//   getActivePage: () => Page;

//   // page specific actions
//   reorderPageElements: (
//     pageId: string,
//     sourceIndex: number,
//     destinationIndex: number
//   ) => void;
//   setPageHeader: <k extends keyof Page["header"]>(
//     pageId: string,
//     fieldName: k,
//     value: Page["header"][k]
//   ) => void;

//   addPageElement: (pageId: string, type: ComponentVariants) => void;
//   deletePageElement: (pageId: string, id: string) => void;
//   updatePageElementProperties: (
//     pageId: string,
//     id: string,
//     updatedFields: Partial<FieldProperties>
//   ) => void;
// };

// export const useMultiPageFormBuilder = create<MultiPageForm>()((set, get) => ({
//   pages: new Map([[emptyPage.id, emptyPage]]),
//   activePageId: emptyPage.id,

//   setActivePageId: (id: string) => {
//     set((state) => ({
//       /** if page with id doesn't exist, fallback to previously active page id */
//       activePageId: state.pages.has(id) ? id : state.activePageId,
//     }));
//   },
//   addPage: () => {
//     const pageId = generatePageId();
//     const newPage: Page = {
//       id: pageId,
//       header: {
//         title: "Untitled Form",
//         description: "",
//       },
//       body: {
//         orderedElementIds: [],
//         elements: [],
//       },
//     };
//     set((state) => ({
//       pages: state.pages.set(pageId, newPage),
//       activePage: newPage,
//     }));
//   },
//   deletePage: (id: string) => {
//     set((state) => {
//       const updatedPages = cloneMapAnd(state.pages, (pages) =>
//         pages.delete(id)
//       );
//       return {
//         pages: updatedPages,
//         activePage: updatedPages.values().next()
//           .value /** default to first page */,
//       };
//     });
//   },
//   setPageHeader: <k extends keyof Page["header"]>(
//     pageId: string,
//     fieldName: k,
//     value: Page["header"][k]
//   ) => {
//     set((state) => ({
//       pages: updateMap(state.pages, pageId, (page) => ({
//         ...page,
//         header: {
//           ...page.header,
//           [fieldName]: value,
//         },
//       })),
//     }));
//   },

//   reorderPageElements: (
//     pageId: string,
//     sourceIndex: number,
//     destinationIndex: number
//   ) => {
//     set((state) => ({
//       pages: updateMap(state.pages, pageId, (page) => ({
//         ...page,
//         body: {
//           ...page.body,
//           elements: arrayMove(
//             page.body.elements,
//             sourceIndex,
//             destinationIndex
//           ),
//           orderedElementIds: arrayMove(
//             page.body.orderedElementIds,
//             sourceIndex,
//             destinationIndex
//           ),
//         },
//       })),
//     }));
//   },
//   addPageElement: (pageId: string, type: ComponentVariants) => {
//     const newElement: FormElement = createFormElement(type);
//     console.log({ newElement });
//     set((state) => ({
//       pages: updateMap(state.pages, pageId, (page) => ({
//         ...page,
//         body: {
//           elements: [...page.body.elements, newElement],
//           orderedElementIds: [...page.body.orderedElementIds, newElement.id],
//         },
//       })),
//     }));
//   },
//   deletePageElement: (pageId: string, id: string) => {
//     set((state) => {
//       return {
//         pages: updateMap(state.pages, pageId, (page) => ({
//           ...page,
//           body: {
//             elements: page.body.elements.filter((item) => item.id !== id),
//             orderedElementIds: page.body.orderedElementIds.filter(
//               (item) => item !== id
//             ),
//           },
//         })),
//       };
//     });
//   },
//   updatePageElementProperties: (
//     pageId: string,
//     id: string,
//     updatedFields: Partial<FieldProperties>
//   ) => {
//     set((state) => ({
//       pages: updateMap(state.pages, pageId, (page) => ({
//         ...page,
//         body: {
//           ...page.body,
//           elements: page.body.elements.map((element) => {
//             if (element.id !== id) return element;
//             switch (element.type) {
//               case "single-line-input":
//                 return {
//                   ...element,
//                   properties: {
//                     ...element.properties,
//                     ...updatedFields,
//                   },
//                 };
//               case "multi-line-input":
//                 return {
//                   ...element,
//                   properties: {
//                     ...element.properties,
//                     ...updatedFields,
//                   },
//                 };
//               case "number-input":
//                 return {
//                   ...element,
//                   properties: {
//                     ...element.properties,
//                     ...updatedFields,
//                   },
//                 };
//               case "date-input":
//                 return {
//                   ...element,
//                   properties: {
//                     ...element.properties,
//                     ...updatedFields,
//                   },
//                 };
//               case "time-input":
//                 return {
//                   ...element,
//                   properties: {
//                     ...element.properties,
//                     ...updatedFields,
//                   },
//                 };
//               case "selection":
//                 return {
//                   ...element,
//                   properties: {
//                     ...element.properties,
//                     ...updatedFields,
//                   },
//                 };

//               default:
//                 return element;
//             }
//           }),
//         },
//       })),
//     }));
//   },

//   // getActivePage: <k extends keyof Page>(
//   //   pageId: string,
//   //   options?: { [k in keyof Page]?: boolean }
//   // ): Page | Record<k, Page[k]> | undefined => {
//   //   const { pages, activePageId } = get();
//   //   const id = pageId ?? activePageId;

//   //   const page = pages.get(id);
//   //   if (!page) return;
//   //   if (!options) return page;

//   //   const customPage = Object.entries(page).reduce(
//   //     (_customPageObj: Page, [propertyName]) => {
//   //       if (options[propertyName as keyof Page])
//   //         return {
//   //           ..._customPageObj,
//   //           [propertyName]: page[propertyName as keyof Page],
//   //         };

//   //       return _customPageObj;
//   //     },
//   //     {} as Page
//   //   );
//   //   return customPage;
//   // },
//   getActivePage: () => {
//     return get().pages.get(get().activePageId) ?? emptyPage;
//   },
// }));

// const fun: <k in keyof Page>(
//   id: string,
//   options?: { []?: boolean }
//   // options?: { [P in k]: true }
//   // options?: Pick<Page, k>
// ) => Page[Props] = (id, options) => {
//   if (!options) return;
//   // if (options.) {
//   //   //
//   // }
// };

// const x = fun("asdf", {id: true})
