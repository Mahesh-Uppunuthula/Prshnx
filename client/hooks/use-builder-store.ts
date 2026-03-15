import { BuilderContext } from "@/context/BuilderProvider";
import { BuilderStore } from "@/store/builder.store";
import { useContext } from "react";
import { useStore } from "zustand";

export const useBuilderStore = <T>(selector: (state: BuilderStore) => T) => {
  const store = useContext(BuilderContext);
  if (!store)
    throw new Error("useBuilderStore must be used within BuilderProvider");
  return useStore(store, selector);
};
