/**
 * Sanity checks for the lesson and question content.
 * Run with: npm run validate
 */
import fs from 'node:fs';
import path from 'node:path';
import { UNITS, ALL_LESSONS } from '../src/content/curriculum';
import { GLOSSARY, FALLACIES, CARDS } from '../src/content/library';
import { ACHIEVEMENTS } from '../src/content/achievements';
import { NOTES } from '../src/content/notes';
import { THEMES } from '../src/theme/themes';
import { tryParse } from '../src/logic/formula';
import type { Question } from '../src/content/types';

const errors: string[] = [];
const err = (where: string, msg: string) => errors.push(`${where}: ${msg}`);

const glyphPath = path.join(
  __dirname,
  '..',
  'node_modules/@expo/vector-icons/build/vendor/react-native-vector-icons/glyphmaps/Ionicons.json'
);
const glyphs: Record<string, number> = JSON.parse(fs.readFileSync(glyphPath, 'utf8'));
const checkIcon = (where: string, name: string) => {
  if (!(name in glyphs)) err(where, `unknown Ionicons glyph "${name}"`);
};

// emoji and emoji-style dingbats are not allowed anywhere in source
const EMOJI = /[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{2B00}-\u{2BFF}\u{FE0F}]/u;
function scanDir(dir: string) {
  for (const f of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, f.name);
    if (f.isDirectory()) scanDir(p);
    else if (/\.(ts|tsx|js|json|md)$/.test(f.name)) {
      const text = fs.readFileSync(p, 'utf8');
      text.split('\n').forEach((line, i) => {
        if (EMOJI.test(line)) err(`${path.relative(process.cwd(), p)}:${i + 1}`, 'contains an emoji character');
      });
    }
  }
}
scanDir(path.join(__dirname, '..', 'src'));

const ids = new Set<string>();
function checkQuestion(q: Question, where: string) {
  if (ids.has(q.id)) err(where, `duplicate id ${q.id}`);
  ids.add(q.id);
  if (!q.q.trim()) err(where, 'empty question text');
  if (!q.explain.trim()) err(where, 'missing explanation');
  switch (q.type) {
    case 'mcq':
      if (q.options.length < 2) err(where, 'needs at least two options');
      if (q.answer < 0 || q.answer >= q.options.length) err(where, 'answer index out of range');
      if (new Set(q.options).size !== q.options.length) err(where, 'duplicate options');
      break;
    case 'multi':
      if (!q.answer.length || q.answer.some((a) => a < 0 || a >= q.options.length)) err(where, 'bad multi answers');
      break;
    case 'order':
      if (q.items.length < 2) err(where, 'order needs 2+ items');
      break;
    case 'match':
      if (q.pairs.length < 2) err(where, 'match needs 2+ pairs');
      break;
    case 'classify':
      if (q.items.some((i) => i.cat < 0 || i.cat >= q.categories.length)) err(where, 'classify category out of range');
      break;
    case 'tt': {
      const r = tryParse(q.formula);
      if (r.error) err(where, `formula "${q.formula}" does not parse: ${r.error}`);
      break;
    }
  }
}

for (const u of UNITS) {
  checkIcon(`unit ${u.id}`, u.icon);
  if (!u.lessons.length) err(`unit ${u.id}`, 'has no lessons');
  for (const l of u.lessons) {
    const w = `lesson ${l.id}`;
    checkIcon(w, l.icon);
    if (l.questions.length < 5) err(w, `only ${l.questions.length} questions`);
    l.pages.forEach((pg, pi) =>
      pg.blocks.forEach((b) => {
        if (b.t === 'tt') b.formulas.forEach((f) => { const r = tryParse(f); if (r.error) err(`${w} page ${pi + 1}`, `table formula "${f}": ${r.error}`); });
      })
    );
    l.questions.forEach((q) => checkQuestion(q, `${w} / ${q.id}`));
  }
}
for (const u of UNITS) {
  const pages = NOTES[u.id];
  if (!pages || pages.length < 2) err(`unit ${u.id}`, 'has no study notes (needs at least two pages)');
  pages?.forEach((pg, pi) =>
    pg.blocks.forEach((b) => {
      if (b.t === 'tt') b.formulas.forEach((f) => { const r = tryParse(f); if (r.error) err(`notes ${u.id} page ${pi + 1}`, `table formula "${f}": ${r.error}`); });
    })
  );
}
for (const id of Object.keys(NOTES)) if (!UNITS.some((u) => u.id === id)) err(`notes ${id}`, 'does not match any unit');
for (const a of ACHIEVEMENTS) checkIcon(`achievement ${a.id}`, a.icon);
for (const t of Object.values(THEMES)) checkIcon(`theme ${t.id}`, t.icon);

const cardIds = new Set<string>();
for (const c of CARDS) {
  if (cardIds.has(c.id)) err('cards', `duplicate card id ${c.id}`);
  cardIds.add(c.id);
}

console.log(
  `${UNITS.length} units, ${ALL_LESSONS.length} lessons, ${ids.size} questions, ${GLOSSARY.length} glossary terms, ` +
    `${FALLACIES.length} fallacies, ${ACHIEVEMENTS.length} achievements, ${CARDS.length} flashcards`
);
if (errors.length) {
  console.error(`\n${errors.length} problem(s):`);
  errors.forEach((e) => console.error(' - ' + e));
  process.exit(1);
}
console.log('Content looks good.');
