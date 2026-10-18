import { cmp, ex, list, p, pg, rule, sym, tip, ttb, warn } from '../helpers';
import type { Page } from '../types';

/** Study notes: Intermediate units. */
export const NOTES_N2: Record<string, Page[]> = {
  equivalences: [
    pg(
      'Laws to know cold',
      sym(
        { sym: '¬¬p ≡ p', name: 'double negation' },
        { sym: 'p → q ≡ ¬p ∨ q', name: 'material implication' },
        { sym: 'p → q ≡ ¬q → ¬p', name: 'contrapositive' },
        { sym: '¬(p ∧ q) ≡ ¬p ∨ ¬q', name: 'De Morgan 1' },
        { sym: '¬(p ∨ q) ≡ ¬p ∧ ¬q', name: 'De Morgan 2' },
        { sym: '¬(p → q) ≡ p ∧ ¬q', name: 'negated conditional' },
        { sym: 'p ↔ q ≡ (p → q) ∧ (q → p)', name: 'biconditional' },
        { sym: 'p ⊕ q ≡ ¬(p ↔ q)', name: 'exclusive or' }
      )
    ),
    pg(
      'Distribution and absorption',
      list('p ∧ (q ∨ r) ≡ (p ∧ q) ∨ (p ∧ r)', 'p ∨ (q ∧ r) ≡ (p ∨ q) ∧ (p ∨ r)', 'p ∨ (p ∧ q) ≡ p and p ∧ (p ∨ q) ≡ p', 'Identity, domination, idempotence, complement.'),
      ex(['(p ∧ q) ∨ (p ∧ ¬q)', '≡ p ∧ (q ∨ ¬q)', '≡ p ∧ ⊤', '≡ p'], 'Typical simplification')
    ),
    pg(
      'Normal forms',
      list('**CNF:** AND of ORs. **DNF:** OR of ANDs.', 'Procedure: remove → and ↔, push ¬ inward, distribute.', 'From a truth table: DNF from true rows, CNF from false rows.'),
      tip('Equivalence means the same truth value in every row, which is the same as saying P ↔ Q is a tautology.')
    ),
  ],

  inference: [
    pg(
      'The core rules',
      rule('Modus ponens', ['p → q', 'p'], 'q'),
      rule('Modus tollens', ['p → q', '¬q'], '¬p'),
      rule('Hypothetical syllogism', ['p → q', 'q → r'], 'p → r'),
      rule('Disjunctive syllogism', ['p ∨ q', '¬p'], 'q'),
      rule('Simplification', ['p ∧ q'], 'p'),
      rule('Conjunction', ['p', 'q'], 'p ∧ q'),
      rule('Addition', ['p'], 'p ∨ q')
    ),
    pg(
      'Dilemmas and resolution',
      rule('Constructive dilemma', ['p → q', 'r → s', 'p ∨ r'], 'q ∨ s'),
      rule('Destructive dilemma', ['p → q', 'r → s', '¬q ∨ ¬s'], '¬p ∨ ¬r'),
      rule('Resolution', ['p ∨ q', '¬p ∨ r'], 'q ∨ r')
    ),
    pg(
      'Testing arguments',
      list('Valid means no row with true premises and a false conclusion.', 'Shortcut: force the conclusion false, then try to make all premises true.', 'Inconsistent premises make an argument valid vacuously.'),
      warn('Affirming the consequent and denying the antecedent are not rules.')
    ),
  ],

  proofs: [
    pg(
      'Proof anatomy',
      list('Number each line; justify with a rule and the lines used.', 'Work backwards from the goal as well as forwards from the premises.', 'Split conjunctions early; use DS and MP to eliminate connectives.'),
      ex(['1. p → q       premise', '2. q → r       premise', '3. p ∧ s       premise', '4. p           Simp 3', '5. q           MP 1, 4', '6. r           MP 2, 5'], 'A direct proof')
    ),
    pg(
      'Assumption-based proofs',
      list('**Conditional proof:** to prove p → q, assume p, derive q, discharge.', '**Indirect proof:** to prove φ, assume ¬φ and derive a contradiction.', '**Proof by cases:** from p ∨ q, show the goal follows from each.'),
      warn('Lines inside a closed sub-proof cannot be used outside it.')
    ),
    pg(
      'Mathematical styles',
      list('**Contrapositive:** prove ¬q → ¬p instead of p → q.', '**Contradiction:** assume the negation and derive an impossibility (√2 irrational).', '**Counterexample:** disproves a universal claim.', '**Induction:** base case plus inductive step.', '**Pigeonhole, exhaustion, strong induction** are other common tools.')
    ),
  ],

  'syllogisms-deep': [
    pg(
      'Square of opposition',
      list('**Contradictories (A–O, E–I):** always opposite.', '**Contraries (A–E):** not both true.', '**Subcontraries (I–O):** not both false.', '**Subalternation (A to I, E to O):** traditional only, needs existential import.'),
      tip('On the modern reading only the contradictories survive.')
    ),
    pg(
      'Figures and moods',
      sym(
        { sym: 'Fig. 1', name: 'M–P, S–M' },
        { sym: 'Fig. 2', name: 'P–M, S–M' },
        { sym: 'Fig. 3', name: 'M–P, M–S' },
        { sym: 'Fig. 4', name: 'P–M, M–S' }
      ),
      list('64 moods × 4 figures = 256 forms.', '24 are traditionally valid: 15 unconditionally, 9 needing existential import.', 'Barbara AAA-1, Celarent EAE-1, Darii AII-1, Ferio EIO-1 head the list.')
    ),
    pg(
      'The six rules and immediate inferences',
      list('Three terms. Middle distributed once. No illicit distribution. No two negative premises. Negative premise ⇔ negative conclusion. No particular conclusion from two universal premises (modern).', '**Conversion:** valid for E and I. **Obversion:** valid for all. **Contraposition:** valid for A and O.')
    ),
  ],

  'predicate-1': [
    pg(
      'Symbols',
      sym(
        { sym: '∀x', name: 'for all x' },
        { sym: '∃x', name: 'there exists an x' },
        { sym: 'P(x)', name: 'predicate applied to x' },
        { sym: 'R(x, y)', name: 'a relation' }
      ),
      p('Always fix the **domain of discourse** first.')
    ),
    pg(
      'Translation patterns',
      list('All S are P: **∀x (S(x) → P(x))**', 'No S are P: **∀x (S(x) → ¬P(x))**', 'Some S are P: **∃x (S(x) ∧ P(x))**', 'Some S are not P: **∃x (S(x) ∧ ¬P(x))**'),
      warn('∀ with ∧ and ∃ with → are the two classic mistakes.')
    ),
    pg(
      'Negation',
      rule('Negating ∀', ['¬∀x P(x)'], '∃x ¬P(x)'),
      rule('Negating ∃', ['¬∃x P(x)'], '∀x ¬P(x)'),
      list('Bound variables can be renamed.', 'A variable not governed by any quantifier is **free**.')
    ),
  ],

  boolean: [
    pg(
      'Gates',
      sym(
        { sym: 'A · B', name: 'AND' },
        { sym: 'A + B', name: 'OR' },
        { sym: "A'", name: 'NOT' },
        { sym: 'A ⊕ B', name: 'XOR' },
        { sym: 'NAND, NOR', name: 'universal gates' }
      ),
      ttb('p ↑ q', 'p ↓ q', 'p ⊕ q', 'p ↔ q')
    ),
    pg(
      'Simplifying',
      list("A + A'B = A + B", 'A + AB = A', "(A + B)' = A'B'", "(AB)' = A' + B'", "A + A' = 1, A · A' = 0"),
      list('Karnaugh maps group neighbouring 1s in powers of two.', 'Cells are in Gray code order.', 'Bigger groups give simpler terms.')
    ),
    pg(
      'Arithmetic circuits',
      list('Half adder: sum = A ⊕ B, carry = A · B.', 'Full adder: sum = A ⊕ B ⊕ C, carry = AB + C(A ⊕ B).', 'Multiplexer: out = S′A + SB.'),
      tip('A CPU’s arithmetic unit is built from exactly these pieces.')
    ),
  ],

  'sets-relations': [
    pg(
      'Sets and logic',
      list('A ∪ B ↔ ∨, A ∩ B ↔ ∧, complement ↔ ¬, A ⊆ B ↔ ∀x (x ∈ A → x ∈ B).', 'De Morgan holds: (A ∪ B)ᶜ = Aᶜ ∩ Bᶜ.', '|A ∪ B| = |A| + |B| − |A ∩ B|.', 'An n-element set has 2ⁿ subsets.')
    ),
    pg(
      'Relations',
      list('**Reflexive:** xRx. **Symmetric:** xRy → yRx. **Antisymmetric:** xRy and yRx imply x = y. **Transitive:** xRy and yRz imply xRz.'),
      cmp(
        { title: 'Equivalence relation', lines: ['reflexive', 'symmetric', 'transitive', 'splits a set into classes'] },
        { title: 'Partial order', lines: ['reflexive', 'antisymmetric', 'transitive', 'e.g. ≤, ⊆, divides'] }
      )
    ),
    pg(
      'Functions',
      list('**Injective:** different inputs give different outputs.', '**Surjective:** every output is hit.', '**Bijective:** both, so an inverse exists.', 'Same cardinality means a bijection exists.', 'Countable sets: ℕ, ℤ, ℚ. Uncountable: ℝ (Cantor’s diagonal).')
    ),
  ],

  probability: [
    pg(
      'Rules',
      list('P(not A) = 1 − P(A)', 'P(A and B) = P(A) · P(B) if independent', 'P(A or B) = P(A) + P(B) − P(A and B)', 'P(A | B) = P(A and B) / P(B)', 'Expected value = sum of value × probability'),
      warn('P(A | B) is not P(B | A).')
    ),
    pg(
      'Bayes',
      rule('Bayes’ theorem', ['P(E | H)', 'P(H)', 'P(E)'], 'P(H | E) = P(E | H) · P(H) / P(E)'),
      list('Use natural frequencies: imagine 1,000 people.', 'Posterior odds = prior odds × likelihood ratio.', 'Rare conditions give mostly false positives even with good tests.')
    ),
    pg(
      'Traps',
      list('**Gambler’s fallacy:** independent trials have no memory.', '**Conjunction fallacy:** P(A and B) ≤ P(A).', '**Prosecutor’s fallacy:** swapping the two conditional probabilities.', '**Simpson’s paradox:** a trend reverses when groups are merged.', '**Regression to the mean:** extremes tend to be followed by less extreme results.')
    ),
  ],

  'puzzles-2': [
    pg(
      'Constraint puzzles',
      list('Variables, domains, constraints.', 'Use the most direct clues first.', 'Fill a grid, eliminate, propagate.', 'Backtrack when a guess leads to contradiction.', 'Encode as SAT: “exactly one” = at least one + pairwise not-both.')
    ),
    pg(
      'Knowledge puzzles',
      list('Model each possibility as a world.', 'An announcement removes the worlds where it is false.', '“I do not know” is information.', 'Common knowledge needs the infinite hierarchy of “everyone knows that everyone knows…”.')
    ),
    pg(
      'Search and invariants',
      list('Puzzles are graphs of states and moves; breadth-first search finds the shortest solution.', 'An **invariant** preserved by every move proves impossibility (mutilated chessboard, 15-puzzle).', 'Towers of Hanoi needs 2ⁿ − 1 moves.')
    ),
  ],
};
