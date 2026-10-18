import { cmp, ex, lesson, list, match, mcq, order, p, pg, rule, sym, tf, tip, unit, warn } from './helpers';

/* =========================================================================
   ADVANCED · UNIT 1 — Advanced Predicate Logic
   ========================================================================= */
export const predicate2Unit = unit(
  'predicate-2',
  2,
  'First-Order Logic in Depth',
  'infinite-outline',
  265,
  'Nested quantifiers, identity, models and quantifier rules.',
  [
    lesson(
      'fol-1',
      'Nested Quantifiers',
      'layers-outline',
      'Why the order of quantifiers matters.',
      7,
      [
        pg(
          'Order changes meaning',
          cmp(
            { title: '∀x ∃y Loves(x, y)', lines: ['Everyone loves someone.', 'The beloved can differ from person to person.'] },
            { title: '∃y ∀x Loves(x, y)', lines: ['Someone is loved by everyone.', 'One single person is adored by all.'] }
          ),
          ex(['Over the integers:', '∀x ∃y (y > x)   true: pick y = x + 1', '∃y ∀x (y > x)   false: no integer exceeds all integers'], 'Numbers')
        ),
        pg(
          'What commutes and what does not',
          list('∀x ∀y φ ≡ ∀y ∀x φ', '∃x ∃y φ ≡ ∃y ∃x φ', '∃y ∀x φ **entails** ∀x ∃y φ', '∀x ∃y φ does **not** entail ∃y ∀x φ'),
          tip('If one y works for every x, then certainly each x has a y. The converse needs the y to be chosen once and for all.')
        ),
        pg(
          'Translating and negating',
          ex(['“Everyone has a mother.”  ∀x ∃y Mother(y, x)', '“Someone is everyone’s friend.”  ∃y ∀x Friend(y, x)'], 'Translations'),
          p('Negation walks through the quantifiers one at a time, flipping each:'),
          ex(['¬∀x ∃y Loves(x, y)', '≡ ∃x ¬∃y Loves(x, y)', '≡ ∃x ∀y ¬Loves(x, y)'], 'Someone loves nobody')
        ),
      ],
      [
        mcq('Which formula says “someone is loved by everyone”?', ['∀x ∃y Loves(x, y)', '∃y ∀x Loves(x, y)', '∃x ∀y Loves(x, y)', '∀y ∃x Loves(x, y)'], 1, 'One y is fixed first, and every x loves that y.'),
        tf('Over the integers, ∀x ∃y (y > x) is true.', true, 'For any x choose y = x + 1.'),
        tf('Over the integers, ∃y ∀x (y > x) is true.', false, 'No integer is larger than every integer (including itself).'),
        mcq('Which entailment holds?', ['∀x ∃y R(x,y) ⊨ ∃y ∀x R(x,y)', '∃y ∀x R(x,y) ⊨ ∀x ∃y R(x,y)', 'Both', 'Neither'], 1, 'A single universal witness works for each x.'),
        mcq('The negation of ∀x ∃y Loves(x, y) is equivalent to…', ['∀x ∀y ¬Loves(x, y)', '∃x ∀y ¬Loves(x, y)', '∃x ∃y ¬Loves(x, y)', '∀x ∃y ¬Loves(x, y)'], 1, 'Flip each quantifier: some x loves nobody.'),
        tf('∀x ∀y φ(x, y) is equivalent to ∀y ∀x φ(x, y).', true, 'Quantifiers of the same kind commute.'),
      ]
    ),
    lesson(
      'fol-2',
      'Identity & Counting',
      'calculator-outline',
      'Using = to count and to describe.',
      7,
      [
        pg(
          'Counting with identity',
          sym(
            { sym: '∃x ∃y (x ≠ y ∧ P(x) ∧ P(y))', name: 'at least two P' },
            { sym: '∀x ∀y (P(x) ∧ P(y) → x = y)', name: 'at most one P' },
            { sym: '∃x (P(x) ∧ ∀y (P(y) → y = x))', name: 'exactly one P' }
          ),
          p('Without “=”, first-order logic cannot distinguish “one” from “two”.')
        ),
        pg(
          'Definite descriptions',
          p('Russell analysed “The King of France is bald” as three claims joined: there is a king, there is only one, and he is bald.'),
          ex(['∃x (King(x) ∧ ∀y (King(y) → y = x) ∧ Bald(x))'], 'Russell’s analysis'),
          p('Since there is no King of France, the sentence is simply **false**, rather than mysteriously neither true nor false.')
        ),
        pg(
          'Superlatives and exceptions',
          ex(['“Ann is taller than everyone else.”', '∀x (x ≠ a → Taller(a, x))', '', '“Only Sam passed.”', 'Passed(s) ∧ ∀x (Passed(x) → x = s)'], 'Patterns'),
          tip('“Everyone else” needs x ≠ a, otherwise Ann would have to be taller than herself.')
        ),
      ],
      [
        mcq('“There are at least two P.” is…', ['∃x ∃y (x ≠ y ∧ P(x) ∧ P(y))', '∃x P(x)', '∀x ∀y (P(x) ∧ P(y) → x = y)', '∃x ∀y (P(y) → y = x)'], 0, 'Two distinct witnesses.'),
        mcq('“At most one P.” is…', ['∃x ∃y (x ≠ y ∧ P(x) ∧ P(y))', '∀x ∀y (P(x) ∧ P(y) → x = y)', '∃x P(x)', '¬∃x P(x)'], 1, 'Any two P’s must be identical.'),
        mcq('“Exactly one P.” is…', ['∃x (P(x) ∧ ∀y (P(y) → y = x))', '∃x P(x)', '∀x P(x)', '∃x ∃y (P(x) ∧ P(y))'], 0, 'Existence plus uniqueness.'),
        tf('On Russell’s analysis, “The King of France is bald” is false.', true, 'The existence clause fails.'),
        mcq('“Only Sam passed.”', ['Passed(s) ∧ ∀x (Passed(x) → x = s)', '∃x Passed(x)', '∀x Passed(x)', 'Passed(s) → ∀x Passed(x)'], 0, 'Sam passed and nobody else did.'),
        mcq('“Ann is taller than everyone else.”', ['∀x (x ≠ a → Taller(a, x))', '∀x Taller(a, x)', '∃x Taller(a, x)', '∀x (Taller(a, x) → x = a)'], 0, 'Exclude Ann herself from the comparison.'),
      ]
    ),
    lesson(
      'fol-3',
      'Models & Validity',
      'cube-outline',
      'Interpretations, countermodels and undecidability.',
      8,
      [
        pg(
          'Structures',
          p('A **model** (or structure) gives meaning to a first-order sentence: a **domain** of objects and an **interpretation** of every predicate, function and constant symbol.'),
          ex(['Domain D = {1, 2, 3}', 'R interpreted as “<”', '∀x ∃y R(x, y) is false in this model (3 has no larger element).'], 'A tiny model')
        ),
        pg(
          'Validity and countermodels',
          list('**Valid:** true in **every** model.', '**Satisfiable:** true in **some** model.', '**Entailment Γ ⊨ φ:** every model of Γ is a model of φ.'),
          ex(['To show ∀x ∃y R(x,y) ⊭ ∃y ∀x R(x,y):', 'D = {1, 2},  R = {(1,2), (2,1)}', 'Every x relates to some y, but no single y is related to by all x.'], 'A countermodel'),
          tip('To show invalidity, build one model. To show validity, you must argue about all models, or give a proof.')
        ),
        pg(
          'Limits',
          list('Propositional validity is **decidable** (truth tables).', 'First-order validity is **undecidable** (Church and Turing, 1936).', 'It is **semi-decidable**: if a sentence is valid, a proof search will eventually find a proof; if not, it may run forever.', 'Special fragments, such as monadic logic (only one-place predicates), are decidable.')
        ),
      ],
      [
        mcq('A first-order sentence true in every model is…', ['Satisfiable only', 'Valid', 'Contradictory', 'Contingent'], 1, 'Validity means true under all interpretations.'),
        tf('One countermodel is enough to show that an inference is invalid.', true, 'It satisfies the premises but not the conclusion.'),
        mcq('In the model D = {1, 2}, R = {(1,2),(2,1)}, ∀x ∃y R(x, y) is…', ['True', 'False'], 0, '1 relates to 2 and 2 relates to 1.'),
        mcq('In that same model, ∃y ∀x R(x, y) is…', ['True', 'False'], 1, 'y = 1 fails for x = 1 and y = 2 fails for x = 2.'),
        tf('Validity of first-order sentences is decidable.', false, 'It is only semi-decidable (Church–Turing).'),
        mcq('Which is decidable?', ['Propositional validity', 'Validity of all first-order sentences', 'The halting problem', 'None'], 0, 'Truth tables give an algorithm.'),
      ]
    ),
    lesson(
      'fol-4',
      'Quantifier Rules',
      'key-outline',
      'Instantiating and generalising in proofs.',
      8,
      [
        pg(
          'Using “all” and building “exists”',
          rule('Universal instantiation (UI)', ['∀x φ(x)'], 'φ(c)'),
          rule('Existential generalisation (EG)', ['φ(c)'], '∃x φ(x)'),
          ex(['1. ∀x (Human(x) → Mortal(x))   premise', '2. Human(s)                      premise', '3. Human(s) → Mortal(s)         UI 1', '4. Mortal(s)                      MP 2, 3', '5. ∃x Mortal(x)                   EG 4'], 'Socrates')
        ),
        pg(
          'The careful rules',
          rule('Existential instantiation (EI)', ['∃x φ(x)'], 'φ(a)   with a a NEW name'),
          rule('Universal generalisation (UG)', ['φ(a)   with a arbitrary'], '∀x φ(x)'),
          warn('UG is only allowed when a is truly arbitrary: it must not occur in any undischarged assumption. “Someone is tall, so everyone is tall” is the typical mistake.')
        ),
        pg(
          'Worked example',
          ex(['1. ∀x (P(x) → Q(x))   premise', '2. ∃x P(x)             premise', '3. P(a)                 EI 2 (a is new)', '4. P(a) → Q(a)         UI 1', '5. Q(a)                 MP 3, 4', '6. ∃x Q(x)             EG 5'], 'From all P are Q and some P exist to some Q exists')
        ),
      ],
      [
        mcq('From ∀x P(x) you may infer…', ['P(c) for any term c', '∃x ¬P(x)', 'P(a) only for a new a', 'Nothing'], 0, 'Universal instantiation.'),
        mcq('From P(c) you may infer…', ['∀x P(x)', '∃x P(x)', '¬P(c)', 'Nothing'], 1, 'Existential generalisation.'),
        mcq('When using existential instantiation the new name must be…', ['Any previously used name', 'A fresh name not used earlier', 'A variable bound elsewhere', 'The same as in the conclusion'], 1, 'Otherwise you would smuggle in unjustified information.'),
        tf('From “Socrates is wise” you may conclude “Everyone is wise” by universal generalisation.', false, 'Socrates is a specific individual, not an arbitrary one.'),
        order('Order the proof of ∃x Q(x) from ∀x(P → Q) and ∃x P(x).', ['∃x P(x) (premise)', 'P(a) (EI)', 'P(a) → Q(a) (UI)', 'Q(a) (MP)', '∃x Q(x) (EG)'], 'Instantiate the existential first, then use the universal for the same a.'),
        mcq('Which step is illegal?', ['UI from ∀x P(x) to P(7)', 'EG from P(7) to ∃x P(x)', 'UG from P(7) to ∀x P(x), 7 is a premise-named constant', 'EI to a fresh a'], 2, 'UG needs an arbitrary name, not a specific constant given in the premises.'),
      ]
    ),
  ]
);

/* =========================================================================
   ADVANCED · UNIT 2 — Natural Deduction & Resolution
   ========================================================================= */
export const deductionUnit = unit(
  'deduction',
  2,
  'Deduction, Resolution & SAT',
  'git-pull-request-outline',
  240,
  'Formal proof systems and how machines prove theorems.',
  [
    lesson(
      'nd-1',
      'Natural Deduction (Fitch Style)',
      'list-outline',
      'Introduction and elimination rules.',
      8,
      [
        pg(
          'Intro and elim for every connective',
          sym(
            { sym: '∧I / ∧E', name: 'From p and q infer p ∧ q / from p ∧ q infer p (or q)' },
            { sym: '∨I / ∨E', name: 'From p infer p ∨ q / cases: p ∨ q, p ⊢ r, q ⊢ r gives r' },
            { sym: '→I / →E', name: 'Subproof assume p … q gives p → q / modus ponens' },
            { sym: '¬I / ¬E', name: 'Assume p … ⊥ gives ¬p / from p and ¬p infer ⊥' },
            { sym: '⊥E', name: 'From ⊥ infer anything' }
          )
        ),
        pg(
          'Subproofs',
          p('In Fitch style, a vertical bar marks an assumption’s scope.'),
          ex(['1 |  p              assume', '2 | |  q             assume', '3 | |  p             reiterate 1', '4 |  q → p          →I 2–3', '5 p → (q → p)       →I 1–4'], 'A theorem: p → (q → p)')
        ),
        pg(
          'Disjunctive syllogism derived',
          ex(['1. p ∨ q        premise', '2. ¬p           premise', '3.   p          assume', '4.   ⊥          ¬E 2, 3', '5.   q          ⊥E 4', '6.   q          assume', '7.   q          reiterate', '8. q             ∨E 1, 3–5, 6–7'], 'Both cases give q'),
          tip('Learn each rule as a pair: how to build a connective, and how to use one.')
        ),
      ],
      [
        match('Match the rule with its job.', [['∧I', 'Combine two lines'], ['→I', 'Discharge an assumption'], ['∨E', 'Reason by cases'], ['⊥E', 'From absurdity, anything']], 'Each rule either builds or uses a connective.'),
        mcq('From p you may derive p ∨ q by…', ['∨E', '∨I', '→E', '¬I'], 1, 'Or-introduction.'),
        mcq('To prove ¬p by ¬I you…', ['Assume p and derive ⊥', 'Assume ¬p and derive p', 'Derive p ∧ q', 'Use ∨E'], 0, 'Assume p, reach a contradiction, conclude ¬p.'),
        tf('Lines inside a closed subproof may be used after the subproof ends.', false, 'Only the discharged result (like q → p) may be used afterwards.'),
        mcq('Which rule is modus ponens in natural deduction?', ['→I', '→E', '∧E', '¬E'], 1, 'Conditional elimination.'),
        tf('From ⊥ you may infer any formula.', true, 'Ex falso quodlibet.'),
      ]
    ),
    lesson(
      'nd-2',
      'Resolution Refutation',
      'contract-outline',
      'Proving by deriving the empty clause.',
      8,
      [
        pg(
          'Proof by refutation',
          p('To show **KB ⊨ φ**, show that **KB ∧ ¬φ is unsatisfiable**. The tool is **resolution** on clauses (CNF).'),
          rule('Resolution', ['A ∨ x', '¬x ∨ B'], 'A ∨ B'),
          p('Deriving the **empty clause** □ means a contradiction.')
        ),
        pg(
          'Example',
          ex(['KB:  p → q,  q → r,  p.    Prove: r.', 'Clauses:', '1. ¬p ∨ q', '2. ¬q ∨ r', '3. p', '4. ¬r      (negated goal)', '5. q      resolve 1, 3', '6. r      resolve 2, 5', '7. □       resolve 4, 6'], 'Refutation'),
          tip('All premises plus the negated goal become clauses. Then keep resolving until □ appears.')
        ),
        pg(
          'Properties',
          list('**Sound:** if □ is derived, the clause set is unsatisfiable.', '**Refutation-complete:** if the set is unsatisfiable, □ can be derived.', 'Search can blow up exponentially; strategies such as unit preference and set-of-support help.')
        ),
      ],
      [
        mcq('To show KB ⊨ φ by refutation you show that…', ['KB ∧ φ is satisfiable', 'KB ∧ ¬φ is unsatisfiable', 'φ is a tautology', 'KB is a tautology'], 1, 'If the negated goal clashes with KB, φ must follow.'),
        mcq('Resolving “p ∨ q” and “¬p ∨ r” gives…', ['q ∨ r', 'p ∨ r', 'q ∧ r', '□'], 0, 'Remove the clashing pair.'),
        mcq('Resolving “p” and “¬p” gives…', ['p', '¬p', '□ (the empty clause)', 'q'], 2, 'Unit clauses that clash produce the empty clause.'),
        tf('Deriving the empty clause shows the clause set is unsatisfiable.', true, 'The empty clause is a contradiction.'),
        tf('Resolution refutation is complete for propositional logic.', true, 'Every unsatisfiable set has a refutation.'),
        mcq('Which step comes first when using resolution?', ['Convert premises and negated goal to CNF', 'Build a truth table', 'Skolemise', 'Apply modus tollens'], 0, 'Resolution works on clauses.'),
      ]
    ),
    lesson(
      'nd-3',
      'SAT & DPLL',
      'search-circle-outline',
      'The problem that powers modern verification.',
      7,
      [
        pg(
          'The satisfiability problem',
          p('**SAT:** given a formula (in CNF), is there a truth assignment making it true? It was the **first NP-complete problem** (Cook, 1971; Levin independently).'),
          p('If SAT could be solved quickly (in polynomial time), thousands of other hard problems could be too: this is the **P versus NP** question.')
        ),
        pg(
          'DPLL',
          list('**Unit propagation:** a clause with one literal left forces its value.', '**Pure literal elimination:** a variable that always appears with one sign can be set to satisfy those clauses.', '**Branch and backtrack:** guess a variable, recurse, undo on conflict.'),
          ex(['Clauses: {p}, {¬p ∨ q}, {¬q ∨ r}', 'p is a unit → p = T', '¬p ∨ q becomes {q} → q = T', '¬q ∨ r becomes {r} → r = T', 'Satisfiable: p = q = r = T'], 'Propagation does everything')
        ),
        pg(
          'Why it matters',
          p('Modern solvers (CDCL) handle millions of clauses. They verify chips and software, schedule exams, resolve package dependencies and solve Sudoku.'),
          tip('Many hard problems are “encoded into SAT” and handed to a solver.')
        ),
      ],
      [
        mcq('SAT asks…', ['Is this formula a tautology?', 'Is there an assignment that makes it true?', 'Is it in DNF?', 'How many rows does it have?'], 1, 'Satisfiability.'),
        mcq('SAT was the first problem shown to be…', ['Undecidable', 'NP-complete', 'In P', 'Unsolvable'], 1, 'Cook–Levin theorem.'),
        mcq('In DPLL, a clause containing a single unassigned literal forces that literal. This is called…', ['Pure literal rule', 'Unit propagation', 'Backtracking', 'Distribution'], 1, 'Unit propagation.'),
        tf('DPLL may need to backtrack when a guess leads to a conflict.', true, 'Branching and undoing is part of the algorithm.'),
        mcq('Which is a real-world use of SAT solvers?', ['Hardware verification', 'Package dependency solving', 'Scheduling', 'All of these'], 3, 'They appear in all of them.'),
        tf('If SAT is solvable in polynomial time then P = NP.', true, 'SAT is NP-complete, so a fast algorithm would settle P versus NP.'),
      ]
    ),
    lesson(
      'nd-4',
      'Unification & First-Order Resolution',
      'git-merge-outline',
      'Matching terms and removing quantifiers.',
      8,
      [
        pg(
          'Unification',
          p('To resolve first-order clauses we must make literals **match** by substituting for variables. The substitution is a **unifier**.'),
          ex(['P(x, f(y))  and  P(a, f(b))', 'unifier:  { x ↦ a,  y ↦ b }'], 'Example'),
          p('The **most general unifier (mgu)** commits to as little as possible. The **occurs check** forbids x ↦ f(x).')
        ),
        pg(
          'Skolemisation',
          p('Existentials are removed by naming the witness. If it depends on universal variables, use a **function**.'),
          ex(['∃y ∀x R(x, y)   becomes   R(x, c)           (constant c)', '∀x ∃y R(x, y)   becomes   R(x, f(x))        (function f)'], 'Examples'),
          p('Afterwards drop ∀, convert to CNF and run resolution with unification.')
        ),
        pg(
          'Prolog',
          p('Prolog is built on this idea. It restricts to **Horn clauses** and searches depth-first with unification and backtracking.'),
          tip('Unification is also what makes type inference and pattern matching work in many languages.')
        ),
      ],
      [
        mcq('The most general unifier of P(x, b) and P(a, y) is…', ['{x ↦ a, y ↦ b}', '{x ↦ b, y ↦ a}', 'There is none', '{x ↦ a}'], 0, 'Match each argument.'),
        tf('x and f(x) can be unified.', false, 'The occurs check fails: x would contain itself.'),
        mcq('Skolemising ∀x ∃y R(x, y) gives…', ['R(x, c)', 'R(x, f(x))', '∃y R(c, y)', 'R(f, x)'], 1, 'The witness may depend on x, so it becomes a function of x.'),
        mcq('Skolemising ∃y ∀x R(x, y) gives…', ['R(x, c)', 'R(x, f(x))', 'R(c, c)', 'R(x, x)'], 0, 'The witness does not depend on x.'),
        mcq('Which language is built on resolution with unification?', ['Prolog', 'C', 'HTML', 'SQL'], 0, 'Prolog.'),
        mcq('A Horn clause has…', ['At most one positive literal', 'Exactly two literals', 'No negative literals', 'Only variables'], 0, 'This restriction makes inference efficient.'),
      ]
    ),
  ]
);

/* =========================================================================
   ADVANCED · UNIT 3 — Metalogic
   ========================================================================= */
export const metalogicUnit = unit(
  'metalogic',
  2,
  'Metalogic',
  'planet-outline',
  300,
  'Logic reasoning about logic: soundness, completeness and limits.',
  [
    lesson(
      'meta-1',
      'Syntax vs Semantics',
      'git-compare-outline',
      'Two meanings of “follows from”.',
      6,
      [
        pg(
          'Two turnstiles',
          cmp(
            { title: 'Γ ⊢ φ  (syntax)', lines: ['φ is derivable from Γ', 'using the rules of a proof system', 'finite and mechanical'] },
            { title: 'Γ ⊨ φ  (semantics)', lines: ['φ is true in every model of Γ', 'about meaning and truth', 'quantifies over infinitely many models'] }
          ),
          p('The big question: do they coincide?')
        ),
        pg(
          'Formal systems',
          p('A **formal system** has a language, axioms and inference rules. A **Hilbert system** uses a few axioms and one rule, modus ponens:'),
          list('A1: φ → (ψ → φ)', 'A2: (φ → (ψ → χ)) → ((φ → ψ) → (φ → χ))', 'A3: (¬ψ → ¬φ) → (φ → ψ)', 'Rule: from φ and φ → ψ, infer ψ')
        ),
        pg(
          'Key properties of a system',
          list('**Consistent:** it cannot derive both φ and ¬φ.', '**Decidable:** an algorithm decides whether φ is a theorem.', '**Sound / complete:** see the next lesson.'),
          tip('Hilbert systems are elegant to study but awkward to use; natural deduction is closer to how people reason.')
        ),
      ],
      [
        match('Match each symbol to its meaning.', [['⊢', 'Derivable (syntactic)'], ['⊨', 'Semantic entailment'], ['≡', 'Logical equivalence'], ['⊥', 'Contradiction']], 'Syntax manipulates symbols; semantics assigns truth.'),
        mcq('Γ ⊢ φ means…', ['φ is true in all models of Γ', 'φ can be proved from Γ', 'Γ is a tautology', 'φ is false'], 1, 'The turnstile is about derivability.'),
        mcq('A Hilbert-style system usually has…', ['Many rules, no axioms', 'Several axioms and a single rule (modus ponens)', 'No rules', 'Only truth tables'], 1, 'That is its defining feature.'),
        tf('A consistent system cannot derive both φ and ¬φ.', true, 'That is the definition.'),
        mcq('Which is a semantic notion?', ['Proof of φ', 'Derivation tree', 'Tautology', 'Axiom schema'], 2, 'Tautologies are defined by truth in all valuations.'),
        tf('Propositional logic is decidable.', true, 'Truth tables always terminate.'),
      ]
    ),
    lesson(
      'meta-2',
      'Soundness, Completeness, Compactness',
      'shield-checkmark-outline',
      'When proof and truth line up perfectly.',
      8,
      [
        pg(
          'Soundness and completeness',
          list('**Soundness:** if Γ ⊢ φ then Γ ⊨ φ. The system proves only truths.', '**Completeness:** if Γ ⊨ φ then Γ ⊢ φ. The system proves all truths of this kind.'),
          p('Together they say ⊢ and ⊨ coincide. Post proved this for propositional logic (1921) and Gödel for first-order logic (1929).')
        ),
        pg(
          'Compactness',
          rule('Compactness theorem', ['Every finite subset of Γ has a model'], 'Γ has a model'),
          p('Consequences: first-order logic cannot say “the domain is finite” and admits **non-standard models** of arithmetic with infinitely large “numbers”.')
        ),
        pg(
          'Löwenheim–Skolem',
          p('If a countable first-order theory has an infinite model, it has models of **every infinite size** (and a countable one).'),
          ex(['Skolem’s paradox: set theory proves uncountable sets exist, yet has a countable model.', 'Resolution: “uncountable” is relative to the model.'], 'A curiosity'),
          tip('Lindström’s theorem: first-order logic is the strongest logic that has both compactness and Löwenheim–Skolem.')
        ),
      ],
      [
        mcq('Soundness says…', ['If Γ ⊢ φ then Γ ⊨ φ', 'If Γ ⊨ φ then Γ ⊢ φ', 'Every formula is provable', 'Every proof is short'], 0, 'Provable implies true.'),
        mcq('Completeness says…', ['If Γ ⊢ φ then Γ ⊨ φ', 'If Γ ⊨ φ then Γ ⊢ φ', 'There are no models', 'The system is consistent'], 1, 'All consequences are provable.'),
        mcq('Who proved the completeness theorem for first-order logic?', ['Turing', 'Gödel', 'Russell', 'Boole'], 1, 'Gödel, 1929.'),
        tf('By compactness, if every finite subset of Γ has a model, then Γ has a model.', true, 'That is the theorem.'),
        mcq('Which cannot be expressed in first-order logic?', ['“There are at least 3 things”', '“The domain is finite”', '“Everything is P”', '“Something is Q”'], 1, 'A consequence of compactness.'),
        tf('The Löwenheim–Skolem theorem shows that first-order theories cannot pin down the size of infinite models.', true, 'They have models of many sizes.'),
      ]
    ),
    lesson(
      'meta-3',
      'Incompleteness & Undecidability',
      'alert-circle-outline',
      'What no formal system can do.',
      9,
      [
        pg(
          'Gödel’s first incompleteness theorem',
          p('Any **consistent**, **effectively axiomatised** system strong enough to express basic arithmetic contains a sentence that is **true but unprovable** in the system.'),
          p('The trick: Gödel numbering lets arithmetic talk about its own formulas, so a sentence G can say “G is not provable”. If G were provable the system would be inconsistent; so G is unprovable, and therefore true.')
        ),
        pg(
          'Second theorem and what it does not mean',
          list('**Second theorem:** such a system cannot prove its own consistency.', 'This is **not** a contradiction of the completeness theorem: logic is complete; **theories** like Peano arithmetic are incomplete.', 'It does not say “math is broken”. It says no single formal system captures all arithmetic truth.')
        ),
        pg(
          'The halting problem',
          p('Turing (1936) proved that no program can decide, for every program and input, whether it halts. Sketch: assume H exists; build a program D that does the opposite of what H predicts about D running on itself, a contradiction.'),
          p('Consequence: first-order validity is undecidable, as is whether arbitrary programs have bugs.'),
          tip('Church–Turing thesis: anything that can be effectively computed can be computed by a Turing machine.')
        ),
      ],
      [
        mcq('Gödel’s first incompleteness theorem says that a consistent, sufficiently strong, effective system…', ['Proves all truths', 'Contains true but unprovable sentences', 'Is inconsistent', 'Is decidable'], 1, 'There are true sentences it cannot prove.'),
        tf('Gödel’s incompleteness theorem contradicts the completeness theorem for first-order logic.', false, 'Completeness is about logic; incompleteness is about strong theories like arithmetic.'),
        mcq('Gödel’s second theorem says such a system cannot…', ['Prove anything', 'Prove its own consistency', 'Be consistent', 'Express addition'], 1, 'It cannot prove its own consistency.'),
        mcq('The halting problem is…', ['Solvable by truth tables', 'Undecidable', 'NP-complete', 'Solved by Gödel'], 1, 'No algorithm decides halting for all programs.'),
        mcq('Who proved that no algorithm decides the halting problem?', ['Turing', 'Aristotle', 'Frege', 'Cantor'], 0, 'Alan Turing, 1936.'),
        tf('Gödel numbering lets a formal system talk about its own formulas.', true, 'Formulas are encoded as numbers.'),
      ]
    ),
  ]
);
