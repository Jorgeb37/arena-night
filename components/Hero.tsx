'use client';

import Link from 'next/link';
import { motion } from 'motion/react';
import Countdown from '@/components/Countdown';

const EVENT_DATE = '2026-07-15T21:00:00';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function Hero() {
  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 px-4 text-center">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(245,158,11,0.08)_0%,_transparent_70%)]" />
      <div className="relative z-10">
        <motion.h1
          className="mb-2 text-6xl font-black tracking-tighter text-white sm:text-8xl"
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          transition={{ duration: 0.4, type: 'spring', bounce: 0.3 }}
        >
          Arena<span className="text-amber-500">Night</span>
        </motion.h1>
        <motion.p
          className="mb-8 text-lg text-gray-400 sm:text-xl"
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          transition={{
            duration: 0.2,
            delay: 0.1,
            ease: [0.21, 0.47, 0.32, 0.98],
          }}
        >
          15 de Julio, 2026 — Boxing & Music
        </motion.p>
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          transition={{
            duration: 0.2,
            delay: 0.2,
            ease: [0.21, 0.47, 0.32, 0.98],
          }}
        >
          <Countdown targetDate={EVENT_DATE} />
        </motion.div>
        <motion.div
          className="mt-10 flex gap-4"
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          transition={{
            duration: 0.2,
            delay: 0.3,
            ease: [0.21, 0.47, 0.32, 0.98],
          }}
        >
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
        </motion.div>
      </div>
    </section>
  );
}
