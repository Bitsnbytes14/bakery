import { el, emojiBadge } from './dom';
import { cancelTyping, typeInto } from './typewriter';

/** A "Chef's Note" bubble: typed visually, announced once in full to screen readers. */
export function createNote() {
  const root = el('div', 'note');
  const bubble = el('div', 'note__bubble');
  bubble.hidden = true;
  const tag = el('p', 'note__tag');
  tag.append("Chef's Note ", emojiBadge('🧑‍🍳', 'note__emoji'));
  const text = el('p', 'note__text');
  text.setAttribute('aria-hidden', 'true');
  bubble.append(tag, text);
  const live = el('p', 'sr-only');
  live.setAttribute('role', 'status');
  root.append(live, bubble);

  return {
    root,
    async show(message: string) {
      live.textContent = `Chef's Note: ${message}`;
      bubble.hidden = false;
      await typeInto(text, message);
    },
    /** Shows a reaction instantly (used when returning to an answered question). */
    showNow(message: string) {
      cancelTyping(text);
      live.textContent = `Chef's Note: ${message}`;
      bubble.hidden = false;
      text.textContent = message;
    },
    hide() {
      cancelTyping(text);
      live.textContent = '';
      bubble.hidden = true;
      text.textContent = '';
    },
    cancel() {
      cancelTyping(text);
    },
  };
}
