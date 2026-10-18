import { classify, cmp, ex, lesson, list, match, mcq, multi, order, p, pg, rule, sym, tf, tip, tt, ttb, unit, warn } from './helpers';

/* =========================================================================
   INTERMEDIATE · UNIT 1 — Equivalences & Laws
   ========================================================================= */
export const equivalencesUnit = unit(
  'equivalences',
  1,
  'Equivalences & Laws',
  'swap-horizontal-outline',
  280,
  'Rewrite formulas without changing their meaning.',
  [
    lesson(
      'eq-1',
      'Logical Equivalence',
      'swap-horizontal-outline',
      'Same truth table, same meaning.',
      5,
      [
        pg(
          'What “equivalent” means',
          p('Two formulas are **logically equivalent** (written **P ≡ Q**) when they have the **same truth value in every row**. Equivalently, **P ↔ Q is a tautology**.'),
          ttb('p → q', '¬p ∨ q'),
          p('The two columns match, so p → q ≡ ¬p ∨ q.')
        ),
        pg(
          'The basic laws',
          sym(
            { sym: '¬¬p ≡ p', name: 'Double negation' },
            { sym: 'p ∧ q ≡ q ∧ p', name: 'Commutative', note: 'same for ∨' },
            { sym: 'p ∧ p ≡ p', name: 'Idempotent', note: 'same for ∨' },
            { sym: 'p ∧ ⊤ ≡ p', name: 'Identity', note: 'p ∨ ⊥ ≡ p' },
            { sym: 'p ∨ ⊤ ≡ ⊤', name: 'Domination', note: 'p ∧ ⊥ ≡ ⊥' },
            { sym: 'p ∨ ¬p ≡ ⊤', name: 'Complement', note: 'p ∧ ¬p ≡ ⊥' }
          )
        ),
        pg(
          'Laws for → and ↔',
          list('**Material implication:** p → q ≡ ¬p ∨ q', '**Contrapositive:** p → q ≡ ¬q → ¬p', '**Negated conditional:** p → q ≡ ¬(p ∧ ¬q)', '**Biconditional:** p ↔ q ≡ (p → q) ∧ (q → p) ≡ (p ∧ q) ∨ (¬p ∧ ¬q)', '**Exclusive or:** p ⊕ q ≡ ¬(p ↔ q)'),
          tip('Memorise “p → q is ¬p ∨ q”. It converts conditionals into the connectives that are easiest to manipulate.')
        ),
      ],
      [
        mcq('Which formula is equivalent to p → q?', ['q → p', '¬p ∨ q', 'p ∧ ¬q', '¬p ∧ q'], 1, 'Material implication: p → q ≡ ¬p ∨ q.'),
        tf('p → q is equivalent to q → p.', false, 'That is the converse, which is not equivalent.'),
        mcq('p ∨ ⊥ is equivalent to…', ['⊥', '⊤', 'p', '¬p'], 2, 'Identity law: or-ing with false changes nothing.'),
        match('Match each law to an example.', [['Double negation', '¬¬p ≡ p'], ['Idempotent', 'p ∨ p ≡ p'], ['Complement', 'p ∨ ¬p ≡ ⊤'], ['Domination', 'p ∧ ⊥ ≡ ⊥']], 'Each law names a pattern that can be applied anywhere in a formula.'),
        mcq('p ↔ q is equivalent to…', ['(p ∧ q) ∨ (¬p ∧ ¬q)', '(p ∨ q) ∧ ¬(p ∧ q)', 'p → q', '¬p ∨ ¬q'], 0, 'Both sides true, or both false.'),
        tf('P ≡ Q means that P ↔ Q is a tautology.', true, 'The formulas agree in every row exactly when their biconditional is always true.'),
      ]
    ),
    lesson(
      'eq-2',
      'De Morgan & Distribution',
      'git-branch-outline',
      'Push negations inward and expand brackets.',
      6,
      [
        pg(
          'De Morgan’s laws',
          rule('De Morgan 1', ['¬(p ∧ q)'], '¬p ∨ ¬q'),
          rule('De Morgan 2', ['¬(p ∨ q)'], '¬p ∧ ¬q'),
          p('Slogan: **break the negation, flip the connective**.'),
          ex(['“I am not both tired and hungry.”', '= “I am not tired, or I am not hungry.”'], 'In English'),
          ttb('¬(p ∧ q)', '¬p ∨ ¬q')
        ),
        pg(
          'Distribution & absorption',
          list('**∧ over ∨:** p ∧ (q ∨ r) ≡ (p ∧ q) ∨ (p ∧ r)', '**∨ over ∧:** p ∨ (q ∧ r) ≡ (p ∨ q) ∧ (p ∨ r)', '**Absorption:** p ∨ (p ∧ q) ≡ p and p ∧ (p ∨ q) ≡ p'),
          warn('Unlike ordinary algebra, ∨ also distributes over ∧.')
        ),
        pg(
          'Negating conditionals',
          list('**¬(p → q) ≡ p ∧ ¬q** (the only way to break a promise)', '**¬(p ↔ q) ≡ p ⊕ q**'),
          p('Putting laws together:'),
          ex(['(p ∧ q) ∨ (p ∧ ¬q)', '≡ p ∧ (q ∨ ¬q)      distribution', '≡ p ∧ ⊤              complement', '≡ p                      identity'], 'Simplifying')
        ),
      ],
      [
        mcq('¬(p ∨ q) is equivalent to…', ['¬p ∨ ¬q', '¬p ∧ ¬q', 'p ∧ q', '¬p → q'], 1, 'De Morgan: negate the pieces and flip ∨ to ∧.'),
        tf('The formulas ¬(p ∧ q) and ¬p ∧ ¬q are logically equivalent.', false, 'By De Morgan, ¬(p ∧ q) is equivalent to ¬p ∨ ¬q, not ¬p ∧ ¬q.'),
        mcq('The negation of “It is sunny and warm” is…', ['It is not sunny and not warm', 'It is not sunny or not warm', 'It is sunny or warm', 'It is not sunny and warm'], 1, 'At least one of the conditions fails.'),
        mcq('¬(p → q) is equivalent to…', ['¬p → ¬q', '¬p ∨ q', 'p ∧ ¬q', 'q → p'], 2, 'A conditional fails exactly when the antecedent holds and the consequent does not.'),
        mcq('Simplify (p ∧ q) ∨ (p ∧ ¬q).', ['q', 'p', 'p ∧ q', '⊤'], 1, 'Factor out p: p ∧ (q ∨ ¬q) ≡ p.'),
        classify(
          'Equivalent to ¬(p ∧ q) ?',
          ['Equivalent', 'Not equivalent'],
          [
            ['¬p ∨ ¬q', 0],
            ['¬p ∧ ¬q', 1],
            ['p → ¬q', 0],
            ['¬(q ∧ p)', 0],
            ['¬p ∨ q', 1],
          ],
          'p → ¬q ≡ ¬p ∨ ¬q ≡ ¬(p ∧ q). The others differ in at least one row.'
        ),
        tf('p ∨ (p ∧ q) is equivalent to p.', true, 'Absorption law.'),
      ]
    ),
    lesson(
      'eq-3',
      'Normal Forms: CNF & DNF',
      'grid-outline',
      'Standard shapes every formula can be put into.',
      6,
      [
        pg(
          'Literals, clauses and terms',
          list('A **literal** is a variable or its negation: p, ¬q.', 'A **term** is literals joined by ∧.', 'A **clause** is literals joined by ∨.'),
          cmp(
            { title: 'DNF (OR of ANDs)', lines: ['(p ∧ ¬q) ∨ (¬p ∧ r)', 'a disjunction of terms'] },
            { title: 'CNF (AND of ORs)', lines: ['(p ∨ ¬q) ∧ (¬p ∨ r)', 'a conjunction of clauses'] }
          )
        ),
        pg(
          'Converting by laws',
          list('1. Eliminate → and ↔ (use ¬p ∨ q).', '2. Push ¬ inward (De Morgan, double negation).', '3. Distribute ∨ over ∧ (for CNF) or ∧ over ∨ (for DNF).'),
          ex(['p → (q ∧ r)', '≡ ¬p ∨ (q ∧ r)', '≡ (¬p ∨ q) ∧ (¬p ∨ r)      this is CNF'], 'Example')
        ),
        pg(
          'Reading them off a truth table',
          list('**DNF:** one term per **true** row.', '**CNF:** one clause per **false** row (negate that row’s literals).'),
          ttb('p ⊕ q'),
          ex(['DNF:  (p ∧ ¬q) ∨ (¬p ∧ q)', 'CNF:  (p ∨ q) ∧ (¬p ∨ ¬q)'], 'For exclusive or'),
          tip('SAT solvers work on CNF. Almost all automated reasoning starts by converting to it.')
        ),
      ],
      [
        mcq('Which formula is in DNF?', ['(p ∧ q) ∨ (¬p ∧ r)', '(p ∨ q) ∧ r', 'p → q', '¬(p ∧ q)'], 0, 'DNF is an OR of ANDs of literals.'),
        mcq('Which formula is in CNF?', ['(p ∨ q) ∧ (¬p ∨ r)', '(p ∧ q) ∨ r', 'p ↔ q', '¬(p ∨ q)'], 0, 'CNF is an AND of ORs of literals.'),
        tf('Every propositional formula has an equivalent CNF.', true, 'Eliminate →/↔, push negations in, then distribute.'),
        mcq('The CNF of p → q is…', ['¬p ∨ q', 'p ∨ ¬q', '¬p ∧ q', 'p ∧ ¬q'], 0, 'A single clause: ¬p ∨ q.'),
        mcq('A DNF for p ↔ q is…', ['(p ∧ q) ∨ (¬p ∧ ¬q)', '(p ∧ ¬q) ∨ (¬p ∧ q)', 'p ∧ q', '(p ∨ q) ∧ (¬p ∨ ¬q)'], 0, 'One term for each true row: TT and FF.'),
        tt('(¬p ∨ q) ∧ (p ∨ ¬q)', 'T, F, F, T: this CNF is the biconditional p ↔ q.'),
      ]
    ),
  ]
);

/* =========================================================================
   INTERMEDIATE · UNIT 2 — Rules of Inference
   ========================================================================= */
export const inferenceUnit = unit(
  'inference',
  1,
  'Rules of Inference',
  'git-merge-outline',
  300,
  'The valid moves that build arguments and proofs.',
  [
    lesson(
      'inf-1',
      'Testing Arguments with Tables',
      'checkbox-outline',
      'Validity as “no counterexample row”.',
      6,
      [
        pg(
          'Semantic validity',
          p('An argument **P₁, …, Pₙ ∴ C** is valid (we write **P₁, …, Pₙ ⊨ C**) iff **no row** makes every premise true and the conclusion false.'),
          ttb('p → q', 'p', 'q'),
          p('Rows where both premises are true: only the first, and there q is true. Modus ponens is valid.')
        ),
        pg(
          'The shortcut: force a counterexample',
          p('Instead of a full table, try to make the **conclusion false** and **all premises true**. If impossible, the argument is valid.'),
          ex(['p → q,  q → r  ∴  p → r', 'Make p → r false:  p = T, r = F', 'p → q needs q = T;  q → r = T → F = F', 'Premise 2 fails, so no counterexample: valid.'], 'Hypothetical syllogism')
        ),
        pg(
          'Finding a counterexample',
          ex(['p ∨ q,  p  ∴  ¬q', 'p = T, q = T:  p ∨ q = T,  p = T,  but ¬q = F'], 'Invalid'),
          tip('A single counterexample row proves invalidity. Validity needs every row checked (or a clever argument).'),
          warn('If the premises are contradictory (never all true), the argument is valid, whatever the conclusion. Logicians call this “vacuous” validity.')
        ),
      ],
      [
        tf('To show an argument is invalid, find a row where all premises are true and the conclusion is false.', true, 'That row is a counterexample.'),
        mcq('For “p → q, ¬p ∴ ¬q”, which row is a counterexample?', ['p = T, q = T', 'p = F, q = T', 'p = T, q = F', 'p = F, q = F'], 1, 'p → q is true, ¬p is true, but ¬q is false.'),
        mcq('How many rows must be checked in a full table for an argument using four variables?', ['4', '8', '16', '32'], 2, '2⁴ = 16.'),
        tf('An argument whose premises can never all be true is (vacuously) valid.', true, 'There is no row with true premises and a false conclusion.'),
        mcq('Is “p ∨ q, ¬p ∴ q” valid?', ['Yes', 'No'], 0, 'That is disjunctive syllogism. If p ∨ q is true and p is false, q must be true.'),
        mcq('For “p → q, q → r ∴ r → p”, which row is a counterexample?', ['p = F, q = F, r = T', 'p = T, q = T, r = T', 'p = T, q = F, r = F', 'p = F, q = F, r = F'], 0, 'Premises: F→F = T and F→T = T. Conclusion r → p = T → F = F.'),
      ]
    ),
    lesson(
      'inf-2',
      'The Core Rules',
      'construct-outline',
      'Modus ponens, tollens, syllogisms and friends.',
      6,
      [
        pg(
          'The four conditional/disjunctive rules',
          rule('Modus ponens (MP)', ['p → q', 'p'], 'q'),
          rule('Modus tollens (MT)', ['p → q', '¬q'], '¬p'),
          rule('Hypothetical syllogism (HS)', ['p → q', 'q → r'], 'p → r'),
          rule('Disjunctive syllogism (DS)', ['p ∨ q', '¬p'], 'q')
        ),
        pg(
          'Three rules for ∧ and ∨',
          rule('Simplification (Simp)', ['p ∧ q'], 'p'),
          rule('Conjunction (Conj)', ['p', 'q'], 'p ∧ q'),
          rule('Addition (Add)', ['p'], 'p ∨ q'),
          tip('Addition looks odd, but if p is true then “p or anything” is certainly true.')
        ),
        pg(
          'Chaining rules',
          ex(['1. p → q          premise', '2. q → r          premise', '3. p                premise', '4. q                MP 1, 3', '5. r                MP 2, 4'], 'A mini derivation'),
          p('Each line is either a premise or follows from earlier lines by a rule.')
        ),
      ],
      [
        match('Match each argument form to its rule.', [['p → q, p ∴ q', 'Modus ponens'], ['p → q, ¬q ∴ ¬p', 'Modus tollens'], ['p → q, q → r ∴ p → r', 'Hypothetical syllogism'], ['p ∨ q, ¬p ∴ q', 'Disjunctive syllogism']], 'These four are the workhorses of propositional proofs.'),
        mcq('From “p ∧ q” which rule gives “p” ?', ['Addition', 'Simplification', 'Conjunction', 'Modus ponens'], 1, 'Simplification extracts a conjunct.'),
        mcq('From “p” alone, which of these follows by Addition?', ['p ∧ q', 'p ∨ q', 'p → q', 'q'], 1, 'If p is true, p ∨ q is true for any q.'),
        order('Order these lines to complete the derivation of r from premises p → q, q → r and p.', ['p → q (premise)', 'q → r (premise)', 'p (premise)', 'q (MP 1,3)', 'r (MP 2,4)'], 'Derive q first, then r.'),
        tf('From “p ∨ q” and “p” you may conclude “¬q”.', false, 'That is the fallacy of affirming a disjunct. Both can be true.'),
        mcq('What follows from “¬q” and “p → q” ?', ['¬p', 'p', 'q', 'Nothing'], 0, 'Modus tollens.'),
      ]
    ),
    lesson(
      'inf-3',
      'Dilemmas & Resolution',
      'git-compare-outline',
      'Rules with two branches, and the engine behind automated provers.',
      6,
      [
        pg(
          'Constructive dilemma',
          rule('Constructive dilemma (CD)', ['p → q', 'r → s', 'p ∨ r'], 'q ∨ s'),
          ex(['If I study I pass; if I cheat I get caught.', 'I will study or cheat.', '∴ I will pass or get caught.'], 'Two ways forward')
        ),
        pg(
          'Destructive dilemma',
          rule('Destructive dilemma (DD)', ['p → q', 'r → s', '¬q ∨ ¬s'], '¬p ∨ ¬r'),
          p('It is modus tollens applied to two conditionals at once.')
        ),
        pg(
          'Resolution',
          rule('Resolution', ['p ∨ q', '¬p ∨ r'], 'q ∨ r'),
          p('Whichever way p goes, one of the clauses forces the remainder. Disjunctive syllogism is the special case when one clause is just ¬p.'),
          tip('A single rule, resolution, is enough (on clauses) to refute any unsatisfiable set. Advanced Logic returns to this.')
        ),
      ],
      [
        mcq('“If it rains I take a coat; if it’s sunny I take a hat. It rains or it’s sunny. ∴ …”', ['I take a coat and a hat', 'I take a coat or a hat', 'It is cloudy', 'Nothing follows'], 1, 'Constructive dilemma.'),
        mcq('Resolving “p ∨ q” and “¬p ∨ r” gives…', ['q ∨ r', 'p ∨ r', 'q ∧ r', 'p ∨ q ∨ r'], 0, 'The clashing literals p and ¬p are removed.'),
        tf('Disjunctive syllogism is a special case of resolution.', true, 'Resolve p ∨ q with the unit clause ¬p to get q.'),
        mcq('Destructive dilemma concludes…', ['q ∨ s', '¬p ∨ ¬r', 'p ∨ r', '¬q ∨ ¬s'], 1, 'From the denial of consequents it concludes the denial of an antecedent.'),
        multi('Which of these are valid rules?', ['p → q, r → s, p ∨ r ∴ q ∨ s', 'p → q, q ∴ p', 'p ∨ q, ¬p ∴ q', 'p ∨ q, p ∴ ¬q'], [0, 2], 'Constructive dilemma and disjunctive syllogism are valid; the others are fallacies.'),
        mcq('Resolving “¬p ∨ q” with “p” yields…', ['q', '¬q', 'p ∧ q', 'Nothing'], 0, 'This is modus ponens in clause form.'),
      ]
    ),
  ]
);

/* =========================================================================
   INTERMEDIATE · UNIT 3 — Proof Methods
   ========================================================================= */
export const proofsUnit = unit(
  'proofs',
  1,
  'Proof Methods',
  'document-text-outline',
  330,
  'Direct, conditional, indirect and mathematical proofs.',
  [
    lesson(
      'proof-1',
      'Direct Proofs',
      'footsteps-outline',
      'Numbered lines and justified steps.',
      6,
      [
        pg(
          'Anatomy of a proof',
          p('A formal proof is a numbered list. Each line is a **premise** or follows from earlier lines by a **named rule**, which is cited with the line numbers used.'),
          ex(['1. p → q        premise', '2. q → r        premise', '3. p ∧ s        premise', 'Goal: r ∧ s'], 'Setup')
        ),
        pg(
          'Completing it',
          ex(['4. p            Simp 3', '5. q            MP 1, 4', '6. r            MP 2, 5', '7. s            Simp 3', '8. r ∧ s        Conj 6, 7'], 'A direct proof')
        ),
        pg(
          'Strategy',
          list('**Work backwards:** what rule could produce the goal?', 'Split conjunctions with **Simp** early.', 'Use **DS** or **MP** to eliminate connectives.', 'Combine with **Conj** at the end.'),
          tip('If you are stuck, write the goal at the bottom and ask “what would I need to have just before?”.')
        ),
      ],
      [
        order('Order the proof of r ∧ s from p → q, q → r, p ∧ s.', ['p (Simp)', 'q (MP)', 'r (MP)', 's (Simp)', 'r ∧ s (Conj)'], 'p first, then q, r; separately s; finally conjoin.'),
        mcq('In the proof above, line 5 “q” is justified by…', ['Simp 3', 'MP 1, 4', 'MT 1, 4', 'HS 1, 2'], 1, 'Line 1 is p → q and line 4 is p, so modus ponens gives q.'),
        mcq('Premises: p ∨ q, ¬p, q → r. What can you prove?', ['r', '¬r', 'p', 'Nothing'], 0, 'DS gives q, then MP gives r.'),
        tf('Every line in a proof must be a premise or follow from earlier lines by a rule.', true, 'Otherwise it is not justified.'),
        mcq('Premises: p → q, ¬q, r ∨ p. Goal: r. First step?', ['¬p (MT 1,2)', 'q (MP)', 'r (Add)', 'p (DS)'], 0, 'MT gives ¬p, then DS with r ∨ p gives r.'),
        mcq('Which rule justifies “p” from “p ∧ q” ?', ['Addition', 'Simplification', 'Conjunction', 'Resolution'], 1, 'Simplification.'),
      ]
    ),
    lesson(
      'proof-2',
      'Conditional & Indirect Proof',
      'git-network-outline',
      'Assume something to see what follows.',
      7,
      [
        pg(
          'Conditional proof (CP)',
          p('To prove **p → q**, temporarily **assume p**, derive **q**, then **discharge** the assumption to conclude p → q.'),
          ex(['1. p → q         premise', '2. q → r         premise', '3.   p            assume (for CP)', '4.   q            MP 1, 3', '5.   r            MP 2, 4', '6. p → r         CP 3–5'], 'Hypothetical syllogism re-proved')
        ),
        pg(
          'Indirect proof (reductio)',
          p('To prove **φ**, assume **¬φ** and derive a **contradiction**. Then φ must hold.'),
          ex(['1. p → q         premise', '2. ¬q              premise', '3.   p             assume (for reductio)', '4.   q             MP 1, 3', '5.   q ∧ ¬q         Conj 2, 4', '6. ¬p              Reductio 3–5'], 'Modus tollens from scratch')
        ),
        pg(
          'Proof by cases',
          rule('Proof by cases', ['p ∨ q', 'p → r', 'q → r'], 'r'),
          p('If each possibility leads to r, then r follows no matter which holds.'),
          tip('Assumptions made inside a sub-proof cannot be used after it is closed.')
        ),
      ],
      [
        mcq('To prove “p → q” by conditional proof you…', ['Assume q and derive p', 'Assume p and derive q', 'Assume ¬p and derive q', 'Prove p and q separately'], 1, 'Assume the antecedent, derive the consequent.'),
        mcq('Indirect proof of φ starts by assuming…', ['φ', '¬φ', 'a premise', 'a tautology'], 1, 'Assume the negation and look for a contradiction.'),
        tf('After closing a sub-proof, you can still use its temporary assumption on later lines.', false, 'The assumption is discharged; lines inside the sub-proof are no longer available.'),
        mcq('Which proof method proves “r” from p ∨ q, p → r, q → r ?', ['Proof by cases', 'Conditional proof', 'Addition', 'Simplification'], 0, 'Each disjunct leads to r.'),
        order('Order the steps of a reductio proof.', ['Assume the negation of the goal', 'Derive consequences', 'Reach a contradiction', 'Discharge the assumption', 'Conclude the goal'], 'Assume, derive, contradict, discharge, conclude.'),
        mcq('A contradiction looks like…', ['p ∨ ¬p', 'p ∧ ¬p', 'p → p', 'p ↔ p'], 1, 'Both a statement and its negation.'),
      ]
    ),
    lesson(
      'proof-3',
      'Mathematical Proof Styles',
      'calculator-outline',
      'Contrapositive, contradiction, counterexample and induction.',
      7,
      [
        pg(
          'Contrapositive and counterexample',
          p('To prove **p → q**, you may prove its contrapositive **¬q → ¬p** instead.'),
          ex(['Claim: if n² is even, n is even.', 'Contrapositive: if n is odd, n² is odd.', 'n = 2k + 1  ⇒  n² = 4k² + 4k + 1 = 2(2k² + 2k) + 1, odd.'], 'Example'),
          p('To disprove a universal claim (“for all x…”), one **counterexample** is enough.')
        ),
        pg(
          'Proof by contradiction',
          p('Assume the opposite and show it is impossible.'),
          ex(['Claim: √2 is irrational.', 'Suppose √2 = a/b in lowest terms.', 'Then a² = 2b², so a is even, a = 2c.', 'Then 4c² = 2b², so b² = 2c² and b is even.', 'Both even contradicts “lowest terms”. ∎'], 'Euclid’s style')
        ),
        pg(
          'Mathematical induction',
          list('**Base case:** prove P(1).', '**Inductive step:** assume P(k), prove P(k + 1).', 'Then P(n) holds for every n ≥ 1.'),
          ex(['P(n): 1 + 2 + … + n = n(n + 1)/2', 'Base: 1 = 1·2/2.', 'Step: assume it for k. Then 1 + … + k + (k+1) = k(k+1)/2 + (k+1) = (k+1)(k+2)/2.'], 'Sum of the first n numbers'),
          tip('Think of dominoes: the base case knocks over the first, the step makes each one knock over the next.')
        ),
      ],
      [
        mcq('To prove “if n² is even then n is even” it is easiest to prove…', ['If n is even then n² is even', 'If n is odd then n² is odd', 'n² is even', 'n is even'], 1, 'That is the contrapositive.'),
        tf('One counterexample is enough to disprove “every swan is white”.', true, 'A universal claim is refuted by a single exception.'),
        mcq('In a proof by induction, the first thing to prove is…', ['The inductive step', 'The base case', 'The conclusion', 'A contradiction'], 1, 'Without a base case the chain never starts.'),
        mcq('Proof that √2 is irrational is an example of…', ['Induction', 'Contradiction', 'Counterexample', 'Conditional proof'], 1, 'Assume it is rational and derive a contradiction.'),
        mcq('The inductive step assumes P(k) and proves…', ['P(k − 1)', 'P(k + 1)', 'P(1)', 'P(2k)'], 1, 'If it holds for k, it holds for the next number.'),
        tf('An inductive proof needs both a base case and an inductive step.', true, 'Each is necessary.'),
      ]
    ),
  ]
);
