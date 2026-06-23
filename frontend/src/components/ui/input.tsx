import type { InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        'h-9 w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-9 text-sm font-semibold text-[var(--foreground)] outline-none transition placeholder:text-[var(--muted)]/60 focus:border-[var(--green-opportunity)] focus:ring-4 focus:ring-[var(--green-opportunity)]/10',
        className,
      )}
      {...props}
    />
  );
}
