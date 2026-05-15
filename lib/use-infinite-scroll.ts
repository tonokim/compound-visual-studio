"use client";

import { useEffect, useRef } from "react";

function findScrollableParent(el: Element | null): Element | null {
  let cur: Element | null = el?.parentElement ?? null;
  while (cur && cur !== document.body) {
    const overflowY = getComputedStyle(cur).overflowY;
    if (overflowY === "auto" || overflowY === "scroll") return cur;
    cur = cur.parentElement;
  }
  return null;
}

export function useInfiniteScroll<T extends HTMLElement>(
  onIntersect: () => void,
  enabled: boolean
) {
  const ref = useRef<T | null>(null);
  const callbackRef = useRef(onIntersect);

  useEffect(() => {
    callbackRef.current = onIntersect;
  });

  useEffect(() => {
    if (!enabled) return;
    const node = ref.current;
    if (!node) return;

    const root = findScrollableParent(node);
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) callbackRef.current();
        }
      },
      { root, rootMargin: "200px" }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [enabled]);

  return ref;
}
