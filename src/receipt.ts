import { CUSTOMER } from './data/questions';
import { $, el } from './dom';
import type { OrderResult } from './questions';

const NO_QUESTION = 'No questions. The chef is relieved.';
const TOTAL_LINE = 'Total: 1 creativity, a little odd, paid in full ✅';
const C = { cream: '#fff8ea', paper: '#fffdf6', cocoa: '#4a2c1d', soft: '#7a5645', green: '#4f7d33', caramel: '#d9a066' };

const today = () => new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

export function initReceipt() {
  const list = $<HTMLElement>('receipt-list');
  const chefQ = $<HTMLElement>('receipt-chefq');
  const date = $<HTMLElement>('receipt-date');
  const status = $<HTMLElement>('receipt-status');
  const dl = $<HTMLButtonElement>('download');
  const share = $<HTMLButtonElement>('share');
  let data: OrderResult | null = null;

  const chefLine = () => (data?.chefQuestion ? `“${data.chefQuestion}”` : NO_QUESTION);

  function fill(result: OrderResult) {
    data = result;
    list.textContent = '';
    for (const l of result.lines) {
      const li = el('li', 'receipt__line');
      const left = el('span', 'receipt__item');
      const icon = el('span', undefined, l.icon);
      icon.setAttribute('aria-hidden', 'true');
      left.append(icon, ` ${l.topic}`);
      li.append(left, el('span', 'receipt__dots'), el('span', 'receipt__answer', l.answer));
      list.append(li);
    }
    chefQ.textContent = chefLine();
    date.textContent = today();
  }

  async function render(): Promise<Blob> {
    if (!data) throw new Error('No receipt');
    await Promise.all([
      document.fonts.load('700 32px Nunito'),
      document.fonts.load('800 32px "Baloo 2"'),
    ]).catch(() => undefined);

    const W = 900;
    const M = 40; // outer margin
    const P = 64; // inner padding
    const body = 'Nunito, "Segoe UI Emoji", "Apple Color Emoji", "Noto Color Emoji", sans-serif';
    const head = '"Baloo 2", Nunito, "Segoe UI Emoji", "Apple Color Emoji", "Noto Color Emoji", sans-serif';
    const canvas = document.createElement('canvas');
    canvas.width = W;
    canvas.height = 4000;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas unavailable');

    const wrap = (text: string, max: number): string[] => {
      const lines: string[] = [];
      let cur = '';
      for (const word of text.split(/\s+/)) {
        const t = cur ? `${cur} ${word}` : word;
        if (ctx.measureText(t).width > max && cur) {
          lines.push(cur);
          cur = word;
        } else cur = t;
      }
      if (cur) lines.push(cur);
      return lines;
    };

    const L = M + P;
    const R = W - M - P;

    let stampY = 0;

    // Single pass that measures (draw=false) or paints (draw=true); returns final y.
    const paint = (draw: boolean): number => {
      let y = M + 40;
      const put = (s: string, x: number, font: string, color: string, align: CanvasTextAlign = 'left') => {
        if (!draw) return;
        ctx.font = font;
        ctx.fillStyle = color;
        ctx.textAlign = align;
        ctx.textBaseline = 'alphabetic';
        ctx.fillText(s, x, y);
      };
      const dash = (dashed: boolean) => {
        if (!draw) return;
        ctx.strokeStyle = C.caramel;
        ctx.lineWidth = 3;
        ctx.setLineDash(dashed ? [10, 8] : [2, 7]);
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(L, y);
        ctx.lineTo(R, y);
        ctx.stroke();
        ctx.setLineDash([]);
      };

      y += 60;
      put('🧁 The Bully Bakery', W / 2, `800 64px ${head}`, C.cocoa, 'center');
      y += 54;
      put('Your order is ready 🎀', W / 2, `700 30px ${body}`, C.soft, 'center');
      y += 36;
      dash(true);
      y += 48;
      put(`Order for: ${CUSTOMER}`, L, `800 32px ${body}`, C.cocoa);
      put(today(), R, `600 26px ${body}`, C.soft, 'right');
      y += 32;
      dash(true);

      const rightMax = 330;
      for (const l of data!.lines) {
        ctx.font = `600 28px ${body}`;
        const long = ctx.measureText(l.answer).width > rightMax;
        // Short answers sit beside the topic; long ones wrap onto full-width lines underneath.
        const lines = long ? wrap(l.answer, R - L) : [l.answer];
        y += 52;
        put(`${l.icon} ${l.topic}`, L, `700 28px ${body}`, C.cocoa);
        lines.forEach((s, i) => {
          if (long) y += i === 0 ? 40 : 36;
          if (!draw) return;
          ctx.font = `600 28px ${body}`;
          ctx.fillStyle = C.green;
          ctx.textAlign = 'right';
          ctx.fillText(s, R, y);
        });
        y += 14;
        dash(false);
      }

      y += 56;
      put('🧑‍🍳 Question for the chef', L, `800 26px ${body}`, C.soft);
      ctx.font = `600 30px ${body}`;
      for (const s of wrap(chefLine(), R - L)) {
        y += 42;
        put(s, L, `600 30px ${body}`, C.cocoa);
      }
      y += 36;
      dash(true);
      y += 60;
      ctx.font = `800 34px ${head}`;
      wrap(TOTAL_LINE, R - L).forEach((s, i) => {
        if (i) y += 44;
        put(s, L, `800 34px ${head}`, C.cocoa);
      });
      stampY = y + 70;
      y += 150;

      // barcode
      if (draw) {
        ctx.fillStyle = C.cocoa;
        let x = L;
        let i = 0;
        while (x < R - 8) {
          const w = [3, 6, 3, 9, 4][i % 5];
          ctx.fillRect(x, y, w, 64);
          x += w + [5, 3, 7, 4, 6][i % 5];
          i++;
        }
      }
      y += 64 + 44;
      put('Thank you, come again 🍪', W / 2, `700 28px ${body}`, C.soft, 'center');
      y += 64;
      return y;
    };

    const inner = paint(false);
    const H = inner + M;
    // Render at 2x so the PNG stays crisp on retina screens.
    const SCALE = 2;
    canvas.width = W * SCALE;
    canvas.height = H * SCALE;
    ctx.scale(SCALE, SCALE);

    ctx.fillStyle = C.cream;
    ctx.fillRect(0, 0, W, H);

    // paper with zigzag top and bottom
    const z = 16;
    ctx.save();
    ctx.shadowColor = 'rgba(74, 44, 29, 0.25)';
    ctx.shadowBlur = 24;
    ctx.shadowOffsetY = 8;
    ctx.fillStyle = C.paper;
    ctx.beginPath();
    ctx.moveTo(M, M);
    for (let x = M; x < W - M; x += z * 2) {
      ctx.lineTo(x + z, M + z * 0.8);
      ctx.lineTo(Math.min(x + z * 2, W - M), M);
    }
    ctx.lineTo(W - M, H - M);
    for (let x = W - M; x > M; x -= z * 2) {
      ctx.lineTo(x - z, H - M - z * 0.8);
      ctx.lineTo(Math.max(x - z * 2, M), H - M);
    }
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    paint(true);

    // PAID stamp
    ctx.save();
    ctx.translate(R - 130, stampY);
    ctx.rotate(-0.14);
    ctx.globalAlpha = 0.85;
    ctx.strokeStyle = C.green;
    ctx.fillStyle = C.green;
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.roundRect(-110, -44, 220, 88, 20);
    ctx.stroke();
    ctx.font = `800 56px ${head}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('PAID', 0, 6);
    ctx.restore();

    return new Promise((resolve, reject) =>
      canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('Render failed'))), 'image/png'),
    );
  }

  function download(blob: Blob) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'bully-bakery-receipt.png';
    document.body.append(a);
    a.click();
    a.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 2000);
  }

  const say = (msg: string) => {
    status.textContent = msg;
  };

  async function run(action: 'download' | 'share') {
    dl.disabled = share.disabled = true;
    say('Boxing up your receipt...');
    try {
      const blob = await render();
      if (action === 'share') {
        const file = new File([blob], 'bully-bakery-receipt.png', { type: 'image/png' });
        if (typeof navigator.canShare === 'function' && navigator.canShare({ files: [file] })) {
          try {
            await navigator.share({ files: [file], title: 'The Bully Bakery receipt', text: 'My order from The Bully Bakery.' });
            say('Shared, by your choice.');
          } catch (e) {
            say(e instanceof DOMException && e.name === 'AbortError' ? 'Share cancelled.' : 'Sharing failed.');
          }
          return;
        }
        download(blob);
        say('Sharing is not supported here, so the receipt was downloaded instead.');
        return;
      }
      download(blob);
      say('Receipt downloaded.');
    } catch {
      say('Could not print the receipt. The chef apologises.');
    } finally {
      dl.disabled = share.disabled = false;
    }
  }

  dl.addEventListener('click', () => void run('download'));
  share.addEventListener('click', () => void run('share'));

  return {
    show: fill,
    reset() {
      data = null;
      list.textContent = '';
      status.textContent = '';
    },
  };
}
