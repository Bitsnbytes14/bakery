import './style.css';
import { initFolder } from './folder';
import { initExhibits } from './exhibits';
import { initInterview } from './interview';
import { initVerdict } from './verdict';
import { initStatement } from './statement';

const exhibits = initExhibits();
const statement = initStatement();
const verdict = initVerdict(() => statement.show());
const interview = initInterview((result) => {
  statement.setResult(result);
  verdict.show();
});
const folder = initFolder(() => {});

document.getElementById('reopen')?.addEventListener('click', () => {
  exhibits.reset();
  interview.reset();
  verdict.reset();
  statement.reset();
  folder.reset();
});
