import { CalendarDays, RefreshCw, Shield, Trophy } from 'lucide-react';
import type { UserProfile } from './types';

export function HomeView({
  user,
  onOpenLive,
  onOpenToday,
}: {
  user: UserProfile;
  onOpenLive: () => void;
  onOpenToday: () => void;
}) {
  return (
    <section className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
      <div className="rounded-md border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm">
        <p className="text-xs font-black uppercase text-[var(--orange-alert)]">Bienvenido</p>
        <h2 className="mt-1 text-2xl font-black">Hola, {user.name}</h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--muted)]">
          Revisa partidos activos, consulta el calendario del dia y abre el detalle de cada encuentro desde una vista limpia.
        </p>
        <div className="mt-5 flex flex-col gap-2 sm:flex-row">
          <button
            className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-[var(--orange-alert)] px-4 text-sm font-bold text-white hover:brightness-110"
            type="button"
            onClick={onOpenLive}
          >
            <Trophy className="h-4 w-4" />
            Ver partidos en vivo
          </button>
          <button
            className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-[var(--border)] bg-[var(--surface)] px-4 text-sm font-bold text-[var(--foreground)] hover:bg-[var(--surface-2)]"
            type="button"
            onClick={onOpenToday}
          >
            <CalendarDays className="h-4 w-4" />
            Revisar calendario
          </button>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
        {[
          { label: 'Estado', value: 'Conectado', icon: Shield },
          { label: 'Actualizacion', value: 'Cada 10 min', icon: RefreshCw },
          { label: 'Fuente', value: 'API-FOOTBALL', icon: Trophy },
        ].map((item) => (
          <article
            key={item.label}
            className="rounded-md border border-[var(--border)] bg-[var(--surface)] p-4 shadow-sm"
          >
            <div className="mb-3 grid h-8 w-8 place-items-center rounded-md bg-[var(--accent-soft)] text-[var(--green-opportunity)]">
              <item.icon className="h-4 w-4" />
            </div>
            <p className="text-[11px] font-black uppercase text-[var(--muted)]">{item.label}</p>
            <p className="mt-1 text-sm font-black text-[var(--foreground)]">{item.value}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
