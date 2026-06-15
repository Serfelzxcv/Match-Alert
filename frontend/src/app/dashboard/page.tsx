'use client';

import { CalendarClock, Home, Loader2, LogOut, Menu, RefreshCw, Trophy, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { api } from '@/lib/api';
import { clearToken, getToken } from '@/lib/auth';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  image?: string | null;
  role: string;
  provider?: string | null;
}

interface ApiFootballTeam {
  id: number;
  name: string;
  logo?: string;
}

interface ApiFootballLiveFixture {
  fixture: {
    id: number;
    status: {
      elapsed?: number | null;
      long?: string;
      short?: string;
    };
  };
  league: {
    name: string;
    country: string;
    logo?: string;
  };
  teams: {
    home: ApiFootballTeam;
    away: ApiFootballTeam;
  };
  goals: {
    home: number | null;
    away: number | null;
  };
}

interface LiveFixturesResponse {
  response: ApiFootballLiveFixture[];
}

const LIVE_FIXTURES_POLL_MS = 10 * 60 * 1000;
type DashboardView = 'home' | 'live';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeView, setActiveView] = useState<DashboardView>('home');
  const [liveFixtures, setLiveFixtures] = useState<ApiFootballLiveFixture[]>([]);
  const [isLoadingFixtures, setIsLoadingFixtures] = useState(false);
  const [fixturesError, setFixturesError] = useState('');
  const [lastUpdatedAt, setLastUpdatedAt] = useState<Date | null>(null);

  const fetchLiveFixtures = useCallback(async () => {
    setFixturesError('');

    setIsLoadingFixtures(true);

    try {
      const response = await api.get<LiveFixturesResponse>('/football/fixtures/live');
      setLiveFixtures(response.data.response ?? []);
      setLastUpdatedAt(new Date());
    } catch (error: any) {
      setFixturesError(error.response?.data?.message || 'No se pudieron cargar los partidos en vivo.');
    } finally {
      setIsLoadingFixtures(false);
    }
  }, []);

  useEffect(() => {
    const token = getToken();

    if (!token) {
      router.replace('/');
      return;
    }

    api
      .get<UserProfile>('/auth/me')
      .then((response) => setUser(response.data))
      .catch(() => {
        clearToken();
        router.replace('/');
      })
      .finally(() => setIsLoadingUser(false));
  }, [router]);

  useEffect(() => {
    if (!user || activeView !== 'live') {
      return;
    }

    fetchLiveFixtures();
    const intervalId = window.setInterval(fetchLiveFixtures, LIVE_FIXTURES_POLL_MS);
    return () => window.clearInterval(intervalId);
  }, [activeView, fetchLiveFixtures, user]);

  const lastUpdatedLabel = useMemo(() => {
    if (!lastUpdatedAt) {
      return 'Esperando datos';
    }

    return lastUpdatedAt.toLocaleTimeString('es-PE', {
      hour: '2-digit',
      minute: '2-digit',
    });
  }, [lastUpdatedAt]);

  function handleLogout() {
    clearToken();
    router.replace('/');
  }

  function changeView(view: DashboardView) {
    setActiveView(view);
    setIsSidebarOpen(false);
  }

  if (isLoadingUser) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#f7f8fb] px-4 text-[#4b5563]">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Cargando inicio...</span>
        </div>
      </main>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <main className="min-h-screen bg-[#f7f8fb] text-[#151922]">
      <div className="lg:grid lg:min-h-screen lg:grid-cols-[280px_1fr]">
        <aside
          className={`fixed inset-y-0 left-0 z-40 w-[280px] border-r border-[#e3e7ee] bg-white transition-transform duration-200 lg:static lg:translate-x-0 ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="flex h-full flex-col">
            <div className="flex h-16 items-center justify-between border-b border-[#eef1f5] px-4">
              <Link className="flex min-w-0 items-center gap-2" href="/dashboard">
                <Image
                  src="/assets/match-alert-isotipo.png.png"
                  alt="Match Alert"
                  width={34}
                  height={34}
                  className="h-8 w-8 object-contain"
                />
                <div className="min-w-0">
                  <span className="block truncate text-sm font-black">Match Alert</span>
                  <span className="block text-xs font-medium text-[#6b7280]">Inicio</span>
                </div>
              </Link>
              <button
                aria-label="Cerrar menu"
                className="grid h-9 w-9 place-items-center rounded-md text-[#6b7280] hover:bg-[#f2f4f7] lg:hidden"
                type="button"
                onClick={() => setIsSidebarOpen(false)}
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <nav className="flex-1 px-3 py-4">
              <div className="space-y-1">
                <button
                  className={`flex h-10 w-full items-center gap-3 rounded-md px-3 text-left text-sm font-semibold transition ${
                    activeView === 'home'
                      ? 'bg-[#101820] text-white shadow-sm'
                      : 'text-[#4b5563] hover:bg-[#f2f4f7] hover:text-[#151922]'
                  }`}
                  type="button"
                  onClick={() => changeView('home')}
                >
                  <Home className="h-4 w-4" />
                  <span>Inicio</span>
                </button>
                <button
                  className={`flex h-10 w-full items-center gap-3 rounded-md px-3 text-left text-sm font-semibold transition ${
                    activeView === 'live'
                      ? 'bg-[#101820] text-white shadow-sm'
                      : 'text-[#4b5563] hover:bg-[#f2f4f7] hover:text-[#151922]'
                  }`}
                  type="button"
                  onClick={() => changeView('live')}
                >
                  <Trophy className="h-4 w-4" />
                  <span>Partidos en vivo</span>
                </button>
              </div>
            </nav>

            <div className="border-t border-[#eef1f5] p-3">
              <div className="mb-2 flex items-center gap-3 rounded-md px-2 py-2">
                <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#e9f8ef] text-xs font-black uppercase text-[#198754]">
                  {user.name.charAt(0)}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-xs font-bold">{user.name}</p>
                  <p className="truncate text-xs text-[#6b7280]">{user.email}</p>
                </div>
              </div>
              <button
                className="flex h-10 w-full items-center gap-3 rounded-md px-3 text-left text-sm font-semibold text-[#4b5563] hover:bg-[#fff0e8] hover:text-[#ef5b2a]"
                type="button"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4" />
                <span>Cerrar sesion</span>
              </button>
            </div>
          </div>
        </aside>

        {isSidebarOpen ? (
          <button
            aria-label="Cerrar menu"
            className="fixed inset-0 z-30 bg-black/30 lg:hidden"
            type="button"
            onClick={() => setIsSidebarOpen(false)}
          />
        ) : null}

        <section className="min-w-0">
          <header className="sticky top-0 z-20 flex min-h-16 items-center gap-3 border-b border-[#e3e7ee] bg-white/92 px-4 backdrop-blur">
            <button
              aria-label="Abrir menu"
              className="grid h-9 w-9 place-items-center rounded-md border border-[#e3e7ee] text-[#4b5563] hover:bg-[#f2f4f7] lg:hidden"
              type="button"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu className="h-4 w-4" />
            </button>
            <div className="min-w-0 flex-1">
              <h1 className="truncate text-base font-bold">
                {activeView === 'home' ? 'Inicio' : 'Partidos en vivo'}
              </h1>
              <p className="truncate text-xs text-[#6b7280]">
                {activeView === 'home' ? 'Pantalla inicial de Match Alert' : 'Datos en vivo desde API-FOOTBALL'}
              </p>
            </div>
            {activeView === 'live' ? (
              <button
                className="inline-flex h-9 items-center justify-center gap-2 rounded-md border border-[#e3e7ee] bg-white px-3 text-sm font-bold text-[#151922] hover:bg-[#f2f4f7]"
                type="button"
                onClick={fetchLiveFixtures}
              >
                <RefreshCw className="h-4 w-4" />
                <span className="hidden sm:inline">Actualizar</span>
              </button>
            ) : null}
          </header>

          <div className="space-y-4 p-4">
            {activeView === 'home' ? <HomeView user={user} onOpenLive={() => changeView('live')} /> : null}
            {activeView === 'live' ? (
              <LiveFixturesView
                fixtures={liveFixtures}
                fixturesError={fixturesError}
                isLoadingFixtures={isLoadingFixtures}
                lastUpdatedLabel={lastUpdatedLabel}
              />
            ) : null}
          </div>
        </section>
      </div>
    </main>
  );
}

function HomeView({ user, onOpenLive }: { user: UserProfile; onOpenLive: () => void }) {
  return (
    <section className="rounded-md border border-[#dfe5ec] bg-white p-5 shadow-sm">
      <p className="text-xs font-black uppercase text-[#ef5b2a]">Bienvenido</p>
      <h2 className="mt-1 text-2xl font-black">Hola, {user.name}</h2>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-[#6b7280]">
        Esta es la pantalla inicial de Match Alert. Desde el menu puedes entrar a los partidos en vivo cuando quieras revisarlos.
      </p>
      <button
        className="mt-5 inline-flex h-10 items-center justify-center gap-2 rounded-md bg-[#101820] px-4 text-sm font-bold text-white hover:bg-[#24313d]"
        type="button"
        onClick={onOpenLive}
      >
        <Trophy className="h-4 w-4" />
        Ver partidos en vivo
      </button>
    </section>
  );
}

function LiveFixturesView({
  fixtures,
  fixturesError,
  isLoadingFixtures,
  lastUpdatedLabel,
}: {
  fixtures: ApiFootballLiveFixture[];
  fixturesError: string;
  isLoadingFixtures: boolean;
  lastUpdatedLabel: string;
}) {
  return (
    <section className="rounded-md border border-[#e3e7ee] bg-white shadow-sm">
      <div className="flex flex-col gap-2 border-b border-[#eef1f5] px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-sm font-bold">Partidos en vivo</h2>
          <p className="mt-1 text-xs text-[#6b7280]">Actualizacion automatica cada 10 minutos.</p>
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold text-[#6b7280]">
          <CalendarClock className="h-4 w-4" />
          <span>Ultima consulta: {lastUpdatedLabel}</span>
        </div>
      </div>

      {isLoadingFixtures ? (
        <div className="flex items-center gap-2 p-4 text-sm font-semibold text-[#6b7280]">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Cargando partidos...</span>
        </div>
      ) : null}

      {!isLoadingFixtures && fixturesError ? (
        <div className="p-4 text-sm font-semibold text-red-700">{fixturesError}</div>
      ) : null}

      {!isLoadingFixtures && !fixturesError && fixtures.length === 0 ? (
        <div className="p-4 text-sm text-[#6b7280]">No hay partidos en vivo en este momento.</div>
      ) : null}

      {!isLoadingFixtures && !fixturesError && fixtures.length > 0 ? (
        <div className="divide-y divide-[#eef1f5] p-2">
          {fixtures.map((match) => (
            <article key={match.fixture.id} className="rounded-md px-2 py-3 hover:bg-[#f7f8fb]">
              <div className="mb-3 flex items-center gap-2 text-xs font-semibold text-[#6b7280]">
                {match.league.logo ? (
                  <Image
                    src={match.league.logo}
                    alt={match.league.name}
                    width={18}
                    height={18}
                    className="h-[18px] w-[18px] object-contain"
                  />
                ) : null}
                <span className="truncate">
                  {match.league.name} - {match.league.country}
                </span>
              </div>

              <div className="grid grid-cols-[1fr_auto] items-center gap-3">
                <div className="min-w-0 space-y-2">
                  <TeamRow team={match.teams.home} />
                  <TeamRow team={match.teams.away} />
                </div>
                <div className="text-right">
                  <p className="text-2xl font-black">
                    {match.goals.home ?? 0} - {match.goals.away ?? 0}
                  </p>
                  <p className="mt-1 text-xs font-bold text-[#ef5b2a]">
                    {formatMatchStatus(match.fixture.status)}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : null}
    </section>
  );
}

function TeamRow({ team }: { team: ApiFootballTeam }) {
  return (
    <div className="flex min-w-0 items-center gap-2">
      {team.logo ? (
        <Image src={team.logo} alt={team.name} width={22} height={22} className="h-[22px] w-[22px] object-contain" />
      ) : (
        <span className="h-[22px] w-[22px] rounded-full bg-[#eef1f5]" />
      )}
      <span className="truncate text-sm font-bold">{team.name}</span>
    </div>
  );
}

function formatMatchStatus(status: ApiFootballLiveFixture['fixture']['status']) {
  if (typeof status.elapsed === 'number') {
    return `${status.elapsed}'`;
  }

  return status.short || status.long || 'En vivo';
}
