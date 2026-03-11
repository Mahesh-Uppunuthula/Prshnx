import { cloneMapAnd } from "@/lib/helper";
import { create } from "zustand";
import { nanoid } from "nanoid";

export type NodeAlign = "horizontal" | "vertical";

export type Node = {
  id: string;
  align?: NodeAlign;
  children: Node[];
};

export type Structure = {
  id: string;
  align?: NodeAlign;
  children: Node[];
};

type selectedNodeProperties = Pick<Structure, "id" | "align">;
export type LayoutBuilderState = {
  selectedNode: selectedNodeProperties | null;
  structure: Structure;
  /**
   * formSectionId -> section_id
   */
  fields: Map<string, any>;
};
export type LayoutBuilderActions = {
  /**
   * Add section
   * Delete section
   * update section - change name, direction, styling {border-(sides, radius), padding, margin, background {color, gradient, image}, }
   *
   * add section - take name, parent-section name selection, direction
   */

  setSelectedNode: (nodeProperties: selectedNodeProperties) => void;
  splitSection: (id: string, orientation: "horizontal" | "vertical") => void;
  deleteSection: (id: string) => void;
  setField: (id: string, value: any) => void;
  deleteField: (id: string) => void;
  // updateFieldProperties: (id: string, properties: Partial<any>) => void;
};

export type LayoutBuilderStore = LayoutBuilderState & LayoutBuilderActions;

const initialStructure: Structure = {
  id: "root",
  align: "vertical",
  children: [],
};
const initialStructure1: Structure = {
  id: "root",
  align: "vertical",
  children: [
    {
      id: "col1",
      align: "vertical",
      children: [
        {
          id: "field1",
          children: [],
        },
        {
          id: "field2",
          children: [],
        },
      ],
    },
    {
      id: "col2",
      align: "vertical",
      children: [],
    },
  ],
};

export const layoutBuilderStore = create<LayoutBuilderStore>((set) => ({
  selectedNode: null,
  structure: initialStructure,
  fields: new Map(),
  setSelectedNode: (nodeProperties: selectedNodeProperties) =>
    set({ selectedNode: nodeProperties }),
  splitSection: (id, orientation) =>
    set((state) => {
      const clonedStructure = structuredClone(state.structure);

      const nodeToMakeChanges =
        id === "root"
          ? clonedStructure
          : clonedStructure.children.find((node) => node.id === id);

      if (!nodeToMakeChanges) {
        return { structure: clonedStructure };
      }
      // Don't split if it already has children and no align (should not happen in this logic but for safety)
      // Actually, splitting means it BECOMES a container.
      // change align
      nodeToMakeChanges.align = orientation;

      if (nodeToMakeChanges.children.length >= 2) {
        return { structure: clonedStructure, selectedNode: nodeToMakeChanges };
      }
      // add sections
      const newSection1: Node = {
        id: nanoid(),
        children: [],
      };
      const newSection2: Node = {
        id: nanoid(),
        children: [],
      };
      /**
       * TODO
       * if empty section exists - add two empty sections as children with orientation
       * if children exists -
       */
      nodeToMakeChanges.children.push(newSection1, newSection2);

      const clonedSelectedNode = structuredClone(state.selectedNode);

      if (clonedSelectedNode?.id === id) {
        clonedSelectedNode.align = orientation;
      }

      console.log({ orientation });
      return { structure: clonedStructure, selectedNode: clonedSelectedNode };
    }),
  deleteSection: (id: string) => {
    if (id === "root") return;
    set((state) => {
      const clonedStructure = structuredClone(state.structure);
      return { structure: clonedStructure };
    });
  },
  setField: (id, value) =>
    set((state) => {
      const newFields = cloneMapAnd(state.fields, (newFields) => {
        newFields.set(id, value);
      });
      console.log("Updated fields:", newFields);
      return { fields: newFields };
    }),
  deleteField: (id) =>
    set((state) => {
      const newFields = cloneMapAnd(state.fields, (newFields) => {
        newFields.delete(id);
      });
      console.log("Updated fields:", newFields);
      return { fields: newFields };
    }),
}));
