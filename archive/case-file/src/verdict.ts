import { prefersReducedMotion, wait } from './motion';
import { cancelTyping, typeInto } from './typewriter';

const SENTENCE = 'The defendant is sentenced to build a better website.';

export function initVerdict(onServed: () => void) {
  const section = document.getElementById('verdict') as HTMLElement;
  const sheet = document.querySelector('.sheet') as HTMLElement;
  const deliver = document.getElementById('deliver') as HTMLButtonElement;
  const pause = document.getElementById('pause') as HTMLElement;
  const guilty = document.getElementById('stamp-guilty') as HTMLElement;
  const sentence = document.getElementById('sentence') as HTMLElement;
  const served = document.getElementById('stamp-served') as HTMLElement;
  const servedNote = document.getElementById('served-note') as HTMLElement;
  let run = 0;

  const slam = (el: HTMLElement) => {
    el.hidden = false;
    el.classList.remove('slam');
    void el.offsetWidth; // restart animation
    el.classList.add('slam');
  };

  deliver.addEventListener('click', async () => {
    const mine = ++run;
    deliver.disabled = true;
    pause.textContent = 'The court is deliberating';
    if (!prefersReducedMotion()) {
      for (let i = 0; i < 3 && run === mine; i++) {
        await wait(550);
        pause.textContent += ' .';
      }
    }
    await wait(700);
    if (run !== mine) return;

    pause.textContent = '';
    slam(guilty);
    if (!prefersReducedMotion()) {
      sheet.classList.remove('shake');
      void sheet.offsetWidth;
      sheet.classList.add('shake');
    }
    await wait(900);
    if (run !== mine) return;

    sentence.hidden = false;
    await typeInto(sentence, SENTENCE, 35);
    await wait(500);
    if (run !== mine) return;

    slam(served);
    servedNote.hidden = false;
    onServed();
    served.scrollIntoView({ block: 'center', behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
  });

  return {
    show() {
      section.hidden = false;
      section.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
    },
    reset() {
      run++;
      section.hidden = true;
      cancelTyping(sentence);
      deliver.disabled = false;
      pause.textContent = '';
      for (const el of [guilty, sentence, served, servedNote]) el.hidden = true;
      guilty.classList.remove('slam');
      served.classList.remove('slam');
      sheet.classList.remove('shake');
      sentence.textContent = '';
    },
  };
}
