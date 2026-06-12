'use client';

import Image from 'next/image';
import Link from 'next/link';
import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Mail, User, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { api, getBackendUrl } from '@/lib/api';
import { setToken } from '@/lib/auth';

const highlights = [
  { value: '24/7', label: 'Alertas activas', detail: 'Avisos listos para goles, tarjetas y momentos clave.' },
  { value: 'LIVE', label: 'Partidos en vivo', detail: 'Sigue el marcador mientras cambia el ritmo del juego.' },
  { value: 'API', label: 'Datos conectables', detail: 'Prepara reglas con eventos, cuotas y equipos favoritos.' },
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
    <main className="min-h-screen overflow-x-hidden bg-[var(--deep-charcoal)] text-[var(--ice-white)]">
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
        <div className="absolute inset-x-0 top-0 h-1 bg-[var(--green-opportunity)]" />
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

          <div className="flex min-h-0 flex-1 items-center px-5 pb-10 pt-7 sm:px-8 lg:px-12">
            <section id="cta" className="max-w-5xl">
              <p className="mb-7 text-sm font-black uppercase text-[var(--green-opportunity)] sm:text-base">
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
                  className="rounded-md bg-[var(--orange-alert)] px-6 py-4 text-center text-base font-black text-[var(--deep-charcoal)] shadow-[0_18px_45px_rgba(255,106,43,0.32)] transition duration-200 hover:-translate-y-1 hover:bg-[#ff7d48] hover:shadow-[0_22px_55px_rgba(255,106,43,0.42)] active:translate-y-0 sm:text-lg"
                >
                  Crear mi alerta
                </button>
                <button
                  type="button"
                  onClick={() => openAuthModal('login')}
                  className="rounded-md border border-[var(--green-opportunity)]/45 bg-[var(--night-blue)]/58 px-6 py-4 text-center text-base font-bold text-[var(--ice-white)] backdrop-blur transition duration-200 hover:-translate-y-1 hover:border-[var(--green-opportunity)] hover:bg-[var(--night-blue)]/82 hover:text-[var(--green-opportunity)] active:translate-y-0 sm:text-lg"
                >
                  Ya tengo cuenta
                </button>
              </div>

              <div id="alertas" className="mt-10 grid gap-3 sm:grid-cols-3 sm:gap-4">
                {highlights.map((item) => (
                  <div
                    key={item.label}
                    className="rounded-md border border-[var(--ice-white)]/12 bg-[var(--deep-charcoal)]/52 p-5 backdrop-blur transition duration-200 hover:-translate-y-1 hover:border-[var(--green-opportunity)]/55 hover:bg-[var(--night-blue)]/70"
                  >
                    <p className="text-3xl font-black italic leading-none text-[var(--green-opportunity)] sm:text-4xl">
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
      router.push('/dashboard');
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

      <section className="relative grid max-h-[92vh] w-full max-w-[900px] overflow-y-auto rounded-lg border border-[var(--green-opportunity)]/55 bg-[#070b0e] text-[var(--ice-white)] shadow-[0_0_0_1px_rgba(255,106,43,0.35),0_28px_90px_rgba(0,0,0,0.7),0_0_55px_rgba(157,255,47,0.16)] md:h-[520px] md:grid-cols-[382px_1fr] md:overflow-hidden">
        <Button
          variant="icon"
          onClick={onClose}
          className="absolute right-3 top-3 z-20 h-8 w-8 rounded-full p-0"
          aria-label="Cerrar"
        >
          <X className="h-4 w-4" strokeWidth={2.4} />
        </Button>

        <div className="relative hidden overflow-hidden md:block">
          <Image
            src="/assets/modal_image.png"
            alt="Match Alert siempre alertas"
            fill
            sizes="382px"
            className="object-cover"
            priority
          />
          <div className="absolute inset-y-0 right-0 w-16 bg-[linear-gradient(90deg,transparent,#070b0e)]" />
          <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(157,255,47,0.1),transparent_32%,rgba(255,106,43,0.16))]" />
        </div>

        <div className="relative flex min-h-[520px] items-start justify-center overflow-hidden bg-[radial-gradient(circle_at_12%_0%,rgba(157,255,47,0.22),transparent_30%),radial-gradient(circle_at_100%_100%,rgba(255,64,79,0.26),transparent_32%),linear-gradient(135deg,#070b0e_0%,#10161a_54%,#080b0d_100%)] px-5 py-5 sm:px-8 md:min-h-0">
          <div className="absolute left-0 top-0 h-px w-full bg-[linear-gradient(90deg,var(--green-opportunity),var(--orange-alert),#ff404f)]" />
          <div className="absolute -right-20 top-12 h-40 w-40 rounded-full border border-[var(--green-opportunity)]/15" />
          <div className="absolute -bottom-14 left-8 h-28 w-28 rounded-full border border-[var(--orange-alert)]/15" />

          <div className="relative w-full max-w-[350px]">
            <div className="mb-3 flex items-center gap-3">
              <div className="grid h-9 w-9 place-items-center rounded-md bg-[var(--green-opportunity)] text-xs font-black text-[#071014] shadow-[0_0_24px_rgba(157,255,47,0.42)]">
                MA
              </div>
              <div>
                <p className="text-xs font-black uppercase text-[var(--orange-alert)]">Match Alert</p>
                <p className="text-xs font-semibold text-[var(--ice-white)]/58">Alertas al instante</p>
              </div>
            </div>

            <h2 id="auth-modal-title" className="text-[28px] font-black leading-none text-white">
              {isRegister ? 'Crear cuenta' : 'Iniciar sesion'}
            </h2>
            <p className="mt-1 text-sm leading-5 text-[var(--ice-white)]/64">
              {isRegister
                ? 'Crea tu acceso y prepara tus primeras alertas.'
                : 'Entra para seguir tus partidos y avisos activos.'}
            </p>

            <div className="mt-3 grid grid-cols-2 rounded-lg border border-white/10 bg-white/[0.06] p-1 shadow-[inset_0_0_18px_rgba(255,255,255,0.03)]">
              <Button
                variant="ghost"
                onClick={() => onModeChange('login')}
                className={`h-10 px-3 ${
                  !isRegister
                    ? 'bg-[var(--green-opportunity)] text-[#071014] shadow-[0_0_18px_rgba(157,255,47,0.28)]'
                    : 'text-white/56 hover:bg-white/10 hover:text-white'
                }`}
              >
                Login
              </Button>
              <Button
                variant="ghost"
                onClick={() => onModeChange('register')}
                className={`h-10 px-3 ${
                  isRegister
                    ? 'bg-[var(--green-opportunity)] text-[#071014] shadow-[0_0_18px_rgba(157,255,47,0.28)]'
                    : 'text-white/56 hover:bg-white/10 hover:text-white'
                }`}
              >
                Registro
              </Button>
            </div>

            <form className="mt-3 space-y-2.5" onSubmit={handleSubmit}>
              {isRegister ? (
                <div className="relative">
                  <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--green-opportunity)]/72" />
                  <Input
                    placeholder="Nombre"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    required
                  />
                </div>
              ) : null}
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--orange-alert)]/78" />
                <Input
                  placeholder="Email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                />
              </div>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#ff4057]/78" />
                <Input
                  placeholder="Password"
                  type="password"
                  minLength={6}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                />
              </div>
              {error ? (
                <p className="rounded-md bg-red-50 px-3 py-2 text-sm font-semibold text-red-700">{error}</p>
              ) : null}
              <Button
                className="h-10 w-full"
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
              </Button>
            </form>

            <div className="mt-3">
              <a
                className="flex h-11 w-full items-center justify-center rounded-lg border border-white/12 bg-white/[0.06] px-4 text-center text-sm font-bold leading-none text-white/88 transition hover:border-[var(--green-opportunity)]/45 hover:bg-white/[0.1] hover:text-white"
                href={`${backendUrl}/auth/google`}
              >
                Continuar con Google
              </a>
            </div>

            <p className="mt-3 text-center text-sm text-white/52">
              {isRegister ? 'Ya tienes cuenta?' : 'No tienes cuenta?'}{' '}
              <Button
                variant="ghost"
                onClick={() => onModeChange(isRegister ? 'login' : 'register')}
                className="h-auto p-0 text-sm font-black text-[var(--green-opportunity)] hover:bg-transparent hover:text-[var(--orange-alert)]"
              >
                {isRegister ? 'Inicia sesion' : 'Registrate'}
              </Button>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
