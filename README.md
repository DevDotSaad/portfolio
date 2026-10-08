# Muhammad Saad Zubair — Portfolio

Personal portfolio for **Muhammad Saad Zubair** — AI Engineer & Full Stack AI Developer, Karachi.

Next.js (App Router, static export) · GSAP + ScrollTrigger · Lenis · CSS 3D · Three.js (hero orb only) · self-hosted Poppins / Inter.

## Run locally

Requires Node 20.9+.

```bash
npm install
npm run dev          # http://localhost:3000 (dev server)
```

Production build (static export to `out/`) and preview:

```bash
npm run build
npm start            # serves out/ on http://localhost:3000
```

The build must finish with no warnings and no errors.

## Deploy to Vercel

1. Push this folder to a Git repository (GitHub/GitLab/Bitbucket).
2. In Vercel: **Add New → Project**, import the repo. Framework preset **Next.js** is detected automatically. Keep the defaults: build command `next build`, with the `out/` static export produced by `output: 'export'` in `next.config.ts`.
3. Add the environment variable `NEXT_PUBLIC_SITE_URL` = your production URL (for example `https://saadzubair.dev`). It is used for absolute Open Graph and canonical URLs.
4. Deploy. Every push to the main branch redeploys.

CLI alternative:

```bash
npx vercel          # preview deployment
npx vercel --prod   # production deployment
```

Any static host works too (Netlify, Cloudflare Pages, GitHub Pages). Upload `out/`.

## Editing content

All copy lives in **`lib/data.ts`**: site info, projects/case studies, concepts, stack, experience, education. Every fact comes from the CV or the project brief, so nothing is invented. Items still waiting for real content are marked `PLACEHOLDER` (see below).

Case-study pages (`/work/[slug]/`) are generated from `PROJECTS`. Architecture diagrams are drawn from each project's `diagram` (nodes plus an optional branch node) by `components/FlowDiagram.tsx`. The diagram is horizontal on desktop and vertical on phones.

## Placeholders to fill

| What | Where |
| --- | --- |
| Production domain | `NEXT_PUBLIC_SITE_URL` env var (fallback in `SITE.url`) |
| AI Interpreter link ("Launching soon") | `PROJECTS[ai-interpreter].link` |
| CRM & AI Automation Suite link | `PROJECTS[crm-automation-suite].link` |

Filled from the CV: the CV PDF (`public/Muhammad-Saad-Zubair-CV.pdf`), LinkedIn, the Coach AI live link, the four More-projects links, and the Thelaywala experience bullets.

## Screenshots

`npm run screens` (`scripts/build-screens.mjs`) reads `../portfolio-assets/screens/`. It renames the sources by product (`rename-log.json` there maps each new name back to its original), crops each one to the product UI only (no browser chrome, taskbars, personal emails or blank margins), writes WebP at two sizes to `public/img/work/`, and emits `lib/screens.generated.ts`.

In `lib/data.ts`, each project picks a `cover` for the home mockup (must be at least 1200 px wide so it stays sharp at 2×) and up to four `shots` for the case-study lightbox grid. Frames are fixed-ratio with `object-fit: cover`, anchored per image, so nothing is stretched. Screenshots below the fold load lazily.

| Product | Home mockup | Case-study grid |
| --- | --- | --- |
| Coach AI — PainterGrowth.com | coach-ai-dashboard | dashboard · live-coach · knowledge-base · meetings |
| AI Real-Time Sales Copilot — Thelaywala | sales-copilot-dashboard-home | dashboard-home · overlay-live-call · dashboard-weekly · dashboard-reports |
| AI Interpreter | ai-interpreter-site-hero | site-hero · site-pipeline · site-they-speak · site-on-your-machine |
| CRM & AI Automation Suite | crm-ghl-workflow-pipeline-sync | pipeline-sync · customer-emails · reply-branches · pvl-purchase |
| Salon / Weather / TaskFlow / Blog | card thumbnails: salon-hero · weather-dashboard · taskflow-home · blog-home | — |

## Assets

`npm run assets` regenerates everything derived from source files (screenshots have their own script, `npm run screens`):

- **Photo**: cropped to 4:5 and exported as WebP at 480 and 960 px (`public/img/saad-*.webp`). Source path: `../portfolio-assets/…jpeg`, or set `PHOTO=/path/to/photo.jpg`.
- **Fonts**: Poppins 600/700 and Inter 400/600 are copied from `@fontsource` into `app/fonts/` and served by `next/font/local`, so no external font requests are made.
- **Tech logos**: only the icons the site uses are extracted from `simple-icons` into `lib/icons.generated.ts`. Tools without a simple-icons logo (OpenAI, GoHighLevel, Close, Retell.ai, …) use a monogram badge.
- **Open Graph image** (`public/og.png`, 1200×630, photo + name) and **apple-touch icon**: rendered with Chrome by `scripts/og.mjs`. The favicon is `public/icon.svg` ("SZ").

## Motion and accessibility

- `prefers-reduced-motion`: a tiny inline script adds `.motion` to `<html>` only when motion is allowed. Every hidden "before reveal" state is scoped to `.motion`, so with reduced motion (or without JS) the page is fully visible and static. The orb becomes static SVG rings, Lenis and GSAP never load, and the marquee becomes a wrapped list.
- Lenis smooth scrolling runs only for mouse/trackpad pointers. Touch devices keep native scrolling.
- Three.js loads on first interaction (or on idle for desktop pointers). Until then the static SVG rings act as the poster. The render loop pauses off-screen and in background tabs.
- GSAP / ScrollTrigger load only when a scroll-linked element (timeline, mockup parallax) approaches the viewport.
- Below-the-fold sections use `content-visibility: auto`. In-page anchor jumps render all sections first so targets land exactly under the nav.

## Measuring

```bash
npm start                                          # serve the build on :3000
node scripts/lighthouse.mjs http://localhost:3000/ 5   # Lighthouse, median of 5 (mobile + desktop)
npm run fps                                        # frame-time p95, headful Chrome (expects :4173, or pass a URL)
npm run shots                                      # screenshots → reports/screens/
```

The scripts use the installed Chrome at `C:/Program Files/Google/Chrome/Application/chrome.exe`. Override it with `CHROME_PATH`.

## Structure

```
app/
  layout.tsx            fonts, metadata/OG, nav, motion runtime
  page.tsx              home (sections, each in its own Suspense boundary)
  work/[slug]/page.tsx  case-study pages (static params)
  globals.css           design tokens + all styles (single dark theme)
components/
  sections/             Hero, Featured, MoreProjects, Stack, Concepts, Experience/Education, Contact
  Orb.tsx, orb-scene.ts Three.js JARVIS orb (lazy) + static SVG fallback
  FlowDiagram.tsx       SVG architecture/flow diagrams
  MotionRuntime.tsx     Lenis, reveals, ScrollTrigger, tilt/magnetic/spotlight, anchor scrolling
  Nav.tsx               floating pill nav with active-section indicator
lib/data.ts             all content
scripts/                asset pipeline, OG render, screenshots, fps, Lighthouse
```
