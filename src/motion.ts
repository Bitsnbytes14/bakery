const query = window.matchMedia('(prefers-reduced-motion: reduce)');

export const prefersReducedMotion = (): boolean => query.matches;

export const wait = (ms: number): Promise<void> =>
  new Promise((resolve) => window.setTimeout(resolve, prefersReducedMotion() ? 0 : ms));
