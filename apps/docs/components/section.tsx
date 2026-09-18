import type { ReactNode } from "react";

export function Section({
  id,
  title,
  children,
  description,
}: {
  id: string;
  title: string;
  description?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-16">
      <h2 className="text-[17px] font-medium tracking-[-0.01em]">
        <a href={`#${id}`} className="text-foreground no-underline">
          {title}
        </a>
      </h2>
      {description ? (
        <p className="mt-2 max-w-[56ch] text-[15px] text-muted">{description}</p>
      ) : null}
      <div className="mt-5 flex flex-col gap-4">{children}</div>
    </section>
  );
}
