'use client';

import { useState, useEffect } from 'react';
import LiveResult from '@/components/LiveResult';
import initialFights from '@/data/combates.json';
import type { Fight } from '@/data/types';

// Simulates event progression: first 2 finished, 1 live, rest upcoming
function simulateEventState(fights: Fight[]): Fight[] {
  return fights.map((fight, index) => {
    if (index < 2) {
      return {
        ...fight,
        status: 'finished' as const,
        score: {
          fighter1: Math.floor(Math.random() * 5) + 27,
          fighter2: Math.floor(Math.random() * 5) + 27,
        },
        winner:
          Math.random() > 0.5 ? ('fighter1' as const) : ('fighter2' as const),
      };
    }
    if (index === 2) {
      return {
        ...fight,
        status: 'live' as const,
        round: 3,
        score: {
          fighter1: Math.floor(Math.random() * 5) + 27,
          fighter2: Math.floor(Math.random() * 5) + 27,
        },
      };
    }
    return fight;
  });
}

export default function ResultadosPage() {
  const [fights, setFights] = useState<Fight[]>(() =>
    simulateEventState(initialFights as Fight[]),
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setFights(simulateEventState(initialFights as Fight[]));
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="mx-auto max-w-3xl px-4 py-20">
      <h1 className="mb-4 text-center text-4xl font-black text-white">
        Resultados en Vivo
      </h1>
      <p className="mb-12 text-center text-gray-400">
        Los resultados se actualizan automaticamente cada 10 segundos.
      </p>
      <div className="flex flex-col gap-6">
        {fights.map((fight) => (
          <LiveResult key={fight.id} fight={fight} />
        ))}
      </div>
    </section>
  );
}
