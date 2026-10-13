export interface Treat {
  name: string;
  /** Plain emoji treat. */
  emoji?: string;
  /** Inline SVG treat (stays sharp on retina). Trusted constant markup only. */
  svg?: string;
}

const BROWNIE = `<svg viewBox="0 0 32 32" aria-hidden="true"><rect x="3" y="6" width="26" height="22" rx="6" fill="#7b4a30"/><path d="M3 13c0-4 3-7 7-7h12c4 0 7 3 7 7v1c-3 1-4 4-7 4s-4-3-7-3-4 3-7 3-5-2-5-5z" fill="#a8704a"/><circle cx="11" cy="12" r="1.4" fill="#a9d18e"/><circle cx="20" cy="10" r="1.4" fill="#f08a9b"/><circle cx="12" cy="21" r="1.2" fill="#fff8ea"/><circle cx="20" cy="22" r="1.2" fill="#fff8ea"/></svg>`;

const KAJU = `<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M16 2 30 16 16 30 2 16Z" fill="#e4e8ef" stroke="#8d97a6" stroke-width="1.6" stroke-linejoin="round"/><path d="M16 9 23 16 16 23 9 16Z" fill="none" stroke="#b5bcc8" stroke-width="1.2"/><circle cx="16" cy="16" r="2.2" fill="#a9d18e"/></svg>`;

export const TREATS = {
  brownie: { name: 'brownie', svg: BROWNIE },
  kaju: { name: 'kaju katli', svg: KAJU },
  cupcake: { name: 'cupcake', emoji: '🧁' },
  choc: { name: 'chocolate bar', emoji: '🍫' },
  cookie: { name: 'cookie', emoji: '🍪' },
  donut: { name: 'doughnut', emoji: '🍩' },
  croissant: { name: 'croissant', emoji: '🥐' },
  chai: { name: 'cup of chai', emoji: '☕' },
  coffee: { name: 'cup of coffee', emoji: '☕' },
  cake: { name: 'slice of cake', emoji: '🍰' },
  ribbon: { name: 'ribbon', emoji: '🎀' },
  bell: { name: 'little bell', emoji: '🛎️' },
  sparkle: { name: 'sparkle', emoji: '✨' },
} satisfies Record<string, Treat>;
