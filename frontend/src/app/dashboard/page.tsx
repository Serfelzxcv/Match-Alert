'use client';

import { BellRing, Loader2, Menu, Newspaper, Radio, RefreshCw, Search, Target } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { api, getBackendUrl } from '@/lib/api';
import { clearToken, getToken } from '@/lib/auth';
import { DashboardSidebar } from './_components/dashboard-sidebar';
import { FixtureDetailDialog } from './_components/fixture-detail-dialog';
import { HomeView } from './_components/home-view';
import { LiveFixturesView } from './_components/live-fixtures-view';
import { ToolPlaceholderView } from './_components/tool-placeholder-view';
import type { ApiFootballLiveFixture, DashboardView, LiveFixturesResponse, UserProfile } from './_components/types';

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

    const streamUrl = `${getBackendUrl()}/football/fixtures/today/stream?token=${encodeURIComponent(token)}&date=${encodeURIComponent(
      selectedCalendarDate,
    )}`;
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

  const lastUpdatedLabel = useMemo(() => formatUpdatedAt(lastUpdatedAt), [lastUpdatedAt]);
  const todayLastUpdatedLabel = useMemo(() => formatUpdatedAt(todayLastUpdatedAt), [todayLastUpdatedAt]);

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
        <DashboardSidebar
          activeView={activeView}
          isOpen={isSidebarOpen}
          liveFixturesCount={liveFixtures.length}
          user={user}
          onChangeView={changeView}
          onClose={() => setIsSidebarOpen(false)}
          onLogout={handleLogout}
        />

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
            {renderDashboardView({
              activeView,
              fixturesError,
              isLoadingFixtures,
              isLoadingTodayFixtures,
              lastUpdatedLabel,
              liveFixtures,
              selectedCalendarDate,
              todayFixtures,
              todayFixturesError,
              todayLastUpdatedLabel,
              user,
              onChangeView: changeView,
              onSelectedDateChange: setSelectedCalendarDate,
              onSelectFixture: setSelectedFixture,
            })}
          </div>
        </section>
      </div>
      {selectedFixture ? <FixtureDetailDialog fixture={selectedFixture} onClose={() => setSelectedFixture(null)} /> : null}
    </main>
  );
}

function renderDashboardView({
  activeView,
  fixturesError,
  isLoadingFixtures,
  isLoadingTodayFixtures,
  lastUpdatedLabel,
  liveFixtures,
  selectedCalendarDate,
  todayFixtures,
  todayFixturesError,
  todayLastUpdatedLabel,
  user,
  onChangeView,
  onSelectedDateChange,
  onSelectFixture,
}: {
  activeView: DashboardView;
  fixturesError: string;
  isLoadingFixtures: boolean;
  isLoadingTodayFixtures: boolean;
  lastUpdatedLabel: string;
  liveFixtures: ApiFootballLiveFixture[];
  selectedCalendarDate: string;
  todayFixtures: ApiFootballLiveFixture[];
  todayFixturesError: string;
  todayLastUpdatedLabel: string;
  user: UserProfile;
  onChangeView: (view: DashboardView) => void;
  onSelectedDateChange: (date: string) => void;
  onSelectFixture: (fixture: ApiFootballLiveFixture) => void;
}) {
  if (activeView === 'home') {
    return <HomeView user={user} onOpenLive={() => onChangeView('live')} onOpenToday={() => onChangeView('today')} />;
  }

  if (activeView === 'live') {
    return (
      <LiveFixturesView
        title="Partidos en vivo"
        description="Actualizacion automatica cada 10 minutos."
        emptyLabel="No hay partidos en vivo en este momento."
        statusLabel="En vivo"
        fixtures={liveFixtures}
        fixturesError={fixturesError}
        isLoadingFixtures={isLoadingFixtures}
        lastUpdatedLabel={lastUpdatedLabel}
        onSelectFixture={onSelectFixture}
      />
    );
  }

  if (activeView === 'today') {
    return (
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
        onSelectedDateChange={onSelectedDateChange}
        onSelectFixture={onSelectFixture}
      />
    );
  }

  const placeholderContent = {
    search: {
      title: 'Buscar',
      description: 'Busca equipos, ligas y partidos desde una vista dedicada.',
      icon: Search,
    },
    news: {
      title: 'Noticias',
      description: 'Espacio reservado para novedades y contexto relevante de los partidos.',
      icon: Newspaper,
    },
    'betting-highlights': {
      title: 'Oportunidades destacadas',
      description: 'Vista preparada para listar partidos con mayor interes para evaluar apuestas.',
      icon: Target,
    },
    'pre-match-alerts': {
      title: 'Alertas pre-partidos',
      description: 'Vista preparada para alertas antes del inicio segun tus criterios de pronostico.',
      icon: BellRing,
    },
    'live-alerts': {
      title: 'Alertas en vivo',
      description: 'Vista preparada para alertas durante partidos activos.',
      icon: Radio,
    },
  } satisfies Record<Exclude<DashboardView, 'home' | 'live' | 'today'>, Parameters<typeof ToolPlaceholderView>[0]>;

  return <ToolPlaceholderView {...placeholderContent[activeView]} />;
}

function getViewTitle(view: DashboardView) {
  const titles: Record<DashboardView, string> = {
    home: 'Inicio',
    search: 'Buscar',
    live: 'Partidos en vivo',
    today: 'Partidos del dia',
    news: 'Noticias',
    'betting-highlights': 'Oportunidades destacadas',
    'pre-match-alerts': 'Alertas pre-partidos',
    'live-alerts': 'Alertas en vivo',
  };

  return titles[view];
}

function getViewDescription(view: DashboardView) {
  const descriptions: Record<DashboardView, string> = {
    home: 'Pantalla inicial de Match Alert',
    search: 'Encuentra partidos, equipos y ligas',
    live: 'Datos en vivo desde API-FOOTBALL',
    today: 'Programacion y resultados de hoy en hora peruana',
    news: 'Actualidad del futbol y contexto de partidos',
    'betting-highlights': 'Partidos relevantes para evaluar oportunidades',
    'pre-match-alerts': 'Avisos antes de que empiece el partido',
    'live-alerts': 'Avisos durante el desarrollo del partido',
  };

  return descriptions[view];
}

function formatUpdatedAt(date: Date | null) {
  if (!date) {
    return 'Esperando datos';
  }

  return date.toLocaleTimeString('es-PE', {
    hour: '2-digit',
    minute: '2-digit',
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
