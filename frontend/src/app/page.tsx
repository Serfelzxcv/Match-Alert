'use client';

import Image from 'next/image';
import Link from 'next/link';
import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api, getBackendUrl } from '@/lib/api';
import { setToken } from '@/lib/auth';

const highlights = [
  { value: '24/7', label: 'Alertas activas' },
  { value: 'LIVE', label: 'Partidos en vivo' },
  { value: 'API', label: 'Datos conectables' },
];

type AuthMode = 'login' | 'register';

export default function HomePage() {
  const [authMode, setAuthMode] = useState<AuthMode | null>(null);

  function openAuthModal(mode: AuthMode) {
    setAuthMode(mode);
  }

  function closeAuthModal() {
    setAuthMode(null);
  }

  return (
    <main className="h-screen overflow-hidden bg-[var(--deep-charcoal)] text-[var(--ice-white)]">
      <section className="relative h-screen overflow-hidden">
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
        <div className="absolute inset-x-0 top-0 h-1 bg-[var(--green-opportunity)]" />
        <div className="absolute inset-0 opacity-[0.07] [background-image:linear-gradient(rgba(244,247,250,0.4)_1px,transparent_1px)] [background-size:100%_7px]" />

        <div className="relative z-10 flex h-screen w-full flex-col">
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
                className="rounded-md border border-[var(--ice-white)]/18 px-3 py-2 text-sm font-bold text-[var(--ice-white)] transition duration-200 hover:-translate-y-0.5 hover:border-[var(--green-opportunity)]/65 hover:bg-[var(--ice-white)]/10 active:translate-y-0 sm:px-4"
              >
                Iniciar sesi&oacute;n
              </button>
              <button
                type="button"
                onClick={() => openAuthModal('register')}
                className="rounded-md bg-[var(--orange-alert)] px-3 py-2 text-sm font-black text-[var(--deep-charcoal)] shadow-[0_12px_30px_rgba(255,106,43,0.28)] transition duration-200 hover:-translate-y-0.5 hover:bg-[#ff7d48] hover:shadow-[0_16px_38px_rgba(255,106,43,0.38)] active:translate-y-0 sm:px-4"
              >
                Registro
              </button>
            </div>
          </nav>

          <div className="flex min-h-0 flex-1 items-center px-5 pb-8 pt-6 sm:px-8 lg:px-12">
            <section id="cta" className="max-w-3xl">
              <p className="mb-6 text-xs font-black uppercase text-[var(--green-opportunity)] sm:text-sm">
                Futbol en vivo, sin perder jugadas
              </p>
              <h1 className="text-5xl font-black italic leading-[0.95] text-[var(--ice-white)] [text-shadow:0_8px_28px_rgba(0,0,0,0.55)] sm:text-6xl lg:text-8xl">
                <span>Match </span>
                <span className="text-[var(--orange-alert)]">Alert</span>
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--ice-white)]/78">
                Recibe alertas de partidos, goles y eventos clave para entrar en accion justo cuando el juego cambia.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={() => openAuthModal('register')}
                  className="rounded-md bg-[var(--orange-alert)] px-5 py-3 text-center text-base font-black text-[var(--deep-charcoal)] shadow-[0_18px_45px_rgba(255,106,43,0.32)] transition duration-200 hover:-translate-y-1 hover:bg-[#ff7d48] hover:shadow-[0_22px_55px_rgba(255,106,43,0.42)] active:translate-y-0"
                >
                  Crear mi alerta
                </button>
                <button
                  type="button"
                  onClick={() => openAuthModal('login')}
                  className="rounded-md border border-[var(--green-opportunity)]/45 bg-[var(--night-blue)]/58 px-5 py-3 text-center text-base font-bold text-[var(--ice-white)] backdrop-blur transition duration-200 hover:-translate-y-1 hover:border-[var(--green-opportunity)] hover:bg-[var(--night-blue)]/82 hover:text-[var(--green-opportunity)] active:translate-y-0"
                >
                  Ya tengo cuenta
                </button>
              </div>

              <div id="alertas" className="mt-9 grid grid-cols-3 gap-2 sm:gap-3">
                {highlights.map((item) => (
                  <div
                    key={item.label}
                    className="rounded-md border border-[var(--ice-white)]/12 bg-[var(--deep-charcoal)]/48 p-3 backdrop-blur transition duration-200 hover:-translate-y-1 hover:border-[var(--green-opportunity)]/55 hover:bg-[var(--night-blue)]/70"
                  >
                    <p className="text-lg font-black italic text-[var(--green-opportunity)] sm:text-2xl">
                      {item.value}
                    </p>
                    <p className="mt-1 text-xs font-semibold leading-4 text-[var(--ice-white)]/66 sm:text-sm">
                      {item.label}
                    </p>
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

function AuthModal({
  mode,
  onClose,
  onModeChange,
}: {
  mode: AuthMode;
  onClose: () => void;
  onModeChange: (mode: AuthMode) => void;
}) {
  const router = useRouter();
  const backendUrl = getBackendUrl();
  const isRegister = mode === 'register';
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const payload = isRegister ? { name, email, password } : { email, password };
      const response = await api.post(isRegister ? '/auth/register' : '/auth/login', payload);
      setToken(response.data.accessToken);
      router.push('/welcome');
    } catch (requestError: any) {
      setError(
        requestError.response?.data?.message ||
          (isRegister ? 'No se pudo registrar el usuario' : 'No se pudo iniciar sesion'),
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-black/62 px-4 py-6 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
    >
      <button
        type="button"
        className="absolute inset-0 cursor-default"
        aria-label="Cerrar modal"
        onClick={onClose}
      />

      <section className="relative grid max-h-[86vh] w-full max-w-4xl overflow-y-auto rounded-lg border border-[var(--orange-alert)]/80 bg-white text-[var(--deep-charcoal)] shadow-[0_26px_90px_rgba(0,0,0,0.55)] md:h-[470px] md:grid-cols-[0.94fr_1.06fr] md:overflow-hidden">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 z-20 grid h-8 w-8 place-items-center rounded-full border border-black/10 bg-white/95 text-lg font-bold text-[#1b1b1b] shadow-sm transition hover:bg-[#f5f5f5]"
          aria-label="Cerrar"
        >
          x
        </button>

        <div className="relative hidden items-center justify-center bg-[radial-gradient(circle_at_20%_20%,rgba(157,255,47,0.16),transparent_28%),linear-gradient(135deg,#f6f6f6_0%,#ffffff_52%,#f1f1f1_100%)] p-6 md:flex">
          <div className="absolute inset-y-6 right-0 w-px bg-black/10" />
          <div className="relative aspect-[4/5] w-full max-w-[312px] overflow-hidden rounded-md shadow-[16px_16px_24px_rgba(0,0,0,0.24)] ring-1 ring-black/10">
            <Image
              src="/assets/modal_image.png"
              alt="Match Alert siempre alertas"
              fill
              sizes="312px"
              className="object-cover"
              priority
            />
          </div>
        </div>

        <div className="flex min-h-[470px] items-center justify-center bg-[linear-gradient(180deg,#ffffff_0%,#fbfbfb_100%)] px-5 py-10 sm:px-9 md:min-h-0">
          <div className="w-full max-w-sm">
            <div className="mb-5 flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-md bg-[#101516] text-sm font-black text-[var(--green-opportunity)] ring-1 ring-black/10">
                MA
              </div>
              <div>
                <p className="text-xs font-black uppercase text-[var(--orange-alert)]">Match Alert</p>
                <p className="text-xs font-semibold text-[#777]">Alertas al instante</p>
              </div>
            </div>

            <h2 id="auth-modal-title" className="text-2xl font-black text-[#111]">
              {isRegister ? 'Crear cuenta' : 'Iniciar sesion'}
            </h2>
            <p className="mt-1 text-sm leading-5 text-[#676767]">
              {isRegister
                ? 'Crea tu acceso y prepara tus primeras alertas.'
                : 'Entra para seguir tus partidos y avisos activos.'}
            </p>

            <div className="mt-5 grid grid-cols-2 rounded-lg border border-[#e4e4e4] bg-[#f4f4f4] p-1">
              <button
                type="button"
                onClick={() => onModeChange('login')}
                className={`rounded-md px-3 py-2 text-sm font-bold transition ${
                  !isRegister ? 'bg-white text-[#111] shadow-sm' : 'text-[#747474] hover:bg-white/45 hover:text-[#111]'
                }`}
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => onModeChange('register')}
                className={`rounded-md px-3 py-2 text-sm font-bold transition ${
                  isRegister ? 'bg-white text-[#111] shadow-sm' : 'text-[#747474] hover:bg-white/45 hover:text-[#111]'
                }`}
              >
                Registro
              </button>
            </div>

            <form className="mt-5 min-h-[178px] space-y-3" onSubmit={handleSubmit}>
              {isRegister ? (
                <input
                  className="h-11 w-full rounded-lg border border-[#d8d8d8] bg-white px-4 text-sm font-semibold text-[#111] shadow-[0_6px_18px_rgba(0,0,0,0.04)] outline-none transition placeholder:text-[#a0a0a0] focus:border-[var(--orange-alert)] focus:ring-4 focus:ring-[var(--orange-alert)]/12"
                  placeholder="Nombre"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  required
                />
              ) : null}
              <input
                className="h-11 w-full rounded-lg border border-[#d8d8d8] bg-white px-4 text-sm font-semibold text-[#111] shadow-[0_6px_18px_rgba(0,0,0,0.04)] outline-none transition placeholder:text-[#a0a0a0] focus:border-[var(--orange-alert)] focus:ring-4 focus:ring-[var(--orange-alert)]/12"
                placeholder="Email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
              <input
                className="h-11 w-full rounded-lg border border-[#d8d8d8] bg-white px-4 text-sm font-semibold text-[#111] shadow-[0_6px_18px_rgba(0,0,0,0.04)] outline-none transition placeholder:text-[#a0a0a0] focus:border-[var(--orange-alert)] focus:ring-4 focus:ring-[var(--orange-alert)]/12"
                placeholder="Password"
                type="password"
                minLength={6}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
              {error ? (
                <p className="rounded-md bg-red-50 px-3 py-2 text-sm font-semibold text-red-700">{error}</p>
              ) : null}
              <button
                className="h-11 w-full rounded-lg bg-[linear-gradient(90deg,var(--orange-alert),#ff404f)] px-4 text-sm font-black text-white shadow-[0_12px_26px_rgba(255,106,43,0.32)] transition hover:brightness-105 disabled:opacity-60"
                type="submit"
                disabled={isLoading}
              >
                {isLoading
                  ? isRegister
                    ? 'Registrando...'
                    : 'Ingresando...'
                  : isRegister
                    ? 'Continuar con Email'
                    : 'Iniciar sesion'}
              </button>
            </form>

            <div className="mt-3 grid gap-2">
              <a
                className="h-10 rounded-lg border border-[#d8d8d8] bg-white px-4 py-2.5 text-center text-sm font-bold leading-5 text-[#222] shadow-sm transition hover:border-[#bdbdbd] hover:bg-[#f9f9f9]"
                href={`${backendUrl}/auth/google`}
              >
                Continuar con Google
              </a>
              <a
                className="h-10 rounded-lg border border-[#d8d8d8] bg-white px-4 py-2.5 text-center text-sm font-bold leading-5 text-[#222] shadow-sm transition hover:border-[#bdbdbd] hover:bg-[#f9f9f9]"
                href={`${backendUrl}/auth/facebook`}
              >
                Continuar con Facebook
              </a>
            </div>

            <p className="mt-5 text-center text-sm text-[#6b6b6b]">
              {isRegister ? 'Ya tienes cuenta?' : 'No tienes cuenta?'}{' '}
              <button
                type="button"
                onClick={() => onModeChange(isRegister ? 'login' : 'register')}
                className="font-black text-[var(--orange-alert)] hover:text-[#e85b24]"
              >
                {isRegister ? 'Inicia sesion' : 'Registrate'}
              </button>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
