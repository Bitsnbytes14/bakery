import { ITEMS } from './data/questions';
import { $, el, withEmoji } from './dom';
import { NO_QUESTION } from './questions';
import type { OrderResult } from './questions';

interface Deps {
  /** Jump back to a question (index into ITEMS). */
  onEdit: (index: number) => void;
  onBack: () => void;
  onGenerate: () => void;
}

/** "Review your order": every answer, tap one to change it, then generate the receipt. */
export function initReview({ onEdit, onBack, onGenerate }: Deps) {
  const list = $<HTMLElement>('review-list');

  $<HTMLButtonElement>('review-back').addEventListener('click', onBack);
  $<HTMLButtonElement>('generate').addEventListener('click', onGenerate);

  function row(index: number, icon: string, topic: string, answer: string) {
    const li = el('li');
    const b = el('button', 'review__item');
    b.type = 'button';
    b.setAttribute('aria-label', `Change ${topic}: ${answer}`);
    const ic = el('span', 'review__icon', icon);
    ic.setAttribute('aria-hidden', 'true');
    const text = el('span', 'review__text');
    text.append(el('span', 'label', topic), el('span', 'review__answer', answer));
    const edit = el('span', 'review__edit');
    edit.setAttribute('aria-hidden', 'true');
    edit.append(withEmoji('Edit', '✏️'));
    b.append(ic, text, edit);
    b.addEventListener('click', () => onEdit(index));
    li.append(b);
    return li;
  }

  return {
    show(result: OrderResult) {
      const chefIndex = ITEMS.length - 1;
      const chef = ITEMS[chefIndex];
      list.textContent = '';
      for (const l of result.lines) list.append(row(l.index, l.icon, l.topic, l.answer));
      list.append(row(chefIndex, chef.icon, chef.topic, result.chefQuestion || NO_QUESTION));
    },
    reset() {
      list.textContent = '';
    },
  };
}
