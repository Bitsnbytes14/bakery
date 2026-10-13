import { $ } from './dom';
import { mountMascot } from './mascot';
import { prefersReducedMotion, wait } from './motion';
import { typeInto } from './typewriter';

export function initShopfront(onEnter: () => void) {
  mountMascot($('shop-mascot'));
  const typed = $<HTMLElement>('shop-sub-text');
  const full = $<HTMLElement>('shop-sub-full').textContent ?? '';
  const cta = $<HTMLButtonElement>('come-in');
  let run = 0;

  cta.addEventListener('click', onEnter);

  /** Pause, type the subheadline, then fade the button in. Everything is instant under reduced motion. */
  async function play() {
    const mine = ++run;
    cta.classList.remove('is-in');
    if (prefersReducedMotion()) {
      typed.textContent = full;
      cta.classList.add('is-in');
      return;
    }
    typed.textContent = '';
    await wait(900);
    if (mine !== run) return;
    await typeInto(typed, full, 42);
    if (mine !== run) return;
    await wait(250);
    if (mine !== run) return;
    cta.classList.add('is-in');
  }

  void play();
  return { play };
}
