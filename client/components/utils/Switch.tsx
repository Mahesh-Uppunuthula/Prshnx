import type { ReactNode } from "react";

type SwitchType<T extends string | number> = {
  when: T;
  cases: Record<T, ReactNode | (() => ReactNode)>;
  fallback?: ReactNode;
};
function Switch<T extends string | number>({
  when,
  cases,
  fallback,
}: SwitchType<T>): ReactNode {
  const Element = cases[when];
  if (typeof Element === "function") {
    return (Element as () => ReactNode)();
  }
  return Element ?? fallback ?? null;
}

export default Switch;
