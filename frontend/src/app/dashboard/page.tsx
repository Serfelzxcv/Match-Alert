'use client';

import {
  Activity,
  Bell,
  CalendarClock,
  ChevronRight,
  CircleUserRound,
  Gauge,
  LayoutDashboard,
  LogOut,
  Menu,
  Search,
  Settings,
  ShieldCheck,
  Trophy,
  X,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
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

const navItems = [
  { href: '#overview', label: 'Overview', icon: LayoutDashboard, active: true },
  { href: '#activity', label: 'Activity', icon: Activity },
  { href: '#matches', label: 'Partidos', icon: Trophy },
  { href: '#alerts', label: 'Alertas', icon: Bell },
  { href: '#settings', label: 'Settings', icon: Settings },
];

const statCards = [
  { label: 'Alertas activas', value: '18', trend: '+4 esta semana', icon: Bell, tone: 'text-[#ef5b2a] bg-[#fff0e8]' },
  { label: 'Partidos seguidos', value: '32', trend: '+7 nuevos', icon: Trophy, tone: 'text-[#2563eb] bg-[#eaf1ff]' },
  { label: 'Eventos detectados', value: '126', trend: '+21 hoy', icon: Gauge, tone: 'text-[#198754] bg-[#e9f8ef]' },
  { label: 'Reglas listas', value: '9', trend: '3 en borrador', icon: ShieldCheck, tone: 'text-[#6f42c1] bg-[#f2ecff]' },
];

const recentActivity = [
  { title: 'Gol detectado en Alianza Lima vs Melgar', meta: 'Canal interno · hace 2 min', type: 'Gol' },
  { title: 'Universitario supera 65% de posesion', meta: 'Regla de control · hace 18 min', type: 'Dato' },
  { title: 'Tarjeta roja en Sporting Cristal vs Boys', meta: 'Alerta disciplinaria · hace 42 min', type: 'Roja' },
  { title: 'Cambio de cuota marcado como oportunidad', meta: 'Mercado hardcodeado · hace 1 h', type: 'Cuota' },
];

const matches = [
  { home: 'Alianza Lima', away: 'Melgar', status: 'En vivo', minute: "67'", score: '2 - 1' },
  { home: 'Sporting Cristal', away: 'Universitario', status: 'Proximo', minute: '20:30', score: '0 - 0' },
  { home: 'Cusco FC', away: 'Cienciano', status: 'Finalizado', minute: 'FT', score: '1 - 1' },
];

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
      .finally(() => setIsLoading(false));
  }, [router]);

  function handleLogout() {
    clearToken();
    router.replace('/');
  }

  if (isLoading) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#f7f8fb] px-4 text-[#4b5563]">
        <p className="text-sm font-semibold">Cargando dashboard...</p>
      </main>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <main className="min-h-screen bg-[#f7f8fb] text-[#151922]">
      <div className="lg:grid lg:min-h-screen lg:grid-cols-[264px_1fr]">
        <aside
          className={`fixed inset-y-0 left-0 z-40 w-[264px] border-r border-[#e3e7ee] bg-white transition-transform duration-200 lg:static lg:translate-x-0 ${
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
                  <span className="block text-xs font-medium text-[#6b7280]">Admin panel</span>
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
                {navItems.map((item) => (
                  <a
                    key={item.label}
                    className={`flex h-10 items-center gap-3 rounded-md px-3 text-sm font-semibold transition ${
                      item.active
                        ? 'bg-[#101820] text-white shadow-sm'
                        : 'text-[#4b5563] hover:bg-[#f2f4f7] hover:text-[#151922]'
                    }`}
                    href={item.href}
                    onClick={() => setIsSidebarOpen(false)}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </a>
                ))}
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
              <h1 className="truncate text-base font-bold">Overview</h1>
              <p className="truncate text-xs text-[#6b7280]">Match Alert dashboard</p>
            </div>
            <div className="hidden h-9 w-full max-w-[260px] items-center gap-2 rounded-md border border-[#e3e7ee] bg-[#f7f8fb] px-3 text-sm text-[#6b7280] sm:flex">
              <Search className="h-4 w-4" />
              <span>Buscar alertas</span>
            </div>
            <div className="flex items-center gap-2 rounded-md border border-[#e3e7ee] px-3 py-2 text-xs font-semibold text-[#4b5563]">
              <CircleUserRound className="h-4 w-4" />
              <span className="hidden sm:inline">{user.role}</span>
            </div>
          </header>

          <div className="space-y-4 p-4">
            <section
              id="overview"
              className="flex flex-col gap-3 rounded-md border border-[#dfe5ec] bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="text-xs font-black uppercase text-[#ef5b2a]">Panel hardcodeado</p>
                <h2 className="mt-1 text-xl font-black">Hola, {user.name}</h2>
                <p className="mt-1 text-sm text-[#6b7280]">
                  Vista clonada del template, sin IA ni conexiones a plataformas externas.
                </p>
              </div>
              <button
                className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-[#101820] px-4 text-sm font-bold text-white hover:bg-[#24313d]"
                type="button"
              >
                Nueva alerta
                <ChevronRight className="h-4 w-4" />
              </button>
            </section>

            <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {statCards.map((stat) => (
                <article key={stat.label} className="rounded-md border border-[#e3e7ee] bg-white p-4 shadow-sm">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-xs font-semibold text-[#6b7280]">{stat.label}</p>
                    <span className={`grid h-8 w-8 place-items-center rounded-md ${stat.tone}`}>
                      <stat.icon className="h-4 w-4" />
                    </span>
                  </div>
                  <p className="mt-3 text-3xl font-black">{stat.value}</p>
                  <p className="mt-1 text-xs font-semibold text-[#198754]">{stat.trend}</p>
                </article>
              ))}
            </section>

            <section className="grid gap-4 xl:grid-cols-[1fr_420px]">
              <article id="activity" className="rounded-md border border-[#e3e7ee] bg-white shadow-sm">
                <div className="flex items-center justify-between border-b border-[#eef1f5] px-4 py-3">
                  <h2 className="text-sm font-bold">Recent activity</h2>
                  <a className="text-xs font-bold text-[#ef5b2a]" href="#activity">
                    View all
                  </a>
                </div>
                <div className="divide-y divide-[#eef1f5] p-2">
                  {recentActivity.map((item) => (
                    <div key={item.title} className="flex items-start gap-3 rounded-md px-2 py-3 hover:bg-[#f7f8fb]">
                      <span className="mt-0.5 rounded-full bg-[#e9f8ef] px-2 py-1 text-[10px] font-black text-[#198754]">
                        {item.type}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold">{item.title}</p>
                        <p className="mt-1 text-xs text-[#6b7280]">{item.meta}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </article>

              <article id="matches" className="rounded-md border border-[#e3e7ee] bg-white shadow-sm">
                <div className="flex items-center justify-between border-b border-[#eef1f5] px-4 py-3">
                  <h2 className="text-sm font-bold">Partidos</h2>
                  <CalendarClock className="h-4 w-4 text-[#6b7280]" />
                </div>
                <div className="divide-y divide-[#eef1f5] p-2">
                  {matches.map((match) => (
                    <div key={`${match.home}-${match.away}`} className="rounded-md px-2 py-3 hover:bg-[#f7f8fb]">
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-sm font-bold">{match.home}</p>
                        <span className="text-sm font-black">{match.score}</span>
                      </div>
                      <div className="mt-1 flex items-center justify-between gap-3">
                        <p className="text-sm text-[#4b5563]">{match.away}</p>
                        <p className="text-xs font-semibold text-[#6b7280]">
                          {match.status} · {match.minute}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </article>
            </section>

            <section id="settings" className="rounded-md border border-[#e3e7ee] bg-white p-4 shadow-sm">
              <h2 className="text-sm font-bold">Settings</h2>
              <dl className="mt-3 divide-y divide-[#eef1f5] text-sm">
                {[
                  ['Usuario', user.name],
                  ['Email', user.email],
                  ['Proveedor', user.provider || 'LOCAL'],
                  ['Modo', 'Dashboard estatico sin integraciones externas'],
                ].map(([label, value]) => (
                  <div key={label} className="grid gap-1 py-3 sm:grid-cols-[160px_1fr]">
                    <dt className="font-semibold text-[#6b7280]">{label}</dt>
                    <dd className="break-words font-medium">{value}</dd>
                  </div>
                ))}
              </dl>
            </section>
          </div>
        </section>
      </div>
    </main>
  );
}
