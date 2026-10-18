# Adding content

All lessons and questions are plain TypeScript in `src/content`. You do not need to touch any UI code to add or change teaching material.

## Where things live

| File | Holds |
| --- | --- |
| `beginner1.ts`, `beginner2.ts` | Beginner units |
| `intermediate1.ts`, `intermediate2.ts` | Intermediate units |
| `advanced1.ts`, `advanced2.ts`, `advanced3.ts` | Advanced units |
| `extra1.ts`, `extra2.ts` | Later additions: critical thinking, probability, puzzle techniques, higher-order logic, complexity |
| `banks/` | Extra questions for existing lessons, keyed by lesson id (see below) |
| `notes/` | Study notes, keyed by unit id (see below) |
| `curriculum.ts` | The ordered list of units |
| `library.ts`, `libraryExtra.ts` | Glossary terms, fallacies, the symbol sheet (these also feed the flashcards) |
| `achievements.ts` | Achievement rules |
| `changelog.ts` | The "What's new" text for each release |
| `helpers.ts` | The small functions used below |

## A lesson

```ts
lesson(
  'fuzzy-1',                 // unique id; question ids become fuzzy-1.1, fuzzy-1.2 ...
  'Degrees of Truth',        // title
  'color-filter-outline',    // Ionicons name (npm run validate checks it exists)
  'Truth values between 0 and 1.', // one-line blurb
  6,                         // minutes
  [ /* pages */ ],
  [ /* questions */ ]
)
```

A lesson needs at least five questions. The player picks five at random each time, so writing six to eight gives variety.

### Pages and blocks

A page is `pg(title, ...blocks)`. Keep a page to a screen or so. Blocks:

| Helper | Use |
| --- | --- |
| `p('text')` | A paragraph. `**bold**` and `__italic__` work. |
| `h('text')` | A small heading. |
| `ex(['line', 'line'], 'Label')` | A boxed example, one string per line. An empty string makes a gap. |
| `tip('text')` | A blue hint box. |
| `warn('text')` | A yellow caution box. |
| `list('a', 'b')` | Bullets. Rich text works. |
| `sym({ sym: '∧', name: 'and', note: 'conjunction' }, ...)` | Symbol cards. |
| `ttb('p -> q', 'p & q')` | A computed truth table. One formula shows every sub-formula column; several show one column each. Never type a truth table by hand. |
| `rule('Modus ponens', ['p -> q', 'p'], 'q')` | An inference rule with the line between premises and conclusion. |
| `venn('A', 'E', 'I', 'O')` | Two-circle diagrams for the categorical forms. |
| `cmp({ title, lines }, { title, lines })` | Two columns side by side, for "valid vs invalid" and similar. |

### Questions

Every question takes an explanation, and most take an optional hint last.

| Helper | Signature |
| --- | --- |
| `mcq` | `mcq(text, options, answerIndex, explain, hint?)` |
| `tf` | `tf(text, answerBool, explain, hint?)` |
| `multi` | `multi(text, options, [answerIndexes], explain, hint?)` |
| `order` | `order(text, itemsInCorrectOrder, explain, hint?)` |
| `match` | `match(text, [[left, right], ...], explain, hint?)` |
| `tt` | `tt('formula', explain, text?, hint?)` The answer is computed from the formula. |
| `classify` | `classify(text, ['Category A', 'Category B'], [['item', 0], ['item', 1]], explain, hint?)` |

Notes:

- Write options in any order. For multiple choice and select-all the app shuffles them on each run, except when the order carries meaning (True/False, numbers, or options like "Both of these").
- For `order`, write the items in the **correct** order; the app shuffles what the learner sees.
- Use `\n` in question text for a line break. Long formulas are best on their own line.
- Formulas use the engine's syntax: letters for variables, `~ & | -> <-> ^` or the unicode symbols.

## A unit

```ts
export const fuzzyUnit = unit(
  'fuzzy',            // stable id. Statistics are stored against it.
  2,                  // level: 0 Beginner, 1 Intermediate, 2 Advanced
  'Fuzzy Logic',
  'color-filter-outline',
  300,                // hue for the unit colour, 0-360
  'Logic with degrees of truth.',
  [ /* lessons */ ]
);
```

Then:

1. Add it to the `UNITS` array in `curriculum.ts`, in the order learners should meet it.
2. Add its id to a group in `GROUPS` in `src/app/(tabs)/progress.tsx` so it appears on the skill map.
3. If the unit has generated questions available, list them in `UNIT_GENERATORS` in `src/logic/generators.ts`.
4. Add a line to `CHANGELOG.md` and `src/content/changelog.ts`.
5. `tests/misc.test.ts` asserts the number of units. Update it.

## More questions for an existing lesson

A lesson's own questions are the first ones a learner meets. Extra questions go in `src/content/banks/`, in a record keyed by lesson id:

```ts
export const BANK_B1: Record<string, QDraft[]> = {
  'prop-3': [
    mcq('...', [...], 0, '...'),
    tf('...', true, '...'),
  ],
};
```

Register the file in `banks/index.ts`. The extra questions are appended to the lesson, so they appear in lesson quizzes (five are drawn at random), unit tests, level exams and practice. Aim for variety of format and difficulty, and do not repeat a question that is already in the lesson. `npm run validate` and `npm test` both check for duplicates.

## Study notes

`src/content/notes/` holds two to four pages of revision notes per unit, written with the same blocks as lessons but denser: definitions, rules, formulas and common mistakes. Every unit needs an entry, and the validator checks that. Notes are not a place to teach from scratch; they are what a learner rereads before a test.

## Endless generated questions

Propositional logic, syllogisms and a few other topics have generators in `src/logic/generators.ts` and `generators2.ts`. A generator returns a question whose answer is computed, never looked up. To add one:

1. Write the function (use the formula engine for anything propositional).
2. Add its name to `GenKind` and `GENS`.
3. List it under the right unit in `UNIT_GENERATORS` so unit tests and practice use it.
4. Make sure `tests/generators.test.ts` covers it (add the kind to `KINDS`).

## Checking your work

```bash
npm run validate
npm test
```

`validate` verifies answer indexes, duplicate options, formulas that must parse, icon names and that no emoji slipped in. It does not check that your logic is right. Please re-read every answer and explanation as if you were the learner who picked the wrong option.

Then run the app (`npm run web` is quickest), go through the lesson and its quiz, and look at it in a dark theme and a light theme.

## Style

- Teach one idea per page.
- Give a concrete example before a formal rule when you can.
- Show the usual mistake. "Affirming the consequent" is easier to remember next to an example that fails.
- Say which convention you are using when textbooks differ.
- No emoji. Use icon names for icons.
