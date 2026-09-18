import { site } from "@/lib/site";

export function Footer() {
  return (
    <footer className="border-border text-muted mt-32 flex items-center justify-between border-t py-8 text-[13px]">
      <span>Built by {site.author}</span>
      <div className="flex gap-4">
        <a
          href={site.github}
          target="_blank"
          rel="noreferrer"
          className="ease-out-quart hover:text-foreground transition-colors duration-150"
        >
          GitHub
        </a>
        <a
          href={site.x}
          target="_blank"
          rel="noreferrer"
          className="ease-out-quart hover:text-foreground transition-colors duration-150"
        >
          X
        </a>
      </div>
    </footer>
  );
}
