'use client';

import {
  CalendarClock,
  CalendarDays,
  CircleDollarSign,
  Flame,
  Home,
  Loader2,
  LogOut,
  MapPin,
  Menu,
  Newspaper,
  RefreshCw,
  Shield,
  ShieldPlus,
  Trophy,
  UserRound,
  X,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { api, getBackendUrl } from '@/lib/api';
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
  winner?: boolean | null;
}

interface ApiFootballScorePair {
  home: number | null;
  away: number | null;
}

interface ApiFootballEvent {
  time: {
    elapsed: number;
    extra?: number | null;
  };
  team: ApiFootballTeam;
  player: {
    id?: number | null;
    name?: string | null;
  };
  assist: {
    id?: number | null;
    name?: string | null;
  };
  type: string;
  detail: string;
  comments?: string | null;
}

interface ApiFootballLiveFixture {
  fixture: {
    id: number;
    referee?: string | null;
    timezone?: string;
    date?: string;
    timestamp?: number;
    periods?: {
      first?: number | null;
      second?: number | null;
    };
    venue?: {
      id?: number | null;
      name?: string | null;
      city?: string | null;
    };
    status: {
      elapsed?: number | null;
      long?: string;
      short?: string;
      extra?: number | null;
    };
  };
  league: {
    id?: number;
    name: string;
    country: string;
    logo?: string;
    flag?: string;
    season?: number;
    round?: string;
    standings?: boolean;
  };
  teams: {
    home: ApiFootballTeam;
    away: ApiFootballTeam;
  };
  goals: {
    home: number | null;
    away: number | null;
  };
  score?: {
    halftime?: ApiFootballScorePair;
    fulltime?: ApiFootballScorePair;
    extratime?: ApiFootballScorePair;
    penalty?: ApiFootballScorePair;
  };
  events?: ApiFootballEvent[];
}

interface LiveFixturesResponse {
  response: ApiFootballLiveFixture[];
}

type DashboardView = 'home' | 'live' | 'today';

const popularLeagues = [
  { name: 'UEFA Champions League', count: 38, icon: Trophy },
  { name: 'Europa League', count: 41, icon: ShieldPlus },
  { name: 'Premier League', count: 153, icon: Trophy },
  { name: 'La Liga', count: 120, icon: Trophy },
  { name: 'Serie A', count: 135, icon: Trophy },
  { name: 'Bundesliga', count: 140, icon: Trophy },
  { name: 'Ligue 1', count: 110, icon: Trophy },
];

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
  const [todayFixtures, setTodayFixtures] = useState<ApiFootballLiveFixture[]>([]);
  const [isLoadingTodayFixtures, setIsLoadingTodayFixtures] = useState(false);
  const [todayFixturesError, setTodayFixturesError] = useState('');
  const [todayLastUpdatedAt, setTodayLastUpdatedAt] = useState<Date | null>(null);
  const [selectedCalendarDate, setSelectedCalendarDate] = useState(() => getPeruDateInputValue());
  const [selectedFixture, setSelectedFixture] = useState<ApiFootballLiveFixture | null>(null);

  const applyLiveFixtures = useCallback((fixtures: ApiFootballLiveFixture[]) => {
    setLiveFixtures(fixtures);
    setSelectedFixture((currentFixture) => {
      if (!currentFixture) {
        return null;
      }

      return fixtures.find((fixture) => fixture.fixture.id === currentFixture.fixture.id) ?? currentFixture;
    });
    setLastUpdatedAt(new Date());
  }, []);

  const applyTodayFixtures = useCallback((fixtures: ApiFootballLiveFixture[]) => {
    setTodayFixtures(fixtures);
    setSelectedFixture((currentFixture) => {
      if (!currentFixture) {
        return null;
      }

      return fixtures.find((fixture) => fixture.fixture.id === currentFixture.fixture.id) ?? currentFixture;
    });
    setTodayLastUpdatedAt(new Date());
  }, []);

  const fetchLiveFixtures = useCallback(async () => {
    setFixturesError('');

    setIsLoadingFixtures(true);

    try {
      const response = await api.get<LiveFixturesResponse>('/football/fixtures/live');
      applyLiveFixtures(response.data.response ?? []);
    } catch (error: any) {
      setFixturesError(error.response?.data?.message || 'No se pudieron cargar los partidos en vivo.');
    } finally {
      setIsLoadingFixtures(false);
    }
  }, [applyLiveFixtures]);

  const fetchTodayFixtures = useCallback(async () => {
    setTodayFixturesError('');
    setIsLoadingTodayFixtures(true);

    try {
      const response = await api.get<LiveFixturesResponse>('/football/fixtures/today', {
        params: { date: selectedCalendarDate },
      });
      applyTodayFixtures(response.data.response ?? []);
    } catch (error: any) {
      setTodayFixturesError(error.response?.data?.message || 'No se pudieron cargar los partidos del dia.');
    } finally {
      setIsLoadingTodayFixtures(false);
    }
  }, [applyTodayFixtures, selectedCalendarDate]);

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

    const token = getToken();

    if (!token) {
      return;
    }

    setIsLoadingFixtures(true);
    setFixturesError('');

    const streamUrl = `${getBackendUrl()}/football/fixtures/live/stream?token=${encodeURIComponent(token)}`;
    const eventSource = new EventSource(streamUrl);

    function handleLiveFixtures(event: MessageEvent<string>) {
      const payload = JSON.parse(event.data) as LiveFixturesResponse;
      applyLiveFixtures(payload.response ?? []);
      setFixturesError('');
      setIsLoadingFixtures(false);
    }

    function handleLiveFixturesError(event: MessageEvent<string>) {
      const payload = JSON.parse(event.data) as { message?: string };
      setFixturesError(payload.message || 'No se pudieron cargar los partidos en vivo.');
      setIsLoadingFixtures(false);
    }

    eventSource.addEventListener('live-fixtures', handleLiveFixtures);
    eventSource.addEventListener('live-fixtures-error', handleLiveFixturesError);
    eventSource.onerror = () => {
      setFixturesError('Conexion en vivo interrumpida. Reintentando...');
      setIsLoadingFixtures(false);
    };

    return () => {
      eventSource.removeEventListener('live-fixtures', handleLiveFixtures);
      eventSource.removeEventListener('live-fixtures-error', handleLiveFixturesError);
      eventSource.close();
    };
  }, [activeView, applyLiveFixtures, user]);

  useEffect(() => {
    if (!user || activeView !== 'today') {
      return;
    }

    const token = getToken();

    if (!token) {
      return;
    }

    setIsLoadingTodayFixtures(true);
    setTodayFixturesError('');

    const streamUrl = `${getBackendUrl()}/football/fixtures/today/stream?token=${encodeURIComponent(token)}&date=${encodeURIComponent(selectedCalendarDate)}`;
    const eventSource = new EventSource(streamUrl);

    function handleTodayFixtures(event: MessageEvent<string>) {
      const payload = JSON.parse(event.data) as LiveFixturesResponse;
      applyTodayFixtures(payload.response ?? []);
      setTodayFixturesError('');
      setIsLoadingTodayFixtures(false);
    }

    function handleTodayFixturesError(event: MessageEvent<string>) {
      const payload = JSON.parse(event.data) as { message?: string };
      setTodayFixturesError(payload.message || 'No se pudieron cargar los partidos del dia.');
      setIsLoadingTodayFixtures(false);
    }

    eventSource.addEventListener('today-fixtures', handleTodayFixtures);
    eventSource.addEventListener('today-fixtures-error', handleTodayFixturesError);
    eventSource.onerror = () => {
      setTodayFixturesError('Conexion de partidos del dia interrumpida. Reintentando...');
      setIsLoadingTodayFixtures(false);
    };

    return () => {
      eventSource.removeEventListener('today-fixtures', handleTodayFixtures);
      eventSource.removeEventListener('today-fixtures-error', handleTodayFixturesError);
      eventSource.close();
    };
  }, [activeView, applyTodayFixtures, selectedCalendarDate, user]);

  const lastUpdatedLabel = useMemo(() => {
    if (!lastUpdatedAt) {
      return 'Esperando datos';
    }

    return lastUpdatedAt.toLocaleTimeString('es-PE', {
      hour: '2-digit',
      minute: '2-digit',
    });
  }, [lastUpdatedAt]);

  const todayLastUpdatedLabel = useMemo(() => {
    if (!todayLastUpdatedAt) {
      return 'Esperando datos';
    }

    return todayLastUpdatedAt.toLocaleTimeString('es-PE', {
      hour: '2-digit',
      minute: '2-digit',
    });
  }, [todayLastUpdatedAt]);

  function handleLogout() {
    clearToken();
    router.replace('/');
  }

  function changeView(view: DashboardView) {
    setActiveView(view);
    setIsSidebarOpen(false);
  }

  function handleSelectFixture(fixture: ApiFootballLiveFixture) {
    setSelectedFixture(fixture);
  }

  if (isLoadingUser) {
    return (
      <main className="grid min-h-screen place-items-center bg-[var(--background)] px-4 text-[var(--muted)]">
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
    <main className="h-screen overflow-hidden bg-[var(--background)] text-[var(--foreground)]">
      <div className="h-full lg:grid lg:grid-cols-[280px_1fr]">
        <aside
          className={`fixed inset-y-0 left-0 z-40 w-[280px] border-r border-[var(--border)] bg-[var(--sidebar)] text-[var(--sidebar-foreground)] transition-transform duration-200 lg:static lg:translate-x-0 ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="flex h-full flex-col">
            <div className="flex h-16 items-center justify-between border-b border-[var(--border)] px-4">
              <Link className="flex min-w-0 items-center gap-2" href="/dashboard">
                <Image
                  src="/assets/match-alert-isotipo.png.png"
                  alt="Match Alert"
                  width={34}
                  height={34}
                  className="h-8 w-8 object-contain"
                />
                <div className="min-w-0">
                  <span className="block truncate text-sm font-black text-[var(--sidebar-foreground)]">Match Alert</span>
                  <span className="block text-xs font-medium text-[var(--sidebar-muted)]">Alertas de futbol</span>
                </div>
              </Link>
              <button
                aria-label="Cerrar menu"
                className="grid h-9 w-9 place-items-center rounded-md text-[var(--sidebar-muted)] hover:bg-[var(--sidebar-hover)] lg:hidden"
                type="button"
                onClick={() => setIsSidebarOpen(false)}
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <nav className="min-h-0 flex-1 overflow-y-auto px-3 py-4">
              <p className="mb-2 px-2 text-[10px] font-black uppercase tracking-wide text-[var(--sidebar-muted)]">Navegacion</p>
              <div className="space-y-1">
                <button
                  className={`flex h-8 w-full items-center gap-3 rounded-md px-2 text-left text-sm font-semibold transition ${
                    activeView === 'home'
                      ? 'bg-[var(--sidebar-active)] text-[var(--sidebar-foreground)] shadow-sm'
                      : 'text-[var(--sidebar-muted)] hover:bg-[var(--sidebar-hover)] hover:text-[var(--sidebar-foreground)]'
                  }`}
                  type="button"
                  onClick={() => changeView('home')}
                >
                  <Home className="h-4 w-4" />
                  <span>Inicio</span>
                </button>
                <button
                  className={`flex h-8 w-full items-center gap-3 rounded-md px-2 text-left text-sm font-semibold transition ${
                    activeView === 'live'
                      ? 'bg-[var(--sidebar-active)] text-[var(--sidebar-foreground)] shadow-sm'
                      : 'text-[var(--sidebar-muted)] hover:bg-[var(--sidebar-hover)] hover:text-[var(--sidebar-foreground)]'
                  }`}
                  type="button"
                  onClick={() => changeView('live')}
                >
                  <Flame className="h-4 w-4" />
                  <span className="min-w-0 flex-1">En vivo</span>
                  <span className="grid h-5 min-w-5 place-items-center rounded-sm bg-[var(--warning-soft)] px-1.5 text-[10px] font-black text-[var(--orange-alert)]">
                    {liveFixtures.length}
                  </span>
                </button>
                <button
                  className={`flex h-8 w-full items-center gap-3 rounded-md px-2 text-left text-sm font-semibold transition ${
                    activeView === 'today'
                      ? 'bg-[var(--sidebar-active)] text-[var(--sidebar-foreground)] shadow-sm'
                      : 'text-[var(--sidebar-muted)] hover:bg-[var(--sidebar-hover)] hover:text-[var(--sidebar-foreground)]'
                  }`}
                  type="button"
                  onClick={() => changeView('today')}
                >
                  <CalendarDays className="h-4 w-4" />
                  <span>Calendario</span>
                </button>
                <button
                  className="flex h-8 w-full items-center gap-3 rounded-md px-2 text-left text-sm font-semibold text-[var(--sidebar-muted)] transition hover:bg-[var(--sidebar-hover)] hover:text-[var(--sidebar-foreground)]"
                  type="button"
                >
                  <Newspaper className="h-4 w-4" />
                  <span>Noticias</span>
                </button>
                <button
                  className="flex h-8 w-full items-center gap-3 rounded-md px-2 text-left text-sm font-semibold text-[var(--sidebar-muted)] transition hover:bg-[var(--sidebar-hover)] hover:text-[var(--sidebar-foreground)]"
                  type="button"
                >
                  <CircleDollarSign className="h-4 w-4" />
                  <span>Suscripcion</span>
                </button>
              </div>

              <div className="mt-6">
                <p className="mb-2 px-2 text-[10px] font-black uppercase tracking-wide text-[var(--sidebar-muted)]">Ligas populares</p>
                <div className="space-y-1">
                  {popularLeagues.map((league) => (
                    <button
                      key={league.name}
                      className={`flex h-8 w-full items-center gap-3 rounded-md px-2 text-left text-sm font-semibold transition ${
                        league.name === 'Premier League'
                          ? 'bg-[var(--sidebar-active)] text-[var(--sidebar-foreground)]'
                          : 'text-[var(--sidebar-muted)] hover:bg-[var(--sidebar-hover)] hover:text-[var(--sidebar-foreground)]'
                      }`}
                      type="button"
                    >
                      <league.icon className="h-4 w-4 shrink-0 text-[var(--sidebar-muted)]" />
                      <span className="min-w-0 flex-1 truncate">{league.name}</span>
                      <span className="text-[11px] font-bold text-[var(--sidebar-muted)]">{league.count}</span>
                    </button>
                  ))}
                </div>
                <button
                  className="mt-2 flex h-8 w-full items-center justify-between rounded-md px-2 text-left text-sm font-semibold text-[var(--sidebar-foreground)] transition hover:bg-[var(--sidebar-hover)]"
                  type="button"
                >
                  <span>Ver todas las ligas</span>
                  <span className="text-[var(--sidebar-muted)]">&gt;</span>
                </button>
              </div>
            </nav>

            <div className="border-t border-[var(--border)] p-3">
              <div className="mb-2 flex items-center gap-3 rounded-md px-2 py-2">
                <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[var(--accent-soft)] text-xs font-black uppercase text-[var(--green-opportunity)]">
                  {user.name.charAt(0)}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-xs font-bold text-[var(--sidebar-foreground)]">{user.name}</p>
                  <p className="truncate text-xs text-[var(--sidebar-muted)]">{user.email}</p>
                </div>
              </div>
              <button
                className="flex h-9 w-full items-center gap-3 rounded-md px-2 text-left text-sm font-semibold text-[var(--sidebar-muted)] hover:bg-[var(--sidebar-hover)] hover:text-[var(--orange-alert)]"
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

        <section className="flex min-h-0 min-w-0 flex-col">
          <header className="sticky top-0 z-20 flex min-h-16 shrink-0 items-center gap-3 border-b border-[var(--border)] bg-[var(--surface)]/92 px-4 backdrop-blur">
            <button
              aria-label="Abrir menu"
              className="grid h-9 w-9 place-items-center rounded-md border border-[var(--border)] text-[var(--muted)] hover:bg-[var(--surface-2)] lg:hidden"
              type="button"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu className="h-4 w-4" />
            </button>
            <div className="min-w-0 flex-1">
              <h1 className="truncate text-base font-bold">{getViewTitle(activeView)}</h1>
              <p className="truncate text-xs text-[var(--muted)]">{getViewDescription(activeView)}</p>
            </div>
            <ThemeToggle />
            {activeView === 'live' || activeView === 'today' ? (
              <button
                className="inline-flex h-9 items-center justify-center gap-2 rounded-md border border-[var(--border)] bg-[var(--surface)] px-3 text-sm font-bold text-[var(--foreground)] hover:bg-[var(--surface-2)]"
                type="button"
                onClick={activeView === 'live' ? fetchLiveFixtures : fetchTodayFixtures}
              >
                <RefreshCw className="h-4 w-4" />
                <span className="hidden sm:inline">Actualizar</span>
              </button>
            ) : null}
          </header>

          <div className="min-h-0 flex-1 overflow-hidden p-4">
            {activeView === 'home' ? (
              <HomeView user={user} onOpenLive={() => changeView('live')} onOpenToday={() => changeView('today')} />
            ) : null}
            {activeView === 'live' ? (
              <LiveFixturesView
                title="Partidos en vivo"
                description="Actualizacion automatica cada 10 minutos."
                emptyLabel="No hay partidos en vivo en este momento."
                statusLabel="En vivo"
                fixtures={liveFixtures}
                fixturesError={fixturesError}
                isLoadingFixtures={isLoadingFixtures}
                lastUpdatedLabel={lastUpdatedLabel}
                onSelectFixture={handleSelectFixture}
              />
            ) : null}
            {activeView === 'today' ? (
              <LiveFixturesView
                title="Partidos del dia"
                description="Horarios en hora peruana. Resultados actualizados cada 10 minutos."
                emptyLabel="No hay partidos programados para hoy."
                statusLabel="Hoy"
                fixtures={todayFixtures}
                fixturesError={todayFixturesError}
                isLoadingFixtures={isLoadingTodayFixtures}
                lastUpdatedLabel={todayLastUpdatedLabel}
                selectedDate={selectedCalendarDate}
                onSelectedDateChange={setSelectedCalendarDate}
                onSelectFixture={handleSelectFixture}
              />
            ) : null}
          </div>
        </section>
      </div>
      {selectedFixture ? (
        <FixtureDetailDialog fixture={selectedFixture} onClose={() => setSelectedFixture(null)} />
      ) : null}
    </main>
  );
}

function HomeView({
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

function LiveFixturesView({
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

function FixtureDetailDialog({
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
            <DetailItem
              icon={<MapPin className="h-4 w-4" />}
              label="Estadio"
              value={formatVenue(fixture.fixture.venue)}
            />
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
                          {event.player?.name ? ` · ${event.player.name}` : ''}
                          {event.assist?.name ? ` · Asistencia: ${event.assist.name}` : ''}
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

function DetailItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
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

function getViewTitle(view: DashboardView) {
  if (view === 'live') {
    return 'Partidos en vivo';
  }

  if (view === 'today') {
    return 'Partidos del dia';
  }

  return 'Inicio';
}

function getViewDescription(view: DashboardView) {
  if (view === 'live') {
    return 'Datos en vivo desde API-FOOTBALL';
  }

  if (view === 'today') {
    return 'Programacion y resultados de hoy en hora peruana';
  }

  return 'Pantalla inicial de Match Alert';
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

function getPeruDateInputValue() {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Lima',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(new Date());

  const year = parts.find((part) => part.type === 'year')?.value;
  const month = parts.find((part) => part.type === 'month')?.value;
  const day = parts.find((part) => part.type === 'day')?.value;

  return `${year}-${month}-${day}`;
}

function formatMatchStatus(status: ApiFootballLiveFixture['fixture']['status']) {
  if (typeof status.elapsed === 'number') {
    return `${status.elapsed}${status.extra ? `+${status.extra}` : ''}'`;
  }

  return status.short || status.long || 'En vivo';
}

