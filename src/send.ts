import { ITEMS } from './data/questions';
import { $ } from './dom';
import { NO_QUESTION } from './questions';
import type { OrderResult } from './questions';

const ENDPOINT = 'https://api.web3forms.com/submit';
const KEY = import.meta.env.VITE_WEB3FORMS_KEY;

const SENDING = 'Sending to the kitchen...';
const SUCCESS = 'Order received. The chef is reading it nervously 👨‍🍳';
const FAILURE = 'The kitchen is closed. Try Share instead.';

function buildMessage(result: OrderResult, typedName: string): string {
  const out = [`Name typed: ${typedName || '(left blank)'}`, '', 'Answers:'];
  for (const l of result.lines) {
    const item = ITEMS[l.index];
    out.push(`${l.index + 1}. ${item.prompt}`, `   ${l.answer}`);
  }
  out.push('', `Question for the chef: ${result.chefQuestion || NO_QUESTION}`);
  return out.join('\n');
}

/**
 * "Send my order to the chef": the only place anything leaves the browser.
 * It runs only on a tap, and the whole block is hidden when no key is configured.
 */
export function initSend() {
  const block = $<HTMLElement>('send-block');
  const button = $<HTMLButtonElement>('send');
  const status = $<HTMLElement>('send-status');
  let order: { result: OrderResult; name: string } | null = null;
  let busy = false;
  let sent = false;

  if (!KEY) {
    block.hidden = true;
    return { setOrder() {}, reset() {} };
  }

  const say = (msg: string) => {
    status.textContent = msg;
  };

  button.addEventListener('click', async () => {
    if (busy || sent || !order) return;
    busy = true;
    button.disabled = true;
    say(SENDING);
    try {
      const res = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: KEY,
          subject: 'New Bully Bakery order 🍫',
          message: buildMessage(order.result, order.name),
        }),
      });
      const data: { success?: boolean } = await res.json().catch(() => ({}));
      if (!res.ok || data.success === false) throw new Error('rejected');
      sent = true; // stays disabled so it cannot be sent twice
      say(SUCCESS);
    } catch {
      say(FAILURE);
      button.disabled = false; // she may try again
    } finally {
      busy = false;
    }
  });

  return {
    setOrder(result: OrderResult, name: string) {
      order = { result, name };
    },
    reset() {
      order = null;
      busy = false;
      sent = false;
      button.disabled = false;
      say('');
    },
  };
}
