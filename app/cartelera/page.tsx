import type { Metadata } from 'next';
import FightCard from '@/components/FightCard';
import AnimateOnScroll from '@/components/AnimateOnScroll';
import fights from '@/data/combates.json';
import type { Fight } from '@/data/types';

export const metadata: Metadata = {
  title: 'Cartelera — Arena Night',
  description:
    'All fights for Arena Night. Check the full card with fighters, categories, and schedule.',
};

export default function CarteleraPage() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-20">
      <h1 className="mb-4 text-center text-4xl font-black text-white">
        Cartelera Completa
      </h1>
      <p className="mb-12 text-center text-gray-400">
        5 combates — 15 de Julio, 2026
      </p>
      <div className="grid gap-6 sm:grid-cols-2">
        {(fights as Fight[]).map((fight, index) => (
          <AnimateOnScroll key={fight.id} delay={index * 0.08}>
            <FightCard fight={fight} />
          </AnimateOnScroll>
        ))}
      </div>
    </section>
  );
}
