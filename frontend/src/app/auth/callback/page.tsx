'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import { setToken } from '@/lib/auth';

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState('');

  useEffect(() => {
    const token = searchParams.get('token');

    if (!token) {
      setError('No se recibio un token valido.');
      return;
    }

    setToken(token);
    router.replace('/dashboard');
  }, [router, searchParams]);

  if (error) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f4f7f3] px-4">
        <section className="w-full max-w-md rounded-lg border border-[#d7ded5] bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-black text-[#14211c]">Error de autenticacion</h1>
          <p className="mt-3 text-[#52635a]">{error}</p>
          <Link className="mt-6 inline-block font-bold text-[#2f7d55]" href="/login">
            Volver a login
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f4f7f3] px-4">
      <p className="font-semibold text-[#52635a]">Procesando autenticacion...</p>
    </main>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-[#f4f7f3] px-4">
          <p className="font-semibold text-[#52635a]">Procesando autenticacion...</p>
        </main>
      }
    >
      <AuthCallbackContent />
    </Suspense>
  );
}
