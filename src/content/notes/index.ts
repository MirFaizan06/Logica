import type { Page } from '../types';
import { NOTES_N1 } from './n1';
import { NOTES_N2 } from './n2';
import { NOTES_N3 } from './n3';

/** Study notes by unit id: short revision pages shown from the Learn tab and the Lab. */
export const NOTES: Record<string, Page[]> = {
  ...NOTES_N1,
  ...NOTES_N2,
  ...NOTES_N3,
};
