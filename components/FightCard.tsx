import Image from 'next/image';
import type { Fight } from '@/data/types';

export default function FightCard({ fight }: { fight: Fight }) {
  return (
    <div className="group rounded-xl border border-white/10 bg-gray-900 p-6 transition-all hover:border-amber-500/30 hover:shadow-lg hover:shadow-amber-500/5">
      <div className="mb-3 flex items-center justify-between text-xs text-gray-500">
        <span className="rounded bg-gray-800 px-2 py-1 font-medium tracking-wider uppercase">
          {fight.category}
        </span>
        <span>{fight.time}</span>
      </div>
      <div className="flex items-center justify-between gap-4">
        <div className="flex flex-1 flex-col items-center text-center">
          <div className="relative mb-2 h-20 w-20 overflow-hidden rounded-full border-2 border-white/20">
            <Image
              src={fight.fighter1.image}
              alt={fight.fighter1.name}
              fill
              className="object-cover"
              sizes="80px"
            />
          </div>
          <span className="text-sm font-bold text-white">
            {fight.fighter1.name}
          </span>
          <span className="text-xs text-gray-500">{fight.fighter1.record}</span>
        </div>
        <span className="text-2xl font-black text-amber-500">VS</span>
        <div className="flex flex-1 flex-col items-center text-center">
          <div className="relative mb-2 h-20 w-20 overflow-hidden rounded-full border-2 border-white/20">
            <Image
              src={fight.fighter2.image}
              alt={fight.fighter2.name}
              fill
              className="object-cover"
              sizes="80px"
            />
          </div>
          <span className="text-sm font-bold text-white">
            {fight.fighter2.name}
          </span>
          <span className="text-xs text-gray-500">{fight.fighter2.record}</span>
        </div>
      </div>
    </div>
  );
}
