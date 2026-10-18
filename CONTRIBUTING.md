# Contributing to Logica

Thanks for wanting to help. This file explains how to get set up, what kinds of changes are useful, and what a pull request needs before it can be merged.

## Ways to help

- **Fix a mistake in a lesson or question.** A wrong answer in a logic app is worse than a bug, so these are the most valuable fixes. Open an issue with the "Content correction" template, or send a pull request.
- **Report a bug.** Use the bug template. Include your device, Android version and app version (Me, then About).
- **Improve explanations.** If a page confused you, it probably confuses others. Say what tripped you up.
- **Write new lessons or questions.** Read [docs/ADDING_CONTENT.md](docs/ADDING_CONTENT.md) first.
- **Fix code issues or add features.** For anything larger than a small fix, open an issue first so we can agree on the approach before you spend time on it.

## Getting set up

You need Node.js 22 and npm.

```bash
git clone <your fork>
cd logica
npm install
npm run web          # browser preview, fastest way to iterate on UI and content
npx expo run:android # real device or emulator
```

Before you push, run the same checks CI runs:

```bash
npm run lint
npm run typecheck
npm test
npm run validate
```

All four must pass.

## Making a change

1. Fork the repository and create a branch from `main`. Name it after what it does, for example `fix-modus-tollens-answer` or `add-lesson-fuzzy-logic`.
2. Keep the change focused. One fix or one feature per pull request.
3. Add or update tests when you change anything in `src/logic`, `src/store` or `src/utils`.
4. Run the checks above.
5. Open a pull request and fill in the template.

### Commit messages

Use short, plain messages in the imperative mood, for example "Fix undistributed middle explanation" or "Add Hoare logic loop invariant question". A conventional prefix such as `fix:`, `feat:`, `docs:` or `content:` is welcome but not required.

## Content guidelines

Lesson text is the product, so it gets the same care as code.

- **Be correct.** Check claims against a textbook or a reliable source. If a topic has competing conventions (existential import, the definition of validity for inductive arguments, symbol choices), say which one the lesson uses.
- **Every question needs an explanation** that says why the answer is right, and ideally why the tempting wrong answers are wrong.
- **Wrong options should be plausible**, not obviously silly. A good distractor is a real mistake people make.
- **Keep pages short.** A page should fit on one phone screen or scroll a little. If it needs more, split it.
- **Plain language.** Define a term the first time it appears. Avoid jargon the lesson has not introduced.
- **No emoji.** Use the icon set (Ionicons) where a symbol is needed. Logic symbols such as ∧, ∨, → and ∴ are fine.
- Run `npm run validate`. It catches bad answer indexes, formulas that do not parse, unknown icon names and stray emoji.

## Code guidelines

- TypeScript with `strict` on. Avoid `any`; if you need an escape hatch, comment why.
- Match the surrounding style. The repository has an `.editorconfig`; two-space indentation, single quotes, semicolons.
- Colours come from the theme (`useTheme()`), never hard-coded, so all eight themes keep working. Check a light theme and a dark theme before you send a UI change.
- Anything that talks to the network, the file system or the notification system must fail quietly and keep the app usable. The app is meant to work offline and must never crash because a request failed.
- Changes to the persisted store need a migration. See "Store versions" in [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md). Existing users must never lose progress after an update.
- No new dependency without a good reason. Use `npx expo install <package>` so the version matches the Expo SDK.

## Pull request checklist

- [ ] The four checks pass locally.
- [ ] New or changed behaviour has a test, or the pull request says why it cannot.
- [ ] Content changes are accurate and every question has an explanation.
- [ ] UI changes were looked at in at least one light and one dark theme.
- [ ] The change is described in `CHANGELOG.md` under an "Unreleased" heading if users would notice it.

## Review

A maintainer will review your pull request, usually within a week. Expect questions and requests for changes; that is normal and not a rejection. Small pull requests are reviewed faster than large ones.

## Reporting security problems

Please do not open a public issue for a security problem. See [SECURITY.md](SECURITY.md).

## Code of conduct

Everyone taking part is expected to follow the [code of conduct](CODE_OF_CONDUCT.md).
