# The Bully Bakery

A tiny interactive bakery. Walk in, place an order by answering this-or-that questions, and collect a receipt. Vite + vanilla TypeScript + plain CSS. No framework or backend. Answers live in memory and only leave the browser if the visitor taps "Send my order to the chef", which needs `VITE_WEB3FORMS_KEY` (see `.env.example`; the button hides without it). Vercel Web Analytics is included for page views.

## Run

```bash
npm install
npm run dev       # local dev server
npm run build     # type-check + static build into dist/
npm run preview   # serve the built site
```

## Deploy to Vercel

Zero config; Vercel auto-detects the Vite preset (build `npm run build`, output `dist`).

- Push to GitHub, import the repo at [vercel.com/new](https://vercel.com/new) and click **Deploy**, or
- run `npx vercel` from this folder.

## Edit the content

Every question, option, Chef's Note and treat assignment lives in `src/data/questions.ts` (treat artwork in `src/data/treats.ts`).

## Structure

```
index.html              markup for every screen
src/main.ts             screen navigation + wiring
src/data/questions.ts   questions, reactions
src/data/treats.ts      treat emoji + SVG (brownie, kaju katli)
src/shopfront.ts        sign, bell, "Come in"
src/nameScramble.ts     name form + letter scramble
src/questions.ts        order tickets, Back / change answers
src/review.ts           review screen before the receipt
src/slider.ts           piping-bag rating slider
src/dessertBox.ts       pinned dessert box
src/mascot.ts           brownie mascot
src/receipt.ts          receipt + PNG download/share
src/style.css           tokens (palette, spacing) and styles
archive/case-file/      previous "Case File" version, not part of the build
```

`prefers-reduced-motion` turns the swing, wiggle, dance, drop, scramble and typing effects into simple fades.
