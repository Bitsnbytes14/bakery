import { CUSTOMER } from './data/questions';
import { $ } from './dom';
import { prefersReducedMotion } from './motion';
import { createNote } from './note';
import { buildTicket } from './ticket';

const LETTERS = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
const NOTE = 'Sorry, our system only accepts verified names 🤷 Welcome, Miss Bully.';

/** Scrambles `from` into `to`, resolving left to right. Instant under reduced motion. */
function scrambleTo(target: HTMLElement, from: string, to: string, timers: number[]): Promise<void> {
  if (prefersReducedMotion()) {
    target.textContent = to;
    return Promise.resolve();
  }
  const len = Math.max(from.length, to.length, 10);
  const start = performance.now();
  return new Promise((resolve) => {
    const id = window.setInterval(() => {
      const t = performance.now() - start;
      let out = '';
      let done = true;
      for (let i = 0; i < len; i++) {
        if (t >= 500 + i * 90) out += to[i] ?? '';
        else {
          done = false;
          out += LETTERS[Math.floor(Math.random() * LETTERS.length)];
        }
      }
      target.textContent = out;
      if (done) {
        window.clearInterval(id);
        target.textContent = to;
        resolve();
      }
    }, 55);
    timers.push(id);
  });
}

export function initName(onDone: () => void) {
  const host = $<HTMLElement>('name-ticket');
  let timers: number[] = [];
  let note = createNote();
  let session = 0;
  let typedName = '';

  function build() {
    host.textContent = '';
    note = createNote();
    const { root, body } = buildTicket('New order');

    const form = document.createElement('form');
    form.className = 'name-form';
    form.innerHTML = `
      <label class="ticket__prompt" for="name">Name for the order? <span aria-hidden="true">✍️</span></label>
      <input id="name" class="input" type="text" maxlength="24" autocomplete="off" placeholder="Type anything" />
      <button type="submit" class="btn">Confirm name <span aria-hidden="true">✅</span></button>
    `;
    const display = document.createElement('p');
    display.className = 'scramble';
    display.setAttribute('aria-hidden', 'true');
    display.hidden = true;
    const actions = document.createElement('div');
    actions.className = 'ticket__actions';
    body.append(form, display, note.root, actions);
    host.append(root);

    const input = form.querySelector<HTMLInputElement>('#name')!;
    const submit = form.querySelector<HTMLButtonElement>('button')!;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const mine = session;
      const typed = input.value.trim();
      typedName = typed;
      input.disabled = true;
      submit.hidden = true;
      display.hidden = false;
      display.textContent = typed;
      await scrambleTo(display, typed, CUSTOMER, timers);
      if (mine !== session) return;
      display.removeAttribute('aria-hidden');
      await note.show(NOTE);
      if (mine !== session) return;
      const next = document.createElement('button');
      next.type = 'button';
      next.className = 'btn';
      next.innerHTML = 'Take a ticket <span aria-hidden="true">🎟️</span>';
      next.addEventListener('click', () => {
        next.disabled = true;
        onDone();
      });
      actions.append(next);
      next.focus({ preventScroll: true });
    });
  }

  build();

  return {
    /** What she typed before it was replaced; only read when she chooses to send her order. */
    typed: () => typedName,
    focus() {
      host.querySelector<HTMLInputElement>('#name')?.focus({ preventScroll: true });
    },
    reset() {
      session++;
      typedName = '';
      timers.forEach((t) => window.clearInterval(t));
      timers = [];
      note.cancel();
      build();
    },
  };
}
