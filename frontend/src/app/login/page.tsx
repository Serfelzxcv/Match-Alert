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
          <span className="text-sm font-semibold text-[#263b33]">Email</span>
          <input
            className="mt-1 w-full rounded-md border border-[#cfd8cf] px-3 py-3 outline-none focus:border-[#2f7d55]"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </label>
        <label className="block">
          <span className="text-sm font-semibold text-[#263b33]">Password</span>
          <input
            className="mt-1 w-full rounded-md border border-[#cfd8cf] px-3 py-3 outline-none focus:border-[#2f7d55]"
            type="password"
            minLength={6}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </label>
        {error ? <p className="rounded-md bg-red-50 px-3 py-2 text-sm font-semibold text-red-700">{error}</p> : null}
        <button
          className="w-full rounded-md bg-[#14211c] px-4 py-3 font-bold text-white hover:bg-[#21372f] disabled:opacity-60"
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? 'Ingresando...' : 'Iniciar sesion'}
        </button>
      </form>

      <div className="mt-4">
        <a
          className="flex w-full items-center justify-center rounded-md border border-[#cfd8cf] px-4 py-3 text-center font-bold text-[#14211c]"
          href={`${backendUrl}/auth/google`}
        >
          Continuar con Google
        </a>
      </div>

      <p className="mt-5 text-center text-sm text-[#52635a]">
        No tienes cuenta?{' '}
        <Link className="font-bold text-[#2f7d55]" href="/register">
          Crear cuenta
        </Link>
      </p>
    </AuthShell>
  );
}
