import type { LucideIcon } from 'lucide-react';

export function ToolPlaceholderView({
  description,
  icon: Icon,
  title,
}: {
  description: string;
  icon: LucideIcon;
  title: string;
}) {
  return (
    <section className="h-full rounded-md border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm">
      <div className="flex max-w-2xl items-start gap-3">
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-[var(--accent-soft)] text-[var(--green-opportunity)]">
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <h2 className="text-base font-black text-[var(--foreground)]">{title}</h2>
          <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{description}</p>
        </div>
      </div>
    </section>
  );
}
