import type { InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        'h-9 w-full rounded-lg border border-white/12 bg-white/[0.07] px-9 text-sm font-semibold text-white outline-none transition placeholder:text-white/36 focus:border-[var(--green-opportunity)] focus:bg-white/[0.1] focus:ring-4 focus:ring-[var(--green-opportunity)]/12',
        className,
      )}
      {...props}
    />
  );
}
