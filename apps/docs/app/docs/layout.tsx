import { MobileNav } from "@/components/docs/mobile-nav";
import { Sidebar } from "@/components/docs/sidebar";

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* Every page puts six navigation links before its own first word.
          That is the right order in the markup and the wrong amount of
          tabbing, so there is a way past them. */}
      <a
        href="#content"
        className="bg-surface border-border text-foreground sr-only rounded-lg border px-3 py-2 text-[13px] no-underline focus-visible:not-sr-only focus-visible:fixed focus-visible:left-4 focus-visible:top-4 focus-visible:z-50"
      >
        Skip to content
      </a>
      <MobileNav />
      <div className="flex w-full">
        <Sidebar />
        <main id="content" className="min-w-0 flex-1">
          {children}
        </main>
      </div>
    </>
  );
}
