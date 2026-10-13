import { prefersReducedMotion } from './motion';

const SVG = `
<svg viewBox="0 0 100 100" role="img" aria-label="Brownie mascot" xmlns="http://www.w3.org/2000/svg">
  <ellipse cx="50" cy="92" rx="30" ry="5" fill="#4a2c1d" opacity=".15"/>
  <g class="mascot__body">
    <rect x="14" y="24" width="72" height="64" rx="18" fill="#7b4a30"/>
    <path d="M14 42c0-12 8-18 18-18h36c10 0 18 6 18 18v2c-6 4-8 10-14 10s-8-8-14-8-8 8-14 8-8-10-14-10-10 6-16 6z" fill="#a8704a"/>
    <circle cx="30" cy="36" r="2.6" fill="#a9d18e"/><circle cx="52" cy="32" r="2.6" fill="#f08a9b"/><circle cx="72" cy="38" r="2.6" fill="#a9d18e"/>
    <g class="mascot__eyes">
      <ellipse class="eye" cx="38" cy="66" rx="4.5" ry="5.5" fill="#fff8ea"/><circle class="pupil" cx="38" cy="67" r="2.4" fill="#2b1710"/>
      <ellipse class="eye" cx="62" cy="66" rx="4.5" ry="5.5" fill="#fff8ea"/><circle class="pupil" cx="62" cy="67" r="2.4" fill="#2b1710"/>
    </g>
    <ellipse cx="29" cy="75" rx="5" ry="3" fill="#f08a9b" opacity=".6"/><ellipse cx="71" cy="75" rx="5" ry="3" fill="#f08a9b" opacity=".6"/>
    <path d="M44 76q6 6 12 0" fill="none" stroke="#fff8ea" stroke-width="2.4" stroke-linecap="round"/>
  </g>
</svg>`;

export interface Mascot {
  dance(): void;
}

export function mountMascot(host: HTMLElement): Mascot {
  host.classList.add('mascot');
  host.innerHTML = SVG;
  let timer = 0;
  return {
    dance() {
      host.classList.remove('dance');
      void host.offsetWidth;
      host.classList.add('dance');
      window.clearTimeout(timer);
      timer = window.setTimeout(() => host.classList.remove('dance'), prefersReducedMotion() ? 0 : 900);
    },
  };
}
