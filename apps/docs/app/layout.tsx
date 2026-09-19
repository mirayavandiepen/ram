import type { Metadata } from "next";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";

import { site } from "@/lib/site";
import { THEME_SCRIPT } from "@/lib/theme";

import "./globals.css";

// The meaning travels with the name everywhere the name goes, including the
// places nobody sees on the page: a search result, a shared link, a tab.
const description = `Swedish for "${site.meaning}". A tiny React component for animated design-tool selection frames around text.`;

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  // A template so every documentation page names itself in the tab and in a
  // search result without each one restating the library's name by hand.
  title: { default: site.name, template: `%s — ${site.name}` },
  description,
  keywords: ["react", "animation", "selection", "frame", "figma", "typography"],
  authors: [{ name: site.author }],
  openGraph: {
    type: "website",
    title: site.name,
    description,
    url: "/",
    siteName: site.name,
  },
  twitter: {
    card: "summary_large_image",
    title: site.name,
    description,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // The inline script writes `data-theme` on this element before React
    // hydrates, which is the whole point of it, so the mismatch is expected.
    <html
      lang="en"
      className={`${GeistSans.variable} ${GeistMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>
      {/* The theme control is placed by each layout rather than here: on the
          landing page it sits in the header with the other site controls, and
          in the docs at the foot of the sidebar or in the mobile bar. */}
      <body>{children}</body>
    </html>
  );
}
