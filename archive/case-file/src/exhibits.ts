const REVEALED_TEXT = "[REDACTED FOR THE DEFENDANT'S DIGNITY]";
const HIDDEN_TEXT = '████████████';

export function initExhibits() {
  const cards = document.querySelectorAll<HTMLElement>('.reveal');
  const redaction = document.getElementById('redaction') as HTMLButtonElement;
  const bar = redaction.querySelector('.redact__bar') as HTMLElement;

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      }
    },
    { threshold: 0.15 },
  );

  const observeAll = () => cards.forEach((c) => observer.observe(c));

  redaction.addEventListener('click', () => {
    if (redaction.classList.contains('is-revealed')) return;
    redaction.classList.add('is-revealed');
    bar.textContent = REVEALED_TEXT;
    bar.removeAttribute('aria-hidden');
    redaction.setAttribute('aria-label', REVEALED_TEXT);
    redaction.setAttribute('aria-live', 'polite');
  });

  observeAll();

  return {
    reset() {
      cards.forEach((c) => c.classList.remove('is-visible'));
      redaction.classList.remove('is-revealed');
      bar.textContent = HIDDEN_TEXT;
      bar.setAttribute('aria-hidden', 'true');
      redaction.setAttribute('aria-label', 'Redacted nickname. Activate to reveal.');
      redaction.removeAttribute('aria-live');
      observeAll();
    },
  };
}
