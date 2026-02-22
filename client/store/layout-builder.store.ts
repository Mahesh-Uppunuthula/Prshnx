import { cloneMapAnd } from "@/lib/helper";
import { create } from "zustand";

export type NodeType = "row" | "column" | "field";

export type Node = {
  id: string;
  type: NodeType;
  children?: Node[];
};

export type Structure = {
  id: string;
  type: NodeType;
  children?: Node[];
};

const initialStructure: Structure = {
  id: "root",
  type: "column",
  children: [],
};

type LayoutBuilderState = {
  selectedNodeId: string | null;
  structure: Structure;
  fields: Map<string, any>;
};
type LayoutBuilderActions = {
  setSelectedNodeId: (id: string | null) => void;
  setField: (id: string, value: any) => void;
  deleteField: (id: string) => void;
  // updateFieldProperties: (id: string, properties: Partial<any>) => void;
};

type LayoutBuilderStore = LayoutBuilderState & LayoutBuilderActions;

export const layoutBuilderStore = create<LayoutBuilderStore>((set) => ({
  selectedNodeId: null,
  structure: initialStructure,
  fields: new Map(),
  setSelectedNodeId: (id) => set({ selectedNodeId: id }),
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
