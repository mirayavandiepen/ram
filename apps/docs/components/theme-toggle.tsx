"use client";

import { type ThemeMode, useTheme } from "@/lib/theme";

import { PRESS } from "./press";

const OPTIONS: { mode: ThemeMode; label: string; icon: React.ReactNode }[] = [
  {
    mode: "system",
    label: "System theme",
    icon: (
      <>
        <rect x="2.5" y="3" width="11" height="8" rx="1.5" />
        <path d="M6 13.5h4" />
      </>
    ),
  },
  {
    mode: "light",
    label: "Light theme",
    icon: (
      <>
        <circle cx="8" cy="8" r="3" />
        <path d="M8 1v1.5M8 13.5V15M15 8h-1.5M2.5 8H1M12.95 3.05l-1.06 1.06M4.11 11.89l-1.06 1.06M12.95 12.95l-1.06-1.06M4.11 4.11L3.05 3.05" />
      </>
    ),
  },
  {
    mode: "dark",
    label: "Dark theme",
    icon: <path d="M13.5 9.2A5.8 5.8 0 0 1 6.8 2.5a5.8 5.8 0 1 0 6.7 6.7z" />,
  },
];

export function ThemeToggle() {
  const { mode, setMode, ready } = useTheme();

  return (
    <div
      role="group"
      aria-label="Theme"
      className="border-border-strong bg-surface flex items-center gap-0.5 rounded-full border p-0.5"
    >
      {OPTIONS.map((option) => {
        const selected = ready && option.mode === mode;
        return (
          <button
            key={option.mode}
            type="button"
            title={option.label}
            aria-label={option.label}
            aria-pressed={selected}
            onClick={() => setMode(option.mode)}
            className={[
              "grid size-7 place-items-center rounded-full",
              PRESS,
              selected
                ? "bg-surface-hover text-foreground"
                : "text-faint hover:text-foreground",
            ].join(" ")}
          >
            <svg
              width="13"
              height="13"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.25"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              {option.icon}
            </svg>
          </button>
        );
      })}
    </div>
  );
}
