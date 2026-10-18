import { classify, cmp, ex, lesson, list, match, mcq, multi, order, p, pg, sym, tf, tip, tt, ttb, unit, warn } from './helpers';

/* =========================================================================
   BEGINNER · UNIT 1 — Thinking in Arguments
   ========================================================================= */
export const argumentsUnit = unit(
  'arguments',
  0,
  'Thinking in Arguments',
  'bulb-outline',
  250,
  'What logic is really about: statements, premises, conclusions and validity.',
  [
    lesson(
      'arguments-1',
      'What Is an Argument?',
      'chatbubble-ellipses-outline',
      'Statements, premises and conclusions.',
      4,
      [
        pg(
          'Logic starts with statements',
          p('A **statement** (or **proposition**) is a sentence that is either **true or false**. That is the raw material logic works with.'),
          ex(['“Paris is the capital of France.” a statement', '“2 + 2 = 5.” a statement (false, but still truth-apt)', '“Close the door.” not a statement: a command', '“Is it raining?” not a statement: a question', '“Wow!” not a statement: an exclamation'], 'Statement or not?'),
          tip('A false statement is still a statement. What matters is that it **can** be true or false.')
        ),
        pg(
          'Premises and conclusions',
          p('An **argument** is a set of statements where some, the **premises**, are offered as reasons to accept another, the **conclusion**.'),
          ex(['All humans are mortal.   (premise)', 'Socrates is a human.   (premise)', 'Therefore, Socrates is mortal.   (conclusion)'], 'The classic'),
          p('Indicator words help you find the pieces:'),
          cmp(
            { title: 'Premise words', lines: ['because', 'since', 'given that', 'for', 'as shown by'] },
            { title: 'Conclusion words', lines: ['therefore', 'thus', 'hence', 'so', 'it follows that'] }
          )
        ),
        pg(
          'Not everything is an argument',
          p('Some passages only **describe**, **explain** or **command**. An argument tries to **prove** something.'),
          list('**Explanation:** “The garden flooded because it rained all night.” (the flooding is already accepted, we explain why)', '**Description:** “The museum opens at 9 and closes at 5.”', '**Command:** “Please pass the salt.”'),
          tip('Ask yourself: “Is the author trying to convince me of a claim by giving reasons?” If yes, it is an argument.')
        ),
      ],
      [
        tf('“Close the window, please.” is a statement.', false, 'Commands are not true or false, so they are not statements.', 'Can you say “that is true” or “that is false” about it?'),
        mcq('Which of these is a statement?', ['What time is it?', 'Please sit down.', 'Water boils at 100 °C at sea level.', 'Wow, what a view!'], 2, 'Only the third can be true or false.'),
        mcq('“The lights are off, so nobody is home.” What is the conclusion?', ['The lights are off', 'Nobody is home', 'The lights are off, so nobody is home', 'There is no conclusion'], 1, '“So” signals the conclusion: nobody is home.', 'Look for the indicator word.'),
        classify(
          'Is each passage an argument?',
          ['Argument', 'Not an argument'],
          [
            ['All birds have feathers; a penguin is a bird; so penguins have feathers.', 0],
            ['Please pass the salt.', 1],
            ['The garden flooded because it rained all night.', 1],
            ['We should hire her: she has the best portfolio and glowing references.', 0],
            ['The museum opens at 9 and closes at 5.', 1],
          ],
          'Arguments offer reasons for a conclusion. Commands, descriptions and explanations of accepted facts are not arguments.'
        ),
        order('Put the argument in standard form.', ['All humans are mortal.', 'Socrates is a human.', 'Therefore, Socrates is mortal.'], 'Premises come first, the conclusion last.'),
        multi('Select all conclusion indicators.', ['therefore', 'because', 'hence', 'since', 'thus', 'given that'], [0, 2, 4], '“Therefore”, “hence” and “thus” introduce conclusions; “because”, “since” and “given that” introduce premises.'),
      ]
    ),
    lesson(
      'arguments-2',
      'Validity & Soundness',
      'checkmark-circle-outline',
      'What makes an argument good (and what doesn’t).',
      5,
      [
        pg(
          'Validity is about structure',
          p('An argument is **valid** if it is **impossible** for all its premises to be true while its conclusion is false.'),
          ex(['All fish can fly.', 'Nemo is a fish.', '∴ Nemo can fly.'], 'Valid, even though absurd'),
          p('If the premises **were** true, the conclusion would have to be. Validity does **not** check whether the premises are actually true.'),
          warn('A valid argument can have a false conclusion, and an invalid argument can have a true conclusion. Validity is about the **link**, not the facts.')
        ),
        pg(
          'Soundness = validity + truth',
          p('An argument is **sound** when it is **valid** and all its premises are **actually true**. Then you must accept the conclusion.'),
          cmp(
            { title: 'Sound', lines: ['All mammals breathe air.', 'Whales are mammals.', '∴ Whales breathe air.'] },
            { title: 'Valid but unsound', lines: ['All birds can fly.', 'Penguins are birds.', '∴ Penguins can fly.'] }
          ),
          tip('Unsound does not mean the conclusion is false. It means this argument fails to **prove** it.')
        ),
        pg(
          'The counterexample method',
          p('To show an argument is **invalid**, describe a scenario where the premises are true but the conclusion is false.'),
          ex(['All cats are mammals.', 'All dogs are mammals.', '∴ All cats are dogs.'], 'Invalid'),
          p('In the real world both premises are true and the conclusion is false. That single counterexample kills the argument.')
        ),
      ],
      [
        mcq('An argument is valid when…', ['its premises are all true', 'its conclusion is true', 'it is impossible for the premises to be true and the conclusion false', 'most people agree with it'], 2, 'That is the definition: no way to have true premises with a false conclusion.'),
        tf('A valid argument must have a true conclusion.', false, 'Validity only guarantees truth **if** the premises are true. Valid arguments can have false conclusions.'),
        mcq('“All squares are circles. All circles are shapes. ∴ All squares are shapes.”', ['Valid and sound', 'Valid but unsound', 'Invalid but sound', 'Invalid and unsound'], 1, 'The form guarantees the conclusion, but the first premise is false, so the argument is unsound.'),
        mcq('“Some birds fly. Some planes fly. ∴ Some birds are planes.” is…', ['Valid', 'Invalid, because the premises are true and the conclusion false', 'Sound', 'Invalid, because a premise is false'], 1, 'Both premises are true and the conclusion is false: a perfect counterexample.'),
        classify(
          'Classify each argument.',
          ['Sound', 'Valid, unsound', 'Invalid'],
          [
            ['All mammals breathe air. Whales are mammals. ∴ Whales breathe air.', 0],
            ['All birds can fly. Penguins are birds. ∴ Penguins can fly.', 1],
            ['Some cars are red. Some red things are apples. ∴ Some cars are apples.', 2],
            ["If it's Tuesday it's a weekday. It's a weekday. ∴ It's Tuesday.", 2],
          ],
          'Sound needs validity AND true premises. A false premise makes a valid argument unsound; a broken form makes it invalid.'
        ),
        tf('If an argument has a false premise, it must be invalid.', false, 'Validity ignores whether premises are actually true. A valid argument may contain false premises.'),
      ]
    ),
    lesson(
      'arguments-3',
      'Deduction, Induction & Abduction',
      'search-outline',
      'Three ways of reasoning from evidence.',
      4,
      [
        pg(
          'Deduction: certainty',
          p('In **deductive** reasoning the conclusion follows **necessarily** from the premises. We judge such arguments as valid or invalid.'),
          ex(['All squares have four sides.', 'This shape is a square.', '∴ This shape has four sides.'], 'Deductive'),
          p('Formal logic is mostly the study of deduction: the guarantees that structure gives us.')
        ),
        pg(
          'Induction: probability',
          p('**Inductive** reasoning generalises from observations. The premises make the conclusion **probable**, never certain.'),
          ex(['Every swan I have seen is white.', '∴ All swans are white.'], 'A classic inductive leap'),
          p('Inductive arguments are **strong** or **weak** (not valid/invalid). Even a strong one can have a false conclusion; black swans were discovered in Australia.'),
          tip('More varied, representative evidence makes an induction stronger.')
        ),
        pg(
          'Abduction: best explanation',
          p('**Abductive** reasoning picks the **best explanation** of what we observe, as detectives and doctors do.'),
          ex(['The grass is wet and the sky is cloudy.', '∴ It probably rained.'], 'Inference to the best explanation'),
          p('Abduction is fallible, and the winner can be overturned by new evidence (the sprinkler was on!).')
        ),
      ],
      [
        mcq('“The sun has risen every day so far, so it will rise tomorrow.”', ['Deductive', 'Inductive', 'Abductive', 'Not an argument'], 1, 'It generalises from past observations to the future: induction.'),
        mcq('“All squares have four sides. This is a square. ∴ This has four sides.”', ['Deductive', 'Inductive', 'Abductive', 'Not an argument'], 0, 'The conclusion follows necessarily.'),
        tf('A strong inductive argument guarantees its conclusion.', false, 'Induction only makes the conclusion probable.'),
        mcq('“The grass is wet and the sky is cloudy; the best explanation is that it rained.”', ['Deduction', 'Induction', 'Abduction', 'Fallacy'], 2, 'Choosing the best explanation of the evidence is abduction.'),
        match('Match the reasoning type to its flavour.', [['Deduction', 'Certainty if premises hold'], ['Induction', 'Probability from patterns'], ['Abduction', 'Best explanation'], ['Soundness', 'Valid + true premises']], 'Each term names a different standard for judging reasoning.'),
        mcq('The discovery of black swans most directly challenged which kind of reasoning?', ['A deductive proof', 'An inductive generalisation', 'A definition', 'A question'], 1, '“All swans are white” was an inductive generalisation from limited samples.'),
      ]
    ),
  ]
);

/* =========================================================================
   BEGINNER · UNIT 2 — Propositions & Connectives
   ========================================================================= */
export const propBasicsUnit = unit(
  'prop-basics',
  0,
  'Propositions & Connectives',
  'link-outline',
  200,
  'The alphabet of logic: statements, ¬, ∧, ∨, →, ↔.',
  [
    lesson(
      'prop-1',
      'Statements & Symbols',
      'text-outline',
      'Atomic statements and the logical alphabet.',
      4,
      [
        pg(
          'Building blocks',
          p('An **atomic** proposition cannot be split into smaller statements. We name them with letters: **p, q, r, …**'),
          ex(['p = “It is raining.”', 'q = “The match is cancelled.”'], 'Naming statements'),
          p('Using **connectives** we build **compound** propositions from atomic ones.')
        ),
        pg(
          'The logical alphabet',
          sym(
            { sym: '¬', name: 'not', note: 'negation' },
            { sym: '∧', name: 'and', note: 'conjunction' },
            { sym: '∨', name: 'or', note: 'disjunction' },
            { sym: '→', name: 'if … then', note: 'conditional' },
            { sym: '↔', name: 'if and only if', note: 'biconditional' }
          ),
          tip('Memorise these five. Everything else in propositional logic is built from them.')
        ),
        pg(
          'Negation',
          p('**¬p** (“not p”) flips the truth value of p.'),
          ttb('¬p'),
          p('Negating twice gets you back: **¬¬p** has the same truth value as **p**.')
        ),
      ],
      [
        mcq('Which statement is atomic?', ['Maria is tall and kind', 'If Maria is tall, she plays', 'Maria is tall', 'Maria is not tall'], 2, '“Maria is tall” has no connective. “Maria is not tall” contains a negation, so it is compound.'),
        match('Match each symbol with its meaning.', [['¬', 'not'], ['∧', 'and'], ['∨', 'or'], ['→', 'if … then'], ['↔', 'if and only if']], 'These five symbols are the core connectives.'),
        tf('¬p is true when p is false.', true, 'Negation flips truth values.'),
        mcq('Let p = “It is sunny”. Which expresses “It is not sunny”?', ['¬p', 'p', '¬¬p', 'p ∧ ¬p'], 0, 'Negation is written ¬p.'),
        mcq('How many atomic statements are in “If it rains and it is cold, then we stay home”?', ['1', '2', '3', '4'], 2, 'It rains, it is cold, we stay home.'),
        tf('¬¬p has the same truth value as p.', true, 'Double negation cancels out.'),
      ]
    ),
    lesson(
      'prop-2',
      'And, Or & Exclusive Or',
      'add-circle-outline',
      'Conjunction and the two kinds of “or”.',
      4,
      [
        pg(
          'Conjunction (∧)',
          p('**p ∧ q** is true **only when both** p and q are true.'),
          ttb('p ∧ q'),
          p('Words like **but, although, yet, while** also translate to ∧. They change tone, not truth conditions.'),
          ex(['“She is smart but lazy.”  →  s ∧ l'], 'Same logic as “and”')
        ),
        pg(
          'Disjunction (∨)',
          p('**p ∨ q** is true when **at least one** of p, q is true. This is the **inclusive** “or”.'),
          ttb('p ∨ q'),
          warn('In logic, p ∨ q is also true when **both** are true. “Coffee or tea?” in everyday talk often means one, but ∨ allows both.')
        ),
        pg(
          'Exclusive or (⊕)',
          p('**p ⊕ q** is true when **exactly one** of p, q is true.'),
          ttb('p ⊕ q'),
          p('You can build it from the basics: **p ⊕ q ≡ (p ∨ q) ∧ ¬(p ∧ q)**.'),
          tip('When a sentence says “…but not both”, it is asking for ⊕.')
        ),
      ],
      [
        tf('p ∧ q is true when p is true and q is false.', false, 'Conjunction needs both parts true.'),
        mcq('When is p ∨ q false?', ['When p is false', 'When q is false', 'When both are false', 'When both are true'], 2, 'An inclusive or fails only if both sides fail.'),
        tf('If p and q are both true, then p ⊕ q is true.', false, 'Exclusive or requires exactly one to be true.'),
        tt('p ∨ ¬q', 'For (p,q) = TT: T; TF: T; FT: F; FF: T.'),
        mcq('“She is smart but lazy.” has which logical form?', ['p ∧ q', 'p ∨ q', 'p → q', '¬p ∧ q'], 0, '“But” behaves like “and” logically.'),
        classify(
          'Inclusive (∨) or exclusive (⊕)?',
          ['Inclusive ∨', 'Exclusive ⊕'],
          [
            ['The applicant must know Python or Java.', 0],
            ['You may have soup or salad (not both).', 1],
            ['Tonight the coin lands heads or tails.', 1],
            ['Registration is open to students or staff.', 0],
          ],
          'If both options can hold together, it is inclusive. If at most one can, it is exclusive.'
        ),
      ]
    ),
    lesson(
      'prop-3',
      'If–Then & If-and-Only-If',
      'arrow-forward-circle-outline',
      'The conditional, the biconditional and their cousins.',
      6,
      [
        pg(
          'The conditional (→)',
          p('**p → q** (“if p then q”) has an **antecedent** p and a **consequent** q. It is false in exactly **one** case: p true and q false.'),
          ttb('p → q'),
          ex(['“If you finish your homework, you can play.”', 'Broken promise only when: homework done, but no play.'], 'Think of it as a promise'),
          tip('When p is false, the promise was never tested, so p → q counts as true.')
        ),
        pg(
          'Sufficient and necessary',
          p('In **p → q**:'),
          list('p is **sufficient** for q (p guarantees q).', 'q is **necessary** for p (without q, p cannot hold).'),
          p('English cues:'),
          cmp(
            { title: 'p → q', lines: ['if p then q', 'p only if q', 'p implies q', 'q is necessary for p'] },
            { title: 'q → p', lines: ['p if q', 'p provided that q', 'p whenever q', 'q is sufficient for p'] }
          ),
          warn('“Only if” flips direction compared to “if”.')
        ),
        pg(
          'The biconditional (↔)',
          p('**p ↔ q** is true when p and q have the **same truth value**. It means “p if and only if q” (often written iff).'),
          ttb('p ↔ q'),
          p('It is the conjunction of two conditionals: **p ↔ q ≡ (p → q) ∧ (q → p)**.')
        ),
        pg(
          'Converse, inverse, contrapositive',
          p('Start with **p → q**:'),
          list('**Converse:** q → p', '**Inverse:** ¬p → ¬q', '**Contrapositive:** ¬q → ¬p'),
          p('Only the **contrapositive** is equivalent to the original.'),
          ex(['If it rains, the street is wet.', 'Contrapositive: if the street is dry, it did not rain. (equivalent)', 'Converse: if the street is wet, it rained. (not equivalent: a hose?)'], 'Rain & streets')
        ),
      ],
      [
        mcq('In “If it rains, the street is wet”, the antecedent is…', ['The street is wet', 'It rains', 'The whole sentence', 'Neither'], 1, 'The antecedent is the “if” part.'),
        tf('p → q is false only when p is true and q is false.', true, 'This is the only way to break the promise.'),
        mcq('If p is false and q is true, p → q is…', ['True', 'False'], 0, 'A false antecedent makes the conditional true.'),
        mcq('“You can vote only if you are 18+.” With v = can vote, e = 18+, this is…', ['v → e', 'e → v', 'v ↔ e', 'v ∧ e'], 0, '“Only if” points toward the necessary condition: v → e.'),
        match('Match each variant of p → q.', [['Converse', 'q → p'], ['Inverse', '¬p → ¬q'], ['Contrapositive', '¬q → ¬p'], ['Original', 'p → q']], 'The converse swaps, the inverse negates, the contrapositive does both.'),
        mcq('Which is logically equivalent to p → q?', ['q → p', '¬p → ¬q', '¬q → ¬p', '¬p ∧ q'], 2, 'The contrapositive always has the same truth table as the conditional.'),
        tf('p ↔ q is true when p and q are both false.', true, 'The biconditional is true whenever both sides match.'),
      ]
    ),
    lesson(
      'prop-4',
      'Translating English',
      'language-outline',
      'From sentences to symbols, without slipping.',
      5,
      [
        pg(
          'A reliable recipe',
          list('1. Spot the **atomic** statements.', '2. Give each a **letter**.', '3. Find the **connective words**.', '4. Combine with **parentheses**.', '5. Re-read your symbols aloud to check.'),
          ex(['“If it rains and it is cold, we stay home.”', 'r = it rains, c = it is cold, h = we stay home', '(r ∧ c) → h'], 'Example')
        ),
        pg(
          'Tricky phrases',
          sym(
            { sym: '¬p ∧ ¬q', name: 'neither p nor q' },
            { sym: '¬(p ∧ q)', name: 'not both p and q' },
            { sym: 'q → p', name: 'p if q · p provided that q' },
            { sym: 'p → q', name: 'p only if q · p implies q' },
            { sym: '¬q → p', name: 'p unless q', note: '≡ p ∨ q' },
            { sym: 'p ⊕ q', name: 'p or q, but not both' }
          )
        ),
        pg(
          'Precedence & parentheses',
          p('Strongest to weakest binding: **¬, ∧, ∨, →, ↔**. So **¬p ∧ q** means (¬p) ∧ q, **not** ¬(p ∧ q).'),
          warn('When in doubt, **add parentheses**. They never hurt and they remove ambiguity.'),
          ex(['¬p ∧ q  =  (¬p) ∧ q', '¬(p ∧ q)  ≠  ¬p ∧ q'], 'Different formulas!')
        ),
      ],
      [
        mcq('“Neither p nor q” is…', ['¬p ∨ ¬q', '¬(p ∧ q)', '¬p ∧ ¬q', '¬p → q'], 2, 'Both fail: ¬p ∧ ¬q (equivalently ¬(p ∨ q)).'),
        mcq('“p unless q” is best written as…', ['p → q', '¬q → p', 'q → p', 'p ∧ ¬q'], 1, 'Unless q happens, p: if not q then p.'),
        mcq('“Not both p and q” is…', ['¬p ∧ ¬q', '¬(p ∧ q)', '¬p ∨ q', 'p ⊕ q'], 1, 'Only the combination p∧q is ruled out.'),
        tf('¬(p ∧ q) is equivalent to ¬p ∧ ¬q.', false, 'By De Morgan, ¬(p ∧ q) ≡ ¬p ∨ ¬q. At least one fails, not necessarily both.'),
        mcq('“I will go to the party if I finish work.” (w = finish work, g = go)', ['g → w', 'w → g', 'w ↔ g', 'g ∧ w'], 1, '“G if w” puts w as the antecedent: w → g.'),
        order('Put the translation steps in order.', ['Identify atomic statements', 'Assign letters', 'Locate the connectives', 'Combine with parentheses', 'Re-read to check'], 'Work from parts to the whole, then verify.'),
        mcq('How is “¬p ∧ q” read?', ['not (p and q)', '(not p) and q', 'not p, therefore q', 'p and not q'], 1, 'Negation binds tighter than conjunction.'),
      ]
    ),
  ]
);

/* =========================================================================
   BEGINNER · UNIT 3 — Truth Tables
   ========================================================================= */
export const truthTablesUnit = unit(
  'truth-tables',
  0,
  'Truth Tables',
  'stats-chart-outline',
  165,
  'The machine that computes every possibility.',
  [
    lesson(
      'tt-1',
      'Building a Truth Table',
      'cube-outline',
      'Rows, columns and the five basic tables.',
      5,
      [
        pg(
          'Why truth tables?',
          p('A **truth table** lists **every possible combination** of truth values for the atomic statements and computes the value of the formula in each case.'),
          list('1 variable → **2** rows', '2 variables → **4** rows', '3 variables → **8** rows', 'n variables → **2ⁿ** rows')
        ),
        pg(
          'Layout',
          p('Put each variable in its own column, then add a column for each **sub-formula**, ending with the full formula. By convention the first row is **all T** and T’s fill in first.'),
          ttb('(p ∧ q) → p')
        ),
        pg(
          'The core tables, side by side',
          ttb('p ∧ q', 'p ∨ q', 'p → q', 'p ↔ q'),
          tip('Memorise: ∧ is true only TT. ∨ is false only FF. → is false only TF. ↔ is true when equal.')
        ),
      ],
      [
        mcq('How many rows does a truth table for three variables have?', ['3', '6', '8', '9'], 2, '2³ = 8.'),
        mcq('How many rows for four variables?', ['8', '12', '16', '32'], 2, '2⁴ = 16.'),
        tt('p ∧ q', 'Only the first row (T,T) is true.'),
        tt('p → q', 'False only for p=T, q=F.'),
        tt('¬p ∨ q', 'It matches p → q: T, F, T, T.'),
        tf('A formula with 5 variables has a truth table with 32 rows.', true, '2⁵ = 32.'),
      ]
    ),
    lesson(
      'tt-2',
      'Evaluating Compound Formulas',
      'calculator-outline',
      'Order of operations and quick shortcuts.',
      5,
      [
        pg(
          'Inside-out',
          p('Evaluate **parentheses first**, then ¬, ∧, ∨, →, ↔. Always work from the innermost piece outward.'),
          ex(['p = T, q = F', '(p ∨ q) → ¬q', '= (T ∨ F) → ¬F', '= T → T', '= T'], 'Worked example')
        ),
        pg(
          'A full table',
          p('Add a helper column for each sub-formula so nothing is done in your head.'),
          ttb('(p → q) ∧ (q → p)'),
          p('This is the biconditional: it is true exactly when p and q match.')
        ),
        pg(
          'Shortcuts',
          list('A conjunction with a **false** side is false.', 'A disjunction with a **true** side is true.', 'A conditional with a **false antecedent** or **true consequent** is true.', 'A biconditional is true iff both sides agree.'),
          tip('Shortcuts let you skip most of a big table, but when unsure, build the full table.')
        ),
      ],
      [
        tf('With p = T and q = F, the formula (p ∧ q) ∨ ¬q is true.', true, 'p ∧ q = F, ¬q = T, so F ∨ T = T.'),
        mcq('With p = F, q = T, r = T: what is (p → q) ∧ r ?', ['True', 'False'], 0, 'p → q is T (false antecedent). T ∧ r(T) = T.'),
        tt('(p ∨ q) ∧ ¬(p ∧ q)', 'This is exclusive or: F in rows 1 and 4.'),
        tt('(p → q) ∧ (q → p)', 'T, F, F, T: the same as p ↔ q.'),
        tf('With p = F and q = F, p ↔ q is true.', true, 'Both sides are false, so they agree.'),
        mcq('p ∧ F is always…', ['True', 'False', 'p', 'Unknown'], 1, 'A conjunction with a false part is false.'),
      ]
    ),
    lesson(
      'tt-3',
      'Tautology, Contradiction, Contingency',
      'contrast-outline',
      'Always true, always false, or sometimes.',
      5,
      [
        pg(
          'Three kinds of formulas',
          list('**Tautology:** true in **every** row.', '**Contradiction:** false in **every** row.', '**Contingent:** true in some rows, false in others.'),
          ttb('p ∨ ¬p', 'p ∧ ¬p')
        ),
        pg(
          'Satisfiability',
          p('A formula is **satisfiable** if at least one row makes it true. So tautologies and contingent formulas are satisfiable; contradictions are not.'),
          p('If a formula’s negation is unsatisfiable, the formula is a tautology.')
        ),
        pg(
          'Why they matter',
          p('Tautologies are the **laws of logic**: they hold no matter what the world is like. “It is raining or it is not raining” is always true but tells you nothing about the weather.'),
          tip('A contradiction in your premises means anything “follows”, which is why consistent premises matter.')
        ),
      ],
      [
        classify(
          'Sort each formula.',
          ['Tautology', 'Contradiction', 'Contingent'],
          [
            ['p ∨ ¬p', 0],
            ['p ∧ ¬p', 1],
            ['p → q', 2],
            ['(p ∧ q) → p', 0],
            ['p ↔ ¬p', 1],
          ],
          'Check the truth-table column: all T, all F, or mixed.'
        ),
        mcq('Which formula is a tautology?', ['p → p', 'p → ¬p', 'p ∧ p', 'p ⊕ p'], 0, 'p → p is true whatever p is.'),
        tf('A contradiction is satisfiable.', false, 'A contradiction is false in every row, so no assignment satisfies it.'),
        mcq('What is p ∧ (p → ¬p)?', ['Tautology', 'Contradiction', 'Contingent'], 1, 'If p is true, p → ¬p is false; if p is false, the conjunction is false.'),
        tf('Every tautology is satisfiable.', true, 'It is true in all rows, in particular in at least one.'),
        mcq('Which two-variable formula is true in exactly ONE row?', ['p ∧ q', 'p ∨ q', 'p → q', 'p ↔ q'], 0, 'p ∧ q is only true in the TT row.'),
      ]
    ),
  ]
);
