import { wait } from './motion';

export function initFolder(onOpened: () => void) {
  const cover = document.getElementById('cover') as HTMLElement;
  const folder = document.getElementById('folder') as HTMLElement;
  const button = document.getElementById('open-folder') as HTMLButtonElement;
  const main = document.getElementById('main') as HTMLElement;
  let busy = false;

  button.addEventListener('click', async () => {
    if (busy) return;
    busy = true;
    folder.classList.add('is-open');
    button.setAttribute('aria-expanded', 'true');
    await wait(950);
    main.hidden = false;
    cover.hidden = true;
    window.scrollTo({ top: 0, behavior: 'auto' });
    main.focus({ preventScroll: true });
    onOpened();
    busy = false;
  });

  return {
    reset() {
      main.hidden = true;
      cover.hidden = false;
      folder.classList.remove('is-open');
      button.setAttribute('aria-expanded', 'false');
      window.scrollTo({ top: 0, behavior: 'auto' });
      button.focus({ preventScroll: true });
    },
  };
}
