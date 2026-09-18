import type { Metadata } from "next";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";

import { ThemeToggle } from "@/components/theme-toggle";
import { site } from "@/lib/site";
import { THEME_SCRIPT } from "@/lib/theme";

import "./globals.css";

const description = "A design-tool selection effect for React.";

export const metadata: Metadata = {
  metadataBase: new URL("https://kerned.dev"),
  title: "Kerned",
  description,
  keywords: ["react", "animation", "selection", "figma", "typography"],
  authors: [{ name: site.author }],
  openGraph: {
    type: "website",
    title: "Kerned",
    description,
    url: "/",
    siteName: "Kerned",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kerned",
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
      <body>
        <div className="fixed top-4 right-4 z-10">
          <ThemeToggle />
        </div>
        {children}
      </body>
    </html>
  );
}
