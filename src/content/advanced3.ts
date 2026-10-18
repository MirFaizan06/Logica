import { cmp, ex, lesson, list, match, mcq, p, pg, rule, sym, tf, tip, unit, warn } from './helpers';

/* =========================================================================
   ADVANCED · UNIT 7 — Logic in Computing
   ========================================================================= */
export const computingUnit = unit(
  'computing-logic',
  2,
  'Logic in Computing',
  'terminal-outline',
  215,
  'Program correctness, types, logic programming and ontologies.',
  [
    lesson(
      'comp-1',
      'Hoare Logic',
      'checkmark-done-outline',
      'Proving that a program does what it should.',
      8,
      [
        pg(
          'Hoare triples',
          p('A **Hoare triple** {P} C {Q} says: if the **precondition** P holds before running command C, then the **postcondition** Q holds afterwards (if C terminates).'),
          ex(['{ x ≥ 0 }   y := x + 1   { y > 0 }'], 'A valid triple')
        ),
        pg(
          'The rules',
          rule('Assignment', ['—'], '{ Q[e/x] }  x := e  { Q }'),
          ex(['To get { x > 5 } after x := x + 1, the precondition is (x + 1 > 5), that is x > 4.'], 'Work backwards: substitute e for x in Q'),
          rule('Sequence', ['{P} C₁ {R}', '{R} C₂ {Q}'], '{P} C₁; C₂ {Q}'),
          rule('While', ['{I ∧ B} body {I}'], '{I} while B do body {I ∧ ¬B}')
        ),
        pg(
          'Loop invariants',
          p('The **invariant** I is true before the loop, preserved by every iteration, and combined with the loop’s exit condition gives the result.'),
          list('Finding invariants is the creative part of verification.', '**Partial correctness** ignores termination. **Total correctness** also proves the loop ends (using a decreasing measure).'),
          tip('Weakest precondition calculus (Dijkstra) automates much of this reasoning.')
        ),
      ],
      [
        mcq('In {P} C {Q}, P is the…', ['Postcondition', 'Precondition', 'Invariant', 'Program'], 1, 'It must hold before C runs.'),
        mcq('What precondition makes { ? } x := x + 1 { x > 5 } valid?', ['x > 4', 'x > 5', 'x > 6', 'x = 5'], 0, 'Substitute x + 1 for x in the postcondition: x + 1 > 5.'),
        mcq('What precondition makes { ? } y := 2 * x { y = 10 } valid?', ['x = 10', 'x = 5', 'y = 5', 'x = 2'], 1, '2 * x = 10 means x = 5.'),
        mcq('A loop invariant is a property that…', ['Is true before and after every iteration', 'Changes each iteration', 'Is false at the end', 'Is only true on exit'], 0, 'It is preserved by the body.'),
        tf('Partial correctness guarantees that the program terminates.', false, 'Only total correctness includes termination.'),
        mcq('After a verified while loop exits, we know…', ['I ∧ B', 'I ∧ ¬B', '¬I', 'Nothing'], 1, 'The invariant still holds and the loop condition is false.'),
      ]
    ),
    lesson(
      'comp-2',
      'Lambda Calculus & Types',
      'code-slash-outline',
      'Functions as the whole of computation, and proofs as programs.',
      9,
      [
        pg(
          'The lambda calculus',
          p('Church’s λ-calculus has only variables, abstraction (functions) and application:'),
          sym(
            { sym: 'λx. M', name: 'a function with parameter x and body M' },
            { sym: 'M N', name: 'apply M to N' }
          ),
          ex(['(λx. x + 1) 5   →β   5 + 1   =   6', 'λx. x   is the identity function'], 'β-reduction'),
          p('Untyped terms can loop forever: (λx. x x)(λx. x x) reduces to itself.')
        ),
        pg(
          'Simple types',
          p('Types classify terms. A function from A to B has type **A → B**. Typed λ-calculus rules out looping and guarantees termination.')
        ),
        pg(
          'Curry–Howard',
          p('Propositions are **types**, proofs are **programs**:'),
          cmp(
            { title: 'Logic', lines: ['A → B', 'A ∧ B', 'A ∨ B', '⊥', 'modus ponens'] },
            { title: 'Programming', lines: ['function type', 'pair (product) type', 'sum (tagged union) type', 'empty type', 'function application'] }
          ),
          tip('Proof assistants such as Coq, Lean and Agda check proofs by type checking programs.')
        ),
      ],
      [
        mcq('β-reducing (λx. x + 1) 5 gives…', ['x + 1', '6', '5', 'λx. 6'], 1, 'Substitute 5 for x.'),
        mcq('Under Curry–Howard, A ∧ B corresponds to…', ['A function type', 'A pair (product) type', 'An empty type', 'A list'], 1, 'A proof of A ∧ B is a pair of proofs.'),
        tf('Under Curry–Howard, modus ponens corresponds to function application.', true, 'Apply a proof of A → B to a proof of A.'),
        mcq('What does the term (λx. x x)(λx. x x) do?', ['Returns 0', 'Reduces to itself forever', 'Is a type error', 'Returns the identity'], 1, 'It is the classic non-terminating term.'),
        match('Match each logical concept to its type-theory twin.', [['A → B', 'Function type'], ['A ∧ B', 'Pair type'], ['A ∨ B', 'Sum (tagged union) type'], ['⊥', 'Empty type']], 'This dictionary is the Curry–Howard correspondence.'),
        tf('Simply typed λ-calculus terms always terminate.', true, 'Typing rules out self-application loops.'),
      ]
    ),
    lesson(
      'comp-3',
      'Logic Programming & Knowledge Bases',
      'server-outline',
      'Prolog, Datalog, SQL and ontologies.',
      9,
      [
        pg(
          'Prolog',
          p('A Prolog program is a set of **facts** and **rules** (Horn clauses):'),
          ex(['parent(tom, bob).', 'parent(bob, ann).', 'grandparent(X, Z) :- parent(X, Y), parent(Y, Z).', '?- grandparent(tom, W).      W = ann'], 'Family tree'),
          p('The engine unifies the query with facts and rules and backtracks through alternatives.')
        ),
        pg(
          'Databases and Datalog',
          list('The **relational calculus** behind SQL is first-order logic in disguise.', '**Datalog** is Prolog without function symbols. Queries always terminate.', '**Negation as failure** and the **closed-world assumption**: what the database does not say is false.'),
          warn('SQL’s NULL gives it a three-valued logic, just like K3.')
        ),
        pg(
          'Description logics',
          p('**Description logics** (for example ALC) are decidable fragments of first-order logic designed for ontologies, the formal vocabularies behind the semantic web (OWL) and medical terminologies.'),
          list('C ⊓ D  (both concepts)  ·  C ⊔ D  (either)  ·  ¬C  (not C)', '∃R.C  (has an R-relation to some C)', '∀R.C  (all R-relations lead to C)'),
          ex(['Parent ≡ Person ⊓ ∃hasChild.Person'], 'A defined concept')
        ),
      ],
      [
        mcq('In Prolog, “grandparent(X, Z) :- parent(X, Y), parent(Y, Z).” is a…', ['Fact', 'Rule', 'Query', 'Comment'], 1, 'Head :- body is a rule.'),
        tf('SQL queries correspond to first-order logic formulas.', true, 'The relational calculus is first-order logic.'),
        mcq('Datalog differs from Prolog because it…', ['Has no function symbols', 'Has no variables', 'Is not logic', 'Allows only one fact'], 0, 'That restriction guarantees termination.'),
        mcq('In description logic, ∃hasChild.Person describes…', ['Things with some child who is a person', 'All children', 'No children', 'The empty set'], 0, 'Existential restriction.'),
        mcq('The closed-world assumption says…', ['Unknown facts are false', 'Everything is possible', 'Unknown facts are true', 'Nothing is known'], 0, 'If it is not stated, it is false.'),
        tf('Description logics are designed to be decidable.', true, 'That makes reasoning in ontologies practical.'),
      ]
    ),
  ]
);

/* =========================================================================
   ADVANCED · UNIT 8 — Paradoxes & Self-reference
   ========================================================================= */
export const paradoxesUnit = unit(
  'paradoxes',
  2,
  'Paradoxes & Self-Reference',
  'sync-circle-outline',
  340,
  'The puzzles that forced logic to grow up.',
  [
    lesson(
      'par-1',
      'The Liar & Friends',
      'chatbubbles-outline',
      'Sentences that talk about their own truth.',
      7,
      [
        pg(
          'The Liar',
          ex(['“This sentence is false.”'], 'The Liar sentence'),
          p('If it is true, then what it says holds, so it is false. If it is false, then what it says fails, so it is true. Either way: contradiction.')
        ),
        pg(
          'Relatives',
          list('**Truth-teller:** “This sentence is true.” Consistent as true or as false, so nothing decides it.', '**Curry’s paradox:** “If this sentence is true, then 1 = 0.” Leads to proving anything, without using negation.', '**Yablo:** an infinite list where each sentence says all later ones are false.')
        ),
        pg(
          'Responses',
          list('**Tarski:** truth for a language cannot be defined within it. Use a hierarchy of metalanguages.', '**Kripke:** allow truth-value gaps; Liar is neither true nor false.', '**Dialetheism (Priest):** the Liar is both true and false; use a paraconsistent logic.'),
          tip('Gödel’s theorem uses “this sentence is provable” in place of “this sentence is true”, which avoids paradox.')
        ),
      ],
      [
        mcq('If the Liar sentence is true, then…', ['It is true', 'It is false', 'It is both and consistent', 'It is a tautology'], 1, 'It says it is false, so it must be false.'),
        mcq('“This sentence is true” is called the…', ['Liar', 'Truth-teller', 'Curry sentence', 'Gödel sentence'], 1, 'It is consistent with both values.'),
        match('Match response to its proposer.', [['Hierarchy of languages', 'Tarski'], ['Truth-value gaps', 'Kripke'], ['True contradictions', 'Priest'], ['Provability instead of truth', 'Gödel']], 'Each author handled the Liar differently.'),
        tf('Curry’s paradox needs negation.', false, 'It uses only the conditional.'),
        mcq('Tarski’s solution says that truth for a language L…', ['Is definable in L', 'Cannot be defined in L itself', 'Does not exist', 'Is always true'], 1, 'It needs a stronger metalanguage.'),
        tf('Dialetheists accept that some contradictions are true.', true, 'That is the definition of dialetheism.'),
      ]
    ),
    lesson(
      'par-2',
      'Russell’s Paradox & Sets',
      'albums-outline',
      'Why “collect everything with property P” broke mathematics.',
      8,
      [
        pg(
          'Naive comprehension',
          p('Frege assumed that **any property defines a set**: {x | P(x)}.'),
          p('Russell (1901) took P(x) to be “x is not a member of itself”. Let R = {x | x ∉ x}.'),
          ex(['Is R ∈ R ?', 'If R ∈ R then R ∉ R.', 'If R ∉ R then R ∈ R.'], 'Contradiction either way')
        ),
        pg(
          'Barber version',
          p('“The barber shaves exactly those who do not shave themselves.” Does the barber shave himself? If yes, he doesn’t; if no, he does. So no such barber exists. Likewise no such set exists.')
        ),
        pg(
          'The repairs',
          list('**Zermelo–Fraenkel set theory (ZF/ZFC):** replace unrestricted comprehension by **separation**: you may carve a subset out of an existing set.', '**Type theory (Russell, later Church):** objects have levels and a set can only contain lower-level objects.', '**Cantor’s theorem:** for any set A, its power set has strictly more elements. Proof by diagonalisation: no function can map A onto its subsets.'),
          tip('The same diagonal trick appears in Cantor’s theorem, the halting problem and Gödel’s theorem.')
        ),
      ],
      [
        mcq('Russell’s set R is defined as…', ['The set of all sets', 'The set of all sets that do not contain themselves', 'The empty set', 'The set of numbers'], 1, 'R = {x | x ∉ x}.'),
        mcq('Russell’s paradox shows that…', ['Naive comprehension is inconsistent', 'All sets are finite', 'The empty set does not exist', 'Truth is relative'], 0, 'Not every property defines a set.'),
        mcq('ZF set theory avoids the paradox by using…', ['Separation instead of unrestricted comprehension', 'Fuzzy logic', 'More truth values', 'Infinitely many sets only'], 0, 'You may only form subsets of an existing set.'),
        tf('Cantor’s theorem says the power set of A is bigger than A.', true, 'There is always a strict increase in size, even for infinite sets.'),
        mcq('Which technique does Cantor’s theorem use?', ['Diagonalisation', 'Truth tables', 'Resolution', 'Induction'], 0, 'The same method as Gödel and Turing.'),
        tf('The barber paradox is a story version of Russell’s paradox.', true, 'Both involve a self-referential condition that cannot be satisfied.'),
      ]
    ),
    lesson(
      'par-3',
      'Sorites, Surprise & Ravens',
      'help-buoy-outline',
      'Vagueness, expectation and confirmation.',
      8,
      [
        pg(
          'The sorites (heap) paradox',
          list('1 grain of sand is not a heap.', 'If n grains are not a heap, n + 1 grains are not a heap.', 'Therefore, 1,000,000 grains are not a heap.'),
          p('The argument looks valid, with plausible premises, and a false conclusion. Responses: **epistemicism** (there is a sharp but unknowable cut-off), **supervaluationism**, **fuzzy logic** (degrees of heapness), **contextualism**.')
        ),
        pg(
          'The surprise exam',
          p('A teacher announces: “There will be an exam next week, on a day you will not expect.” Students reason backwards: it cannot be Friday (they’d know by Thursday night), so not Thursday, and so on until every day is eliminated. Then the exam happens on Wednesday, to their surprise.'),
          tip('The paradox is a study in self-referential knowledge and is still debated in epistemic logic.')
        ),
        pg(
          'Hempel’s ravens',
          p('“All ravens are black” is logically equivalent to “All non-black things are non-ravens”. A white shoe is a non-black non-raven, so it confirms the second statement and hence the first?'),
          p('Many accept that it confirms it, but only by a tiny amount, since there are vastly more non-black things than ravens.')
        ),
      ],
      [
        mcq('The sorites paradox is about…', ['Vagueness', 'Set membership', 'Probability', 'Modal necessity'], 0, 'There is no sharp boundary for “heap”.'),
        match('Match each paradox with its topic.', [['Sorites', 'Vague predicates'], ['Surprise exam', 'Knowledge and expectation'], ['Ravens', 'Confirmation'], ['Liar', 'Self-reference']], 'Each exposes a different weakness in our reasoning tools.'),
        mcq('Which approach models “heap” with degrees of truth?', ['Fuzzy logic', 'Natural deduction', 'Resolution', 'Hoare logic'], 0, 'Truth values between 0 and 1.'),
        tf('“All ravens are black” is logically equivalent to “All non-black things are non-ravens”.', true, 'Contrapositive of ∀x (Raven(x) → Black(x)).'),
        mcq('In the surprise exam story the students reason backwards from…', ['Monday', 'Friday', 'The weekend', 'Wednesday'], 1, 'They eliminate the last day first.'),
        mcq('Why does a white shoe confirm “all ravens are black” only slightly?', ['It does not confirm at all', 'There are vastly many non-black non-ravens', 'Shoes are never white', 'The statement is false'], 1, 'Each observation is a tiny fraction of the evidence needed.'),
      ]
    ),
  ]
);
