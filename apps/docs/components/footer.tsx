import { site } from "@/lib/site";

export function Footer() {
  return (
    <footer className="mt-32 flex items-center justify-between border-t border-border py-8 text-[13px] text-muted">
      <span>Built by {site.author}</span>
      <div className="flex gap-4">
        <a href={site.github} target="_blank" rel="noreferrer" className="hover:text-foreground">
          GitHub
        </a>
        <a href={site.x} target="_blank" rel="noreferrer" className="hover:text-foreground">
          X
        </a>
      </div>
    </footer>
  );
}
