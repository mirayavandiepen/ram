import { PROPS } from "@/lib/reference";

import { Reference } from "../reference";
import { Section } from "../section";

export function Api() {
  return (
    <Section id="api" title="API">
      <Reference nameLabel="Prop" rows={PROPS} />
    </Section>
  );
}
