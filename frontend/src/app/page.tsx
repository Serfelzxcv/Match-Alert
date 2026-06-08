import Image from 'next/image';
import Link from 'next/link';

const highlights = [
  { value: '24/7', label: 'Alertas activas' },
  { value: 'LIVE', label: 'Partidos en vivo' },
  { value: 'API', label: 'Datos conectables' },
];

export default function HomePage() {
  return (
    <main className="h-screen overflow-hidden bg-[#07100f] text-white">
      <section className="relative h-screen overflow-hidden">
        <Image
          src="/assets/match_alert_landing.png"
          alt="Jugador entrando al campo antes de un partido en vivo"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(7,16,15,0.94)_0%,rgba(7,16,15,0.78)_34%,rgba(7,16,15,0.42)_62%,rgba(7,16,15,0.88)_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,16,15,0.82)_0%,rgba(7,16,15,0.12)_36%,rgba(7,16,15,0.76)_100%)]" />

        <div className="relative z-10 flex h-screen w-full flex-col">
          <nav className="flex h-20 items-center justify-between gap-4 border-b border-white/12 bg-[#07100f]/72 px-5 backdrop-blur-md sm:px-8 lg:px-12">
            <Link href="/" className="flex items-center gap-3">
              <span className="grid size-9 place-items-center rounded-md bg-[#f15b2a] text-sm font-black text-white">
                MA
              </span>
              <span className="text-base font-black tracking-normal text-white">Match Alert</span>
            </Link>

            <div className="hidden items-center gap-6 text-sm font-semibold text-white/78 md:flex">
              <a href="#alertas" className="hover:text-white">
                Alertas
              </a>
              <a href="#cta" className="hover:text-white">
                Empezar
              </a>
            </div>

            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="rounded-md border border-white/18 px-3 py-2 text-sm font-bold text-white hover:bg-white/10 sm:px-4"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="rounded-md bg-[#f15b2a] px-3 py-2 text-sm font-bold text-white hover:bg-[#d94f24] sm:px-4"
              >
                Registro
              </Link>
            </div>
          </nav>

          <div className="flex min-h-0 flex-1 items-center px-5 pb-8 pt-6 sm:px-8 lg:px-12">
            <section id="cta" className="max-w-2xl">
              <p className="text-sm font-black uppercase text-[#9ad66e]">Futbol en vivo, sin perder jugadas</p>
              <h1 className="mt-4 text-5xl font-black leading-[1.02] tracking-normal text-white sm:text-6xl lg:text-7xl">
                Match Alert
              </h1>
              <p className="mt-5 text-lg leading-8 text-white/78">
                Recibe alertas de partidos, goles y eventos clave para entrar en accion justo cuando el juego cambia.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/register"
                  className="rounded-md bg-[#f15b2a] px-5 py-3 text-center text-base font-black text-white shadow-[0_18px_45px_rgba(241,91,42,0.28)] hover:bg-[#d94f24]"
                >
                  Crear mi alerta
                </Link>
                <Link
                  href="/login"
                  className="rounded-md border border-white/20 bg-white/8 px-5 py-3 text-center text-base font-bold text-white backdrop-blur hover:bg-white/14"
                >
                  Ya tengo cuenta
                </Link>
              </div>

              <div id="alertas" className="mt-9 grid grid-cols-3 gap-2 sm:gap-3">
                {highlights.map((item) => (
                  <div key={item.label} className="rounded-md border border-white/12 bg-white/8 p-3 backdrop-blur">
                    <p className="text-lg font-black text-white sm:text-2xl">{item.value}</p>
                    <p className="mt-1 text-xs font-semibold leading-4 text-white/62 sm:text-sm">{item.label}</p>
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
