import type { RatingQuestion } from './data/questions';
import { wait } from './motion';

/** Mounts the stubborn rating slider into host. Calls onRecord when the visitor records a value. */
export function mountSlider(
  host: HTMLElement,
  q: RatingQuestion,
  onRecord: (value: number, reaction: string) => void,
): void {
  const wrap = document.createElement('div');
  wrap.className = 'slider';
  wrap.innerHTML = `
    <label class="label" for="rating">Rating (1 to 10)</label>
    <p class="slider__value" aria-hidden="true"><span id="rating-out">${q.floor}</span> / 10</p>
    <input id="rating" class="slider__input" type="range" min="1" max="10" step="1" value="${q.floor}" aria-describedby="rating-protest" />
    <div class="slider__ticks" aria-hidden="true"><span>1</span><span>10</span></div>
    <p id="rating-protest" class="slider__protest" role="status" aria-live="polite"></p>
    <button type="button" class="btn" id="rating-record">Record rating</button>
  `;
  host.append(wrap);

  const input = wrap.querySelector<HTMLInputElement>('#rating')!;
  const out = wrap.querySelector<HTMLElement>('#rating-out')!;
  const protest = wrap.querySelector<HTMLElement>('#rating-protest')!;
  const record = wrap.querySelector<HTMLButtonElement>('#rating-record')!;

  let protests = 0;
  let unlocked = false;
  let last = 0;

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
    } else if (v < q.floor) {
      protest.textContent = 'Very well.';
    } else {
      protest.textContent = '';
    }
    out.textContent = input.value;
  });

  record.addEventListener('click', () => {
    const v = Number(input.value);
    input.disabled = true;
    record.disabled = true;
    protest.textContent = '';
    onRecord(v, v >= q.floor ? q.accepted : q.forced);
  });
}
