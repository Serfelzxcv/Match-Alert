'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { CSSProperties, FormEvent, useEffect, useState } from 'react';
import { Eye, EyeOff, Lock, Mail, X } from 'lucide-react';
import { api, getBackendUrl } from '@/lib/api';
import { setToken } from '@/lib/auth';
import { Button } from '@/components/ui/button';

export type AuthMode = 'login' | 'register';

const REMEMBER_LOGIN_KEY = 'match_alert_remember_login';

const inputVisualStyle = {
  backgroundColor: '#111111',
  color: '#ffffff',
  caretColor: '#ffffff',
  WebkitBoxShadow: '0 0 0 1000px #111111 inset',
  transition: 'background-color 9999s ease-out 0s',
} as CSSProperties;

export function AuthModal({
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
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const savedPreference = window.localStorage.getItem(REMEMBER_LOGIN_KEY);

    if (savedPreference === 'false') {
      setRememberMe(false);
    }
  }, []);

  function handleRememberMeChange(value: boolean) {
    setRememberMe(value);
    window.localStorage.setItem(REMEMBER_LOGIN_KEY, String(value));
  }

  function changeMode(nextMode: AuthMode) {
    setError('');
    setConfirmPassword('');
    setShowPassword(false);
    setShowConfirmPassword(false);
    onModeChange(nextMode);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');

    if (isRegister && password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    setIsLoading(true);

    try {
      const fallbackName = email.split('@')[0] || 'Cuenta';
      const payload = isRegister ? { name: fallbackName, email, password } : { email, password };
      const response = await api.post(isRegister ? '/auth/register' : '/auth/login', payload);

      setToken(response.data.accessToken, isRegister ? true : rememberMe);
      router.push('/dashboard');
    } catch (requestError: any) {
      setError(
        requestError.response?.data?.message ||
          (isRegister ? 'No se pudo completar el registro.' : 'No se pudo iniciar sesión.'),
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-black/68 px-4 py-4 backdrop-blur-sm"
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

      <section className="relative grid max-h-[calc(100vh-32px)] w-full max-w-[980px] overflow-y-auto rounded-[18px] border border-white/12 bg-[#070707] text-white shadow-[0_32px_90px_rgba(0,0,0,0.62)] md:h-[640px] md:grid-cols-[420px_minmax(0,1fr)] md:overflow-hidden">
        <style jsx global>{`
          .auth-modal-input::placeholder {
            color: rgba(255, 255, 255, 0.18);
            -webkit-text-fill-color: rgba(255, 255, 255, 0.18);
            opacity: 1;
          }

          .auth-modal-input:focus::placeholder {
            color: rgba(255, 255, 255, 0.14);
            -webkit-text-fill-color: rgba(255, 255, 255, 0.14);
          }

          .auth-modal-input:-webkit-autofill,
          .auth-modal-input:-webkit-autofill:hover,
          .auth-modal-input:-webkit-autofill:focus {
            -webkit-box-shadow: 0 0 0 1000px #111111 inset;
            -webkit-text-fill-color: #ffffff;
            caret-color: #ffffff;
          }

          .auth-modal-input::-ms-reveal,
          .auth-modal-input::-ms-clear {
            display: none;
          }
        `}</style>

        <Button
          variant="icon"
          onClick={onClose}
          className="absolute right-4 top-4 z-20 h-9 w-9 rounded-lg border border-white/12 bg-black/35 p-0 text-white/68 backdrop-blur transition hover:bg-white/10 hover:text-white"
          aria-label="Cerrar"
        >
          <X className="h-4 w-4" strokeWidth={2.4} />
        </Button>

        <aside className="relative hidden overflow-hidden border-r border-white/10 bg-[#101010] md:block">
          <Image
            src="/assets/modal_image.png"
            alt="Imagen deportiva"
            fill
            sizes="420px"
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.06),rgba(0,0,0,0.18)_48%,rgba(0,0,0,0.72))]" />
          <div className="absolute right-6 top-6 h-2.5 w-2.5 rounded-sm bg-[var(--orange-alert)] shadow-[0_0_24px_var(--orange-alert)]" />
        </aside>

        <div className="relative flex min-h-[620px] items-center justify-center overflow-hidden bg-[#070707] px-5 py-8 sm:px-10 md:min-h-0 md:px-12">
          <div className="pointer-events-none absolute right-[-140px] top-[-140px] h-80 w-80 bg-[var(--orange-alert)] opacity-[0.11] blur-[100px]" />
          <div className="pointer-events-none absolute bottom-[-170px] left-[20%] h-80 w-80 bg-white opacity-[0.045] blur-[100px]" />
          <div className="absolute left-0 top-0 h-px w-full bg-[linear-gradient(90deg,transparent,var(--orange-alert),transparent)] opacity-70" />

          <div className="relative w-full max-w-[420px]">
            <div className="mb-7 flex items-center gap-3 md:hidden">
              <div className="grid h-10 w-10 place-items-center rounded-lg bg-[var(--orange-alert)] text-xs font-black text-black">
                MA
              </div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/48">Alertas al instante</p>
            </div>

            <div className="mb-8">
              <h2
                id="auth-modal-title"
                className="text-[34px] font-black leading-none tracking-[-0.045em] text-white sm:text-[38px]"
              >
                {isRegister ? 'Crear cuenta' : 'Iniciar sesión'}
              </h2>
              <p className="mt-3 max-w-[360px] text-sm leading-6 text-white/58">
                {isRegister
                  ? 'Regístrate con tu email y contraseña para guardar tus alertas.'
                  : 'Entra para administrar tus partidos, equipos y notificaciones.'}
              </p>
            </div>

            <div className="mb-7 grid grid-cols-2 border-b border-white/12">
              <button
                type="button"
                onClick={() => changeMode('login')}
                className={`relative h-12 px-2 text-left text-sm font-black transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--orange-alert)] ${
                  !isRegister ? 'text-white' : 'text-white/46 hover:text-white/80'
                }`}
                aria-pressed={!isRegister}
              >
                Login
                {!isRegister ? (
                  <span className="absolute bottom-[-1px] left-0 h-0.5 w-full bg-[var(--orange-alert)]" />
                ) : null}
              </button>
              <button
                type="button"
                onClick={() => changeMode('register')}
                className={`relative h-12 px-2 text-left text-sm font-black transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--orange-alert)] ${
                  isRegister ? 'text-white' : 'text-white/46 hover:text-white/80'
                }`}
                aria-pressed={isRegister}
              >
                Registro
                {isRegister ? (
                  <span className="absolute bottom-[-1px] left-0 h-0.5 w-full bg-[var(--orange-alert)]" />
                ) : null}
              </button>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <label className="block">
                <span className="mb-2 block text-xs font-black uppercase tracking-[0.14em] text-white/60">
                  Email
                </span>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/36" />
                  <input
                    className="auth-modal-input h-12 w-full appearance-none rounded-lg border border-white/14 !bg-[#111111] px-11 !text-white caret-white outline-none placeholder:text-white/[0.18] invalid:border-[var(--orange-alert)] focus:border-[var(--orange-alert)] focus:ring-2 focus:ring-[var(--orange-alert)]/20"
                    style={inputVisualStyle}
                    placeholder="correo electrónico"
                    type="email"
                    autoComplete="email"
                    autoCapitalize="none"
                    spellCheck={false}
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                  />
                </div>
              </label>

              <label className="block">
                <span className="mb-2 block text-xs font-black uppercase tracking-[0.14em] text-white/60">
                  Contraseña
                </span>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/36" />
                  <input
                    className="auth-modal-input h-12 w-full appearance-none rounded-lg border border-white/14 !bg-[#111111] px-11 pr-12 !text-white caret-white outline-none placeholder:text-white/[0.18] focus:border-[var(--orange-alert)] focus:ring-2 focus:ring-[var(--orange-alert)]/20"
                    style={inputVisualStyle}
                    placeholder="contraseña"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete={isRegister ? 'new-password' : 'current-password'}
                    minLength={6}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-md bg-white/[0.035] text-[var(--orange-alert)] opacity-90 transition hover:bg-white/[0.08] hover:text-white hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--orange-alert)]/45"
                    onClick={() => setShowPassword((value) => !value)}
                    aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  >
                    {showPassword ? (
                      <EyeOff className="h-[18px] w-[18px]" strokeWidth={2.2} />
                    ) : (
                      <Eye className="h-[18px] w-[18px]" strokeWidth={2.2} />
                    )}
                  </button>
                </div>
              </label>

              <div className="min-h-[82px]">
                {!isRegister ? (
                  <label className="flex h-12 cursor-pointer items-center justify-between gap-3 rounded-lg border border-white/14 bg-[#111111] px-4 text-sm font-semibold text-white/68 transition hover:border-white/24 hover:text-white">
                    <span className="flex min-w-0 items-center gap-3">
                      <input
                        checked={rememberMe}
                        className="h-4 w-4 accent-[var(--orange-alert)]"
                        type="checkbox"
                        onChange={(event) => handleRememberMeChange(event.target.checked)}
                      />
                      <span>Mantener sesión iniciada</span>
                    </span>
                    <span className="text-xs font-black uppercase text-[var(--orange-alert)]">
                      {rememberMe ? 'Activo' : 'Temporal'}
                    </span>
                  </label>
                ) : (
                  <label className="block">
                    <span className="mb-2 block text-xs font-black uppercase tracking-[0.14em] text-white/60">
                      Confirmar contraseña
                    </span>
                    <div className="relative">
                      <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/36" />
                      <input
                        className="auth-modal-input h-12 w-full appearance-none rounded-lg border border-white/14 !bg-[#111111] px-11 pr-12 !text-white caret-white outline-none placeholder:text-white/[0.18] focus:border-[var(--orange-alert)] focus:ring-2 focus:ring-[var(--orange-alert)]/20"
                        style={inputVisualStyle}
                        placeholder="repite tu contraseña"
                        type={showConfirmPassword ? 'text' : 'password'}
                        autoComplete="new-password"
                        minLength={6}
                        value={confirmPassword}
                        onChange={(event) => setConfirmPassword(event.target.value)}
                        required
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-md bg-white/[0.035] text-[var(--orange-alert)] opacity-90 transition hover:bg-white/[0.08] hover:text-white hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--orange-alert)]/45"
                        onClick={() => setShowConfirmPassword((value) => !value)}
                        aria-label={showConfirmPassword ? 'Ocultar confirmación de contraseña' : 'Mostrar confirmación de contraseña'}
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-[18px] w-[18px]" strokeWidth={2.2} />
                        ) : (
                          <Eye className="h-[18px] w-[18px]" strokeWidth={2.2} />
                        )}
                      </button>
                    </div>
                  </label>
                )}
              </div>

              {error ? (
                <p className="rounded-lg border border-[var(--orange-alert)]/60 bg-[var(--orange-alert)]/10 px-4 py-3 text-sm font-semibold leading-5 text-white/84">
                  {error}
                </p>
              ) : null}

              <button
                className="h-12 w-full rounded-lg bg-[var(--orange-alert)] px-4 text-sm font-black text-black shadow-[0_16px_34px_rgba(0,0,0,0.35)] transition hover:brightness-110 disabled:pointer-events-none disabled:opacity-60"
                type="submit"
                disabled={isLoading}
              >
                {isLoading
                  ? isRegister
                    ? 'Registrando...'
                    : 'Ingresando...'
                  : isRegister
                    ? 'Crear cuenta'
                    : 'Iniciar sesión'}
              </button>
            </form>

            <div className="mt-3">
              <a
                className="flex h-12 w-full items-center justify-center rounded-lg border border-white/16 bg-transparent px-4 text-center text-sm font-black leading-none text-white transition hover:border-white/30 hover:bg-white/[0.055]"
                href={`${backendUrl}/auth/google`}
              >
                Continuar con Google
              </a>
            </div>

            <p className="mt-6 text-center text-sm text-white/48">
              {isRegister ? '¿Ya tienes cuenta?' : '¿No tienes cuenta?'}{' '}
              <button
                type="button"
                onClick={() => changeMode(isRegister ? 'login' : 'register')}
                className="font-black text-[var(--orange-alert)] transition hover:text-white"
              >
                {isRegister ? 'Inicia sesión' : 'Regístrate'}
              </button>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
