'use client';

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
      <main className="flex min-h-screen items-center justify-center px-4">
        <p className="text-gray-700">Cargando...</p>
      </main>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <main className="min-h-screen px-4 py-10">
      <section className="mx-auto w-full max-w-2xl rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-emerald-700">Match Alert</p>
            <h1 className="mt-2 text-3xl font-bold text-gray-950">Bienvenido</h1>
          </div>
          <button
            className="rounded-md border border-gray-300 px-4 py-2 font-semibold text-gray-900 hover:bg-gray-50"
            type="button"
            onClick={handleLogout}
          >
            Cerrar sesión
          </button>
        </div>

        <dl className="mt-8 grid gap-4 rounded-md bg-gray-50 p-4">
          <div>
            <dt className="text-sm font-medium text-gray-500">Nombre</dt>
            <dd className="mt-1 text-gray-950">{user.name}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Email</dt>
            <dd className="mt-1 text-gray-950">{user.email}</dd>
          </div>
          {user.phone ? (
            <div>
              <dt className="text-sm font-medium text-gray-500">Phone</dt>
              <dd className="mt-1 text-gray-950">{user.phone}</dd>
            </div>
          ) : null}
          <div>
            <dt className="text-sm font-medium text-gray-500">Provider</dt>
            <dd className="mt-1 text-gray-950">{user.provider || 'LOCAL'}</dd>
          </div>
        </dl>
      </section>
    </main>
  );
}
