/**
 * Lists questions whose text repeats within a lesson, or whose text and options repeat anywhere.
 * Run with: npx tsx scripts/find-duplicates.ts
 */
import { UNITS } from '../src/content/curriculum';

const global = new Map<string, string>();
let count = 0;
for (const u of UNITS) {
  for (const l of u.lessons) {
    const seen = new Map<string, string>();
    for (const q of l.questions) {
      const key = (q.q + ('formula' in q ? q.formula : '') + ('items' in q ? JSON.stringify(q.items) : '') + ('pairs' in q ? JSON.stringify(q.pairs) : '')).trim().toLowerCase();
      if (seen.has(key)) {
        console.log(`[lesson] ${l.id}: ${seen.get(key)} and ${q.id}: ${q.q.slice(0, 70).replace(/\n/g, ' ')}`);
        count++;
      }
      seen.set(key, q.id);
      const full = key + '|' + ('options' in q ? q.options.join('/') : '');
      if (global.has(full)) {
        console.log(`[global] ${global.get(full)} and ${q.id}: ${q.q.slice(0, 70).replace(/\n/g, ' ')}`);
        count++;
      }
      global.set(full, q.id);
    }
  }
}
console.log(count ? `${count} duplicate(s)` : 'no duplicates');
