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
 * Three zones on one line: who made it, where it lives, how it should look.
 *
 * The marks take the middle column rather than queueing behind the byline.
 * Crowded against the theme control they read as one long run of six things;
 * given a column of their own, each group is separated by space instead of by
 * the reader's patience, and nothing needs a rule to divide it.
 *
 * Below `sm` the three stack and centre, because a row this wide would break
 * in the wrong places.
 */
export function Footer() {
  return (
    <footer className="border-border text-muted mt-32 grid items-center justify-items-center gap-7 border-t py-10 text-[13px] sm:grid-cols-3 sm:gap-6">
      <span className="sm:justify-self-start">
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

      {/* Equal breathing room rather than equal boxes: the npm wordmark is
          two and a half times as wide as the other two, and a square that
          fitted it would strand them in space. */}
      <nav aria-label="Elsewhere" className="flex items-center gap-1">
        {LINKS.map((link) => (
          <a
            key={link.href}
            href={link.href}
            target="_blank"
            rel="noreferrer"
            aria-label={link.label}
            title={link.label}
            className={`text-faint hover:bg-surface-hover hover:text-foreground grid h-7 min-w-7 place-items-center rounded-full px-1.5 ${PRESS}`}
          >
            {link.icon}
          </a>
        ))}
      </nav>

      <div className="sm:justify-self-end">
        <ThemeToggle />
      </div>
    </footer>
  );
}
