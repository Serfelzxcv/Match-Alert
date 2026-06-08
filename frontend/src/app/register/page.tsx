'use client';

import Link from 'next/link';
import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthShell } from '@/components/AuthShell';
import { api, getBackendUrl } from '@/lib/api';
import { setToken } from '@/lib/auth';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const backendUrl = getBackendUrl();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await api.post('/auth/register', { name, email, password, phone });
      setToken(response.data.accessToken);
      router.push('/welcome');
    } catch (requestError: any) {
      setError(requestError.response?.data?.message || 'No se pudo registrar el usuario');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <AuthShell title="Crear cuenta" subtitle="Guarda tu perfil y prepara tus primeras alertas deportivas.">
      <form className="space-y-4" onSubmit={handleSubmit}>
        <label className="block">
          <span className="text-sm font-semibold text-[#263b33]">Nombre</span>
          <input
            className="mt-1 w-full rounded-md border border-[#cfd8cf] px-3 py-3 outline-none focus:border-[#2f7d55]"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
          />
        </label>
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
        <label className="block">
          <span className="text-sm font-semibold text-[#263b33]">Telefono</span>
          <input
            className="mt-1 w-full rounded-md border border-[#cfd8cf] px-3 py-3 outline-none focus:border-[#2f7d55]"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
          />
        </label>
        {error ? <p className="rounded-md bg-red-50 px-3 py-2 text-sm font-semibold text-red-700">{error}</p> : null}
        <button
          className="w-full rounded-md bg-[#14211c] px-4 py-3 font-bold text-white hover:bg-[#21372f] disabled:opacity-60"
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? 'Registrando...' : 'Crear cuenta'}
        </button>
      </form>

      <div className="mt-4 grid gap-3">
        <a className="rounded-md border border-[#cfd8cf] px-4 py-3 text-center font-bold text-[#14211c]" href={`${backendUrl}/auth/google`}>
          Registrarme con Google
        </a>
        <a className="rounded-md border border-[#cfd8cf] px-4 py-3 text-center font-bold text-[#14211c]" href={`${backendUrl}/auth/facebook`}>
          Registrarme con Facebook
        </a>
      </div>

      <p className="mt-5 text-center text-sm text-[#52635a]">
        Ya tienes cuenta?{' '}
        <Link className="font-bold text-[#2f7d55]" href="/login">
          Iniciar sesion
        </Link>
      </p>
    </AuthShell>
  );
}
