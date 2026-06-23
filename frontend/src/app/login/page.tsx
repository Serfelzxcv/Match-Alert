'use client';

import Link from 'next/link';
import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthShell } from '@/components/AuthShell';
import { api, getBackendUrl } from '@/lib/api';
import { setToken } from '@/lib/auth';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const backendUrl = getBackendUrl();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await api.post('/auth/login', { email, password });
      setToken(response.data.accessToken, rememberMe);
      router.push('/dashboard');
    } catch (requestError: any) {
      setError(requestError.response?.data?.message || 'No se pudo iniciar sesion');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <AuthShell title="Iniciar sesion" subtitle="Accede con tu email o con Google.">
      <form className="space-y-4" onSubmit={handleSubmit}>
        <label className="block">
          <span className="text-sm font-semibold text-[var(--foreground)]">Email</span>
          <input
            className="mt-1 w-full rounded-md border border-[var(--border)] bg-[var(--surface)] px-3 py-3 text-[var(--foreground)] outline-none focus:border-[var(--orange-alert)]"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </label>
        <label className="block">
          <span className="text-sm font-semibold text-[var(--foreground)]">Password</span>
          <input
            className="mt-1 w-full rounded-md border border-[var(--border)] bg-[var(--surface)] px-3 py-3 text-[var(--foreground)] outline-none focus:border-[var(--orange-alert)]"
            type="password"
            minLength={6}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </label>
        <label className="flex cursor-pointer items-center gap-2 text-sm font-semibold text-[var(--muted)]">
          <input
            checked={rememberMe}
            className="h-4 w-4 accent-[var(--orange-alert)]"
            type="checkbox"
            onChange={(event) => setRememberMe(event.target.checked)}
          />
          <span>Recordarme</span>
        </label>
        {error ? <p className="rounded-md bg-red-50 px-3 py-2 text-sm font-semibold text-red-700">{error}</p> : null}
        <button
          className="w-full rounded-md bg-[var(--orange-alert)] px-4 py-3 font-bold text-white hover:brightness-110 disabled:opacity-60"
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? 'Ingresando...' : 'Iniciar sesion'}
        </button>
      </form>

      <div className="mt-4">
        <a
          className="flex w-full items-center justify-center rounded-md border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-center font-bold text-[var(--foreground)] hover:bg-[var(--surface-2)]"
          href={`${backendUrl}/auth/google`}
        >
          Continuar con Google
        </a>
      </div>

      <p className="mt-5 text-center text-sm text-[var(--muted)]">
        No tienes cuenta?{' '}
        <Link className="font-bold text-[var(--orange-alert)]" href="/register">
          Crear cuenta
        </Link>
      </p>
    </AuthShell>
  );
}
