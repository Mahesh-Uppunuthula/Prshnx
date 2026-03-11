import { create } from "zustand";
import { nanoid } from "nanoid";
import { BuilderNode, BuilderState } from "@/types/new-form-builder.types";

type ActiveNode = Pick<BuilderNode, "id" | "type" | "parentId">;
type State = {
  past: BuilderState[];
  present: BuilderState;
  future: BuilderState[];
  activeNode: ActiveNode | null;
};

type Actions = {
  setActiveNode: (node: ActiveNode) => void;
  addField: (parentId: string, fieldType: string, label: string) => void;
  addContainer: (parentId: string, direction: "row" | "column") => void;
  changeContainerDirection: (
    nodeId: string,
    direction: "row" | "column",
  ) => void;
  moveNode: (nodeId: string, newParentId: string, overId?: string) => void;
  deleteNode: (nodeId: string) => void;
  wrapNodes: (nodeIds: string[], direction: "row" | "column") => void;
  commit: (newPresent: BuilderState) => void;
  undo: () => void;
  redo: () => void;
};
type Store = State & Actions;

const initialState: BuilderState = {
  rootId: "root",
  nodes: {
    root: {
      id: "root",
      type: "container",
      direction: "column",
      parentId: null,
      children: [],
    },
  },
};

// --- Helpers ---

const isDescendant = (
  nodes: Record<string, BuilderNode>,
  parentId: string,
  nodeId: string,
): boolean => {
  let current = nodes[parentId]?.parentId;
  while (current) {
    if (current === nodeId) return true;
    current = nodes[current]?.parentId || null;
  }
  return false;
};

const removeFromParent = (
  nodes: Record<string, BuilderNode>,
  nodeId: string,
) => {
  const node = nodes[nodeId];
  if (!node || !node.parentId) return;

  const parent = nodes[node.parentId];
  if (parent && parent.type === "container") {
    parent.children = parent.children.filter((id) => id !== nodeId);
  }
};

export const useBuilderStore = create<Store>((set, get) => ({
  past: [],
  present: initialState,
  future: [],
  activeNode: {
    id: initialState.rootId,
    type: initialState.nodes[initialState.rootId]!.type,
    parentId: initialState.nodes[initialState.rootId]!.parentId,
  },

  setActiveNode: (node: ActiveNode) => {
    set({ activeNode: node });
  },

  // 🔥 Utility to commit state (for undo support)
  commit: (newPresent: BuilderState) => {
    const { past, present } = get();
    set({
      past: [...past, present],
      present: newPresent,
      future: [],
    });
  },

  // ✅ Add Field
  addField: (parentId, fieldType, label) => {
    const { present } = get();
    const parent = present.nodes[parentId];
    if (!parent || parent.type !== "container") return;

    const newId = nanoid();
    const newState = structuredClone(present);

    newState.nodes[newId] = {
      id: newId,
      type: "field",
      fieldType,
      label,
      parentId,
    };

    const newParent = newState.nodes[parentId];
    if (newParent && newParent.type === "container") {
      newParent.children.push(newId);
    }

    get().commit(newState);
  },

  // ✅ Add Container
  addContainer: (parentId, direction) => {
    const { present } = get();
    const parent = present.nodes[parentId];
    if (!parent || parent.type !== "container") return;

    const newId = nanoid();
    const newState = structuredClone(present);

    newState.nodes[newId] = {
      id: newId,
      type: "container",
      direction,
      parentId,
      children: [],
    };

    const newParent = newState.nodes[parentId];
    if (newParent && newParent.type === "container") {
      newParent.children.push(newId);
    }

    get().commit(newState);
    set({ activeNode: { id: newId, type: "container", parentId } });
  },

  changeContainerDirection: (nodeId, direction) => {
    const { present } = get();
    const node = present.nodes[nodeId];
    if (!node || node.type !== "container") return;

    const newState = structuredClone(present);
    const targetNode = newState.nodes[nodeId];
    if (targetNode && targetNode.type === "container") {
      targetNode.direction = direction;
    }

    get().commit(newState);
  },

  // ✅ Move Node (reorder + reparent)
  moveNode: (nodeId, newParentId, overId) => {
    if (nodeId === "root") return;

    const { present } = get();
    const node = present.nodes[nodeId];
    const newParent = present.nodes[newParentId];

    if (!node || !newParent || newParent.type !== "container") return;

    // Prevent circular drop: node cannot be moved into its own descendant
    if (isDescendant(present.nodes, newParentId, nodeId)) return;

    const newState = structuredClone(present);

    // Remove from old parent
    removeFromParent(newState.nodes, nodeId);

    // Add to new parent
    const targetParent = newState.nodes[newParentId];
    if (targetParent && targetParent.type === "container") {
      if (overId && targetParent.children.includes(overId)) {
        const index = targetParent.children.indexOf(overId);
        targetParent.children.splice(index, 0, nodeId);
      } else {
        targetParent.children.push(nodeId);
      }
    }

    const targetNode = newState.nodes[nodeId];
    if (targetNode) {
      targetNode.parentId = newParentId;
    }

    get().commit(newState);
  },

  // ✅ Delete Node + Subtree
  deleteNode: (nodeId) => {
    if (nodeId === "root") return;

    const { present } = get();
    if (!present.nodes[nodeId]) return;

    const newState = structuredClone(present);

    // Remove from parent
    removeFromParent(newState.nodes, nodeId);

    const deleteSubtree = (id: string) => {
      const n = newState.nodes[id];
      if (!n) return;

      if (n.type === "container") {
        const children = [...n.children];
        children.forEach(deleteSubtree);
      }
      delete newState.nodes[id];
    };

    deleteSubtree(nodeId);
    get().commit(newState);
  },

  // ✅ Wrap Multiple Nodes
  wrapNodes: (nodeIds, direction) => {
    const firstNodeId = nodeIds[0];
    if (!firstNodeId || nodeIds.includes("root")) return;

    const { present } = get();
    const firstNode = present.nodes[firstNodeId];
    if (!firstNode || !firstNode.parentId) return;

    const parentId = firstNode.parentId;
    const parentNode = present.nodes[parentId];
    if (!parentNode || parentNode.type !== "container") return;

    const insertIndex = parentNode.children.indexOf(firstNodeId);

    const newState = structuredClone(present);
    const wrapperId = nanoid();

    // Create wrapper
    newState.nodes[wrapperId] = {
      id: wrapperId,
      type: "container",
      direction,
      parentId,
      children: [...nodeIds],
    };

    // Remove nodes from their current parents and update their parentId
    nodeIds.forEach((id) => {
      const n = newState.nodes[id];
      if (n) {
        removeFromParent(newState.nodes, id);
        n.parentId = wrapperId;
      }
    });

    // Add wrapper to the parent of the first node at its original position
    const targetParent = newState.nodes[parentId];
    if (targetParent && targetParent.type === "container") {
      if (insertIndex > -1) {
        targetParent.children.splice(insertIndex, 0, wrapperId);
      } else {
        targetParent.children.push(wrapperId);
      }
    }

    get().commit(newState);
  },

  // 🔁 Undo
  undo: () => {
    const { past, present, future } = get();
    if (!past.length) return;

    const previous = past[past.length - 1];

    set({
      past: past.slice(0, -1),
      present: previous,
      future: [present, ...future],
    });
  },

  // 🔁 Redo
  redo: () => {
    const { past, present, future } = get();
    if (!future.length) return;

    const next = future[0];

    set({
      past: [...past, present],
      present: next,
      future: future.slice(1),
    });
  },
}));
