"use client";

import { useEffect, useState } from "react";

export type ThemeMode = "system" | "light" | "dark";

export const THEME_STORAGE_KEY = "kerned-theme";

/**
 * Runs in the document head, before anything paints. Any later and the page
 * would show a frame of the wrong theme on every load. Kept as a string rather
 * than a module so it ships inline: a fetched file is a frame too late.
 */
export const THEME_SCRIPT = `(function(){try{
var m=localStorage.getItem("${THEME_STORAGE_KEY}");
if(m!=="light"&&m!=="dark")m=window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";
document.documentElement.dataset.theme=m;
}catch(e){}})();`;

function apply(mode: ThemeMode) {
  const resolved =
    mode === "system"
      ? window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light"
      : mode;
  document.documentElement.dataset.theme = resolved;
}

export function useTheme() {
  const [mode, setMode] = useState<ThemeMode>("system");
  // The server has no way to know the stored choice, so the first render is
  // always "system" and this corrects it. Nothing visual depends on it until
  // `ready` flips, so the control never shows the wrong option as selected.
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(THEME_STORAGE_KEY);
      if (stored === "light" || stored === "dark") setMode(stored);
    } catch {
      // Storage can be unavailable. The system default still applies.
    }
    setReady(true);
  }, []);

  // Only while following the system, and only after mount: the inline script
  // has already resolved the value this listener exists to keep up to date.
  useEffect(() => {
    if (mode !== "system") return;
    const query = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => apply("system");
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, [mode]);

  const change = (next: ThemeMode) => {
    setMode(next);
    apply(next);
    try {
      if (next === "system") localStorage.removeItem(THEME_STORAGE_KEY);
      else localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      // A choice that cannot be stored still applies for this visit.
    }
  };

  return { mode, setMode: change, ready };
}
