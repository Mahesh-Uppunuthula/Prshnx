import {
  BuilderStore,
  createBuilderStore,
  InitialBuilderState,
} from "@/store/builder.store";
import { createContext, PropsWithChildren, useState } from "react";
import { StoreApi } from "zustand";

export const BuilderContext = createContext<StoreApi<BuilderStore> | undefined>(
  undefined,
);

type BuilderProviderProps = PropsWithChildren & {
  initialBuilderState?: InitialBuilderState;
};
export const BuilderProvider = ({
  initialBuilderState,
  children,
}: BuilderProviderProps) => {
  const [store] = useState(() => createBuilderStore(initialBuilderState));
  return (
    <BuilderContext.Provider value={store}>{children}</BuilderContext.Provider>
  );
};
