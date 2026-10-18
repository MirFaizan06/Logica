import type { QDraft } from '../helpers';
import { BANK_B1 } from './b1';
import { BANK_B2 } from './b2';
import { BANK_B3 } from './b3';
import { BANK_B4 } from './b4';
import { BANK_B5 } from './b5';
import { BANK_B6 } from './b6';

/** Extra questions per lesson id. They are appended to the lesson's own questions. */
export const BANK: Record<string, QDraft[]> = {
  ...BANK_B1,
  ...BANK_B2,
  ...BANK_B3,
  ...BANK_B4,
  ...BANK_B5,
  ...BANK_B6,
};
