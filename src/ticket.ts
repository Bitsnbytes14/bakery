import { CUSTOMER } from './data/questions';
import { el } from './dom';

/** Order ticket card: header stub, perforation, body. */
export function buildTicket(right: string, progress?: number) {
  const root = el('div', 'ticket');
  const stub = el('div', 'ticket__stub');
  const row = el('div', 'ticket__row');
  row.append(el('p', 'label', `Order for: ${CUSTOMER}`), el('p', 'label ticket__progress', right));
  stub.append(row);
  if (progress !== undefined) {
    const bar = el('div', 'bar');
    bar.setAttribute('aria-hidden', 'true');
    const fill = el('span');
    fill.style.setProperty('--p', String(progress));
    bar.append(fill);
    stub.append(bar);
  }
  const body = el('div', 'ticket__body');
  root.append(stub, body);
  return { root, body };
}
