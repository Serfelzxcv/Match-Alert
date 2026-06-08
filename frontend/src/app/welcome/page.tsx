'use client';

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

const alertRows = [
  { match: 'Alianza Lima vs Melgar', rule: 'Gol despues del minuto 30', status: 'Activa' },
  { match: 'Sporting Cristal vs Universitario', rule: 'Empate en vivo', status: 'Activa' },
  { match: 'Cusco FC vs Cienciano', rule: 'Cambio fuerte de cuota', status: 'Borrador' },
];

export default function WelcomePage() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = getToken();

    if (!token) {
      router.replace('/login');
      return;
    }

    api
      .get<UserProfile>('/auth/me')
      .then((response) => setUser(response.data))
      .catch(() => {
        clearToken();
        router.replace('/login');
      })
      .finally(() => setIsLoading(false));
  }, [router]);

  function handleLogout() {
    clearToken();
    router.replace('/login');
  }

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f4f7f3] px-4">
        <p className="font-semibold text-[#52635a]">Cargando panel...</p>
      </main>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <main className="min-h-screen bg-[#f4f7f3] px-5 py-6 lg:px-8">
      <section className="mx-auto w-full max-w-6xl">
        <header className="flex flex-col gap-4 rounded-lg border border-[#d7ded5] bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link href="/" className="text-sm font-black uppercase text-[#2f7d55]">
              Match Alert
            </Link>
            <h1 className="mt-2 text-3xl font-black text-[#14211c]">Hola, {user.name}</h1>
            <p className="mt-1 text-sm text-[#52635a]">Tu tablero inicial de alertas deportivas.</p>
          </div>
          <button
            className="rounded-md border border-[#cfd8cf] px-4 py-2 font-bold text-[#14211c] hover:bg-[#eef3ee]"
            type="button"
            onClick={handleLogout}
          >
            Cerrar sesion
          </button>
        </header>

        <div className="mt-5 grid gap-5 lg:grid-cols-[300px_1fr]">
          <aside className="rounded-lg border border-[#d7ded5] bg-white p-5 shadow-sm">
            <h2 className="text-lg font-black text-[#14211c]">Perfil</h2>
            <dl className="mt-5 grid gap-4 text-sm">
              <div>
                <dt className="font-bold text-[#52635a]">Email</dt>
                <dd className="mt-1 break-words text-[#14211c]">{user.email}</dd>
              </div>
              <div>
                <dt className="font-bold text-[#52635a]">Telefono</dt>
                <dd className="mt-1 text-[#14211c]">{user.phone || 'Sin registrar'}</dd>
              </div>
              <div>
                <dt className="font-bold text-[#52635a]">Proveedor</dt>
                <dd className="mt-1 text-[#14211c]">{user.provider || 'LOCAL'}</dd>
              </div>
              <div>
                <dt className="font-bold text-[#52635a]">Rol</dt>
                <dd className="mt-1 text-[#14211c]">{user.role}</dd>
              </div>
            </dl>
          </aside>

          <section className="grid gap-5">
            <div className="grid gap-3 sm:grid-cols-3">
              {[
                ['Alertas activas', '2'],
                ['Partidos seguidos', '3'],
                ['Canales listos', 'Email'],
              ].map(([label, value]) => (
                <div key={label} className="rounded-lg border border-[#d7ded5] bg-white p-5 shadow-sm">
                  <p className="text-sm font-bold text-[#52635a]">{label}</p>
                  <p className="mt-3 text-3xl font-black text-[#14211c]">{value}</p>
                </div>
              ))}
            </div>

            <div className="rounded-lg border border-[#d7ded5] bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between border-b border-[#e4e9e2] pb-4">
                <div>
                  <h2 className="text-xl font-black text-[#14211c]">Alertas recientes</h2>
                  <p className="mt-1 text-sm text-[#52635a]">Vista inicial mientras conectamos reglas reales.</p>
                </div>
                <button className="rounded-md bg-[#f15b2a] px-4 py-2 text-sm font-bold text-white" type="button">
                  Nueva alerta
                </button>
              </div>
              <div className="mt-4 grid gap-3">
                {alertRows.map((row) => (
                  <div
                    key={row.match}
                    className="grid gap-2 rounded-md border border-[#e1e7df] p-4 text-sm md:grid-cols-[1fr_1fr_auto] md:items-center"
                  >
                    <p className="font-bold text-[#14211c]">{row.match}</p>
                    <p className="text-[#52635a]">{row.rule}</p>
                    <span className="w-fit rounded-full bg-[#eef3ee] px-3 py-1 text-xs font-black text-[#2f7d55]">
                      {row.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}
