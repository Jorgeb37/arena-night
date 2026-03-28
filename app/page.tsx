import Link from 'next/link';
import Hero from '@/components/Hero';
import FightCard from '@/components/FightCard';
import AnimateOnScroll from '@/components/AnimateOnScroll';
import fights from '@/data/combates.json';
import type { Fight } from '@/data/types';

export default function Home() {
  const previewFights = (fights as Fight[]).slice(0, 3);

  return (
    <>
      <Hero />

      {/* Fight Preview */}
      <section className="mx-auto max-w-6xl px-4 py-20">
        <h2 className="mb-8 text-center text-3xl font-bold text-white">
          Combates Destacados
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {previewFights.map((fight, index) => (
            <AnimateOnScroll key={fight.id} delay={index * 0.08}>
              <FightCard fight={fight} />
            </AnimateOnScroll>
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
