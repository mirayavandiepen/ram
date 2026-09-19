import { PRESS } from "./press";

/**
 * One button system, two surfaces.
 *
 * The page draws with lines, not with depth: no surface on it casts a shadow,
 * and a button that did would be the only floating thing here. So the border
 * carries the affordance, one step darker than the hairlines that divide
 * sections, which is enough to read as an edge you could press rather than a
 * rule drawn on the page.
 */
const BASE =
  "inline-flex shrink-0 items-center justify-center gap-1.5 rounded-full font-medium leading-none whitespace-nowrap";

/** Filled. The one thing the page most wants you to do. */
export const BUTTON_PRIMARY = `${BASE} ${PRESS} bg-primary text-primary-foreground hover:bg-primary-hover`;

/** Outlined. Everything else, including the unselected half of a group. */
export const BUTTON_SECONDARY = `${BASE} ${PRESS} border border-border-strong bg-surface text-foreground hover:bg-surface-hover`;

/** Compact, for the control rows that run four and six across. */
export const BUTTON_SM = "h-8 px-3.5 text-[13px]";

/** Standing size, for the page's own actions. */
export const BUTTON_MD = "h-9 px-4 text-[14px]";
