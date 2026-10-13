import { NUMBERED, QUESTIONS } from './data/questions';
import type { ChoiceQuestion, OpenQuestion, Question, RatingQuestion } from './data/questions';
import { wait } from './motion';
import { mountSlider } from './slider';
import { cancelTyping, typeInto } from './typewriter';

export interface Answer {
  topic: string;
  answer: string;
}

export interface Interview {
  answers: Answer[];
  /** Text of the question for the defendant; empty if skipped. */
  defendantQuestion: string;
}

export function initInterview(onComplete: (result: Interview) => void) {
  const root = document.getElementById('interview') as HTMLElement;
  let answers: Answer[] = [];
  let defendantQuestion = '';
  let session = 0;

  function el<K extends keyof HTMLElementTagNameMap>(tag: K, cls?: string, text?: string) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text) e.textContent = text;
    return e;
  }

  function shell(index: number, q: Question) {
    const card = el('div', 'card');
    const numbered = index < NUMBERED;
    const progress = el('div', 'progress');
    progress.append(
      el('p', 'label progress__text', numbered ? `Question ${index + 1} of ${NUMBERED}` : 'Final question'),
    );
    const bar = el('div', 'progress__bar');
    bar.setAttribute('aria-hidden', 'true');
    const fill = el('span');
    fill.style.width = `${((index + 1) / QUESTIONS.length) * 100}%`;
    bar.append(fill);
    progress.append(bar);

    const h = el('h3', 'card__prompt', q.prompt);
    h.tabIndex = -1;

    const body = el('div', 'card__body');
    const note = el('div', 'court-note');
    note.hidden = true;
    const tag = el('span', 'stamp stamp--red court-note__tag', 'Court Note');
    const text = el('p', 'court-note__text');
    text.setAttribute('aria-hidden', 'true');
    note.append(tag, text);
    const live = el('p', 'sr-only');
    live.setAttribute('role', 'status');
    const actions = el('div', 'card__actions');

    card.append(progress, h, body, note, live, actions);

    /** Types out the reaction, then shows the follow-up button. */
    const react = async (reaction: string, buttonLabel: string, onNext: () => void) => {
      const mine = session;
      live.textContent = `Court note: ${reaction}`;
      note.hidden = false;
      await typeInto(text, reaction);
      if (mine !== session) return;
      const next = el('button', 'btn', buttonLabel);
      next.type = 'button';
      next.addEventListener('click', () => {
        next.disabled = true;
        onNext();
      });
      actions.append(next);
      next.focus({ preventScroll: true });
      next.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    };

    return { card, body, h, react };
  }

  function nextLabel(index: number) {
    return index + 1 === NUMBERED ? 'Final question' : 'Next';
  }

  function choiceCard(index: number, q: ChoiceQuestion) {
    const { card, body, h, react } = shell(index, q);
    const opts = el('div', 'q__opts');
    q.choices.forEach((c) => {
      const b = el('button', 'opt', c.label);
      b.type = 'button';
      b.addEventListener('click', () => {
        opts.querySelectorAll<HTMLButtonElement>('.opt').forEach((x) => {
          x.disabled = true;
          x.classList.toggle('is-picked', x === b);
        });
        answers.push({ topic: q.topic, answer: c.label });
        void react(c.reaction, nextLabel(index), () => show(index + 1));
      });
      opts.append(b);
    });
    body.append(opts);
    return { card, h };
  }

  function ratingCard(index: number, q: RatingQuestion) {
    const { card, body, h, react } = shell(index, q);
    mountSlider(body, q, (value, reaction) => {
      answers.push({ topic: q.topic, answer: `${value} / 10` });
      void react(reaction, nextLabel(index), () => show(index + 1));
    });
    return { card, h };
  }

  function openCard(index: number, q: OpenQuestion) {
    const { card, body, h, react } = shell(index, q);
    const label = el('label', 'label', 'Question for the defendant');
    label.htmlFor = 'defendant-q';
    const area = el('textarea', 'textbox');
    area.id = 'defendant-q';
    area.rows = 3;
    area.maxLength = 140;
    area.placeholder = q.placeholder;
    const submit = el('button', 'btn', 'Skip question');
    submit.type = 'button';
    area.addEventListener('input', () => {
      submit.textContent = area.value.trim() ? 'Submit question' : 'Skip question';
    });
    submit.addEventListener('click', () => {
      const value = area.value.trim();
      defendantQuestion = value;
      area.disabled = true;
      submit.remove();
      void react(value ? q.submitReaction : q.skipReaction, 'Conclude interview', () =>
        onComplete({ answers, defendantQuestion }),
      );
    });
    body.append(label, area, submit);
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
    const q = QUESTIONS[index];
    const { card, h } =
      q.kind === 'choice' ? choiceCard(index, q) : q.kind === 'rating' ? ratingCard(index, q) : openCard(index, q);
    card.classList.add('is-entering');
    root.append(card);
    if (index > 0) {
      h.focus({ preventScroll: true });
      card.scrollIntoView({ block: 'start', behavior: 'smooth' });
    }
  }

  const start = () => void show(0);
  start();

  return {
    reset() {
      session++;
      root.querySelectorAll<HTMLElement>('.court-note__text').forEach(cancelTyping);
      answers = [];
      defendantQuestion = '';
      root.textContent = '';
      start();
    },
  };
}
