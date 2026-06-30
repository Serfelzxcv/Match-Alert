import {
  BellRing,
  CalendarDays,
  Flame,
  Home,
  LogOut,
  Newspaper,
  Radio,
  Search,
  Sparkles,
  Target,
  X,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import type { ComponentType } from 'react';
import type { DashboardView, UserProfile } from './types';

interface NavItem {
  label: string;
  view: DashboardView;
  icon: ComponentType<{ className?: string }>;
  count?: number;
}

interface DashboardSidebarProps {
  activeView: DashboardView;
  isOpen: boolean;
  liveFixturesCount: number;
  user: UserProfile;
  onChangeView: (view: DashboardView) => void;
  onClose: () => void;
  onLogout: () => void;
}

export function DashboardSidebar({
  activeView,
  isOpen,
  liveFixturesCount,
  user,
  onChangeView,
  onClose,
  onLogout,
}: DashboardSidebarProps) {
  const navigationItems: NavItem[] = [
    { label: 'Inicio', view: 'home', icon: Home },
    { label: 'Buscar', view: 'search', icon: Search },
    { label: 'En vivo', view: 'live', icon: Flame, count: liveFixturesCount },
    { label: 'Calendario', view: 'today', icon: CalendarDays },
    { label: 'Noticias', view: 'news', icon: Newspaper },
  ];

  const predictionItems: NavItem[] = [
    { label: 'Oportunidades destacadas', view: 'betting-highlights', icon: Target },
    { label: 'Alertas pre-partidos', view: 'pre-match-alerts', icon: BellRing },
    { label: 'Alertas en vivo', view: 'live-alerts', icon: Radio },
  ];

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 w-[280px] border-r border-[var(--border)] bg-[var(--sidebar)] text-[var(--sidebar-foreground)] transition-transform duration-200 lg:static lg:translate-x-0 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
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
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <nav className="min-h-0 flex-1 overflow-y-auto px-3 py-4">
          <SidebarSection activeView={activeView} items={navigationItems} title="Navegacion" onChangeView={onChangeView} />
          <SidebarSection
            activeView={activeView}
            className="mt-6"
            items={predictionItems}
            title="Herramientas de pronostico"
            onChangeView={onChangeView}
          />
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
            onClick={onLogout}
          >
            <LogOut className="h-4 w-4" />
            <span>Cerrar sesion</span>
          </button>
        </div>
      </div>
    </aside>
  );
}

function SidebarSection({
  activeView,
  className = '',
  items,
  title,
  onChangeView,
}: {
  activeView: DashboardView;
  className?: string;
  items: NavItem[];
  title: string;
  onChangeView: (view: DashboardView) => void;
}) {
  return (
    <div className={className}>
      <p className="mb-2 px-2 text-[10px] font-black uppercase tracking-wide text-[var(--sidebar-muted)]">{title}</p>
      <div className="space-y-1">
        {items.map((item) => (
          <SidebarButton key={item.view} active={activeView === item.view} item={item} onChangeView={onChangeView} />
        ))}
      </div>
    </div>
  );
}

function SidebarButton({
  active,
  item,
  onChangeView,
}: {
  active: boolean;
  item: NavItem;
  onChangeView: (view: DashboardView) => void;
}) {
  const Icon = item.icon;

  return (
    <button
      className={`flex h-8 w-full items-center gap-3 rounded-md px-2 text-left text-sm font-semibold transition ${
        active
          ? 'bg-[var(--sidebar-active)] text-[var(--sidebar-foreground)] shadow-sm'
          : 'text-[var(--sidebar-muted)] hover:bg-[var(--sidebar-hover)] hover:text-[var(--sidebar-foreground)]'
      }`}
      type="button"
      onClick={() => onChangeView(item.view)}
    >
      <Icon className="h-4 w-4 shrink-0" />
      <span className="min-w-0 flex-1 truncate">{item.label}</span>
      {typeof item.count === 'number' ? (
        <span className="grid h-5 min-w-5 place-items-center rounded-sm bg-[var(--warning-soft)] px-1.5 text-[10px] font-black text-[var(--orange-alert)]">
          {item.count}
        </span>
      ) : null}
      {item.view === 'betting-highlights' ? <Sparkles className="h-3.5 w-3.5 shrink-0 text-[var(--orange-alert)]" /> : null}
    </button>
  );
}
