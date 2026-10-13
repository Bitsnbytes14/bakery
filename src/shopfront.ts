import { $ } from './dom';
import { mountMascot } from './mascot';

export function initShopfront(onEnter: () => void) {
  mountMascot($('shop-mascot'));
  $<HTMLButtonElement>('come-in').addEventListener('click', onEnter);
}
