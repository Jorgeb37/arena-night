# Arena Night — Extra Features Design Spec

**Goal:** Add three polishing features to Arena Night that demonstrate advanced frontend skills: micro-animations, dynamic fight detail pages, and Open Graph social cards.

**Context:** Arena Night is already deployed at arena-night.vercel.app with 5 pages (landing, cartelera, votaciones, resultados, 404), 13 tests, and Lighthouse scores 95/95/96/100. These extras add "milla extra" quality without breaking existing performance.

---

## Feature 1: Micro-Animations (Motion library)

### Philosophy

Follow Emil Kowalski's animation principles: subtle, purposeful animations that enhance UX without drawing attention. No gratuitous motion.

### Library

**Motion** (formerly Framer Motion) — `motion` npm package. Lightweight, React-native, GPU-accelerated.

### What Gets Animated

| Element                    | Animation                     | Duration                  | Trigger                     |
| -------------------------- | ----------------------------- | ------------------------- | --------------------------- |
| Hero title ("Arena Night") | Fade up + slight scale        | 400ms spring              | Page load                   |
| Hero subtitle + buttons    | Staggered fade up             | 200ms each, 100ms stagger | After title                 |
| Fight cards (cartelera)    | Staggered fade up from bottom | 300ms each, 80ms stagger  | Scroll into view (viewport) |
| Navbar mobile menu         | Slide down + fade             | 200ms ease-out            | Toggle open                 |
| Vote bars                  | Width transition              | 300ms spring              | Value change                |
| Page transitions           | Fade in                       | 200ms                     | Route change                |

### Constraints

- Only animate `opacity` and `transform` (GPU-accelerated, no layout thrashing)
- `prefers-reduced-motion: reduce` — disable all animations via Motion's built-in support
- No animation on SSG-critical content that would cause layout shift (CLS)
- Keep Lighthouse Performance score >= 90

### Implementation Approach

- Create a reusable `<AnimateOnScroll>` wrapper component for scroll-triggered animations
- Use Motion's `<motion.div>` directly for simple cases (hero, navbar)
- Vote bar width animation uses CSS transitions (already partially in place), enhanced with Motion spring
- FightCard becomes a thin client wrapper that imports the server-rendered content and adds animation

### Files Affected

- `components/Hero.tsx` — NEW: extract hero section from `app/page.tsx` into its own component, add Motion animations
- `components/AnimateOnScroll.tsx` — NEW: reusable scroll-triggered animation wrapper
- `components/Navbar.tsx` — MODIFY: add Motion to mobile menu toggle
- `components/FightCard.tsx` — MODIFY: stays as server component for content; wrapped by animated client component in parent pages
- `components/VoteBar.tsx` — MODIFY: enhance bar width with spring transition
- `app/page.tsx` — MODIFY: use Hero component, wrap fight cards with AnimateOnScroll
- `app/cartelera/page.tsx` — MODIFY: wrap fight cards with AnimateOnScroll

### Testing

- Test that AnimateOnScroll renders children
- Test that animation classes/styles don't break existing component tests
- Existing 13 tests must continue passing

---

## Feature 2: Dynamic Fight Pages (`/cartelera/[id]`)

### Purpose

Each fight gets its own detail page at `/cartelera/fight-1`, `/cartelera/fight-2`, etc. Demonstrates `generateStaticParams` (SSG for dynamic routes) and `generateMetadata` (dynamic SEO).

### Route

`app/cartelera/[id]/page.tsx`

### Data Source

Same `data/combates.json` — no new data needed. Each fight page shows:

- Fight category + scheduled time
- Both fighters with large images, names, records
- "VS" divider
- Link to vote on this fight (`/votaciones`)
- Back link to full cartelera

### SSG Strategy

```typescript
export function generateStaticParams() {
  return fights.map((fight) => ({ id: fight.id }));
}
// Generates: /cartelera/fight-1, /cartelera/fight-2, ..., /cartelera/fight-5
```

All 5 pages pre-rendered at build time. `dynamicParams = false` to return 404 for invalid IDs.

### SEO

```typescript
export function generateMetadata({ params }: Props): Metadata {
  const fight = fights.find((f) => f.id === params.id);
  return {
    title: `${fight.fighter1.name} vs ${fight.fighter2.name} — Arena Night`,
    description: `${fight.category} — ${fight.fighter1.name} (${fight.fighter1.record}) vs ${fight.fighter2.name} (${fight.fighter2.record}). Arena Night, 15 de Julio 2026.`,
  };
}
```

### Navigation

- FightCard in cartelera grid becomes a clickable link (`<Link href={/cartelera/${fight.id}}>`)
- Fight detail page has "Volver a cartelera" back link
- Fight detail page has "Votar en este combate" CTA linking to `/votaciones`

### Files

- `app/cartelera/[id]/page.tsx` — NEW: dynamic fight detail page (Server Component)
- `components/FightCard.tsx` — MODIFY: wrap in `<Link>` to fight detail
- `components/FightDetail.tsx` — NEW: large-format fight display component

### Testing

- Test FightDetail renders fighter names, records, category
- Test FightCard now renders as a link
- Test 404 for invalid fight ID (generateStaticParams + dynamicParams false)

---

## Feature 3: Open Graph Social Cards

### Purpose

When someone shares an Arena Night link on Twitter/Discord/WhatsApp, it shows a rich preview card with the event branding instead of a generic link.

### Strategy

Static OG images using Next.js `opengraph-image.tsx` (ImageResponse API). No external services needed — images are generated at build time as part of SSG.

### Pages and Their OG Images

| Page              | OG Image Content                                           | Size     |
| ----------------- | ---------------------------------------------------------- | -------- |
| `/` (home)        | "Arena Night" logo + "15 de Julio 2026" + "Boxing & Music" | 1200x630 |
| `/cartelera`      | "Cartelera Completa" + "5 Combates"                        | 1200x630 |
| `/cartelera/[id]` | Fighter1 name VS Fighter2 name + category                  | 1200x630 |
| `/votaciones`     | "Vota por tu favorito"                                     | 1200x630 |
| `/resultados`     | "Resultados en Vivo"                                       | 1200x630 |

### Design

- Dark background (gray-950) matching site theme
- Amber accent (#f59e0b) for "Night" and highlights
- Inter font (same as site)
- Clean, bold typography — no complex graphics needed
- 1200x630px (standard OG size)

### Implementation

- `app/opengraph-image.tsx` — Home page OG image
- `app/cartelera/opengraph-image.tsx` — Cartelera OG image
- `app/cartelera/[id]/opengraph-image.tsx` — Dynamic per-fight OG image
- `app/votaciones/opengraph-image.tsx` — Votaciones OG image
- `app/resultados/opengraph-image.tsx` — Resultados OG image

Each file exports a default function using Next.js `ImageResponse` from `next/og`.

### Metadata Enhancement

Update `app/layout.tsx` metadata to include:

- `metadataBase` URL (arena-night.vercel.app)
- `openGraph` with siteName, locale, type
- `twitter` card type "summary_large_image"

### Testing

- Verify OG image files exist and export valid ImageResponse
- Manual verification: deploy to Vercel, test with og-image debugger tools

---

## Shared Constraints

- **Performance:** Lighthouse scores must stay >= 90 across all categories
- **Tests:** All existing 13 tests must pass. New tests added for new components.
- **Dependencies:** Only `motion` added as new dependency. OG images use built-in Next.js `next/og`.
- **SSG:** All new pages are statically generated. No new server-side runtime.
- **Accessibility:** `prefers-reduced-motion` respected. All images have alt text. Links are keyboard-navigable.

## Implementation Order

1. **Animations** — adds Motion dependency, creates foundational components (AnimateOnScroll, Hero)
2. **Dynamic fight pages** — uses FightCard (may be modified in step 1), adds new route
3. **Social cards** — depends on all routes existing (including dynamic pages from step 2)

---

Built for [Arena Night](https://arena-night.vercel.app) portfolio project.
