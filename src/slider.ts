import type { RatingItem, Treat } from './data/questions';
import { wait } from './motion';

export interface SliderOptions {
  /** Restores a previously recorded value when returning to the question. */
  value?: number;
  unlocked?: boolean;
  recorded?: boolean;
  onRecord: (value: number, reaction: string, treat: Treat, unlocked: boolean) => void;
  /** The visitor moved the slider after recording: the old answer no longer matches. */
  onInvalidate: () => void;
}

/** Piping-bag rating slider that resists going below the floor. */
export function mountSlider(host: HTMLElement, q: RatingItem, opts: SliderOptions): void {
  const start = opts.value ?? q.floor;
  const wrap = document.createElement('div');
  wrap.className = 'slider';
  wrap.innerHTML = `
    <label class="label" for="rating">Rating, 1 to 10</label>
    <p class="slider__value" aria-hidden="true"><span id="rating-out">${start}</span> / 10 <span>⭐</span></p>
    <input id="rating" class="slider__input" type="range" min="1" max="10" step="1" value="${start}" aria-describedby="rating-protest" />
    <div class="slider__ticks" aria-hidden="true"><span>1</span><span>10</span></div>
    <p id="rating-protest" class="slider__protest" role="status" aria-live="polite"></p>
    <button type="button" class="btn" id="rating-record"></button>
  `;
  host.append(wrap);

  const input = wrap.querySelector<HTMLInputElement>('#rating')!;
  const out = wrap.querySelector<HTMLElement>('#rating-out')!;
  const protest = wrap.querySelector<HTMLElement>('#rating-protest')!;
  const record = wrap.querySelector<HTMLButtonElement>('#rating-record')!;

  let protests = 0;
  let unlocked = opts.unlocked ?? false;
  let recorded = opts.recorded ?? false;
  let last = 0;

  const setRecordLabel = () => {
    record.textContent = recorded ? 'Recorded ' : 'Record rating ';
    const e = document.createElement('span');
    e.setAttribute('aria-hidden', 'true');
    e.textContent = recorded ? '✅' : '🧁';
    record.append(e);
    record.disabled = recorded;
  };
  setRecordLabel();

  // The number on screen always comes from the input itself, so what you see is what gets saved.
  const paint = () => {
    input.style.setProperty('--pct', `${((Number(input.value) - 1) / 9) * 100}%`);
    out.textContent = input.value;
  };
  paint();

  const wobble = async () => {
    wrap.classList.remove('wobble');
    void wrap.offsetWidth;
    wrap.classList.add('wobble');
    await wait(450);
    wrap.classList.remove('wobble');
  };

  input.addEventListener('input', () => {
    const v = Number(input.value);
    if (v < q.floor && !unlocked) {
      const now = performance.now();
      if (now - last > 500) {
        last = now;
        protest.textContent = q.protests[Math.min(protests, q.protests.length - 1)];
        protests += 1;
        if (protests >= q.protests.length) unlocked = true;
        void wobble();
      }
      input.value = String(q.floor);
    } else {
      protest.textContent = '';
    }
    paint();
    if (recorded && Number(input.value) !== Number(out.dataset.saved)) {
      recorded = false;
      setRecordLabel();
      opts.onInvalidate();
    }
  });

  record.addEventListener('click', () => {
    const v = Number(input.value);
    protest.textContent = '';
    const ok = v >= q.floor;
    const [reaction, treat] =
      v === 10 ? [q.perfect, q.perfectTreat] : ok ? [q.accepted, q.acceptedTreat] : [q.forced, q.forcedTreat];
    recorded = true;
    out.dataset.saved = String(v);
    setRecordLabel();
    opts.onRecord(v, reaction, treat, unlocked || !ok);
  });

  if (recorded) out.dataset.saved = String(start);
}
