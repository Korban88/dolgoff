"use client";

import { useEffect, useState } from "react";

export type Theme = "light" | "dark";

const STORAGE_KEY = "dolgoff-theme";

export function useTheme() {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    // Read from localStorage or from the HTML attribute set by ThemeScript
    const stored = localStorage.getItem(STORAGE_KEY) as Theme | null;
    const attr = document.documentElement.getAttribute("data-theme") as Theme;
    const initial = stored ?? attr ?? "light";
    setTheme(initial);
  }, []);

  const toggle = () => {
    const next: Theme = theme === "light" ? "dark" : "light";
    setTheme(next);
    localStorage.setItem(STORAGE_KEY, next);
    document.documentElement.setAttribute("data-theme", next);
  };

  const set = (t: Theme) => {
    setTheme(t);
    localStorage.setItem(STORAGE_KEY, t);
    document.documentElement.setAttribute("data-theme", t);
  };

  return { theme, toggle, set };
}
