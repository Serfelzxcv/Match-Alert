import type { ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'default' | 'ghost' | 'outline' | 'icon';
};

const variants = {
  default:
    'bg-[var(--orange-alert)] text-white shadow-sm hover:brightness-105',
  ghost: 'bg-transparent text-[var(--muted)] hover:bg-[var(--surface-2)] hover:text-[var(--foreground)]',
  outline:
    'border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] hover:bg-[var(--surface-2)]',
  icon:
    'border border-[var(--border)] bg-[var(--surface)] text-[var(--muted)] shadow-sm hover:text-[var(--foreground)]',
};

export function Button({ className, variant = 'default', type = 'button', ...props }: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        'inline-flex items-center justify-center rounded-lg text-sm font-bold transition disabled:pointer-events-none disabled:opacity-60',
        variants[variant],
        className,
      )}
      {...props}
    />
  );
}
