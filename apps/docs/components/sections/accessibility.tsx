import { Section } from "../section";

export function Accessibility() {
  return (
    <Section id="accessibility" title="Accessibility">
      <ul className="flex list-disc flex-col gap-1.5 pl-5 text-[15px] text-muted marker:text-faint">
        <li>The outline, handles and label are decorative and hidden from assistive technology.</li>
        <li>The wrapped text stays ordinary text: selectable, searchable, and read exactly as written.</li>
        <li>
          <code className="font-mono text-[13px] text-foreground">prefers-reduced-motion</code>{" "}
          drops the tracking pass. The box still fades in and out.
        </li>
        <li>Kerned adds no headings, landmarks or roles, so the semantics of the surrounding markup are unchanged.</li>
      </ul>
    </Section>
  );
}
