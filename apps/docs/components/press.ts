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
 * Deliberately carries no `position`. It used to set `relative`, which beats
 * `absolute` in Tailwind's own cascade order no matter which is written last,
 * so every corner-pinned control it touched fell back into the document flow.
 * The pseudo-element needs a positioned ancestor, so a statically positioned
 * control pairs this with `relative` itself.
 */
export const HIT_AREA = "after:absolute after:-inset-1.5 after:content-['']";
