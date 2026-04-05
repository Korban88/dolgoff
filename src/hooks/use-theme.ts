"use client";

import { useEffect, useState } from "react";

export type Theme = "light" | "dark";

const STORAGE_KEY = "dolgoff-theme";
const THEME_EVENT = "dolgoff-theme-change";

function applyTheme(next: Theme) {
  localStorage.setItem(STORAGE_KEY, next);
  document.documentElement.setAttribute("data-theme", next);
  window.dispatchEvent(new CustomEvent<Theme>(THEME_EVENT, { detail: next }));
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as Theme | null;
    const attr = document.documentElement.getAttribute("data-theme") as Theme | null;
    const initial: Theme = stored ?? attr ?? "dark";
    setTheme(initial);

    const handler = (e: Event) => {
      setTheme((e as CustomEvent<Theme>).detail);
    };
    window.addEventListener(THEME_EVENT, handler);
    return () => window.removeEventListener(THEME_EVENT, handler);
  }, []);

  const toggle = () => applyTheme(theme === "light" ? "dark" : "light");
  const set = (t: Theme) => applyTheme(t);

  return { theme, toggle, set };
}
