import { emptyPage } from "@/lib/constants";
import {
  cloneMapAnd,
  createFormElement,
  generatePageId,
  toMultiPageForm,
  updateMap,
} from "@/lib/helper";
import { MultiPageForm } from "@/store/form-builder.store";
import {
  ComponentVariants,
  FieldProperties,
  FormElement,
  Page,
} from "@/types/form-builder.types";
import { FormConfiguration } from "@/types/form.types";
import { arrayMove } from "@dnd-kit/sortable";
import { createContext, PropsWithChildren, useContext, useState } from "react";
import { createStore, StoreApi, useStore } from "zustand";

const MultiPageFormProviderContext = createContext<
  StoreApi<MultiPageForm> | undefined
>(undefined);

type MultiPageFormProviderProps = PropsWithChildren & {
  initialForm?: FormConfiguration;
};

export function MultiPageFormProvider({
  children,
  initialForm,
}: MultiPageFormProviderProps) {
  console.log("MultiPageFormProvider", { initialForm });
  const mulitPageForm = toMultiPageForm(
    initialForm ?? {
      title: "Untitled Form",
      pages: [emptyPage],
      settings: {
        cover: undefined,
        logo: undefined,
        thankYouPageId: undefined,
      },
    },
  );
  console.log("Inside multipageformprovider ", { mulitPageForm });
  const [store] = useState(() =>
    createStore<MultiPageForm>((set, get) => ({
      title: mulitPageForm.title,
      pages: mulitPageForm.pages,
      activePageId: mulitPageForm.pages.keys().next().value!, // guaranteed to have at least one page
      activeFormElement: null,
      isDirty: false,
      lastSavedForm: {
        title: mulitPageForm.title,
        pages: mulitPageForm.pages,
        activePageId: mulitPageForm.pages.keys().next().value!, // guaranteed to have at least one page
        activeFormElement: null,
        pageSettings: mulitPageForm.pageSettings,
      },
      pageSettings: mulitPageForm.pageSettings,
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
        type: "cta" | FormElement["type"],
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
            isDirty: true, // mark as dirty
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
            pages.delete(pageId),
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
            isDirty: true, // mark as dirty
          };
        });
      },
      setPageHeader: <k extends keyof Page["header"]>(
        fieldName: k,
        value: Page["header"][k],
      ) => {
        set((state) => ({
          pages: updateMap(state.pages, get().activePageId, (page) => ({
            ...page,
            header: {
              ...page.header,
              [fieldName]: value,
            },
          })),
          isDirty: true, // mark as dirty
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
                destinationIndex,
              ),
              // orderedElementIds: arrayMove(
              //   page.body.orderedElementIds,
              //   sourceIndex,
              //   destinationIndex
              // ),
            },
          })),
          isDirty: true, // mark as dirty
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
          isDirty: true, // mark as dirty
        }));
      },
      deletePageElement: (elementId: string) => {
        set((state) => {
          const activePageElements = get().pages.get(get().activePageId)!.body
            .elements;
          const filteredPageElements = activePageElements.filter(
            (item) => item.id !== elementId,
          );
          console.log(
            "activePageElements.length > 0",
            activePageElements,
            activePageElements.length,
          );

          return {
            pages: updateMap(state.pages, get().activePageId, (page) => ({
              ...page,
              body: {
                elements: page.body.elements.filter(
                  (item) => item.id !== elementId,
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
                    id: filteredPageElements[0]!.id,
                    type: filteredPageElements[0]!.type,
                  }
                : null,
            isDirty: true, // mark as dirty
          };
        });
      },
      updatePageElementProperties: (
        elementId: string,
        updatedFields: Partial<FieldProperties>,
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
          isDirty: true, // mark as dirty
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
          isDirty: true, // mark as dirty
        }));
      },
      updatePageSettings: (
        updatedField: Partial<MultiPageForm["pageSettings"]>,
      ) => {
        set((state) => ({
          pageSettings: {
            ...state.pageSettings,
            ...updatedField,
          },
          isDirty: true, // mark as dirty
        }));
      },
      setTitle: (title: string) =>
        set({
          title,
          isDirty: true, // mark as dirty
        }),
      // seedConfiguration: (formConfig: FormConfiguration) => {
      //   console.log("inside seedConfiguration", { formConfig });
      //   const pages: MultiPageForm["pages"] = new Map();
      //   formConfig.pages.forEach((page) => {
      //     pages.set(page.id, page);
      //   });
      //   set({
      //     title: formConfig.title,
      //     pages: pages,
      //     activePageId: pages.keys().next().value, // first page id
      //     activeFormElement: null,
      //     pageSettings: formConfig.settings,
      //   });
      // },
      markSaved: () => {
        set((state) => ({
          isDirty: false,
          lastSavedForm: {
            title: state.title,
            pages: state.pages,
            activePageId: state.activePageId,
            activeFormElement: state.activeFormElement,
            pageSettings: state.pageSettings,
          },
        }));
      },
    })),
  );
  return (
    <MultiPageFormProviderContext.Provider value={store}>
      {children}
    </MultiPageFormProviderContext.Provider>
  );
}

export function useMultiPageFormStore<T>(
  selector: (state: MultiPageForm) => T,
) {
  const store = useContext(MultiPageFormProviderContext);
  console.log({ store });
  if (!store) {
    throw new Error(
      "useMultiPageFormStore must be used within a MultiPageFormProvider",
    );
  }

  return useStore(store, selector);
}
