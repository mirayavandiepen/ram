import type { ReactNode } from "react";

/**
 * A name from the API, set into a sentence.
 *
 * The reference tables mark names with the accent colour alone, and that is
 * right there: a table already puts every name in the same column, so colour
 * is all it takes to find one. A sentence gives a name no such column, and
 * colour alone leaves it to be read as emphasis. The tinted ground says the
 * word is a thing rather than a word said loudly.
 *
 * Sized in `em`, so the badge follows whatever it is set into — a 16px lede,
 * a 15px list item — instead of holding one size in three places. The padding
 * is in `em` for the same reason, and the radius is small enough that a badge
 * around three characters still reads as a rectangle.
 */
export function InlineCode({ children }: { children: ReactNode }) {
  return (
    <code className="bg-accent-subtle text-accent rounded-[5px] px-[0.4em] py-[0.15em] font-mono text-[0.875em] font-medium">
      {children}
    </code>
  );
}
