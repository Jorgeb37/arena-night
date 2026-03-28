import Link from 'next/link';
import Countdown from '@/components/Countdown';
import FightCard from '@/components/FightCard';
import fights from '@/data/combates.json';
import type { Fight } from '@/data/types';

const EVENT_DATE = '2026-07-15T21:00:00';

export default function Home() {
  const previewFights = (fights as Fight[]).slice(0, 3);

  return (
    <>
      {/* Hero */}
      <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 px-4 text-center">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(245,158,11,0.08)_0%,_transparent_70%)]" />
        <div className="relative z-10">
          <h1 className="mb-2 text-6xl font-black tracking-tighter text-white sm:text-8xl">
            Arena<span className="text-amber-500">Night</span>
          </h1>
          <p className="mb-8 text-lg text-gray-400 sm:text-xl">
            15 de Julio, 2026 — Boxing & Music
          </p>
          <Countdown targetDate={EVENT_DATE} />
          <div className="mt-10 flex gap-4">
            <Link
              href="/cartelera"
              className="rounded-lg bg-amber-500 px-6 py-3 font-semibold text-gray-950 transition-colors hover:bg-amber-400"
            >
              Ver Cartelera
            </Link>
            <Link
              href="/votaciones"
              className="rounded-lg border border-white/20 px-6 py-3 font-semibold text-white transition-colors hover:bg-white/10"
            >
              Hacer tu Prediccion
            </Link>
          </div>
        </div>
      </section>

      {/* Fight Preview */}
      <section className="mx-auto max-w-6xl px-4 py-20">
        <h2 className="mb-8 text-center text-3xl font-bold text-white">
          Combates Destacados
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {previewFights.map((fight) => (
            <FightCard key={fight.id} fight={fight} />
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link
            href="/cartelera"
            className="text-amber-500 transition-colors hover:text-amber-400"
          >
            Ver cartelera completa &rarr;
          </Link>
        </div>
      </section>
    </>
  );
}
