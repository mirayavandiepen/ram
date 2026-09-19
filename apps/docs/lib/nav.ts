/**
 * The documentation, as a list.
 *
 * One declaration feeds the sidebar, the mobile nav and the previous/next
 * pager at the foot of every page. Ordering is the reading order, so the
 * pager is derived rather than maintained: a page moved in this list moves
 * everywhere it appears.
 */
export type NavItem = {
  label: string;
  href: string;
  /** Used as the page's own lede and as its meta description. */
  summary: string;
};

export type NavGroup = {
  label: string;
  items: NavItem[];
};

export const NAV: NavGroup[] = [
  {
    label: "Basics",
    items: [
      {
        label: "Getting started",
        href: "/docs",
        summary: "Install the package and frame your first word.",
      },
    ],
  },
  {
    label: "Guides",
    items: [
      {
        label: "Appearance",
        href: "/docs/appearance",
        summary:
          "The outline, the corner handles and the measurement label, and how much of each to draw.",
      },
      {
        label: "Animation",
        href: "/docs/animation",
        summary: "How the frame enters, how long it stays, and what starts it.",
      },
      {
        label: "Styling",
        href: "/docs/styling",
        summary:
          "Typography is inherited. Everything else is a CSS variable you can set.",
      },
    ],
  },
  {
    label: "Reference",
    items: [
      {
        label: "API",
        href: "/docs/api",
        summary: "Every prop the component takes.",
      },
      {
        label: "Accessibility",
        href: "/docs/accessibility",
        summary:
          "What the component adds to the accessibility tree, and what it deliberately does not.",
      },
    ],
  },
];

/** Flattened into reading order, which is what the pager walks. */
export const NAV_ITEMS: NavItem[] = NAV.flatMap((group) => group.items);

export function navNeighbours(href: string) {
  const index = NAV_ITEMS.findIndex((item) => item.href === href);
  return {
    previous: index > 0 ? NAV_ITEMS[index - 1] : undefined,
    next: index >= 0 ? NAV_ITEMS[index + 1] : undefined,
  };
}
