# Architecture

This is a map of how Logica is put together, written for someone about to change it.

## Stack

- Expo SDK 58, React Native 0.88, React 19, TypeScript
- Expo Router for navigation (file-based, `src/app`)
- Reanimated for animation, `react-native-svg` for charts, diagrams and the mascot
- zustand for state, persisted with AsyncStorage
- No backend

## Folders

| Path | Role |
| --- | --- |
| `src/app` | One file per screen. Tabs live in `src/app/(tabs)`, Lab tools in `src/app/lab`. |
| `src/components` | Shared UI. `QuestionView.tsx` renders all seven question types; `LessonBlocks.tsx` renders lesson pages. |
| `src/content` | All teaching content as TypeScript data. No logic here except small helpers. |
| `src/logic` | Pure functions: the propositional engine, syllogism engine, generators, grading, rewards, progression. No React, so they are unit-tested directly. |
| `src/services` | Side effects: starting sessions, update checks, notifications, haptics. |
| `src/store` | The persisted store, the level maths, and the transient session and update UI stores. |
| `src/theme` | Theme definitions and provider. |
| `tests` | Unit tests for everything under `logic`, `utils` and parts of `store` and `content`. |

## Content model

`src/content/types.ts` defines the shapes.

- A **Unit** has a level, an icon name, a hue and a list of **Lessons**.
- A **Lesson** has **pages** (lists of **blocks**) and **questions**.
- A **Question** is one of seven types. Question ids are `<lessonId>.<n>` and are assigned by the `lesson()` helper, so they stay stable as long as the order in a lesson does not change.
- `src/content/curriculum.ts` lists the units in order, merges the extra question banks from `src/content/banks` into their lessons, and tags every question with its unit and level. Study notes live in `src/content/notes` and are keyed by unit id.

Unit ids are used elsewhere (generators, achievements, analytics), so renaming one is a breaking change for stored statistics. Do not rename them casually.

## The logic engine

`src/logic/formula.ts` parses propositional formulas (unicode or ASCII), evaluates them, builds truth tables, classifies formulas, tests equivalence and entailment, and produces minimal DNF and CNF with Quine-McCluskey. `src/logic/syllogism.ts` decides categorical syllogisms by checking all 256 worlds of the eight Venn regions, which gives the traditional 24 valid forms (15 unconditional, 9 needing existential import).

`src/logic/generators.ts` and `generators2.ts` use these to make endless questions (19 kinds, from truth-table and De Morgan drills to Bayes problems and Kripke models). Propositional answers are checked by brute force, never by a lookup table, so generated questions cannot disagree with the engine. `UNIT_GENERATORS` decides which units draw on which generators.

## Sessions

A "session" is any run of questions: a lesson quiz, unit test, exam, practice set, daily challenge, speed round, mistakes review, fallacy game or the placement test.

1. `src/services/sessions.ts` builds a `SessionConfig` (questions, mode, pass mark) and puts it in `useSession`.
2. `src/app/session.tsx` runs it. It keeps answers in refs, grades with `src/logic/grading.ts`, and at the end builds a `SessionResult`.
3. `computeReward` in `src/logic/rewards.ts` decides XP, gems and stars.
4. `completeSession` in the store applies the result: streak, daily stats, per-unit and per-type statistics, lesson, test and exam records, the mistakes queue, and achievements. It returns what changed so the results screen can celebrate it.
5. `src/app/results.tsx` shows the outcome.

Multiple choice and select-all options are shuffled per run (`randomizeQuestion`), except where order carries meaning such as True/False or "Both of these".

## Progression

`src/logic/progression.ts` decides what is unlocked. A unit is open if it is below the learner's starting level, is the first unit of that level, or the previous unit is complete. A unit counts as complete when all its lessons are done or its unit test is passed, which is how "test out" works. Level exams open at 60% of the level.

## The store

`src/store/index.ts` holds everything that is saved: profile, settings, progress, streak, stats, the mistakes queue, flashcard schedule, achievements and update bookkeeping.

### Store versions

Saved data is merged over fresh defaults on every load (`mergeData`). Fields added in a newer version therefore always exist, and a field with the wrong type in saved data is ignored instead of crashing the app.

When a change cannot be handled by merging (a field is renamed or reshaped):

1. Increase `STORE_VERSION`.
2. Add a branch to `migrate()` that converts the old shape.
3. Add a test that feeds an old snapshot through it.

`exportData` and `importData` use the same merge, so old backups keep working.

## Updates

`src/services/updates.ts` and `src/store/updateUi.ts`.

1. On launch (after a short delay) and when the app returns to the foreground, `checkForUpdate` asks the GitHub API for the latest release. It runs at most every six hours unless the user taps "Check now". Every failure becomes a result value; nothing throws.
2. Drafts and prereleases are ignored. Tags are compared as numbers, so `1.10.0` is newer than `1.9.9`.
3. If a newer release exists, a sheet is shown, but only on a main tab. It never appears during a lesson, quiz or onboarding. "Later" hides it for a day; "Skip this version" hides that version.
4. On Android, "Update now" writes a backup of the store, downloads the APK to the cache directory with progress, checks the size (and the MD5 if the release has a `.md5` file), and opens the system installer. Nothing is installed if a check fails.
5. On other platforms the button opens the release page.
6. If the stored data is ever found empty while a pre-update backup exists, the backup is restored.
7. After an update, a "What's new" sheet shows the notes from `src/content/changelog.ts`.

A release whose notes contain `[force-update]` cannot be dismissed.

## Themes

`src/theme/themes.ts` defines each theme as a flat set of tokens. Components read them through `useTheme()`. A theme with `glow: true` (Neon Circuit) adds coloured shadows. Free themes are unlocked from the start; the rest are bought with gems, and `ThemeProvider` falls back to Auto if the saved theme is not owned.

## Testing

`npm test` runs `node --test` through `tsx`. Tests import the pure modules directly, so anything that imports React Native (screens, components, the store) is exercised by running the app instead. If you need to test store logic, extract it into a pure function first.
