import './style.css';
import { initDessertBox } from './dessertBox';
import { $ } from './dom';
import { mountMascot } from './mascot';
import { wait } from './motion';
import { initName } from './nameScramble';
import { initQuestions } from './questions';
import { initReceipt } from './receipt';
import { initReview } from './review';
import { initShopfront } from './shopfront';

type ScreenName = 'shop' | 'name' | 'order' | 'review' | 'receipt';

const screens: Record<ScreenName, HTMLElement> = {
  shop: $('screen-shop'),
  name: $('screen-name'),
  order: $('screen-order'),
  review: $('screen-review'),
  receipt: $('screen-receipt'),
};
let current: ScreenName = 'shop';
let navigating = false;

const box = initDessertBox();
const orderMascot = mountMascot($('order-mascot'));
const receipt = initReceipt();
const questions = initQuestions({
  box,
  mascot: orderMascot,
  onDone: (result) => {
    review.show(result);
    void go('review');
  },
});
const review = initReview({
  onEdit: (index) => {
    questions.edit(index);
    void go('order');
  },
  onBack: () => {
    questions.showLast();
    void go('order');
  },
  // The receipt only exists once she has reviewed and asked for it.
  onGenerate: () => {
    receipt.show(questions.result());
    void go('receipt');
  },
});
const name = initName(() => {
  void go('order');
  questions.start();
});
initShopfront(() => void go('name'));

async function go(next: ScreenName) {
  if (navigating || next === current) return;
  navigating = true;
  const from = screens[current];
  from.classList.add('is-leaving');
  await wait(220);
  from.hidden = true;
  from.classList.remove('is-leaving');

  const to = screens[next];
  to.hidden = false;
  to.classList.add('is-entering');
  current = next;
  window.scrollTo({ top: 0, behavior: 'auto' });
  if (next === 'order') box.show();
  else box.hide();
  if (next === 'name') name.focus();
  else to.querySelector<HTMLElement>('h1, h2')?.focus({ preventScroll: true });
  navigating = false;
}

// On phones the on-screen keyboard must not hide the field or its button:
// drop the fixed dessert strip while typing and scroll the field + button into view.
const isField = (t: EventTarget | null): t is HTMLElement =>
  t instanceof HTMLElement && t.matches('input[type="text"], textarea');
document.addEventListener('focusin', (e) => {
  if (!isField(e.target)) return;
  const field = e.target;
  document.documentElement.classList.add('typing');
  window.setTimeout(() => {
    const target = field.closest('.ticket__body')?.querySelector<HTMLElement>('.btn:not([hidden])') ?? field;
    target.scrollIntoView({ block: 'center', behavior: 'smooth' });
  }, 350);
});
document.addEventListener('focusout', (e) => {
  if (!isField(e.target)) return;
  window.setTimeout(() => {
    if (!isField(document.activeElement)) document.documentElement.classList.remove('typing');
  }, 150);
});

$('new-order').addEventListener('click', () => {
  questions.reset();
  box.reset();
  name.reset();
  review.reset();
  receipt.reset();
  void go('shop');
});
