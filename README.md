# Arena Night

A high-traffic event landing page built with **Next.js 16**, **TypeScript**, and **Firebase**. Designed as a portfolio piece demonstrating SSG, real-time features, and frontend performance optimization.

## Why This Project

Built to demonstrate the technical skills needed for building event websites that handle massive traffic:

- **Static Site Generation (SSG)** for pages that don't change — served instantly from CDN
- **Client Components** only where interactivity is needed — countdown, voting, live results
- **Real-time voting** with Firebase Firestore — updates across all connected clients instantly
- **Performance-first** — Lighthouse 90+ across all categories

## Tech Stack

| Technology                  | Purpose                                    |
| --------------------------- | ------------------------------------------ |
| Next.js 16 (App Router)     | SSG, routing, server/client components     |
| TypeScript                  | Type safety                                |
| Tailwind CSS                | Styling                                    |
| Firebase (Firestore + Auth) | Real-time voting, anonymous authentication |
| Vitest + RTL                | Testing (13 tests)                         |
| Vercel                      | Deployment with global CDN                 |

## Architecture

```
SSG (Build Time)          Client (Browser)
┌─────────────────┐      ┌──────────────────┐
│ Landing page    │      │ Countdown timer  │
│ Cartelera       │      │ Vote bars        │
│ (static HTML)   │      │ Live results     │
└─────────────────┘      │ (Firebase real-  │
        │                │  time + polling)  │
        ▼                └──────────────────┘
   Served by CDN                 │
   (instant load)                ▼
                          Firebase Firestore
                          (real-time sync)
```

**Why this split?** Content that doesn't change (fight cards, hero) is pre-rendered at build time as static HTML — a CDN serves it instantly to millions of users without hitting a server. Interactive features (countdown, voting, live scores) run as client components with minimal JavaScript.

## Features

- **Hero with countdown** — Pure client-side timer, no backend needed
- **Fight card grid** — SSG pre-rendered, responsive 2-column layout
- **Real-time voting** — Firebase anonymous auth + Firestore real-time listeners
- **Live results** — Simulated polling updates every 10 seconds
- **Mobile responsive** — Hamburger menu, works on all screen sizes

## Getting Started

```bash
# Clone
git clone https://github.com/Jorgeb37/arena-night.git
cd arena-night

# Install
npm install

# Set up Firebase (create .env.local)
cp .env.example .env.local
# Fill in your Firebase config values

# Run
npm run dev
```

## Testing

```bash
npm run test        # Watch mode
npm run test:run    # Single run (13 tests)
```

## Live Demo

**[arena-night.vercel.app](https://arena-night.vercel.app)**

## Lighthouse Score

<!-- Add screenshot after running Lighthouse audit -->

---

Built by [Jorge Manuel Bustillos Caicedo](https://linkedin.com/in/jorge-manuel-bustillos)
