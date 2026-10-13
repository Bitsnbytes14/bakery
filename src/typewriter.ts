import { prefersReducedMotion } from './motion';

const timers = new WeakMap<HTMLElement, number>();

export function cancelTyping(el: HTMLElement): void {
  const id = timers.get(el);
  if (id !== undefined) window.clearTimeout(id);
  timers.delete(el);
}

/** Types text into el one character at a time. Instant under reduced motion. */
export function typeInto(el: HTMLElement, text: string, speed = 28): Promise<void> {
  cancelTyping(el);
  if (prefersReducedMotion()) {
    el.textContent = text;
    return Promise.resolve();
  }
  el.textContent = '';
  // Step by code point so emoji never flash as broken characters mid-type.
  const chars = Array.from(text);
  return new Promise((resolve) => {
    let i = 0;
    const tick = () => {
      i += 1;
      el.textContent = chars.slice(0, i).join('');
      if (i >= chars.length) {
        timers.delete(el);
        resolve();
        return;
      }
      timers.set(el, window.setTimeout(tick, speed));
    };
    timers.set(el, window.setTimeout(tick, speed));
  });
}
