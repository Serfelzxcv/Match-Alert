import { CalendarClock, CalendarDays, Loader2, Trophy } from 'lucide-react';
import Image from 'next/image';
import { useMemo } from 'react';
import type { ApiFootballLiveFixture, ApiFootballTeam } from './types';

export function LiveFixturesView({
  title,
  description,
  emptyLabel,
  statusLabel,
  fixtures,
  fixturesError,
  isLoadingFixtures,
  lastUpdatedLabel,
  selectedDate,
  onSelectedDateChange,
  onSelectFixture,
}: {
  title: string;
  description: string;
  emptyLabel: string;
  statusLabel: string;
  fixtures: ApiFootballLiveFixture[];
  fixturesError: string;
  isLoadingFixtures: boolean;
  lastUpdatedLabel: string;
  selectedDate?: string;
  onSelectedDateChange?: (date: string) => void;
  onSelectFixture: (fixture: ApiFootballLiveFixture) => void;
}) {
  const groupedFixtures = useMemo(() => groupFixturesByLeague(fixtures), [fixtures]);

  return (
    <section className="flex h-full min-h-0 flex-col rounded-md border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] shadow-sm">
      <div className="flex flex-col gap-3 border-b border-[var(--border)] px-4 py-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-sm font-bold text-[var(--foreground)]">{title}</h2>
          <p className="mt-1 text-xs text-[var(--muted)]">{description}</p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          {selectedDate && onSelectedDateChange ? (
            <label className="flex items-center gap-2 rounded-md border border-[var(--border)] bg-[var(--surface-2)] px-2 py-1.5 text-xs font-bold text-[var(--foreground)]">
              <CalendarDays className="h-4 w-4 text-[var(--green-opportunity)]" />
              <input
                className="bg-transparent text-xs font-bold text-[var(--foreground)] outline-none"
                type="date"
                value={selectedDate}
                onChange={(event) => onSelectedDateChange(event.target.value)}
              />
            </label>
          ) : null}
          <div className="flex items-center gap-2 text-xs font-semibold text-[var(--muted)]">
            <CalendarClock className="h-4 w-4" />
            <span>Ultima consulta: {lastUpdatedLabel}</span>
          </div>
        </div>
      </div>

      {isLoadingFixtures ? (
        <div className="flex items-center gap-2 p-4 text-sm font-semibold text-[var(--muted)]">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Cargando partidos...</span>
        </div>
      ) : null}

      {!isLoadingFixtures && fixturesError ? (
        <div className="p-4 text-sm font-semibold text-red-700">{fixturesError}</div>
      ) : null}

      {!isLoadingFixtures && !fixturesError && fixtures.length === 0 ? (
        <div className="p-4 text-sm text-[var(--muted)]">{emptyLabel}</div>
      ) : null}

      {!isLoadingFixtures && !fixturesError && fixtures.length > 0 ? (
        <div className="min-h-0 flex-1 space-y-3 overflow-y-auto p-2">
          {groupedFixtures.map((group) => (
            <article key={group.key} className="overflow-hidden rounded-md border border-[var(--border)] bg-[var(--surface-2)]">
              <div className="flex items-center justify-between gap-3 border-b border-[var(--border)] bg-[var(--surface-3)] px-3 py-2">
                <div className="flex min-w-0 items-center gap-2">
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[var(--warning-soft)] text-[var(--orange-alert)]">
                    <Trophy className="h-4 w-4" />
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-black text-[var(--foreground)]">{group.leagueName}</p>
                    <p className="truncate text-xs font-semibold text-[var(--muted)]">{group.country}</p>
                  </div>
                </div>
                <span className="grid h-6 min-w-6 place-items-center rounded-full bg-[var(--surface)] px-2 text-xs font-black text-[var(--green-opportunity)]">
                  {group.fixtures.length}
                </span>
              </div>

              <div className="divide-y divide-[var(--border)]">
                {group.fixtures.map((match) => (
                  <FixtureRow
                    key={match.fixture.id}
                    match={match}
                    statusLabel={statusLabel}
                    onSelectFixture={onSelectFixture}
                  />
                ))}
              </div>
            </article>
          ))}
        </div>
      ) : null}
    </section>
  );
}

function FixtureRow({
  match,
  statusLabel,
  onSelectFixture,
}: {
  match: ApiFootballLiveFixture;
  statusLabel: string;
  onSelectFixture: (fixture: ApiFootballLiveFixture) => void;
}) {
  return (
    <div
      className="grid cursor-pointer grid-cols-[58px_1fr_34px] items-center gap-3 px-3 py-2.5 transition duration-200 hover:bg-[var(--surface)]"
      role="button"
      tabIndex={0}
      onClick={() => onSelectFixture(match)}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onSelectFixture(match);
        }
      }}
    >
      <div className="text-xs font-bold leading-4 text-[var(--muted)]">
        <p className="text-[var(--orange-alert)]">{formatFixtureListStatus(match)}</p>
        <p>{match.fixture.status.short || statusLabel}</p>
      </div>

      <div className="min-w-0 space-y-1">
        <TeamRow team={match.teams.home} />
        <TeamRow team={match.teams.away} />
      </div>

      <div className="space-y-1 text-right text-sm font-black tabular-nums text-[var(--foreground)]">
        <p>{formatGoal(match.goals.home)}</p>
        <p>{formatGoal(match.goals.away)}</p>
      </div>
    </div>
  );
}

function TeamRow({ team }: { team: ApiFootballTeam }) {
  return (
    <div className="flex min-w-0 items-center gap-2">
      {team.logo ? (
        <Image
          src={team.logo}
          alt={team.name}
          width={22}
          height={22}
          unoptimized
          className="h-[22px] w-[22px] object-contain"
        />
      ) : (
        <span className="h-[22px] w-[22px] rounded-full bg-[#eef1f5]" />
      )}
      <span className="truncate text-sm font-bold text-[var(--foreground)]">{team.name}</span>
    </div>
  );
}

function groupFixturesByLeague(fixtures: ApiFootballLiveFixture[]) {
  const groups = new Map<
    string,
    {
      key: string;
      leagueName: string;
      country: string;
      sortTime: number;
      fixtures: ApiFootballLiveFixture[];
    }
  >();

  for (const fixture of fixtures) {
    const key = `${fixture.league.id ?? fixture.league.name}-${fixture.league.country}`;
    const timestamp = fixture.fixture.timestamp ?? 0;
    const existingGroup = groups.get(key);

    if (existingGroup) {
      existingGroup.fixtures.push(fixture);
      existingGroup.sortTime = Math.min(existingGroup.sortTime, timestamp);
      continue;
    }

    groups.set(key, {
      key,
      leagueName: fixture.league.name,
      country: fixture.league.country,
      sortTime: timestamp,
      fixtures: [fixture],
    });
  }

  return Array.from(groups.values())
    .map((group) => ({
      ...group,
      fixtures: group.fixtures.sort((firstFixture, secondFixture) => {
        const firstTimestamp = firstFixture.fixture.timestamp ?? 0;
        const secondTimestamp = secondFixture.fixture.timestamp ?? 0;
        return firstTimestamp - secondTimestamp;
      }),
    }))
    .sort((firstGroup, secondGroup) => firstGroup.sortTime - secondGroup.sortTime);
}

function formatGoal(goal: number | null) {
  return goal ?? '-';
}

function formatFixtureListStatus(match: ApiFootballLiveFixture) {
  if (typeof match.fixture.status.elapsed === 'number') {
    return formatMatchStatus(match.fixture.status);
  }

  const status = match.fixture.status.short;

  if (status === 'NS' || status === 'TBD' || !status) {
    return formatPeruTime(match.fixture.date);
  }

  return status;
}

function formatPeruTime(date?: string) {
  if (!date) {
    return '--:--';
  }

  return new Date(date).toLocaleTimeString('es-PE', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'America/Lima',
  });
}

function formatMatchStatus(status: ApiFootballLiveFixture['fixture']['status']) {
  if (typeof status.elapsed === 'number') {
    return `${status.elapsed}${status.extra ? `+${status.extra}` : ''}'`;
  }

  return status.short || status.long || 'En vivo';
}
