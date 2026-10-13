export function el<K extends keyof HTMLElementTagNameMap>(tag: K, cls?: string, text?: string): HTMLElementTagNameMap[K] {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text) e.textContent = text;
  return e;
}

export function $<T extends HTMLElement>(id: string): T {
  const e = document.getElementById(id);
  if (!e) throw new Error(`Missing #${id}`);
  return e as T;
}

/** Text followed by a decorative emoji (screen readers get the text only). */
export function withEmoji(text: string, emoji: string): DocumentFragment {
  const f = document.createDocumentFragment();
  f.append(`${text} `);
  const s = el('span');
  s.setAttribute('aria-hidden', 'true');
  s.textContent = emoji;
  f.append(s);
  return f;
}

export function emojiBadge(emoji: string, cls = 'badge'): HTMLElement {
  const s = el('span', cls, emoji);
  s.setAttribute('aria-hidden', 'true');
  return s;
}
