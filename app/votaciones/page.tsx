'use client';

import VoteBar from '@/components/VoteBar';
import fights from '@/data/combates.json';
import type { Fight } from '@/data/types';

export default function VotacionesPage() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-20">
      <h1 className="mb-4 text-center text-4xl font-black text-white">
        Predicciones
      </h1>
      <p className="mb-12 text-center text-gray-400">
        Vota por quien crees que ganara cada combate. Los resultados se
        actualizan en tiempo real.
      </p>
      <div className="flex flex-col gap-6">
        {(fights as Fight[]).map((fight) => (
          <VoteBar
            key={fight.id}
            fightId={fight.id}
            fighter1Name={fight.fighter1.name}
            fighter2Name={fight.fighter2.name}
          />
        ))}
      </div>
    </section>
  );
}
