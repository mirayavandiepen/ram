import { Section } from "../section";

export function Accessibility() {
  return (
    <Section id="accessibility" title="Accessibility">
      <ul className="text-muted marker:text-faint flex list-disc flex-col gap-1.5 text-pretty pl-5 text-[15px]">
        <li>
          The outline, handles and label are decorative and hidden from
          assistive technology.
        </li>
        <li>
          The wrapped text stays ordinary text: selectable, searchable, and read
          exactly as written.
        </li>
        <li>
          <code className="text-foreground font-mono text-[13px]">
            prefers-reduced-motion
          </code>{" "}
          drops the tracking pass. The frame still fades in and out.
        </li>
        <li>
          Ram adds no headings, landmarks or roles, so the semantics of the
          surrounding markup are unchanged.
        </li>
      </ul>
    </Section>
  );
}
