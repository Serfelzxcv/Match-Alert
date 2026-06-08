import Image from 'next/image';
import Link from 'next/link';

const highlights = [
  { value: '24/7', label: 'Alertas activas' },
  { value: 'LIVE', label: 'Partidos en vivo' },
  { value: 'API', label: 'Datos conectables' },
];

export default function HomePage() {
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
              <Link
                href="/login"
                className="rounded-md border border-[var(--ice-white)]/18 px-3 py-2 text-sm font-bold text-[var(--ice-white)] transition duration-200 hover:-translate-y-0.5 hover:border-[var(--green-opportunity)]/65 hover:bg-[var(--ice-white)]/10 active:translate-y-0 sm:px-4"
              >
                Iniciar sesi&oacute;n
              </Link>
              <Link
                href="/register"
                className="rounded-md bg-[var(--orange-alert)] px-3 py-2 text-sm font-black text-[var(--deep-charcoal)] shadow-[0_12px_30px_rgba(255,106,43,0.28)] transition duration-200 hover:-translate-y-0.5 hover:bg-[#ff7d48] hover:shadow-[0_16px_38px_rgba(255,106,43,0.38)] active:translate-y-0 sm:px-4"
              >
                Registro
              </Link>
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
                <Link
                  href="/register"
                  className="rounded-md bg-[var(--orange-alert)] px-5 py-3 text-center text-base font-black text-[var(--deep-charcoal)] shadow-[0_18px_45px_rgba(255,106,43,0.32)] transition duration-200 hover:-translate-y-1 hover:bg-[#ff7d48] hover:shadow-[0_22px_55px_rgba(255,106,43,0.42)] active:translate-y-0"
                >
                  Crear mi alerta
                </Link>
                <Link
                  href="/login"
                  className="rounded-md border border-[var(--green-opportunity)]/45 bg-[var(--night-blue)]/58 px-5 py-3 text-center text-base font-bold text-[var(--ice-white)] backdrop-blur transition duration-200 hover:-translate-y-1 hover:border-[var(--green-opportunity)] hover:bg-[var(--night-blue)]/82 hover:text-[var(--green-opportunity)] active:translate-y-0"
                >
                  Ya tengo cuenta
                </Link>
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
    </main>
  );
}
