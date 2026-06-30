import { CalendarClock, MapPin, Shield, Trophy, UserRound, X } from 'lucide-react';
import Image from 'next/image';
import type { ReactNode } from 'react';
import type { ApiFootballLiveFixture, ApiFootballScorePair, ApiFootballTeam } from './types';

export function FixtureDetailDialog({
  fixture,
  onClose,
}: {
  fixture: ApiFootballLiveFixture;
  onClose: () => void;
}) {
  const eventList = fixture.events ?? [];

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/45 px-4 py-6 backdrop-blur-sm">
      <button className="absolute inset-0 cursor-default" type="button" aria-label="Cerrar detalle" onClick={onClose} />

      <section
        className="relative max-h-[92vh] w-full max-w-3xl overflow-hidden rounded-md border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="fixture-detail-title"
      >
        <header className="flex items-center justify-between gap-3 border-b border-[var(--border)] px-4 py-3">
          <div className="min-w-0">
            <div className="flex min-w-0 items-center gap-2 text-xs font-bold text-[var(--muted)]">
              <Trophy className="h-3.5 w-3.5 shrink-0 text-[var(--orange-alert)]" />
              <span className="truncate">
                {fixture.league.name} - {fixture.league.country}
              </span>
            </div>
            <h2 id="fixture-detail-title" className="mt-1 truncate text-base font-black text-[var(--foreground)]">
              Detalle del partido
            </h2>
          </div>
          <button
            className="grid h-9 w-9 place-items-center rounded-md border border-[var(--border)] text-[var(--muted)] hover:bg-[var(--surface-2)]"
            type="button"
            aria-label="Cerrar"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </button>
        </header>

        <div className="max-h-[calc(92vh-64px)] overflow-y-auto p-4">
          <section className="grid gap-4 border-b border-[var(--border)] pb-4 md:grid-cols-[1fr_auto_1fr] md:items-center">
            <DialogTeam team={fixture.teams.home} align="left" />
            <div className="text-center">
              <p className="text-4xl font-black tabular-nums text-[var(--foreground)]">
                {fixture.goals.home ?? 0} - {fixture.goals.away ?? 0}
              </p>
              <p className="mt-1 text-xs font-black uppercase text-[var(--orange-alert)]">
                {formatMatchStatus(fixture.fixture.status)}
              </p>
              <p className="mt-1 text-xs font-semibold text-[var(--muted)]">
                {fixture.fixture.status.long || fixture.fixture.status.short || 'En vivo'}
              </p>
            </div>
            <DialogTeam team={fixture.teams.away} align="right" />
          </section>

          <section className="grid gap-3 py-4 sm:grid-cols-2 lg:grid-cols-4">
            <DetailItem icon={<Shield className="h-4 w-4" />} label="Fixture ID" value={String(fixture.fixture.id)} />
            <DetailItem icon={<CalendarClock className="h-4 w-4" />} label="Fecha" value={formatFixtureDate(fixture.fixture.date)} />
            <DetailItem icon={<UserRound className="h-4 w-4" />} label="Arbitro" value={fixture.fixture.referee || 'No disponible'} />
            <DetailItem icon={<MapPin className="h-4 w-4" />} label="Estadio" value={formatVenue(fixture.fixture.venue)} />
          </section>

          <section className="grid gap-4 lg:grid-cols-[280px_1fr]">
            <article className="rounded-md border border-[var(--border)]">
              <div className="border-b border-[var(--border)] px-3 py-2">
                <h3 className="text-sm font-black">Marcador por etapa</h3>
              </div>
              <div className="divide-y divide-[var(--border)]">
                <ScoreStage label="Medio tiempo" score={fixture.score?.halftime} />
                <ScoreStage label="Final" score={fixture.score?.fulltime} />
                <ScoreStage label="Tiempo extra" score={fixture.score?.extratime} />
                <ScoreStage label="Penales" score={fixture.score?.penalty} />
              </div>
            </article>

            <article className="rounded-md border border-[var(--border)]">
              <div className="flex items-center justify-between border-b border-[var(--border)] px-3 py-2">
                <h3 className="text-sm font-black">Eventos</h3>
                <span className="text-xs font-bold text-[var(--muted)]">{eventList.length}</span>
              </div>
              {eventList.length > 0 ? (
                <div className="max-h-[260px] divide-y divide-[var(--border)] overflow-y-auto">
                  {eventList.map((event, index) => (
                    <div key={`${event.time.elapsed}-${event.type}-${index}`} className="grid grid-cols-[52px_1fr] gap-3 px-3 py-2">
                      <p className="text-xs font-black text-[var(--orange-alert)]">
                        {event.time.elapsed}
                        {event.time.extra ? `+${event.time.extra}` : ''}'
                      </p>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold text-[var(--foreground)]">
                          {event.type} - {event.detail}
                        </p>
                        <p className="mt-0.5 truncate text-xs text-[var(--muted)]">
                          {event.team.name}
                          {event.player?.name ? ` - ${event.player.name}` : ''}
                          {event.assist?.name ? ` - Asistencia: ${event.assist.name}` : ''}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="px-3 py-4 text-sm text-[var(--muted)]">Todavia no hay eventos registrados para este partido.</p>
              )}
            </article>
          </section>
        </div>
      </section>
    </div>
  );
}

function DialogTeam({ team, align }: { team: ApiFootballTeam; align: 'left' | 'right' }) {
  return (
    <div className={`flex items-center gap-3 ${align === 'right' ? 'md:flex-row-reverse md:text-right' : ''}`}>
      {team.logo ? (
        <Image src={team.logo} alt={team.name} width={42} height={42} unoptimized className="h-[42px] w-[42px] object-contain" />
      ) : (
        <span className="h-[42px] w-[42px] rounded-full bg-[#eef1f5]" />
      )}
      <div className="min-w-0">
        <p className="truncate text-base font-black text-[var(--foreground)]">{team.name}</p>
        <p className="text-xs font-semibold text-[var(--muted)]">{team.winner ? 'Ganando' : 'Equipo'}</p>
      </div>
    </div>
  );
}

function DetailItem({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-md border border-[var(--border)] bg-[var(--surface)] p-3">
      <div className="mb-2 flex items-center gap-2 text-[var(--orange-alert)]">{icon}</div>
      <p className="text-[11px] font-black uppercase text-[var(--muted)]">{label}</p>
      <p className="mt-1 break-words text-sm font-bold text-[var(--foreground)]">{value}</p>
    </div>
  );
}

function ScoreStage({ label, score }: { label: string; score?: ApiFootballScorePair }) {
  return (
    <div className="flex items-center justify-between gap-3 px-3 py-2 text-sm">
      <span className="font-semibold text-[var(--muted)]">{label}</span>
      <span className="font-black tabular-nums text-[var(--foreground)]">
        {score?.home ?? '-'} - {score?.away ?? '-'}
      </span>
    </div>
  );
}

function formatFixtureDate(date?: string) {
  if (!date) {
    return 'No disponible';
  }

  return new Date(date).toLocaleString('es-PE', {
    dateStyle: 'short',
    timeStyle: 'short',
  });
}

function formatVenue(venue?: ApiFootballLiveFixture['fixture']['venue']) {
  if (!venue?.name && !venue?.city) {
    return 'No disponible';
  }

  return [venue.name, venue.city].filter(Boolean).join(' - ');
}

function formatMatchStatus(status: ApiFootballLiveFixture['fixture']['status']) {
  if (typeof status.elapsed === 'number') {
    return `${status.elapsed}${status.extra ? `+${status.extra}` : ''}'`;
  }

  return status.short || status.long || 'En vivo';
}
