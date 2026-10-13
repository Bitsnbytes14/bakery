import type { Interview } from './interview';

const CASE_NO = 'CASE NO. 2026/CRTV/001';
const NO_QUESTIONS = 'The witness has no further questions.';
const C = { paper: '#f6f0e2', ink: '#2f4468', soft: '#4d6089', red: '#b3261e', text: '#26324a' };

const today = () =>
  new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

export function initStatement() {
  const section = document.getElementById('statement') as HTMLElement;
  const list = document.getElementById('statement-list') as HTMLElement;
  const defQ = document.getElementById('statement-defq') as HTMLElement;
  const dateEl = document.getElementById('statement-date') as HTMLElement;
  const status = document.getElementById('statement-status') as HTMLElement;
  const dl = document.getElementById('download') as HTMLButtonElement;
  const share = document.getElementById('share') as HTMLButtonElement;
  let data: Interview | null = null;

  const defendantLine = () => (data?.defendantQuestion ? `“${data.defendantQuestion}”` : NO_QUESTIONS);

  function fill(result: Interview) {
    data = result;
    list.textContent = '';
    for (const a of result.answers) {
      const wrap = document.createElement('div');
      wrap.className = 'field';
      const dt = document.createElement('dt');
      dt.className = 'label';
      dt.textContent = a.topic;
      const dd = document.createElement('dd');
      dd.textContent = a.answer;
      wrap.append(dt, dd);
      list.append(wrap);
    }
    defQ.textContent = defendantLine();
    dateEl.textContent = today();
  }

  async function render(): Promise<Blob> {
    if (!data) throw new Error('No statement');
    await Promise.all([
      document.fonts.load('32px "Special Elite"'),
      document.fonts.load('700 32px "Oswald"'),
    ]).catch(() => undefined);

    const W = 1080;
    const P = 72;
    const body = '"Special Elite", "Courier New", monospace';
    const display = 'Oswald, Impact, "Arial Narrow", sans-serif';
    const canvas = document.createElement('canvas');
    canvas.width = W;
    canvas.height = 3000;
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

    // One pass that either measures (draw=false) or paints (draw=true); returns the final y.
    const paint = (draw: boolean): number => {
      let y = P;
      const text = (s: string, x: number, font: string, color: string, align: CanvasTextAlign = 'left') => {
        if (!draw) return;
        ctx.font = font;
        ctx.fillStyle = color;
        ctx.textAlign = align;
        ctx.fillText(s, x, y);
      };
      const rule = (yy: number, color = C.ink, w = 2) => {
        if (!draw) return;
        ctx.strokeStyle = color;
        ctx.lineWidth = w;
        ctx.beginPath();
        ctx.moveTo(P, yy);
        ctx.lineTo(W - P, yy);
        ctx.stroke();
      };

      y += 24;
      text(CASE_NO, W - P, `500 26px ${display}`, C.ink, 'right');
      y += 90;
      text('STATEMENT OF WITNESS', P, `700 84px ${display}`, C.ink);
      y += 48;
      text('In the matter of: Alleged Lack of Creativity', P, `28px ${body}`, C.soft);
      y += 28;
      rule(y, C.ink, 4);
      y += 20;

      const colW = 290;
      for (const a of data!.answers) {
        ctx.font = `32px ${body}`;
        const lines = wrap(a.answer, W - 2 * P - colW - 24);
        const h = Math.max(lines.length, 1) * 42;
        y += 50;
        text(a.topic.toUpperCase(), P, `500 22px ${display}`, C.soft);
        lines.forEach((l, i) => {
          if (draw) {
            ctx.font = `32px ${body}`;
            ctx.fillStyle = C.text;
            ctx.textAlign = 'left';
            ctx.fillText(l, P + colW, y + i * 42);
          }
        });
        y += h - 42 + 14;
        rule(y, C.soft, 1);
      }

      y += 70;
      text('QUESTION FOR THE DEFENDANT', P, `500 22px ${display}`, C.soft);
      ctx.font = `32px ${body}`;
      const dq = wrap(defendantLine(), W - 2 * P);
      dq.forEach((l) => {
        y += 46;
        if (draw) {
          ctx.font = `32px ${body}`;
          ctx.fillStyle = C.text;
          ctx.textAlign = 'left';
          ctx.fillText(l, P, y);
        }
      });

      y += 130;
      const sigY = y;
      if (draw) {
        ctx.strokeStyle = C.ink;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(P, sigY);
        ctx.lineTo(P + 420, sigY);
        ctx.moveTo(W - P - 300, sigY);
        ctx.lineTo(W - P, sigY);
        ctx.stroke();
        // scribbled signature
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(P + 20, sigY - 12);
        ctx.bezierCurveTo(P + 70, sigY - 90, P + 110, sigY + 10, P + 150, sigY - 40);
        ctx.bezierCurveTo(P + 190, sigY - 80, P + 230, sigY + 5, P + 300, sigY - 30);
        ctx.lineTo(P + 390, sigY - 24);
        ctx.stroke();
      }
      y += 36;
      text('SIGNATURE OF WITNESS', P, `500 22px ${display}`, C.soft);
      text('DATE', W - P - 300, `500 22px ${display}`, C.soft);
      if (draw) {
        ctx.font = `26px ${body}`;
        ctx.fillStyle = C.text;
        ctx.textAlign = 'left';
        ctx.fillText(today(), W - P - 290, sigY - 10);
      }

      y += 60;
      text('Case closed. Built by Mohammad Ahmad', P, `24px ${body}`, C.soft);
      y += P;
      return y;
    };

    const height = paint(false);
    canvas.height = height;
    ctx.fillStyle = C.paper;
    ctx.fillRect(0, 0, W, height);
    ctx.fillStyle = C.ink;
    ctx.fillRect(0, 0, W, 14);
    ctx.strokeStyle = '#e6dcc3';
    ctx.lineWidth = 6;
    ctx.strokeRect(3, 3, W - 6, height - 6);
    paint(true);

    // RECEIVED stamp
    ctx.save();
    ctx.translate(W - P - 190, height - 190);
    ctx.rotate(-0.1);
    ctx.globalAlpha = 0.85;
    ctx.strokeStyle = C.red;
    ctx.fillStyle = C.red;
    ctx.lineWidth = 6;
    ctx.strokeRect(-150, -42, 300, 84);
    ctx.lineWidth = 2;
    ctx.strokeRect(-142, -34, 284, 68);
    ctx.font = `700 46px ${display}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('SWORN', 0, 3);
    ctx.restore();

    return new Promise((resolve, reject) =>
      canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('Render failed'))), 'image/png'),
    );
  }

  function download(blob: Blob) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'witness-statement.png';
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
    say('Preparing the statement...');
    try {
      const blob = await render();
      if (action === 'share') {
        const file = new File([blob], 'witness-statement.png', { type: 'image/png' });
        if (typeof navigator.canShare === 'function' && navigator.canShare({ files: [file] })) {
          try {
            await navigator.share({ files: [file], title: 'Witness Statement', text: 'My official witness statement.' });
            say('Shared, by your choice.');
          } catch (e) {
            say(e instanceof DOMException && e.name === 'AbortError' ? 'Share cancelled. Nothing was sent.' : 'Sharing failed.');
          }
          return;
        }
        download(blob);
        say('Sharing is not supported here, so the statement was downloaded instead.');
        return;
      }
      download(blob);
      say('Statement downloaded. Nothing was sent anywhere.');
    } catch {
      say('Could not render the statement. The court apologises.');
    } finally {
      dl.disabled = share.disabled = false;
    }
  }

  dl.addEventListener('click', () => void run('download'));
  share.addEventListener('click', () => void run('share'));

  return {
    setResult: fill,
    show() {
      section.hidden = false;
    },
    reset() {
      section.hidden = true;
      data = null;
      list.textContent = '';
      status.textContent = '';
    },
  };
}
