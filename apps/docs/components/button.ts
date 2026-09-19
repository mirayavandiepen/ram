import { PRESS } from "./press";

/**
 * One button system, two surfaces.
 *
 * A hairline border on a near-white page is almost nothing, which is why the
 * outlined controls read as labels rather than as things you can press. A
 * layered shadow does what a border cannot: it lifts the control off the
 * page, and depth is what the eye reads as pressable. The border stays, but
 * now it draws the edge rather than carrying the whole affordance.
 */
const BASE =
  "inline-flex shrink-0 items-center justify-center gap-1.5 rounded-full font-medium leading-none whitespace-nowrap shadow-button";

/** Filled. The one thing the page most wants you to do. */
export const BUTTON_PRIMARY = `${BASE} ${PRESS} bg-primary text-primary-foreground hover:bg-primary-hover`;

/** Outlined. Everything else, including the unselected half of a group. */
export const BUTTON_SECONDARY = `${BASE} ${PRESS} border border-border bg-surface text-foreground hover:bg-surface-hover`;

/** Compact, for the control rows that run four and six across. */
export const BUTTON_SM = "h-8 px-3.5 text-[13px]";

/** Standing size, for the page's own actions. */
export const BUTTON_MD = "h-9 px-4 text-[14px]";
