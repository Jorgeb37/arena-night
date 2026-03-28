# Arena Night

## Project

Portfolio project: landing page for a fictional boxing + music event. Built to demonstrate SSG, React performance, and real-time features.

## Stack

- Next.js 14 (App Router), TypeScript, Tailwind CSS
- Firebase (Firestore + Anonymous Auth)
- Vitest + React Testing Library

## Structure

- `app/` — Next.js pages (App Router)
- `components/` — React components
- `data/` — Static fight data (JSON) and TypeScript types
- `lib/` — Firebase config and utilities
- `__tests__/` — Test files

## Conventions

- TypeScript strict mode
- Server components by default, "use client" only when needed (interactivity/state/browser APIs)
- Tailwind for all styling, no CSS modules
- Data types defined in `data/types.ts`
- Tests follow risk-based strategy: test critical logic first

## Commands

- `npm run dev` — Start dev server
- `npm run build` — Production build
- `npm run test` — Run tests (watch mode)
- `npm run test:run` — Run tests once
- `npm run lint` — Run ESLint
