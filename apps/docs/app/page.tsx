import { Footer } from "@/components/footer";
import { Hero } from "@/components/hero";
import { Install } from "@/components/install";
import { Section } from "@/components/section";
import { Accessibility } from "@/components/sections/accessibility";
import { Animation } from "@/components/sections/animation";
import { Api } from "@/components/sections/api";
import { Appearance } from "@/components/sections/appearance";
import { Label } from "@/components/sections/label";
import { Overview } from "@/components/sections/overview";
import { Position } from "@/components/sections/position";
import { Styling } from "@/components/sections/styling";
import { Trigger } from "@/components/sections/trigger";
import { Usage } from "@/components/sections/usage";

export default function Page() {
  return (
    <main className="mx-auto w-full max-w-[640px] px-6">
      <Hero />
      <div className="flex flex-col gap-20">
        <Overview />
        <Section id="installation" title="Installation">
          <Install />
        </Section>
        <Usage />
        <Appearance />
        <Label />
        <Position />
        <Animation />
        <Trigger />
        <Styling />
        <Api />
        <Accessibility />
      </div>
      <Footer />
    </main>
  );
}
