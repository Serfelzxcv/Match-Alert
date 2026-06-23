import Link from 'next/link';
import type { ReactNode } from 'react';
import { PublicThemeReset } from './PublicThemeReset';

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
    <main className="grid min-h-screen bg-[#f5f6f8] px-5 py-8 text-[#161a22] lg:grid-cols-[1fr_460px] lg:px-8">
      <PublicThemeReset />
      <section className="hidden flex-col justify-between rounded-lg bg-[#151a22] p-8 text-[#e8ebf0] lg:flex">
        <div>
          <Link href="/" className="text-lg font-black">
            Match Alert
          </Link>
          <h2 className="mt-12 max-w-xl text-5xl font-black leading-tight">
            Alertas listas para partidos que cambian rapido.
          </h2>
        </div>
        <div className="grid gap-3">
          <div className="rounded-md bg-white/10 p-4">
            <p className="text-sm font-bold text-[#d6b47a]">Backend conectado</p>
            <p className="mt-2 text-sm text-white/75">Autenticacion local, OAuth y perfil protegido.</p>
          </div>
          <div className="rounded-md bg-white/10 p-4">
            <p className="text-sm font-bold text-[#d6b47a]">Docker listo</p>
            <p className="mt-2 text-sm text-white/75">Postgres, API y frontend en el mismo compose.</p>
          </div>
        </div>
      </section>
      <section className="mx-auto flex w-full max-w-md flex-col justify-center lg:pl-8">
        <div className="rounded-lg border border-[#d9dee7] bg-white p-6 shadow-sm">
          <Link href="/" className="text-sm font-bold uppercase text-[#9a5b16]">
            Match Alert
          </Link>
          <h1 className="mt-3 text-3xl font-black text-[#161a22]">{title}</h1>
          <p className="mt-2 text-sm leading-6 text-[#626b78]">{subtitle}</p>
          <div className="mt-6">{children}</div>
        </div>
      </section>
    </main>
  );
}
