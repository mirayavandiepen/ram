"use client";

export type Option<T extends string> = { value: T; label?: string };

export function Segmented<T extends string>({
  value,
  onChange,
  options,
  label,
}: {
  value: T;
  onChange: (value: T) => void;
  options: readonly (T | Option<T>)[];
  label?: string;
}) {
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
      {label ? (
        <span className="w-[72px] shrink-0 text-[13px] text-muted">{label}</span>
      ) : null}
      <div role="group" aria-label={label} className="flex flex-wrap gap-1.5">
        {options.map((option) => {
          const item: Option<T> =
            typeof option === "string" ? { value: option } : option;
          const selected = item.value === value;
          return (
            <button
              key={item.value}
              type="button"
              aria-pressed={selected}
              onClick={() => onChange(item.value)}
              className={[
                "h-7 rounded-full border px-3 text-[13px] leading-none transition-colors duration-150",
                selected
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-surface text-foreground hover:bg-surface-hover",
              ].join(" ")}
            >
              {item.label ?? item.value}
            </button>
          );
        })}
      </div>
    </div>
  );
}
