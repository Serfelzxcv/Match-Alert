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
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const backendUrl = getBackendUrl();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await api.post('/auth/login', { email, password });
      setToken(response.data.accessToken);
      router.push('/welcome');
    } catch (requestError: any) {
      setError(requestError.response?.data?.message || 'No se pudo iniciar sesión');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <AuthShell title="Iniciar sesión" subtitle="Accede con email o con un proveedor OAuth.">
      <form className="space-y-4" onSubmit={handleSubmit}>
        <label className="block">
          <span className="text-sm font-medium text-gray-700">Email</span>
          <input
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-emerald-700"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-gray-700">Password</span>
          <input
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-emerald-700"
            type="password"
            minLength={6}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </label>
        {error ? <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}
        <button
          className="w-full rounded-md bg-emerald-700 px-4 py-3 font-semibold text-white hover:bg-emerald-800 disabled:opacity-60"
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? 'Ingresando...' : 'Iniciar sesión'}
        </button>
      </form>
      <div className="mt-4 grid gap-3">
        <a className="rounded-md border border-gray-300 px-4 py-3 text-center font-semibold" href={`${backendUrl}/auth/google`}>
          Iniciar sesión con Google
        </a>
        <a className="rounded-md border border-gray-300 px-4 py-3 text-center font-semibold" href={`${backendUrl}/auth/facebook`}>
          Iniciar sesión con Facebook
        </a>
      </div>
      <p className="mt-5 text-center text-sm text-gray-600">
        ¿No tienes cuenta?{' '}
        <Link className="font-semibold text-emerald-700" href="/register">
          Regístrate
        </Link>
      </p>
    </AuthShell>
  );
}
