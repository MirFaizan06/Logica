import { cmp, ex, list, p, pg, rule, sym, tip, warn } from '../helpers';
import type { Page } from '../types';

/** Study notes: Advanced units. */
export const NOTES_N3: Record<string, Page[]> = {
  'predicate-2': [
    pg(
      'Quantifier order',
      list('∀x ∀y and ∃x ∃y commute.', '∃y ∀x φ entails ∀x ∃y φ, not the other way round.', 'Negation flips each quantifier in turn.'),
      ex(['∀x ∃y (y > x) true over the integers', '∃y ∀x (y > x) false'], 'Order matters')
    ),
    pg(
      'Identity and counting',
      list('At least two: ∃x ∃y (x ≠ y ∧ P(x) ∧ P(y))', 'At most one: ∀x ∀y (P(x) ∧ P(y) → x = y)', 'Exactly one: ∃x (P(x) ∧ ∀y (P(y) → y = x))', 'Russell: “the F is G” = there is exactly one F and it is G.')
    ),
    pg(
      'Models and rules',
      list('A model = domain + interpretation. Valid = true in all models. Invalid = give a countermodel.', '**UI:** ∀x φ ⊢ φ(c). **EG:** φ(c) ⊢ ∃x φ.', '**EI:** use a fresh name. **UG:** the name must be arbitrary.', 'Validity of first-order logic is undecidable but semi-decidable.')
    ),
  ],

  deduction: [
    pg(
      'Natural deduction rules',
      sym(
        { sym: '∧I, ∧E', name: 'build or split a conjunction' },
        { sym: '∨I, ∨E', name: 'add a disjunct, or reason by cases' },
        { sym: '→I, →E', name: 'discharge an assumption, modus ponens' },
        { sym: '¬I, ¬E', name: 'reductio, clash gives ⊥' },
        { sym: '⊥E', name: 'from absurdity, anything' }
      ),
      tip('Learn each rule as a pair: how to build a connective and how to use one.')
    ),
    pg(
      'Resolution and SAT',
      rule('Resolution', ['A ∨ x', '¬x ∨ B'], 'A ∨ B'),
      list('Prove KB ⊨ φ by showing KB ∧ ¬φ derives the empty clause.', '**DPLL:** unit propagation, pure literals, branching with backtracking.', 'SAT is NP-complete; CDCL solvers handle millions of clauses.')
    ),
    pg(
      'First-order resolution',
      list('**Skolemise** existentials: ∃y ∀x R ⇒ R(x, c); ∀x ∃y R ⇒ R(x, f(x)).', '**Unify** literals with a most general unifier; apply the occurs check.', 'Prolog uses resolution on Horn clauses.')
    ),
  ],

  metalogic: [
    pg(
      'Vocabulary',
      cmp(
        { title: 'Γ ⊢ φ', lines: ['derivable', 'syntactic', 'a proof exists'] },
        { title: 'Γ ⊨ φ', lines: ['entailment', 'semantic', 'true in every model of Γ'] }
      ),
      list('**Sound:** ⊢ implies ⊨. **Complete:** ⊨ implies ⊢.', '**Consistent:** cannot derive both φ and ¬φ.', '**Decidable:** an algorithm answers yes or no for every input.')
    ),
    pg(
      'Big theorems',
      list('**Completeness (Gödel 1929):** first-order logic is complete.', '**Compactness:** if every finite subset has a model, so does the set.', '**Löwenheim–Skolem:** infinite models come in many sizes.', '**Lindström:** first-order logic is the strongest logic with compactness and L–S.')
    ),
    pg(
      'Limits',
      list('**First incompleteness:** consistent, effective theories of arithmetic have true but unprovable sentences.', '**Second:** they cannot prove their own consistency.', '**Halting problem** is undecidable; so is first-order validity.', '**Tarski:** truth in arithmetic is not definable in arithmetic.'),
      warn('Logic is complete; strong theories like Peano arithmetic are not. These are different statements.')
    ),
  ],

  modal: [
    pg(
      'Basics',
      list('□ necessarily, ◇ possibly. ◇p ≡ ¬□¬p and □p ≡ ¬◇¬p.', 'Kripke semantics: w ⊨ □φ iff φ holds at all worlds accessible from w; w ⊨ ◇φ iff at some.', 'At a dead end □φ is vacuously true and ◇φ is false.')
    ),
    pg(
      'Axioms and frames',
      sym(
        { sym: 'K', name: '□(p → q) → (□p → □q)', note: 'every normal system' },
        { sym: 'T', name: '□p → p', note: 'reflexive' },
        { sym: '4', name: '□p → □□p', note: 'transitive' },
        { sym: 'B', name: 'p → □◇p', note: 'symmetric' },
        { sym: '5', name: '◇p → □◇p', note: 'Euclidean' },
        { sym: 'D', name: '□p → ◇p', note: 'serial' }
      )
    ),
    pg(
      'Systems',
      list('**K:** the weakest normal system.', '**T = K + T.** **S4 = T + 4.** **S5 = T + 5** (equivalence relation).', 'In S5, modalities collapse: ◇◇p ≡ ◇p and □◇p ≡ ◇p.', 'Necessitation: if ⊢ φ then ⊢ □φ.')
    ),
  ],

  'temporal-epistemic': [
    pg(
      'Temporal (LTL)',
      sym(
        { sym: 'X p', name: 'next' },
        { sym: 'F p', name: 'eventually' },
        { sym: 'G p', name: 'always' },
        { sym: 'p U q', name: 'until' }
      ),
      list('Safety: G ¬bad. Liveness: G (request → F grant).', 'Model checking tests a finite-state system against such a formula.')
    ),
    pg(
      'Epistemic',
      list('K_a φ: agent a knows φ. In S5: factive, with positive and negative introspection.', 'Common knowledge = everyone knows, everyone knows that everyone knows, and so on.', 'Muddy children: with k muddy, they speak in round k.', 'Logical omniscience is a known idealisation.')
    ),
    pg(
      'Deontic',
      list('O obligatory, P permitted ≡ ¬O¬, F forbidden ≡ O¬.', 'Axiom D: Oφ → Pφ.', 'Paradoxes: Ross (Oφ → O(φ ∨ ψ)) and Chisholm (contrary-to-duty).', 'Dyadic deontic logic handles conditional obligations.')
    ),
  ],

  nonclassical: [
    pg(
      'Many-valued',
      list('**K3:** values T, F, N. ¬N = N; N ∧ F = F; N ∨ T = T. No tautologies.', '**Ł3:** N → N is true.', '**Fuzzy:** ¬x = 1 − x, x ∧ y = min, x ∨ y = max.'),
      tip('Many-valued logics model vagueness and future contingents.')
    ),
    pg(
      'Constructive and paraconsistent',
      list('**Intuitionistic:** true means provable by a construction. Excluded middle and ¬¬p → p fail. p → ¬¬p holds.', '**Paraconsistent (LP):** contradictions do not explode. Disjunctive syllogism fails.', '**Relevance logic:** premises must be relevant to the conclusion.')
    ),
    pg(
      'Non-monotonic reasoning',
      list('Conclusions can be withdrawn when information is added.', '**Default logic, circumscription, closed-world assumption, negation as failure.**', '**AGM:** expansion, contraction, revision of beliefs.')
    ),
  ],

  'computing-logic': [
    pg(
      'Programs and proofs',
      rule('Assignment axiom', ['—'], '{ Q[e/x] } x := e { Q }'),
      list('Hoare triple {P} C {Q}: if P holds before C, Q holds after (if C halts).', 'While rule: find an **invariant** I; at exit I ∧ ¬B holds.', 'Total correctness needs a variant that decreases.')
    ),
    pg(
      'λ-calculus and types',
      list('Terms: variables, abstraction λx. M, application M N.', 'β-reduction: (λx. M) N → M[x := N].', 'Curry–Howard: propositions are types, proofs are programs. A → B is a function type, A ∧ B a pair, A ∨ B a sum, ⊥ the empty type.')
    ),
    pg(
      'Logic programming and ontologies',
      list('Prolog: facts and rules (Horn clauses), unification, backtracking.', 'Datalog: Prolog without function symbols; always terminates.', 'SQL ≈ first-order logic. Closed-world assumption for databases.', 'Description logics (OWL): concepts, roles, ⊓, ⊔, ∃R.C, ∀R.C.')
    ),
  ],

  'higher-order': [
    pg(
      'Second-order logic',
      list('Quantifies over properties and relations.', 'Second-order Peano arithmetic is categorical.', 'Full semantics: no complete proof system, no compactness, no Löwenheim–Skolem.', 'Henkin semantics restores completeness.')
    ),
    pg(
      'Types and proof assistants',
      list('Dependent types: Π (functions) and Σ (pairs, existentials).', 'Lean, Coq, Agda, Isabelle check proofs with a small trusted kernel.', 'Verified artefacts: the four colour theorem, CompCert, seL4.'),
      warn('A verified proof is only as good as the statement that was formalised.')
    ),
    pg(
      'Linear logic',
      list('Drops weakening and contraction: resources are used exactly once.', '⊗ both, ⊸ consume to produce, & choice, !A reusable.', 'Relevance logic drops weakening; affine logic drops contraction.', 'Appears in Rust’s ownership, session types and Petri nets.')
    ),
  ],

  complexity: [
    pg(
      'Computability',
      list('Church–Turing thesis: effectively computable = Turing computable.', 'Decidable, semi-decidable, undecidable.', 'Halting problem: semi-decidable, undecidable; its complement is not semi-decidable.', 'Show undecidability by reduction. Rice: non-trivial semantic properties of programs are undecidable.')
    ),
    pg(
      'Complexity',
      list('**P:** polynomial time. **NP:** solutions checkable in polynomial time. **NP-complete:** hardest in NP.', 'SAT, 3-colouring, Hamiltonian path are NP-complete.', 'Tautology is coNP-complete; QBF is PSPACE-complete.', 'P ⊆ NP ⊆ PSPACE ⊆ EXPTIME. P versus NP is open.'),
      p('Fagin: NP = existential second-order logic over finite structures.')
    ),
    pg(
      'Automata and logic',
      list('Regular languages = finite automata = MSO on words.', 'Büchi automata handle infinite words; LTL translates to them.', 'Model checking = automaton emptiness; the enemy is state explosion.', 'Decidable: Presburger, monadic fragments, modal K (PSPACE), guarded fragment.')
    ),
  ],

  paradoxes: [
    pg(
      'Self-reference',
      list('**Liar:** “This sentence is false.”', '**Truth-teller**, **Curry** (needs only a conditional), **Yablo** (no self-reference).', 'Responses: Tarski hierarchy, Kripke gaps, dialetheism, avoid truth (Gödel uses provability).')
    ),
    pg(
      'Sets',
      list('**Russell:** R = {x | x ∉ x} cannot exist.', 'ZF replaces comprehension by separation.', '**Cantor:** |P(A)| > |A| by diagonalisation.', 'Burali-Forti and the barber are relatives.')
    ),
    pg(
      'Vagueness and evidence',
      list('**Sorites:** epistemicism, supervaluationism, fuzzy logic.', '**Surprise exam:** backward induction from the last day.', '**Hempel’s ravens:** a white shoe confirms “all ravens are black” only slightly.', '**Monty Hall:** switching wins 2/3 of the time.', '**Grue:** induction depends on the choice of predicates.')
    ),
  ],
};
