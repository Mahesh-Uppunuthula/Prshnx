import { useEffect, useRef } from "react";

export function useOutsideClick<T extends HTMLElement>(
  handler: (event: Event) => void
) {
  const ref = useRef<T>(null);

  useEffect(() => {
    function listener(event: Event) {
      const el = ref.current;
      if (!el || el.contains(event.target as Node)) return;
      handler(event);
    }

    document.addEventListener("pointerdown", listener);
    return () => {
      document.removeEventListener("pointerdown", listener);
    };
  }, [handler]);

  return ref;
}
