/**
 * Press feedback, shared by every control on the page.
 *
 * A control that reacts to a hover but not to a click feels dead under the
 * finger, and touch never gets the hover at all. 0.96 is felt rather than
 * seen: anything lower visibly collapses the control.
 *
 * Reduced motion pins the scale rather than dropping the transition, so the
 * control stops moving but colour still eases. Gentler, not off.
 */
export const PRESS =
  "control active:scale-[0.96] motion-reduce:active:scale-100";

/**
 * Grows an icon-only control's hit area without changing what it looks like.
 * Only safe where nothing sits within the extra ring, since two overlapping
 * hit areas steal each other's taps.
 *
 * `relative` is part of it because the pseudo-element is offset against its
 * nearest positioned ancestor: on a static control that is the viewport, and
 * the ring becomes a full-page sheet that swallows every click on the page.
 *
 * Tailwind emits `relative` after `absolute`, so a corner-pinned control
 * cannot simply add `absolute` alongside this and win. Those controls use
 * ABSOLUTE_HIT_AREA instead, which leaves the positioning to them.
 */
export const HIT_AREA =
  "relative after:absolute after:-inset-1.5 after:content-['']";

/**
 * The same ring for a control that already positions itself. It supplies the
 * containing block, so this must not declare one of its own.
 */
export const ABSOLUTE_HIT_AREA =
  "after:absolute after:-inset-1.5 after:content-['']";
