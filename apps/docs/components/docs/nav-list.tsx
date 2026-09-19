"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

import { NAV } from "@/lib/nav";

/**
 * The navigation itself, shared by the sidebar and the small-screen sheet.
 * Current page is marked with `aria-current` first and colour second, so the
 * fact survives being read out as well as being looked at.
 */
export function NavList({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <nav aria-label="Documentation" className="flex flex-col gap-6">
      {NAV.map((group) => (
        <div key={group.label}>
          <h2 className="text-faint px-2.5 text-[12px] font-medium">
            {group.label}
          </h2>
          <ul className="mt-1.5 flex flex-col gap-px">
            {group.items.map((item) => {
              const current = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={onNavigate}
                    aria-current={current ? "page" : undefined}
                    className={`control flex h-8 items-center rounded-[7px] px-2.5 text-[13.5px] no-underline ${
                      current
                        ? "bg-surface-hover text-foreground font-medium"
                        : "text-muted hover:bg-surface-hover hover:text-foreground"
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}
