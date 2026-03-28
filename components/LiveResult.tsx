'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import type { Fight } from '@/data/types';

const statusConfig = {
  upcoming: { label: 'Proximo', color: 'bg-gray-600' },
  live: { label: 'En vivo', color: 'bg-red-500 animate-pulse' },
  finished: { label: 'Finalizado', color: 'bg-green-600' },
};

function simulateLiveData(fight: Fight): Fight {
  if (fight.status !== 'live') return fight;

  return {
    ...fight,
    round: Math.floor(Math.random() * 5) + 1,
    score: {
      fighter1: Math.floor(Math.random() * 10) + 25,
      fighter2: Math.floor(Math.random() * 10) + 25,
    },
  };
}

export default function LiveResult({ fight: initialFight }: { fight: Fight }) {
  const [fight, setFight] = useState(initialFight);

  useEffect(() => {
    if (initialFight.status !== 'live') return;

    const interval = setInterval(() => {
      setFight(simulateLiveData(initialFight));
    }, 10000);

    return () => clearInterval(interval);
  }, [initialFight]);

  const { label, color } = statusConfig[fight.status];

  return (
    <div className="rounded-xl border border-white/10 bg-gray-900 p-6">
      <div className="mb-4 flex items-center justify-between">
        <span className="text-xs font-medium tracking-wider text-gray-500 uppercase">
          {fight.category} — {fight.time}
        </span>
        <span
          className={`rounded-full px-3 py-1 text-xs font-bold text-white ${color}`}
        >
          {label}
        </span>
      </div>
      <div className="flex items-center justify-between gap-4">
        <div
          className={`flex flex-1 flex-col items-center text-center ${
            fight.winner === 'fighter1'
              ? 'rounded-lg p-2 ring-2 ring-amber-500'
              : ''
          }`}
        >
          <div className="relative mb-2 h-16 w-16 overflow-hidden rounded-full border-2 border-white/20">
            <Image
              src={fight.fighter1.image}
              alt={fight.fighter1.name}
              fill
              className="object-cover"
              sizes="64px"
            />
          </div>
          <span className="text-sm font-bold text-white">
            {fight.fighter1.name}
          </span>
          {fight.score && (
            <span className="mt-1 text-2xl font-black text-white">
              {fight.score.fighter1}
            </span>
          )}
          {fight.winner === 'fighter1' && (
            <span className="mt-1 text-xs font-bold text-amber-500">
              Ganador
            </span>
          )}
        </div>
        {fight.status === 'live' && fight.round && (
          <div className="text-center">
            <span className="text-xs text-gray-500">Ronda {fight.round}</span>
          </div>
        )}
        {fight.status !== 'live' && (
          <span className="text-xl font-black text-gray-600">VS</span>
        )}
        <div
          className={`flex flex-1 flex-col items-center text-center ${
            fight.winner === 'fighter2'
              ? 'rounded-lg p-2 ring-2 ring-amber-500'
              : ''
          }`}
        >
          <div className="relative mb-2 h-16 w-16 overflow-hidden rounded-full border-2 border-white/20">
            <Image
              src={fight.fighter2.image}
              alt={fight.fighter2.name}
              fill
              className="object-cover"
              sizes="64px"
            />
          </div>
          <span className="text-sm font-bold text-white">
            {fight.fighter2.name}
          </span>
          {fight.score && (
            <span className="mt-1 text-2xl font-black text-white">
              {fight.score.fighter2}
            </span>
          )}
          {fight.winner === 'fighter2' && (
            <span className="mt-1 text-xs font-bold text-amber-500">
              Ganador
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
