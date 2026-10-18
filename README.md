# Logica

Logica is a mobile app for learning formal logic, from "what is an argument?" up to modal logic, Gödel's theorems and the classic paradoxes. It has short lessons, quizzes, practice modes and a few tools for checking your own work.

It is offline. There are no accounts and nothing is sent anywhere. The only network request the app makes is an occasional check of this repository's releases to see whether a newer version exists.

Developed by Tech Bytes Design. Developer: Mir Faizan. Contact: techbytesdesign@gmail.com.

## What is in the app

**Lessons.** 83 lessons in 26 units, split into three levels. Every unit also has revision notes.

| Level | Covers |
| --- | --- |
| Beginner (7 units, 22 lessons) | Arguments and validity, propositions and connectives, truth tables, categorical syllogisms, common fallacies, logic puzzles, a critical thinking toolkit (argument maps, cognitive biases, weighing evidence) |
| Intermediate (9 units, 28 lessons) | Equivalences and normal forms, rules of inference, proof methods, syllogisms in depth, quantifiers, Boolean algebra and gates, sets and relations, probability and Bayes, puzzle techniques |
| Advanced (10 units, 33 lessons) | First-order logic in depth, natural deduction, resolution and SAT, metalogic, modal, temporal, epistemic and deontic logic, many-valued, intuitionistic, paraconsistent and non-monotonic logic, Hoare logic and lambda calculus, second-order logic and proof assistants, linear logic, computability and complexity, paradoxes |

**Questions.** About 1,400 written questions in seven formats (multiple choice, true or false, select all, ordering, matching, filling a truth table, classifying), with an explanation for each. On top of that, nineteen generators produce fresh drills on demand (truth tables, equivalences, De Morgan, inference rules, syllogisms, quantifier negation, logic gates, binary arithmetic, sets, probability, Bayes, Kripke models and more), so practice does not run out.

**Study notes.** Short revision pages for every unit, readable from the Learn tab and the Lab.

**Checks and exams.** A placement test when you start, a test at the end of each unit, and an exam per level that earns a certificate.

**Practice.** Daily challenge, speed round, fallacy detective, flashcards (about 250 cards), and a review queue that collects the questions you got wrong.

**Lab.** A truth table tool that also computes normal forms and checks equivalence and argument validity, a syllogism checker that draws the Venn diagram, a logic gate explorer, a glossary of about 180 terms, a library of 45 fallacies, a symbol sheet and the study notes.

**Progress.** XP, levels, daily goals, streaks, gems, 40 achievements, charts, and a skill map that shows which topics need work.

**Themes.** Eight of them. Daylight, Nightfall, Blossom and Neon Circuit are free. Midnight OLED, Ocean Breeze, Deep Forest and Sunset Boulevard are bought with gems earned in the app.

## Installing

Android: open the [latest release](../../releases/latest), download `logica-<version>.apk` and open it. Android will ask you to allow installs from your browser or file manager the first time. After that, the app tells you when a new version is out and can install it itself.

iOS: no builds are published. You can build the project yourself from source.

## Running from source

You need Node.js 22 and npm. For a real device or emulator you also need the Android SDK (Android Studio installs it).

```bash
git clone <this repository>
cd logica
npm install
npx expo start
```

The app uses native modules (notifications, file system, intent launcher), so a development build is the reliable way to run it on a phone:

```bash
npx expo run:android
```

`npm run web` starts a browser preview. It is handy for working on layouts and content, but the app is built for phones and a few features (haptics, reminders, installing updates) do nothing on the web.

## Scripts

| Command | What it does |
| --- | --- |
| `npm start` | Start the Expo dev server |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript, no emit |
| `npm test` | Unit tests for the logic engine, grading, rewards, version handling and release parsing |
| `npm run validate` | Checks every lesson and question: answer indexes, formulas parse, icons exist, no emoji |
| `npm run check-release` | Checks the version, changelog and in-app release notes agree before tagging |
| `npm run export:android` | Builds the JavaScript bundle for Android (a quick "does it compile" check) |

## How the code is organised

```
src/
  app/          screens, one file per route (Expo Router)
  components/   shared UI: buttons, cards, charts, question views, the update sheet
  content/      lessons, questions, glossary, fallacies, achievements
  logic/        the propositional engine, syllogism engine, question generators, grading, rewards
  services/     sessions, updates, notifications, haptics
  store/        persisted state (zustand) and the transient session store
  theme/        the eight themes and the theme provider
  utils/        dates, colours, versions, release parsing
tests/          node:test unit tests
scripts/        content validator and release helpers
docs/           architecture, content guide, release guide
```

More detail is in [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

## Updates

Releases are built by GitHub Actions when a version tag is pushed. The app compares its own version with the latest release, and on Android it can download the APK, check its size and checksum, and hand it to the system installer. Progress is stored in the app's data directory and is kept across updates; a backup is written just before an install as a safety net.

Maintainers: see [docs/RELEASING.md](docs/RELEASING.md).

## Contributing

Corrections to lesson content are as welcome as code. Please read [CONTRIBUTING.md](CONTRIBUTING.md) first, and [docs/ADDING_CONTENT.md](docs/ADDING_CONTENT.md) if you want to write a lesson or add questions.

By taking part you agree to follow the [code of conduct](CODE_OF_CONDUCT.md). Security problems should be reported privately; see [SECURITY.md](SECURITY.md).

## License

MIT. See [LICENSE](LICENSE). The lesson text is covered by the same license.
