import type { ReactNode } from "react";

export function PageIntro({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <header className="border-b border-sand bg-paper">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-brass">{eyebrow}</p>
        <h1 className="mt-3 max-w-3xl font-serif text-4xl leading-tight text-ink sm:text-6xl">
          {title}
        </h1>
        <div className="mt-4 max-w-2xl text-base leading-7 text-muted">{children}</div>
      </div>
    </header>
  );
}
