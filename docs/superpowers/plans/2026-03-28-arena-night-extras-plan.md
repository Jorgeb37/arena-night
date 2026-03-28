# Arena Night Extra Features Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add micro-animations, dynamic fight detail pages, and Open Graph social cards to Arena Night.

**Architecture:** Three independent features layered on top of the existing SSG site. Motion library for GPU-accelerated animations, Next.js dynamic routes with `generateStaticParams` for fight pages, and Next.js `ImageResponse` API for OG images. All features are statically generated — no new runtime.

**Tech Stack:** Motion (animations), Next.js 16 App Router (dynamic routes, OG images), TypeScript, Tailwind CSS v4

---

## File Structure

### New Files

| File                                     | Responsibility                                                                     |
| ---------------------------------------- | ---------------------------------------------------------------------------------- |
| `components/AnimateOnScroll.tsx`         | Reusable client wrapper: fade-up children when they enter viewport                 |
| `components/Hero.tsx`                    | Client component: hero section extracted from `app/page.tsx`, animated with Motion |
| `components/FightDetail.tsx`             | Server component: large-format fight display for detail pages                      |
| `app/cartelera/[id]/page.tsx`            | Dynamic fight detail route with `generateStaticParams` + `generateMetadata`        |
| `app/opengraph-image.tsx`                | OG image for home page                                                             |
| `app/cartelera/opengraph-image.tsx`      | OG image for cartelera page                                                        |
| `app/cartelera/[id]/opengraph-image.tsx` | Dynamic OG image per fight                                                         |
| `app/votaciones/opengraph-image.tsx`     | OG image for votaciones page                                                       |
| `app/resultados/opengraph-image.tsx`     | OG image for resultados page                                                       |
| `__tests__/AnimateOnScroll.test.tsx`     | Tests for AnimateOnScroll wrapper                                                  |
| `__tests__/Hero.test.tsx`                | Tests for Hero component                                                           |
| `__tests__/FightDetail.test.tsx`         | Tests for FightDetail component                                                    |

### Modified Files

| File                       | Change                                                                       |
| -------------------------- | ---------------------------------------------------------------------------- |
| `app/page.tsx`             | Replace inline hero with `<Hero>`, wrap fight cards with `<AnimateOnScroll>` |
| `app/cartelera/page.tsx`   | Wrap fight cards with `<AnimateOnScroll>`                                    |
| `components/FightCard.tsx` | Wrap content in `<Link href={/cartelera/${fight.id}}>`                       |
| `components/Navbar.tsx`    | Add Motion `<AnimatePresence>` + `<motion.div>` to mobile menu               |
| `components/VoteBar.tsx`   | Replace CSS `transition-all` with Motion `motion.div` spring for bar width   |
| `app/layout.tsx`           | Add `metadataBase`, `openGraph`, `twitter` to metadata                       |
| `package.json`             | Add `motion` dependency                                                      |

---

### Task 1: Install Motion dependency

**Files:**

- Modify: `package.json`

- [ ] **Step 1: Install motion**

```bash
cd C:/Users/Usuario/Desktop/arena-night && npm install motion
```

- [ ] **Step 2: Verify installation**

```bash
cd C:/Users/Usuario/Desktop/arena-night && node -e "require('motion'); console.log('motion OK')"
```

Expected: `motion OK`

- [ ] **Step 3: Run existing tests to confirm nothing broke**

```bash
cd C:/Users/Usuario/Desktop/arena-night && npx vitest run
```

Expected: 13 tests pass

- [ ] **Step 4: Commit**

```bash
cd C:/Users/Usuario/Desktop/arena-night && git add package.json package-lock.json && git commit -m "chore: add motion library for animations"
```

---

### Task 2: Create AnimateOnScroll component (TDD)

**Files:**

- Create: `components/AnimateOnScroll.tsx`
- Create: `__tests__/AnimateOnScroll.test.tsx`

- [ ] **Step 1: Write the failing test**

Create `__tests__/AnimateOnScroll.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import AnimateOnScroll from '@/components/AnimateOnScroll';

// Mock motion to avoid animation complexity in tests
vi.mock('motion/react', () => ({
  motion: {
    div: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
      <div data-testid="motion-div" {...props}>
        {children}
      </div>
    ),
  },
  useInView: () => true,
}));

describe('AnimateOnScroll', () => {
  it('renders children', () => {
    render(
      <AnimateOnScroll>
        <p>Hello World</p>
      </AnimateOnScroll>,
    );
    expect(screen.getByText('Hello World')).toBeInTheDocument();
  });

  it('renders a motion wrapper div', () => {
    render(
      <AnimateOnScroll>
        <p>Content</p>
      </AnimateOnScroll>,
    );
    expect(screen.getByTestId('motion-div')).toBeInTheDocument();
  });

  it('accepts custom className', () => {
    render(
      <AnimateOnScroll className="custom-class">
        <p>Styled</p>
      </AnimateOnScroll>,
    );
    expect(screen.getByTestId('motion-div')).toHaveClass('custom-class');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
cd C:/Users/Usuario/Desktop/arena-night && npx vitest run __tests__/AnimateOnScroll.test.tsx
```

Expected: FAIL — module `@/components/AnimateOnScroll` not found

- [ ] **Step 3: Write minimal implementation**

Create `components/AnimateOnScroll.tsx`:

```tsx
'use client';

import { useRef } from 'react';
import { motion, useInView } from 'motion/react';

interface AnimateOnScrollProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export default function AnimateOnScroll({
  children,
  className,
  delay = 0,
}: AnimateOnScrollProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-10% 0px' });

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      transition={{
        duration: 0.3,
        delay,
        ease: [0.21, 0.47, 0.32, 0.98],
      }}
    >
      {children}
    </motion.div>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
cd C:/Users/Usuario/Desktop/arena-night && npx vitest run __tests__/AnimateOnScroll.test.tsx
```

Expected: 3 tests PASS

- [ ] **Step 5: Run all tests to verify nothing broke**

```bash
cd C:/Users/Usuario/Desktop/arena-night && npx vitest run
```

Expected: 16 tests pass (13 existing + 3 new)

- [ ] **Step 6: Commit**

```bash
cd C:/Users/Usuario/Desktop/arena-night && git add components/AnimateOnScroll.tsx __tests__/AnimateOnScroll.test.tsx && git commit -m "feat: add AnimateOnScroll component with scroll-triggered fade-up"
```

---

### Task 3: Create Hero component and animate landing page (TDD)

**Files:**

- Create: `components/Hero.tsx`
- Create: `__tests__/Hero.test.tsx`
- Modify: `app/page.tsx`

- [ ] **Step 1: Write the failing test**

Create `__tests__/Hero.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Hero from '@/components/Hero';

// Mock motion
vi.mock('motion/react', () => ({
  motion: {
    div: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
      <div {...props}>{children}</div>
    ),
    h1: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
      <h1 {...props}>{children}</h1>
    ),
    p: ({ children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
      <p {...props}>{children}</p>
    ),
  },
}));

// Mock Countdown — it's a client component with timers
vi.mock('@/components/Countdown', () => ({
  default: ({ targetDate }: { targetDate: string }) => (
    <div data-testid="countdown">{targetDate}</div>
  ),
}));

// Mock next/link
vi.mock('next/link', () => ({
  default: ({
    children,
    href,
  }: {
    children: React.ReactNode;
    href: string;
  }) => <a href={href}>{children}</a>,
}));

describe('Hero', () => {
  it('renders Arena Night title', () => {
    render(<Hero />);
    expect(screen.getByText('Arena')).toBeInTheDocument();
    expect(screen.getByText('Night')).toBeInTheDocument();
  });

  it('renders event date', () => {
    render(<Hero />);
    expect(
      screen.getByText('15 de Julio, 2026 — Boxing & Music'),
    ).toBeInTheDocument();
  });

  it('renders countdown', () => {
    render(<Hero />);
    expect(screen.getByTestId('countdown')).toBeInTheDocument();
  });

  it('renders CTA links', () => {
    render(<Hero />);
    expect(screen.getByText('Ver Cartelera')).toBeInTheDocument();
    expect(screen.getByText('Hacer tu Prediccion')).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
cd C:/Users/Usuario/Desktop/arena-night && npx vitest run __tests__/Hero.test.tsx
```

Expected: FAIL — module `@/components/Hero` not found

- [ ] **Step 3: Write Hero component**

Create `components/Hero.tsx`:

```tsx
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
```

- [ ] **Step 4: Run test to verify it passes**

```bash
cd C:/Users/Usuario/Desktop/arena-night && npx vitest run __tests__/Hero.test.tsx
```

Expected: 4 tests PASS

- [ ] **Step 5: Update `app/page.tsx` to use Hero + AnimateOnScroll**

Replace `app/page.tsx` with:

```tsx
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
```

- [ ] **Step 6: Run all tests**

```bash
cd C:/Users/Usuario/Desktop/arena-night && npx vitest run
```

Expected: 20 tests pass (13 existing + 3 AnimateOnScroll + 4 Hero)

- [ ] **Step 7: Commit**

```bash
cd C:/Users/Usuario/Desktop/arena-night && git add components/Hero.tsx __tests__/Hero.test.tsx app/page.tsx && git commit -m "feat: extract Hero component with staggered fade-up animations"
```

---

### Task 4: Animate cartelera page fight cards

**Files:**

- Modify: `app/cartelera/page.tsx`

- [ ] **Step 1: Update cartelera page to use AnimateOnScroll**

Replace `app/cartelera/page.tsx` with:

```tsx
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
```

- [ ] **Step 2: Run all tests**

```bash
cd C:/Users/Usuario/Desktop/arena-night && npx vitest run
```

Expected: All 20 tests pass

- [ ] **Step 3: Commit**

```bash
cd C:/Users/Usuario/Desktop/arena-night && git add app/cartelera/page.tsx && git commit -m "feat: add staggered scroll animations to cartelera fight cards"
```

---

### Task 5: Animate Navbar mobile menu

**Files:**

- Modify: `components/Navbar.tsx`

- [ ] **Step 1: Update Navbar with Motion AnimatePresence**

Replace `components/Navbar.tsx` with:

```tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'motion/react';

const navLinks = [
  { href: '/', label: 'Inicio' },
  { href: '/cartelera', label: 'Cartelera' },
  { href: '/votaciones', label: 'Votaciones' },
  { href: '/resultados', label: 'Resultados' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 z-50 w-full border-b border-white/10 bg-gray-950/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="text-xl font-bold tracking-tight text-white">
          Arena<span className="text-amber-500">Night</span>
        </Link>
        {/* Desktop */}
        <ul className="hidden gap-6 sm:flex">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="text-sm font-medium text-gray-400 transition-colors hover:text-white"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
        {/* Mobile toggle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-gray-400 sm:hidden"
          aria-label="Toggle menu"
        >
          <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {isOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>
      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="border-t border-white/10 bg-gray-950 sm:hidden"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: [0.21, 0.47, 0.32, 0.98] }}
          >
            <ul className="flex flex-col gap-1 px-4 py-4">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="block rounded-lg px-3 py-2 text-sm font-medium text-gray-400 transition-colors hover:bg-gray-900 hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
```

- [ ] **Step 2: Run all tests**

```bash
cd C:/Users/Usuario/Desktop/arena-night && npx vitest run
```

Expected: All 20 tests pass

- [ ] **Step 3: Commit**

```bash
cd C:/Users/Usuario/Desktop/arena-night && git add components/Navbar.tsx && git commit -m "feat: animate navbar mobile menu with slide-down transition"
```

---

### Task 6: Enhance VoteBar with Motion spring

**Files:**

- Modify: `components/VoteBar.tsx`

- [ ] **Step 1: Update VoteBar to use motion.div for bar animation**

In `components/VoteBar.tsx`, add the import at the top (after existing imports):

```tsx
import { motion } from 'motion/react';
```

Then replace the bar `<div>` elements (the two inner divs inside the `h-4` container, around lines 110-117) from:

```tsx
<div className="mb-2 flex h-4 overflow-hidden rounded-full bg-gray-800">
  <div
    className="bg-amber-500 transition-all duration-500"
    style={{ width: `${pct1}%` }}
  />
  <div
    className="bg-gray-600 transition-all duration-500"
    style={{ width: `${pct2}%` }}
  />
</div>
```

to:

```tsx
<div className="mb-2 flex h-4 overflow-hidden rounded-full bg-gray-800">
  <motion.div
    className="bg-amber-500"
    animate={{ width: `${pct1}%` }}
    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
  />
  <motion.div
    className="bg-gray-600"
    animate={{ width: `${pct2}%` }}
    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
  />
</div>
```

- [ ] **Step 2: Run VoteBar tests**

```bash
cd C:/Users/Usuario/Desktop/arena-night && npx vitest run __tests__/VoteBar.test.tsx
```

Expected: 3 tests PASS

If tests fail because `motion.div` is not recognized in test environment, add this mock at the top of `__tests__/VoteBar.test.tsx` (before other mocks):

```tsx
vi.mock('motion/react', () => ({
  motion: {
    div: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
      <div {...props}>{children}</div>
    ),
  },
}));
```

- [ ] **Step 3: Run all tests**

```bash
cd C:/Users/Usuario/Desktop/arena-night && npx vitest run
```

Expected: All 20 tests pass

- [ ] **Step 4: Commit**

```bash
cd C:/Users/Usuario/Desktop/arena-night && git add components/VoteBar.tsx __tests__/VoteBar.test.tsx && git commit -m "feat: use Motion spring for vote bar width transitions"
```

---

### Task 7: Create FightDetail component (TDD)

**Files:**

- Create: `components/FightDetail.tsx`
- Create: `__tests__/FightDetail.test.tsx`

- [ ] **Step 1: Write the failing test**

Create `__tests__/FightDetail.test.tsx`:

```tsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import FightDetail from '@/components/FightDetail';
import type { Fight } from '@/data/types';

vi.mock('next/image', () => ({
  // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
    <img {...props} />
  ),
}));

vi.mock('next/link', () => ({
  default: ({
    children,
    href,
  }: {
    children: React.ReactNode;
    href: string;
  }) => <a href={href}>{children}</a>,
}));

const mockFight: Fight = {
  id: 'fight-1',
  fighter1: { name: 'El Titan', image: '/fighters/titan.svg', record: '5-1' },
  fighter2: { name: 'Shadow', image: '/fighters/shadow.svg', record: '4-2' },
  category: 'Peso medio',
  time: '21:00',
  status: 'upcoming',
};

describe('FightDetail', () => {
  it('renders both fighter names', () => {
    render(<FightDetail fight={mockFight} />);
    expect(screen.getByText('El Titan')).toBeInTheDocument();
    expect(screen.getByText('Shadow')).toBeInTheDocument();
  });

  it('renders fighter records', () => {
    render(<FightDetail fight={mockFight} />);
    expect(screen.getByText('5-1')).toBeInTheDocument();
    expect(screen.getByText('4-2')).toBeInTheDocument();
  });

  it('renders category and time', () => {
    render(<FightDetail fight={mockFight} />);
    expect(screen.getByText('Peso medio')).toBeInTheDocument();
    expect(screen.getByText('21:00')).toBeInTheDocument();
  });

  it('renders VS separator', () => {
    render(<FightDetail fight={mockFight} />);
    expect(screen.getByText('VS')).toBeInTheDocument();
  });

  it('renders back link to cartelera', () => {
    render(<FightDetail fight={mockFight} />);
    const backLink = screen.getByText(/Volver a cartelera/);
    expect(backLink.closest('a')).toHaveAttribute('href', '/cartelera');
  });

  it('renders vote CTA link', () => {
    render(<FightDetail fight={mockFight} />);
    const voteLink = screen.getByText(/Votar en este combate/);
    expect(voteLink.closest('a')).toHaveAttribute('href', '/votaciones');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
cd C:/Users/Usuario/Desktop/arena-night && npx vitest run __tests__/FightDetail.test.tsx
```

Expected: FAIL — module `@/components/FightDetail` not found

- [ ] **Step 3: Write FightDetail component**

Create `components/FightDetail.tsx`:

```tsx
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
```

- [ ] **Step 4: Run test to verify it passes**

```bash
cd C:/Users/Usuario/Desktop/arena-night && npx vitest run __tests__/FightDetail.test.tsx
```

Expected: 6 tests PASS

- [ ] **Step 5: Run all tests**

```bash
cd C:/Users/Usuario/Desktop/arena-night && npx vitest run
```

Expected: 26 tests pass (20 previous + 6 new)

- [ ] **Step 6: Commit**

```bash
cd C:/Users/Usuario/Desktop/arena-night && git add components/FightDetail.tsx __tests__/FightDetail.test.tsx && git commit -m "feat: add FightDetail component for fight detail pages"
```

---

### Task 8: Create dynamic fight detail route

**Files:**

- Create: `app/cartelera/[id]/page.tsx`

- [ ] **Step 1: Create dynamic route page**

Create `app/cartelera/[id]/page.tsx`:

```tsx
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import FightDetail from '@/components/FightDetail';
import fights from '@/data/combates.json';
import type { Fight } from '@/data/types';

export const dynamicParams = false;

export function generateStaticParams() {
  return (fights as Fight[]).map((fight) => ({ id: fight.id }));
}

export function generateMetadata({
  params,
}: {
  params: { id: string };
}): Metadata {
  const fight = (fights as Fight[]).find((f) => f.id === params.id);
  if (!fight) return { title: 'Not Found — Arena Night' };

  return {
    title: `${fight.fighter1.name} vs ${fight.fighter2.name} — Arena Night`,
    description: `${fight.category} — ${fight.fighter1.name} (${fight.fighter1.record}) vs ${fight.fighter2.name} (${fight.fighter2.record}). Arena Night, 15 de Julio 2026.`,
  };
}

export default function FightPage({ params }: { params: { id: string } }) {
  const fight = (fights as Fight[]).find((f) => f.id === params.id);
  if (!fight) notFound();

  return (
    <section className="px-4 py-20">
      <FightDetail fight={fight} />
    </section>
  );
}
```

- [ ] **Step 2: Verify build works with dynamic routes**

```bash
cd C:/Users/Usuario/Desktop/arena-night && npx next build 2>&1 | head -30
```

Expected: Build succeeds. Look for `/cartelera/fight-1`, `/cartelera/fight-2`, etc. in the output.

- [ ] **Step 3: Run all tests**

```bash
cd C:/Users/Usuario/Desktop/arena-night && npx vitest run
```

Expected: All 26 tests pass

- [ ] **Step 4: Commit**

```bash
cd C:/Users/Usuario/Desktop/arena-night && git add "app/cartelera/[id]/page.tsx" && git commit -m "feat: add dynamic fight detail pages with generateStaticParams"
```

---

### Task 9: Make FightCard clickable

**Files:**

- Modify: `components/FightCard.tsx`
- Modify: `__tests__/FightCard.test.tsx`

- [ ] **Step 1: Update FightCard test to expect a link**

Add a new test to `__tests__/FightCard.test.tsx`. First, add the `next/link` mock after the `next/image` mock:

```tsx
vi.mock('next/link', () => ({
  default: ({
    children,
    href,
    ...props
  }: {
    children: React.ReactNode;
    href: string;
  } & React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));
```

Then add this test to the `describe` block:

```tsx
it('links to fight detail page', () => {
  render(<FightCard fight={mockFight} />);
  const link = screen.getByRole('link');
  expect(link).toHaveAttribute('href', '/cartelera/fight-1');
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
cd C:/Users/Usuario/Desktop/arena-night && npx vitest run __tests__/FightCard.test.tsx
```

Expected: FAIL — no element with role "link" found

- [ ] **Step 3: Update FightCard to wrap in Link**

Replace `components/FightCard.tsx` with:

```tsx
import Image from 'next/image';
import Link from 'next/link';
import type { Fight } from '@/data/types';

export default function FightCard({ fight }: { fight: Fight }) {
  return (
    <Link href={`/cartelera/${fight.id}`} className="block">
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
            <span className="text-xs text-gray-500">
              {fight.fighter1.record}
            </span>
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
            <span className="text-xs text-gray-500">
              {fight.fighter2.record}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
```

- [ ] **Step 4: Run FightCard tests**

```bash
cd C:/Users/Usuario/Desktop/arena-night && npx vitest run __tests__/FightCard.test.tsx
```

Expected: 5 tests PASS

- [ ] **Step 5: Run all tests**

```bash
cd C:/Users/Usuario/Desktop/arena-night && npx vitest run
```

Expected: 27 tests pass (26 previous + 1 new link test)

- [ ] **Step 6: Commit**

```bash
cd C:/Users/Usuario/Desktop/arena-night && git add components/FightCard.tsx __tests__/FightCard.test.tsx && git commit -m "feat: make FightCard clickable with link to detail page"
```

---

### Task 10: Update layout metadata for OG + Twitter

**Files:**

- Modify: `app/layout.tsx`

- [ ] **Step 1: Update metadata in layout.tsx**

Replace the `metadata` export in `app/layout.tsx` (lines 11-15) from:

```tsx
export const metadata: Metadata = {
  title: 'Arena Night — Boxing & Music Event',
  description:
    'Arena Night is a premier boxing and music event experience. Vote for your favourite fighters and artists, check the lineup, and see live results.',
};
```

to:

```tsx
export const metadata: Metadata = {
  metadataBase: new URL('https://arena-night.vercel.app'),
  title: 'Arena Night — Boxing & Music Event',
  description:
    'Arena Night is a premier boxing and music event experience. Vote for your favourite fighters and artists, check the lineup, and see live results.',
  openGraph: {
    siteName: 'Arena Night',
    locale: 'es_ES',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
  },
};
```

- [ ] **Step 2: Run all tests**

```bash
cd C:/Users/Usuario/Desktop/arena-night && npx vitest run
```

Expected: All 27 tests pass

- [ ] **Step 3: Commit**

```bash
cd C:/Users/Usuario/Desktop/arena-night && git add app/layout.tsx && git commit -m "feat: add metadataBase, openGraph, and twitter card metadata"
```

---

### Task 11: Create OG image for home page

**Files:**

- Create: `app/opengraph-image.tsx`

- [ ] **Step 1: Create home OG image**

Create `app/opengraph-image.tsx`:

```tsx
import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Arena Night — Boxing & Music Event';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OGImage() {
  return new ImageResponse(
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
        backgroundColor: '#030712',
        fontFamily: 'Inter, sans-serif',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'baseline' }}>
        <span
          style={{
            fontSize: 96,
            fontWeight: 900,
            color: '#ffffff',
            letterSpacing: '-0.05em',
          }}
        >
          Arena
        </span>
        <span
          style={{
            fontSize: 96,
            fontWeight: 900,
            color: '#f59e0b',
            letterSpacing: '-0.05em',
          }}
        >
          Night
        </span>
      </div>
      <span
        style={{
          fontSize: 32,
          color: '#9ca3af',
          marginTop: 16,
        }}
      >
        15 de Julio, 2026 — Boxing & Music
      </span>
    </div>,
    { ...size },
  );
}
```

- [ ] **Step 2: Verify build succeeds**

```bash
cd C:/Users/Usuario/Desktop/arena-night && npx next build 2>&1 | tail -20
```

Expected: Build succeeds with OG image route

- [ ] **Step 3: Commit**

```bash
cd C:/Users/Usuario/Desktop/arena-night && git add app/opengraph-image.tsx && git commit -m "feat: add Open Graph image for home page"
```

---

### Task 12: Create OG images for static pages

**Files:**

- Create: `app/cartelera/opengraph-image.tsx`
- Create: `app/votaciones/opengraph-image.tsx`
- Create: `app/resultados/opengraph-image.tsx`

- [ ] **Step 1: Create cartelera OG image**

Create `app/cartelera/opengraph-image.tsx`:

```tsx
import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Cartelera — Arena Night';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OGImage() {
  return new ImageResponse(
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
        backgroundColor: '#030712',
        fontFamily: 'Inter, sans-serif',
      }}
    >
      <span
        style={{
          fontSize: 72,
          fontWeight: 900,
          color: '#ffffff',
        }}
      >
        Cartelera Completa
      </span>
      <span
        style={{
          fontSize: 36,
          color: '#f59e0b',
          marginTop: 16,
        }}
      >
        5 Combates
      </span>
      <span
        style={{
          fontSize: 24,
          color: '#6b7280',
          marginTop: 24,
        }}
      >
        Arena Night — 15 de Julio, 2026
      </span>
    </div>,
    { ...size },
  );
}
```

- [ ] **Step 2: Create votaciones OG image**

Create `app/votaciones/opengraph-image.tsx`:

```tsx
import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Votaciones — Arena Night';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OGImage() {
  return new ImageResponse(
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
        backgroundColor: '#030712',
        fontFamily: 'Inter, sans-serif',
      }}
    >
      <span
        style={{
          fontSize: 72,
          fontWeight: 900,
          color: '#ffffff',
        }}
      >
        Vota por tu favorito
      </span>
      <span
        style={{
          fontSize: 28,
          color: '#9ca3af',
          marginTop: 16,
        }}
      >
        Predicciones en tiempo real
      </span>
      <span
        style={{
          fontSize: 24,
          color: '#6b7280',
          marginTop: 24,
        }}
      >
        Arena Night — 15 de Julio, 2026
      </span>
    </div>,
    { ...size },
  );
}
```

- [ ] **Step 3: Create resultados OG image**

Create `app/resultados/opengraph-image.tsx`:

```tsx
import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Resultados — Arena Night';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OGImage() {
  return new ImageResponse(
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
        backgroundColor: '#030712',
        fontFamily: 'Inter, sans-serif',
      }}
    >
      <span
        style={{
          fontSize: 72,
          fontWeight: 900,
          color: '#ffffff',
        }}
      >
        Resultados en Vivo
      </span>
      <span
        style={{
          fontSize: 28,
          color: '#ef4444',
          marginTop: 16,
        }}
      >
        Actualizacion en tiempo real
      </span>
      <span
        style={{
          fontSize: 24,
          color: '#6b7280',
          marginTop: 24,
        }}
      >
        Arena Night — 15 de Julio, 2026
      </span>
    </div>,
    { ...size },
  );
}
```

- [ ] **Step 4: Run all tests**

```bash
cd C:/Users/Usuario/Desktop/arena-night && npx vitest run
```

Expected: All 27 tests pass

- [ ] **Step 5: Commit**

```bash
cd C:/Users/Usuario/Desktop/arena-night && git add app/cartelera/opengraph-image.tsx app/votaciones/opengraph-image.tsx app/resultados/opengraph-image.tsx && git commit -m "feat: add Open Graph images for cartelera, votaciones, resultados"
```

---

### Task 13: Create dynamic OG image for fight detail pages

**Files:**

- Create: `app/cartelera/[id]/opengraph-image.tsx`

- [ ] **Step 1: Create dynamic fight OG image**

Create `app/cartelera/[id]/opengraph-image.tsx`:

```tsx
import { ImageResponse } from 'next/og';
import fights from '@/data/combates.json';
import type { Fight } from '@/data/types';

export const runtime = 'edge';
export const alt = 'Fight Detail — Arena Night';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export function generateStaticParams() {
  return (fights as Fight[]).map((fight) => ({ id: fight.id }));
}

export default function OGImage({ params }: { params: { id: string } }) {
  const fight = (fights as Fight[]).find((f) => f.id === params.id);

  if (!fight) {
    return new ImageResponse(
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '100%',
          backgroundColor: '#030712',
          color: '#ffffff',
          fontSize: 48,
          fontWeight: 900,
        }}
      >
        Arena Night
      </div>,
      { ...size },
    );
  }

  return new ImageResponse(
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
        backgroundColor: '#030712',
        fontFamily: 'Inter, sans-serif',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 40,
        }}
      >
        <span
          style={{
            fontSize: 64,
            fontWeight: 900,
            color: '#ffffff',
          }}
        >
          {fight.fighter1.name}
        </span>
        <span
          style={{
            fontSize: 48,
            fontWeight: 900,
            color: '#f59e0b',
          }}
        >
          VS
        </span>
        <span
          style={{
            fontSize: 64,
            fontWeight: 900,
            color: '#ffffff',
          }}
        >
          {fight.fighter2.name}
        </span>
      </div>
      <span
        style={{
          fontSize: 28,
          color: '#9ca3af',
          marginTop: 24,
        }}
      >
        {fight.category}
      </span>
      <span
        style={{
          fontSize: 24,
          color: '#6b7280',
          marginTop: 16,
        }}
      >
        Arena Night — 15 de Julio, 2026
      </span>
    </div>,
    { ...size },
  );
}
```

- [ ] **Step 2: Build to verify all OG images generate**

```bash
cd C:/Users/Usuario/Desktop/arena-night && npx next build 2>&1 | tail -30
```

Expected: Build succeeds. All routes show in output including `/cartelera/[id]` OG images.

- [ ] **Step 3: Run all tests**

```bash
cd C:/Users/Usuario/Desktop/arena-night && npx vitest run
```

Expected: All 27 tests pass

- [ ] **Step 4: Commit**

```bash
cd C:/Users/Usuario/Desktop/arena-night && git add "app/cartelera/[id]/opengraph-image.tsx" && git commit -m "feat: add dynamic Open Graph images for fight detail pages"
```

---

### Task 14: Final build + deploy verification

**Files:**

- No file changes

- [ ] **Step 1: Run full test suite**

```bash
cd C:/Users/Usuario/Desktop/arena-night && npx vitest run
```

Expected: 27 tests pass (13 original + 3 AnimateOnScroll + 4 Hero + 6 FightDetail + 1 FightCard link)

- [ ] **Step 2: Run production build**

```bash
cd C:/Users/Usuario/Desktop/arena-night && npx next build
```

Expected: Build succeeds with all routes including:

- `/cartelera/fight-1` through `/cartelera/fight-5` (SSG)
- OG images for all routes

- [ ] **Step 3: Run linter**

```bash
cd C:/Users/Usuario/Desktop/arena-night && npx eslint .
```

Expected: No errors

- [ ] **Step 4: Deploy to Vercel**

```bash
cd C:/Users/Usuario/Desktop/arena-night && npx vercel --prod
```

Expected: Deploy succeeds at arena-night.vercel.app

- [ ] **Step 5: Commit any remaining changes**

If the build or lint step produced fixes, commit them:

```bash
cd C:/Users/Usuario/Desktop/arena-night && git status
```

If clean, no commit needed. If changes exist:

```bash
cd C:/Users/Usuario/Desktop/arena-night && git add -A && git commit -m "chore: final build fixes for extra features"
```
