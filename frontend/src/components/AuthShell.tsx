import Link from 'next/link';
import type { ReactNode } from 'react';

export function AuthShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10">
      <section className="w-full max-w-md rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <Link href="/" className="text-sm font-semibold text-emerald-700">
          Match Alert
        </Link>
        <h1 className="mt-5 text-2xl font-bold text-gray-950">{title}</h1>
        <p className="mt-2 text-sm text-gray-600">{subtitle}</p>
        <div className="mt-6">{children}</div>
      </section>
    </main>
  );
}
