import Image from 'next/image';
import Link from 'next/link';
import type { Fight } from '@/data/types';

export default function FightDetail({ fight }: { fight: Fight }) {
  return (
    <div className="mx-auto max-w-2xl">
      <Link
        href="/cartelera"
        className="mb-8 inline-flex items-center gap-1 text-sm text-gray-400 transition-colors hover:text-white"
      >
        &larr; Volver a cartelera
      </Link>

      <div className="rounded-2xl border border-white/10 bg-gray-900 p-8 sm:p-12">
        <div className="mb-6 flex items-center justify-between text-sm text-gray-500">
          <span className="rounded bg-gray-800 px-3 py-1.5 font-medium tracking-wider uppercase">
            {fight.category}
          </span>
          <span>{fight.time}</span>
        </div>

        <div className="flex items-center justify-between gap-6">
          <div className="flex flex-1 flex-col items-center text-center">
            <div className="relative mb-4 h-32 w-32 overflow-hidden rounded-full border-2 border-white/20 sm:h-40 sm:w-40">
              <Image
                src={fight.fighter1.image}
                alt={fight.fighter1.name}
                fill
                className="object-cover"
                sizes="160px"
              />
            </div>
            <span className="text-lg font-bold text-white sm:text-2xl">
              {fight.fighter1.name}
            </span>
            <span className="text-sm text-gray-500">
              {fight.fighter1.record}
            </span>
          </div>

          <span className="text-3xl font-black text-amber-500 sm:text-5xl">
            VS
          </span>

          <div className="flex flex-1 flex-col items-center text-center">
            <div className="relative mb-4 h-32 w-32 overflow-hidden rounded-full border-2 border-white/20 sm:h-40 sm:w-40">
              <Image
                src={fight.fighter2.image}
                alt={fight.fighter2.name}
                fill
                className="object-cover"
                sizes="160px"
              />
            </div>
            <span className="text-lg font-bold text-white sm:text-2xl">
              {fight.fighter2.name}
            </span>
            <span className="text-sm text-gray-500">
              {fight.fighter2.record}
            </span>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/votaciones"
            className="inline-block rounded-lg bg-amber-500 px-6 py-3 font-semibold text-gray-950 transition-colors hover:bg-amber-400"
          >
            Votar en este combate
          </Link>
        </div>
      </div>
    </div>
  );
}
