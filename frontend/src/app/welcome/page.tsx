'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function WelcomePage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/dashboard');
  }, [router]);

  return (
    <main className="grid min-h-screen place-items-center bg-[var(--background)] px-4 text-[var(--muted)]">
      <p className="text-sm font-semibold">Redirigiendo al dashboard...</p>
    </main>
  );
}
