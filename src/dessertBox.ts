import { NUMBERED } from './data/questions';
import type { Treat } from './data/questions';
import { $, el } from './dom';

export interface DessertBox {
  /** Puts (or replaces) the treat for question `index`; null empties the slot. */
  set(index: number, treat: Treat | null): void;
  show(): void;
  hide(): void;
  reset(): void;
}

export function initDessertBox(): DessertBox {
  const box = $<HTMLElement>('box');
  const list = $<HTMLElement>('box-items');
  const count = $<HTMLElement>('box-count');
  const slots: HTMLElement[] = [];

  const updateCount = () => {
    const filled = slots.filter((s) => s.classList.contains('is-filled')).length;
    count.textContent = `${filled} of ${NUMBERED}`;
  };

  const build = () => {
    list.textContent = '';
    slots.length = 0;
    for (let i = 0; i < NUMBERED; i++) {
      const li = el('li', 'slot');
      li.setAttribute('aria-hidden', 'true');
      slots.push(li);
      list.append(li);
    }
    updateCount();
  };
  build();

  // Keep content clear of the pinned box: expose its height as a CSS variable.
  const sync = () => {
    document.documentElement.style.setProperty('--box-h', box.hidden ? '0px' : `${box.offsetHeight}px`);
  };
  new ResizeObserver(sync).observe(box);

  return {
    set(index, treat) {
      const slot = slots[index];
      if (!slot) return;
      slot.textContent = '';
      slot.classList.remove('is-filled');
      if (!treat) {
        slot.setAttribute('aria-hidden', 'true');
      } else {
        void slot.offsetWidth; // restart the drop animation when a treat is swapped
        slot.removeAttribute('aria-hidden');
        slot.classList.add('is-filled');
        const visual = el('span', 'slot__emoji');
        visual.setAttribute('aria-hidden', 'true');
        if (treat.svg) {
          visual.classList.add('slot__svg');
          visual.innerHTML = treat.svg;
        } else visual.textContent = treat.emoji ?? '';
        slot.append(visual, el('span', 'sr-only', treat.name));
      }
      updateCount();
    },
    show() {
      box.hidden = false;
      sync();
    },
    hide() {
      box.hidden = true;
      sync();
    },
    reset() {
      build();
    },
  };
}
