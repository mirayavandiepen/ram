import { ThemeToggle } from "@/components/theme-toggle";
import { site } from "@/lib/site";

import { GitHubIcon, NpmIcon, XIcon } from "./logos";
import { PRESS } from "./press";

const LINKS = [
  { label: "GitHub", href: site.github, icon: <GitHubIcon size={15} /> },
  { label: "npm", href: site.npm, icon: <NpmIcon size={10} /> },
  { label: "X", href: site.x, icon: <XIcon size={13} /> },
];

/**
 * The last word on the page: who made it, where it lives, and how it should
 * look. The theme control sits here rather than in the masthead because it is
 * a setting, not a destination, and settings belong at the end.
 *
 * The three marks carry no text beside them. The npm logo is the word "npm"
 * and the X logo is the letter, so a label next to either would be the same
 * thing said twice; each is named for assistive technology and on hover
 * instead. They are sized to their own drawing rather than to a shared box,
 * because matching the heights of a wide wordmark and a dense glyph leaves
 * one looming over the other.
 */
export function Footer() {
  return (
    <footer className="border-border text-muted mt-32 flex flex-wrap items-center justify-between gap-x-6 gap-y-5 border-t py-8 text-[13px]">
      <span>
        Built by{" "}
        <a
          href={site.authorUrl}
          target="_blank"
          rel="noreferrer"
          className="text-muted decoration-faint ease-out-quart hover:text-foreground hover:decoration-foreground underline decoration-from-font underline-offset-[3px] transition-colors duration-150"
        >
          {site.author}
        </a>
      </span>

      {/* One cluster, the marks spaced closer to each other than to the
          control beside them, so the two groups read apart. */}
      <div className="flex items-center gap-4">
        <nav aria-label="Elsewhere" className="flex items-center gap-1">
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noreferrer"
              aria-label={link.label}
              title={link.label}
              // Equal breathing room rather than equal boxes: the npm
              // wordmark is two and a half times as wide as the other two,
              // and a square that fitted it would strand them in space.
              className={`text-faint hover:bg-surface-hover hover:text-foreground grid h-7 min-w-7 place-items-center rounded-full px-1.5 ${PRESS}`}
            >
              {link.icon}
            </a>
          ))}
        </nav>
        <ThemeToggle />
      </div>
    </footer>
  );
}
