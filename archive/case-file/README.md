# Case File: Alleged Lack of Creativity

A small interactive self-roast with a playful witness interview, dressed up as a government dossier. Vite + vanilla TypeScript + plain CSS. No framework, backend, tracking or env vars.

## Run

```bash
npm install
npm run dev       # local dev server
npm run build     # type-check + static build into dist/
npm run preview   # serve the built site
```

## Deploy to Vercel

Zero config; Vercel auto-detects the Vite preset (build `npm run build`, output `dist`).

- Push to GitHub, then import the repo at [vercel.com/new](https://vercel.com/new) and click **Deploy**, or
- run `npx vercel` from this folder.

## Structure

```
index.html          markup for every section
src/main.ts         boot + reset wiring
src/folder.ts       cover and flap animation
src/exhibits.ts     scroll reveals, redaction toggle
src/interview.ts    witness interview cards
src/slider.ts       stubborn rating slider
src/statement.ts    signed statement + PNG download/share
src/data/questions.ts  all questions and reactions (edit here)
src/verdict.ts      pause, stamp slam, sentence served
src/typewriter.ts   typing helper
src/motion.ts       reduced-motion helpers
src/style.css       tokens (palette, spacing) and styles
```

`prefers-reduced-motion` disables the shake, typing and slam effects.
