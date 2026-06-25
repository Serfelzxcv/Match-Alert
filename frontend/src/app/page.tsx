'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { AuthModal, type AuthMode } from '@/components/AuthModal';

const highlights = [
  { value: '24/7', label: 'Alertas activas', detail: 'Avisos listos para goles, tarjetas y momentos clave.' },
  { value: 'LIVE', label: 'Partidos en vivo', detail: 'Sigue el marcador mientras cambia el ritmo del juego.' },
  { value: 'API', label: 'Datos conectables', detail: 'Prepara reglas con eventos, cuotas y equipos favoritos.' },
];

export default function HomePage() {
  const [authMode, setAuthMode] = useState<AuthMode | null>(null);

  useEffect(() => {
    document.documentElement.dataset.theme = 'light';
  }, []);

  function openAuthModal(mode: AuthMode) {
    setAuthMode(mode);
  }

  function closeAuthModal() {
    setAuthMode(null);
  }

  return (
    <main className="min-h-screen overflow-x-hidden bg-[var(--background)] text-[var(--foreground)]">
      <section className="relative min-h-screen overflow-hidden">
        <Image
          src="/assets/match_alert_landing.png"
          alt="Jugador entrando al campo antes de un partido en vivo"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(11,15,18,0.97)_0%,rgba(7,26,31,0.86)_36%,rgba(7,26,31,0.45)_66%,rgba(11,15,18,0.9)_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,26,31,0.88)_0%,rgba(7,26,31,0.14)_35%,rgba(11,15,18,0.82)_100%)]" />
        <div className="absolute inset-x-0 top-0 h-1 bg-[var(--orange-alert)]/90" />
        <div className="absolute inset-0 opacity-[0.07] [background-image:linear-gradient(rgba(244,247,250,0.4)_1px,transparent_1px)] [background-size:100%_7px]" />

        <div className="relative z-10 flex min-h-screen w-full flex-col">
          <nav className="flex h-20 items-center justify-between gap-4 border-b border-[var(--ice-white)]/10 bg-[var(--deep-charcoal)]/76 px-5 backdrop-blur-md sm:px-8 lg:px-12">
            <Link href="/" className="flex min-w-0 items-center">
              <Image
                src="/assets/match-alert-imagotipo.png.png"
                alt="Match Alert"
                width={244}
                height={72}
                priority
                className="h-11 w-auto max-w-[160px] object-contain sm:max-w-[220px]"
              />
            </Link>

            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => openAuthModal('login')}
                className="rounded-md border border-[var(--ice-white)]/18 px-3 py-2 text-sm font-bold text-[var(--ice-white)] transition duration-200 hover:-translate-y-0.5 hover:border-[var(--ice-white)]/34 hover:bg-[var(--ice-white)]/10 active:translate-y-0 sm:px-4"
              >
                Iniciar sesi&oacute;n
              </button>
              <button
                type="button"
                onClick={() => openAuthModal('register')}
                className="rounded-md bg-[var(--orange-alert)] px-3 py-2 text-sm font-black text-white shadow-[0_12px_28px_rgba(0,0,0,0.24)] transition duration-200 hover:-translate-y-0.5 hover:brightness-110 active:translate-y-0 sm:px-4"
              >
                Registro
              </button>
            </div>
          </nav>

          <div className="flex min-h-0 flex-1 items-center px-5 pb-10 pt-7 sm:px-8 lg:px-12">
            <section id="cta" className="max-w-5xl">
              <p className="mb-7 text-sm font-black uppercase text-[var(--ice-white)]/72 sm:text-base">
                Futbol en vivo, sin perder jugadas
              </p>
              <h1 className="text-6xl font-black italic leading-[0.92] text-[var(--ice-white)] [text-shadow:0_8px_28px_rgba(0,0,0,0.55)] sm:text-7xl lg:text-9xl">
                <span>Match </span>
                <span className="text-[var(--orange-alert)]">Alert</span>
              </h1>
              <p className="mt-7 max-w-3xl text-xl leading-9 text-[var(--ice-white)]/82 sm:text-2xl sm:leading-10">
                Recibe alertas de partidos, goles y eventos clave para entrar en accion justo cuando el juego cambia.
              </p>
              <p className="mt-4 max-w-3xl text-base leading-7 text-[var(--ice-white)]/64 sm:text-lg">
                Configura tus equipos, define condiciones en vivo y recibe avisos para reaccionar antes de que la oportunidad se enfrie.
              </p>

              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={() => openAuthModal('register')}
                  className="rounded-md bg-[var(--orange-alert)] px-6 py-4 text-center text-base font-black text-white shadow-[0_18px_38px_rgba(0,0,0,0.28)] transition duration-200 hover:-translate-y-1 hover:brightness-110 active:translate-y-0 sm:text-lg"
                >
                  Crear mi alerta
                </button>
                <button
                  type="button"
                  onClick={() => openAuthModal('login')}
                  className="rounded-md border border-[var(--ice-white)]/22 bg-[var(--night-blue)]/58 px-6 py-4 text-center text-base font-bold text-[var(--ice-white)] backdrop-blur transition duration-200 hover:-translate-y-1 hover:border-[var(--ice-white)]/45 hover:bg-[var(--night-blue)]/82 active:translate-y-0 sm:text-lg"
                >
                  Ya tengo cuenta
                </button>
              </div>

              <div id="alertas" className="mt-10 grid gap-3 sm:grid-cols-3 sm:gap-4">
                {highlights.map((item) => (
                  <div
                    key={item.label}
                    className="rounded-md border border-[var(--ice-white)]/12 bg-[var(--deep-charcoal)]/52 p-5 backdrop-blur transition duration-200 hover:-translate-y-1 hover:border-[var(--ice-white)]/28 hover:bg-[var(--night-blue)]/70"
                  >
                    <p className="text-3xl font-black italic leading-none text-[var(--ice-white)] sm:text-4xl">
                      {item.value}
                    </p>
                    <p className="mt-2 text-sm font-black uppercase leading-5 text-[var(--ice-white)] sm:text-base">
                      {item.label}
                    </p>
                    <p className="mt-3 text-sm leading-6 text-[var(--ice-white)]/62">{item.detail}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </section>

      {authMode ? (
        <AuthModal mode={authMode} onClose={closeAuthModal} onModeChange={setAuthMode} />
      ) : null}
    </main>
  );
}
