import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <section className="w-full max-w-xl rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">Match Alert</p>
        <h1 className="mt-4 text-3xl font-bold text-gray-950">Alertas deportivas con base sólida</h1>
        <p className="mt-3 text-gray-600">
          Regístrate o inicia sesión para entrar a la primera vista protegida.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/login"
            className="rounded-md bg-emerald-700 px-4 py-3 text-center font-semibold text-white hover:bg-emerald-800"
          >
            Ir a login
          </Link>
          <Link
            href="/register"
            className="rounded-md border border-gray-300 px-4 py-3 text-center font-semibold text-gray-900 hover:bg-gray-50"
          >
            Ir a registro
          </Link>
        </div>
      </section>
    </main>
  );
}
