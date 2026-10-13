import { ITEMS, NUMBERED } from './data/questions';
import type { ChefItem, ChoiceItem, RatingItem, Treat } from './data/questions';
import type { DessertBox } from './dessertBox';
import { $, el, emojiBadge, withEmoji } from './dom';
import type { Mascot } from './mascot';
import { wait } from './motion';
import { createNote } from './note';
import { mountSlider } from './slider';
import { buildTicket } from './ticket';

export const NO_QUESTION = 'No questions. The chef is relieved.';

export interface Line {
  /** Index of the question in ITEMS, used by the review screen to jump back. */
  index: number;
  icon: string;
  topic: string;
  answer: string;
}

export interface OrderResult {
  lines: Line[];
  chefQuestion: string;
}

interface Deps {
  box: DessertBox;
  mascot: Mascot;
  /** Called when the visitor finishes the last question (or returns from an edit). */
  onDone: (result: OrderResult) => void;
}

/** Everything remembered about one answered question (memory only). */
interface Stored {
  line: Line;
  reaction: string;
  choice?: number;
  value?: number;
  unlocked?: boolean;
  text?: string;
}

export function initQuestions({ box, mascot, onDone }: Deps) {
  const root = $<HTMLElement>('order');
  const LAST = ITEMS.length - 1;
  let stored: (Stored | undefined)[] = [];
  let chefDraft = '';
  let editing = false; // true when she arrived from the review screen
  let session = 0;

  function result(): OrderResult {
    const lines = stored.filter((s): s is Stored => !!s && s.line.index < LAST).map((s) => s.line);
    return { lines, chefQuestion: stored[LAST]?.text ?? '' };
  }

  function shell(index: number, icon: string, prompt: string) {
    const last = index >= NUMBERED;
    const { root: card, body } = buildTicket(
      last ? 'Last item' : `Item ${index + 1} of ${NUMBERED}`,
      last ? 1 : (index + 1) / NUMBERED,
    );
    const h = el('h3', 'ticket__prompt');
    h.append(emojiBadge(icon), prompt);
    h.tabIndex = -1;
    const content = el('div', 'ticket__content');
    const note = createNote();
    const actions = el('div', 'ticket__actions');
    body.append(h, content, note.root, actions);

    if (index > 0) {
      const back = el('button', 'btn btn--ghost btn--back');
      back.type = 'button';
      back.append(withEmoji('Back', '👈'));
      back.addEventListener('click', () => void show(index - 1));
      actions.append(back);
    }

    const dropNext = () => actions.querySelector('.btn--next')?.remove();

    const addNext = (focus: boolean) => {
      dropNext();
      const next = el('button', 'btn btn--next');
      next.type = 'button';
      next.append(
        editing ? withEmoji('Back to review', '📝') : index === LAST ? withEmoji('Review your order', '📝') : withEmoji('Next', '👉'),
      );
      next.addEventListener('click', () => {
        next.disabled = true;
        if (editing || index === LAST) {
          editing = false;
          onDone(result());
        } else void show(index + 1);
      });
      actions.append(next);
      if (focus) {
        next.focus({ preventScroll: true });
        next.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    };

    /** A fresh answer: dance, drop the treat, type the note, then offer Next. */
    const react = async (reaction: string, treat: Treat | null) => {
      const mine = session;
      dropNext();
      mascot.dance();
      box.set(index, treat);
      await note.show(reaction);
      if (mine !== session) return;
      addNext(true);
    };

    /** Coming back to an answered question: restore without animating. */
    const restore = (reaction: string) => {
      note.showNow(reaction);
      addNext(false);
    };

    /** The answer was changed or cleared and no longer matches the reaction. */
    const invalidate = () => {
      dropNext();
      note.hide();
      box.set(index, null);
      stored[index] = undefined;
    };

    return { card, content, h, react, restore, invalidate };
  }

  function choiceCard(index: number, q: ChoiceItem) {
    const { card, content, h, react, restore } = shell(index, q.icon, q.prompt);
    const opts = el('div', q.choices.length === 2 ? 'opts opts--two' : 'opts');
    const buttons: HTMLButtonElement[] = [];
    const mark = (picked: number) =>
      buttons.forEach((x, i) => {
        x.classList.toggle('is-picked', i === picked);
        x.setAttribute('aria-pressed', String(i === picked));
      });

    q.choices.forEach((c, i) => {
      const b = el('button', 'opt');
      b.type = 'button';
      b.setAttribute('aria-keyshortcuts', String(i + 1));
      b.setAttribute('aria-pressed', 'false');
      const text = el('span');
      text.append(withEmoji(c.label, c.emoji));
      const key = el('span', 'opt__key', String(i + 1));
      key.setAttribute('aria-hidden', 'true');
      b.append(text, key);
      b.addEventListener('click', () => {
        mark(i);
        stored[index] = { choice: i, reaction: c.reaction, line: { index, icon: c.emoji, topic: q.topic, answer: c.label } };
        void react(c.reaction, c.treat);
      });
      buttons.push(b);
      opts.append(b);
    });
    content.append(opts);

    const prev = stored[index];
    if (prev?.choice !== undefined) {
      mark(prev.choice);
      restore(prev.reaction);
    }
    return { card, h };
  }

  function ratingCard(index: number, q: RatingItem) {
    const { card, content, h, react, restore, invalidate } = shell(index, q.icon, q.prompt);
    const prev = stored[index];
    mountSlider(content, q, {
      value: prev?.value,
      unlocked: prev?.unlocked,
      recorded: !!prev,
      onRecord: (value, reaction, treat, unlocked) => {
        stored[index] = { value, unlocked, reaction, line: { index, icon: q.icon, topic: q.topic, answer: `${value} / 10` } };
        void react(reaction, treat);
      },
      onInvalidate: invalidate,
    });
    if (prev) restore(prev.reaction);
    return { card, h };
  }

  function chefCard(index: number, q: ChefItem) {
    const { card, content, h, react, restore, invalidate } = shell(index, q.icon, q.prompt);
    const prev = stored[index];
    const label = el('label', 'label', 'Your question for the chef');
    label.htmlFor = 'chef-q';
    const area = el('textarea', 'textbox');
    area.id = 'chef-q';
    area.rows = 3;
    area.maxLength = 140;
    area.placeholder = q.placeholder;
    area.value = prev?.text ?? chefDraft;
    const send = el('button', 'btn');
    send.type = 'button';
    const setLabel = () => {
      send.textContent = '';
      send.append(area.value.trim() ? withEmoji('Send to the chef', '🧑‍🍳') : withEmoji('Skip', '⏭️'));
    };
    setLabel();
    area.addEventListener('input', () => {
      chefDraft = area.value;
      setLabel();
      if (stored[index]) invalidate();
    });
    send.addEventListener('click', () => {
      const text = area.value.trim();
      const reaction = text ? q.submitReaction : q.skipReaction;
      stored[index] = { text, reaction, line: { index, icon: q.icon, topic: q.topic, answer: text || NO_QUESTION } };
      void react(reaction, null);
    });
    content.append(label, area, send);
    if (prev) restore(prev.reaction);
    return { card, h };
  }

  async function show(index: number) {
    const mine = session;
    const old = root.firstElementChild as HTMLElement | null;
    if (old) {
      old.classList.add('is-leaving');
      await wait(220);
      if (mine !== session) return;
    }
    root.textContent = '';
    const q = ITEMS[index];
    const { card, h } =
      q.kind === 'choice' ? choiceCard(index, q) : q.kind === 'rating' ? ratingCard(index, q) : chefCard(index, q);
    card.classList.add('is-entering');
    root.append(card);
    if (index > 0) {
      h.focus({ preventScroll: true });
      card.scrollIntoView({ block: 'start', behavior: 'smooth' });
    }
  }

  // Keyboard shortcuts: 1-4 pick an option, Enter advances (or records the rating).
  document.addEventListener('keydown', (e) => {
    if (e.ctrlKey || e.metaKey || e.altKey || $('screen-order').hidden) return;
    const t = e.target as HTMLElement;
    if (t.matches('textarea, input:not([type="range"]), select')) return;
    if (/^[1-4]$/.test(e.key)) {
      const b = root.querySelectorAll<HTMLButtonElement>('.opt')[Number(e.key) - 1];
      if (b && !b.disabled) {
        e.preventDefault();
        b.click();
      }
    } else if (e.key === 'Enter' && !t.closest('button, a')) {
      const target =
        root.querySelector<HTMLButtonElement>('.btn--next:not(:disabled)') ??
        root.querySelector<HTMLButtonElement>('#rating-record:not(:disabled)');
      if (target) {
        e.preventDefault();
        target.click();
      }
    }
  });

  return {
    start() {
      void show(0);
    },
    /** Jump to a question from the review screen. */
    edit(index: number) {
      editing = true;
      void show(index);
    },
    /** Return from the review screen to the last question. */
    showLast() {
      editing = false;
      void show(LAST);
    },
    result,
    reset() {
      session++;
      stored = [];
      chefDraft = '';
      editing = false;
      root.textContent = '';
    },
  };
}
