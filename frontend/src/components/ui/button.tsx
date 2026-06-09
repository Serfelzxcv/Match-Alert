import type { ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'default' | 'ghost' | 'outline' | 'icon';
};

const variants = {
  default:
    'bg-[linear-gradient(90deg,var(--orange-alert),#ff3f57)] text-white shadow-[0_12px_30px_rgba(255,64,79,0.34)] hover:brightness-110',
  ghost: 'bg-transparent text-white/60 hover:bg-white/10 hover:text-white',
  outline:
    'border border-white/12 bg-white/[0.06] text-white/88 hover:border-[var(--green-opportunity)]/45 hover:bg-white/[0.1] hover:text-white',
  icon:
    'border border-[var(--green-opportunity)]/35 bg-[#0c1114]/90 text-[var(--green-opportunity)] shadow-[0_0_18px_rgba(157,255,47,0.18)] hover:border-[var(--orange-alert)] hover:text-[var(--orange-alert)]',
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
