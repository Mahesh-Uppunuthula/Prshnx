import type { JSX } from "react";

type ShowProps<T> = {
  when: T | boolean | null | undefined;
  fallback: JSX.Element;
  children: JSX.Element;
};
export default function Show({ when, children, fallback }: ShowProps<unknown>) {
  return when ? children : fallback;
}
