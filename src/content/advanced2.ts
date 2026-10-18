import { classify, cmp, ex, lesson, list, match, mcq, p, pg, rule, sym, tf, tip, unit, warn } from './helpers';

/* =========================================================================
   ADVANCED · UNIT 4 — Modal Logic
   ========================================================================= */
export const modalUnit = unit(
  'modal',
  2,
  'Modal Logic',
  'earth-outline',
  190,
  'Necessity, possibility and possible worlds.',
  [
    lesson(
      'modal-1',
      'Necessity & Possibility',
      'lock-open-outline',
      'Two new operators: □ and ◇.',
      6,
      [
        pg(
          'Beyond true and false',
          p('Classical logic only asks whether something **is** true. Modal logic asks whether it **must** be or **could** be.'),
          sym(
            { sym: '□p', name: 'necessarily p' },
            { sym: '◇p', name: 'possibly p' }
          ),
          ex(['□(2 + 2 = 4)   necessarily true', '◇(it rains tomorrow)   possibly true'], 'Examples')
        ),
        pg(
          'Duality',
          rule('Duality', ['◇p'], '¬□¬p'),
          list('◇p ≡ ¬□¬p  (possible = not necessarily false)', '□p ≡ ¬◇¬p  (necessary = not possibly false)', '¬◇p ≡ □¬p  (impossible = necessarily false)'),
          p('It mirrors ∃ and ∀: □ is like a universal quantifier over situations, ◇ like an existential one.')
        ),
        pg(
          'Many modalities, one shape',
          list('**Alethic:** necessity and possibility.', '**Epistemic:** □ means “it is known that”.', '**Deontic:** □ means “it ought to be that”.', '**Temporal:** □ means “always”.', '**Provability:** □ means “it is provable that”.'),
          p('C. I. Lewis invented modern modal logic to define **strict implication** □(p → q), avoiding paradoxes of material implication such as “if the moon is cheese, then 2 + 2 = 4” counting as true.')
        ),
      ],
      [
        mcq('◇p is equivalent to…', ['¬□p', '¬□¬p', '□¬p', '□p'], 1, 'Possible means not necessarily false.'),
        mcq('“It is impossible that p” is…', ['¬□p', '□¬p', '◇¬p', '¬p'], 1, 'Impossible means necessarily false.'),
        match('Match the kind of modality to its box.', [['Alethic', 'necessarily'], ['Epistemic', 'it is known that'], ['Deontic', 'it ought to be that'], ['Temporal', 'always']], 'The same operator can have many readings.'),
        mcq('What is strict implication?', ['p → q', '□(p → q)', '◇(p → q)', 'p ∧ q'], 1, 'The conditional holds necessarily.'),
        mcq('“p is contingent” can be expressed as…', ['□p ∧ □¬p', '◇p ∧ ◇¬p', '□p', '¬◇p'], 1, 'It could be true and it could be false.'),
        tf('□p ≡ ¬◇¬p', true, 'Necessity is the dual of possibility.'),
      ]
    ),
    lesson(
      'modal-2',
      'Possible Worlds & Kripke Frames',
      'planet-outline',
      'How to evaluate a modal sentence.',
      8,
      [
        pg(
          'Kripke semantics',
          p('A **Kripke model** has a set of **worlds** W, an **accessibility relation** R (which worlds can “see” which), and a valuation saying which atoms are true where.'),
          list('w ⊨ □φ iff φ is true at **every** world accessible from w.', 'w ⊨ ◇φ iff φ is true at **some** world accessible from w.')
        ),
        pg(
          'Worked example',
          ex(['Worlds: a, b, c.   a sees b and c.   b and c see nothing.', 'p is true at b and c.', 'At a:  □p true,  ◇p true,  ◇¬p false.', 'At c:  □p true (vacuously!),  ◇p false.'], 'A small model'),
          warn('At a world with no accessible worlds, □φ is vacuously true and ◇φ is false.')
        ),
        pg(
          'Valid on a frame',
          p('A formula is **valid on a frame** if it is true at every world under **every** valuation. Properties of R decide which modal formulas are valid, and that links modal logic to the next lesson.'),
          tip('Modal logic with Kripke frames is a tool for reasoning about knowledge, time, programs and permissions.')
        ),
      ],
      [
        mcq('w ⊨ □φ means…', ['φ is true at w', 'φ is true at all worlds accessible from w', 'φ is true at some accessible world', 'φ is false at w'], 1, 'Box quantifies over accessible worlds.'),
        mcq('w ⊨ ◇φ means…', ['φ true at every accessible world', 'φ true at some accessible world', 'φ false everywhere', 'w sees itself'], 1, 'Diamond is existential.'),
        mcq('Worlds: a sees b and c. p holds at b but not c. At a, which holds?', ['□p and ◇p', '◇p but not □p', '□p but not ◇p', 'Neither'], 1, 'p holds at some, but not all, accessible worlds.'),
        tf('At a world that sees no other world, □p is true for every p.', true, 'The condition over accessible worlds is vacuous.'),
        tf('At a world that sees no other world, ◇p is true for every p.', false, 'There is no accessible world to witness p.'),
        mcq('Accessibility relations are used to…', ['Interpret □ and ◇', 'Evaluate ∧', 'Define truth tables', 'Name constants'], 0, 'They determine which worlds the operators range over.'),
      ]
    ),
    lesson(
      'modal-3',
      'Systems K, T, S4, S5',
      'git-branch-outline',
      'Axioms and the shape of the frames.',
      8,
      [
        pg(
          'The base system K',
          rule('Axiom K', ['□(p → q)'], '□p → □q'),
          rule('Necessitation', ['⊢ φ'], '⊢ □φ'),
          p('K together with the propositional tautologies is the weakest **normal** modal logic.')
        ),
        pg(
          'Extra axioms, extra frame properties',
          sym(
            { sym: 'T:  □p → p', name: 'reflexive', note: 'every world sees itself' },
            { sym: '4:  □p → □□p', name: 'transitive' },
            { sym: 'B:  p → □◇p', name: 'symmetric' },
            { sym: '5:  ◇p → □◇p', name: 'Euclidean' },
            { sym: 'D:  □p → ◇p', name: 'serial', note: 'every world sees something' }
          )
        ),
        pg(
          'Named systems',
          list('**T** = K + T', '**S4** = T + 4 (reflexive, transitive)', '**S5** = T + 5 (an equivalence relation: all worlds see each other)', 'In S5 modalities collapse: ◇◇p ≡ ◇p and □◇p ≡ ◇p.'),
          tip('S5 is the usual logic for metaphysical necessity and idealised knowledge; S4 is related to provability and intuitionistic logic.')
        ),
      ],
      [
        match('Match axiom with the frame property it corresponds to.', [['T: □p → p', 'Reflexive'], ['4: □p → □□p', 'Transitive'], ['B: p → □◇p', 'Symmetric'], ['D: □p → ◇p', 'Serial']], 'Each axiom is valid exactly on frames with that property.'),
        mcq('Which system is the weakest normal modal logic?', ['K', 'T', 'S4', 'S5'], 0, 'K has only the distribution axiom and necessitation.'),
        tf('In S5, □◇p is equivalent to ◇p.', true, 'In S5 modal operators collapse.'),
        mcq('S5 corresponds to frames where R is…', ['Empty', 'An equivalence relation', 'Irreflexive', 'A function'], 1, 'Reflexive, symmetric and transitive.'),
        mcq('The T axiom □p → p says…', ['Whatever is necessary is true', 'Whatever is true is necessary', 'Possibility implies truth', 'Truth implies possibility'], 0, 'Factivity of the box.'),
        mcq('Which axiom corresponds to transitivity?', ['T', '4', 'B', 'D'], 1, '□p → □□p.'),
      ]
    ),
  ]
);

/* =========================================================================
   ADVANCED · UNIT 5 — Temporal, Epistemic & Deontic
   ========================================================================= */
export const temporalUnit = unit(
  'temporal-epistemic',
  2,
  'Time, Knowledge & Duty',
  'time-outline',
  170,
  'Modal logics for programs, minds and morals.',
  [
    lesson(
      'tmp-1',
      'Temporal Logic (LTL)',
      'timer-outline',
      'Properties of systems over time.',
      7,
      [
        pg(
          'The operators',
          sym(
            { sym: 'X p', name: 'next', note: 'p holds in the next state' },
            { sym: 'F p', name: 'eventually', note: 'p holds sometime in the future' },
            { sym: 'G p', name: 'globally', note: 'p holds always from now' },
            { sym: 'p U q', name: 'until', note: 'p holds until q becomes true (and q does)' }
          ),
          p('Linear Temporal Logic (LTL) evaluates formulas along a single infinite sequence of states.')
        ),
        pg(
          'Safety and liveness',
          ex(['Safety (nothing bad happens):   G ¬(crit₁ ∧ crit₂)   mutual exclusion', 'Liveness (something good happens):   G (request → F grant)   every request is served'], 'Specifications'),
          p('Pnueli (1977) proposed temporal logic for program specification; model checking then automatically verifies finite-state systems against such formulas.')
        ),
        pg(
          'Evaluating on a trace',
          ex(['Trace: p, p, ¬p, ¬p, ¬p, …', 'F ¬p   true (it happens at step 3)', 'G p     false (it fails at step 3)', 'p U ¬p true (p holds until ¬p appears)'], 'Reading a trace')
        ),
      ],
      [
        match('Match the operator with its reading.', [['X', 'next'], ['F', 'eventually'], ['G', 'always'], ['U', 'until']], 'These four are the building blocks of LTL.'),
        mcq('“Every request is eventually granted.”', ['G (request → F grant)', 'F (request → grant)', 'X request → grant', 'request U grant'], 0, 'At every moment, a request leads to a later grant.'),
        classify(
          'Safety or liveness?',
          ['Safety', 'Liveness'],
          [
            ['Two processes are never in the critical section together.', 0],
            ['Every request is eventually answered.', 1],
            ['The reactor temperature never exceeds the limit.', 0],
            ['The program eventually terminates.', 1],
          ],
          'Safety properties forbid bad states. Liveness properties promise good ones.'
        ),
        mcq('On the trace p, p, ¬p, ¬p, …, which is true at the first state?', ['G p', 'F ¬p', 'X ¬p', 'G ¬p'], 1, '¬p happens at the third state.'),
        tf('Model checking automatically verifies a finite-state system against a temporal formula.', true, 'That is its purpose.'),
        mcq('p U q requires that…', ['p holds forever', 'q eventually holds, with p holding before that', 'q holds now', 'p and q never hold together'], 1, 'The “until” guarantees q eventually happens.'),
      ]
    ),
    lesson(
      'tmp-2',
      'Epistemic Logic',
      'eye-outline',
      'Reasoning about what agents know.',
      7,
      [
        pg(
          'Knowledge as a modality',
          p('**Kₐφ** reads “agent a knows φ”. Usually it is modelled in **S5**:'),
          list('**K:** Kₐ(φ → ψ) → (Kₐφ → Kₐψ)', '**T (factivity):** Kₐφ → φ. You can only know what is true.', '**4 (positive introspection):** Kₐφ → KₐKₐφ', '**5 (negative introspection):** ¬Kₐφ → Kₐ¬Kₐφ')
        ),
        pg(
          'Group knowledge',
          list('**Everyone knows** φ: each agent knows φ.', '**Common knowledge** of φ: everyone knows φ, everyone knows that everyone knows φ, and so on forever.'),
          p('Common knowledge is what coordination needs; “everyone knows” is not enough.')
        ),
        pg(
          'The muddy children',
          p('Several children have mud on their foreheads. Each sees the others but not themselves. A father announces: “At least one of you is muddy”, then repeatedly asks “Does anyone know whether they are muddy?”'),
          ex(['With k muddy children, nobody speaks for k − 1 rounds.', 'In round k, all the muddy children say yes.'], 'The pattern'),
          tip('The father’s announcement looks pointless (everyone could already see a muddy child when k ≥ 2), but it makes the fact common knowledge.')
        ),
      ],
      [
        tf('Under axiom T, if an agent knows φ then φ is true.', true, 'Knowledge is factive.'),
        mcq('Axiom 4 (positive introspection) says…', ['Knowing implies knowing that you know', 'Not knowing implies knowing that you do not know', 'Knowledge implies truth', 'Everyone knows everything'], 0, 'Kₐφ → KₐKₐφ.'),
        mcq('Common knowledge of φ differs from “everyone knows φ” because…', ['It adds nothing', 'It adds knowledge about knowledge at every level', 'It means φ is false', 'It requires one agent only'], 1, 'Everyone knows that everyone knows, ad infinitum.'),
        mcq('In the muddy children puzzle with 3 muddy children, they first answer yes in round…', ['1', '2', '3', '4'], 2, 'With k muddy children, they answer in round k.'),
        mcq('Why does the father’s announcement help when k ≥ 2?', ['It gives new facts nobody could see', 'It makes the fact common knowledge', 'It makes the children honest', 'It changes the number of muddy children'], 1, 'It starts the chain of reasoning about others’ knowledge.'),
        tf('Epistemic logic is typically modelled in S5.', true, 'Idealised knowledge uses equivalence relations.'),
      ]
    ),
    lesson(
      'tmp-3',
      'Deontic Logic',
      'scale-outline',
      'Obligation, permission and prohibition.',
      7,
      [
        pg(
          'The operators',
          sym(
            { sym: 'O φ', name: 'it is obligatory that φ' },
            { sym: 'P φ', name: 'it is permitted that φ', note: '≡ ¬O¬φ' },
            { sym: 'F φ', name: 'it is forbidden that φ', note: '≡ O¬φ' }
          ),
          p('Axiom **D**: Oφ → Pφ (obligations are consistent: what is obligatory is permitted).')
        ),
        pg(
          'Paradoxes',
          list('**Ross’s paradox:** from “You ought to mail the letter” we derive “You ought to mail the letter or burn it”, which sounds absurd.', '**Chisholm’s paradox (contrary-to-duty):** “You ought to help; if you help, you ought to tell; if you do not help, you ought not tell; you do not help.” Standard deontic logic produces inconsistencies.'),
          tip('These puzzles drive modern work on dyadic and defeasible deontic logics.')
        ),
        pg(
          'Why it matters',
          p('Deontic logic is used in legal reasoning, contract analysis, normative multi-agent systems and the ethics of autonomous machines.'),
          warn('“Ought implies can” is a famous principle, but it is not an axiom of the standard system.')
        ),
      ],
      [
        mcq('Fφ (“φ is forbidden”) is equivalent to…', ['O¬φ', '¬Oφ', 'Pφ', '¬Pφ ∧ Oφ'], 0, 'It is obligatory not to do it.'),
        mcq('Pφ (“permitted”) is equivalent to…', ['O¬φ', '¬O¬φ', 'Oφ', '¬Oφ'], 1, 'Permitted means not obligatory to avoid.'),
        tf('Axiom D says that whatever is obligatory is permitted.', true, 'Oφ → Pφ.'),
        mcq('Ross’s paradox arises because…', ['Oφ → O(φ ∨ ψ) is derivable', 'O is not a modality', 'Oφ implies φ', 'D is false'], 0, 'Weakening an obligation gives odd results.'),
        mcq('Chisholm’s paradox is about…', ['Contrary-to-duty obligations', 'Time travel', 'Tautologies', 'Set theory'], 0, 'What to do once a duty has been violated.'),
        tf('In standard deontic logic, O(p ∧ q) is equivalent to Op ∧ Oq.', true, 'Obligation distributes over conjunction.'),
      ]
    ),
  ]
);

/* =========================================================================
   ADVANCED · UNIT 6 — Non-Classical Logics
   ========================================================================= */
export const nonclassicalUnit = unit(
  'nonclassical',
  2,
  'Beyond Classical Logic',
  'shapes-outline',
  20,
  'Many values, constructive proofs and logics that tolerate contradiction.',
  [
    lesson(
      'nc-1',
      'Many-Valued & Fuzzy Logic',
      'color-filter-outline',
      'More than true and false.',
      8,
      [
        pg(
          'Three values',
          p('Add a third value **N** (unknown, indeterminate). Kleene’s strong three-valued logic (**K3**):'),
          list('¬N = N', 'N ∧ T = N,   N ∧ F = F', 'N ∨ T = T,   N ∨ F = N'),
          warn('In K3, p ∨ ¬p is N when p is N. So K3 has **no tautologies**: the law of excluded middle fails.')
        ),
        pg(
          'Łukasiewicz',
          p('Łukasiewicz’s Ł3 uses the same ¬, ∧, ∨ but defines the conditional so that **N → N = T**. It was motivated by Aristotle’s “sea battle tomorrow”: statements about the open future may be neither true nor false yet.'),
          tip('Which conditional you pick decides whether p → p stays a law.')
        ),
        pg(
          'Fuzzy logic',
          p('Truth comes in **degrees** between 0 and 1. Zadeh’s standard connectives:'),
          list('¬x = 1 − x', 'x ∧ y = min(x, y)', 'x ∨ y = max(x, y)'),
          ex(['Tall(Ann) = 0.7,  Heavy(Ann) = 0.4', 'Tall ∧ Heavy = 0.4', '¬Tall = 0.3'], 'Example'),
          p('Fuzzy logic models vagueness, and is used in control systems such as washing machines and cameras.')
        ),
      ],
      [
        mcq('In K3, what is N ∧ F ?', ['N', 'T', 'F'], 2, 'A false conjunct makes the conjunction false whatever the other is.'),
        mcq('In K3, what is N ∨ T ?', ['N', 'T', 'F'], 1, 'A true disjunct is enough.'),
        tf('In K3, p ∨ ¬p is always true.', false, 'When p is N, p ∨ ¬p is N. K3 has no tautologies.'),
        mcq('In fuzzy logic with min/max, Tall = 0.7 and Heavy = 0.4. What is Tall ∧ Heavy ?', ['0.7', '0.4', '1.1', '0.28'], 1, 'Conjunction takes the minimum.'),
        mcq('In fuzzy logic, ¬0.7 equals…', ['0.7', '0.3', '1.7', '0'], 1, '1 − 0.7.'),
        tf('Łukasiewicz’s Ł3 makes N → N true.', true, 'That is what distinguishes its conditional from K3’s.'),
      ]
    ),
    lesson(
      'nc-2',
      'Intuitionistic Logic',
      'construct-outline',
      'Truth means having a construction.',
      8,
      [
        pg(
          'The constructive idea',
          p('Intuitionists (Brouwer, Heyting) hold that a statement is true only when we can **construct** a proof of it. The BHK interpretation:'),
          list('A proof of **A ∧ B** is a pair: a proof of A and a proof of B.', 'A proof of **A ∨ B** is a proof of A **or** of B, with a label saying which.', 'A proof of **A → B** is a method turning any proof of A into a proof of B.', '**¬A** means A → ⊥: from a proof of A we could derive absurdity.')
        ),
        pg(
          'What changes',
          cmp(
            { title: 'Not accepted', lines: ['p ∨ ¬p  (excluded middle)', '¬¬p → p  (double negation elimination)', 'Peirce’s law ((p → q) → p) → p'] },
            { title: 'Still accepted', lines: ['p → ¬¬p', '⊥ → p  (ex falso)', '(p → q) → (¬q → ¬p)', '¬¬¬p ≡ ¬p'] }
          ),
          p('Intuitionistic provability is stronger evidence: if you prove ∃x P(x) you can produce an x.')
        ),
        pg(
          'A non-constructive proof',
          ex(['Claim: there are irrational a, b with a^b rational.', 'Either √2^√2 is rational (take a = b = √2) or irrational (take a = √2^√2, b = √2, then a^b = 2).', 'Uses excluded middle, and does not tell us which case holds.'], 'Classically fine, constructively incomplete'),
          tip('Curry–Howard: intuitionistic proofs are programs. Proof assistants such as Coq and Lean rest on this.')
        ),
      ],
      [
        mcq('Which law is NOT accepted in intuitionistic logic?', ['p → p', 'p ∨ ¬p', '⊥ → p', 'p → ¬¬p'], 1, 'The excluded middle needs a decision of which disjunct holds.'),
        mcq('Under BHK, a proof of A ∨ B is…', ['A proof of A or a proof of B, with a label', 'Any proof at all', 'A proof of A ∧ B', 'A contradiction'], 0, 'You must be able to say which one holds.'),
        tf('Double negation elimination (¬¬p → p) is valid intuitionistically.', false, 'Only the introduction direction p → ¬¬p is valid.'),
        mcq('The √2^√2 argument is…', ['Constructive', 'Non-constructive (uses excluded middle)', 'Invalid', 'An induction'], 1, 'It does not say which case holds.'),
        mcq('The Curry–Howard correspondence connects proofs with…', ['Programs', 'Truth tables', 'Venn diagrams', 'Sets only'], 0, 'Proofs are programs, propositions are types.'),
        mcq('In intuitionistic logic, ¬A is read as…', ['A → ⊥', 'A ∨ ⊥', 'A ∧ ⊤', '⊥ → A'], 0, 'A refutation of A.'),
      ]
    ),
    lesson(
      'nc-3',
      'Paraconsistent & Relevance Logic',
      'git-pull-request-outline',
      'Living with contradictions and demanding relevance.',
      8,
      [
        pg(
          'Explosion',
          p('In classical logic, **a contradiction entails everything** (ex falso quodlibet).'),
          ex(['1. p            premise', '2. ¬p           premise', '3. p ∨ q       Addition 1', '4. q            Disjunctive syllogism 2, 3'], 'From p and ¬p to any q'),
          p('One inconsistency destroys a classical theory.')
        ),
        pg(
          'Paraconsistent logic',
          p('A **paraconsistent** logic rejects explosion, so reasoning can continue in the presence of contradiction. Priest’s **LP** adds a value **B** (“both true and false”).'),
          list('Useful for inconsistent databases, legal systems and the history of science.', 'Dialetheism is the philosophical view that some contradictions are true (the Liar, perhaps).')
        ),
        pg(
          'Relevance logic',
          p('Relevance logicians say an implication needs **connection**: the antecedent must be relevant to the consequent. They reject:'),
          list('p → (q → p)', '(p ∧ ¬p) → q', 'p → (q ∨ ¬q)'),
          p('A common test is the variable-sharing property: in a valid p → q, the two sides share a propositional variable.')
        ),
      ],
      [
        mcq('Ex falso quodlibet says…', ['A contradiction entails any statement', 'Falsehood is acceptable', 'Every statement is true', 'A tautology entails everything'], 0, 'From a contradiction, anything follows.'),
        mcq('Which rule is used to derive q from p ∨ q and ¬p?', ['Modus ponens', 'Disjunctive syllogism', 'Conjunction', 'Resolution only'], 1, 'Disjunctive syllogism.'),
        tf('A paraconsistent logic rejects the principle of explosion.', true, 'That is its defining feature.'),
        mcq('Relevance logic rejects which formula?', ['p → p', 'p → (q → p)', '(p ∧ q) → p', 'p ∨ ¬p'], 1, 'The consequent q → p has nothing to do with the antecedent.'),
        mcq('In LP, B stands for…', ['Both true and false', 'Boolean', 'Believed', 'Blank'], 0, 'LP tolerates glut statements.'),
        tf('Dialetheism claims that some contradictions are true.', true, 'It is the philosophical motivation for some paraconsistent logics.'),
      ]
    ),
    lesson(
      'nc-4',
      'Non-Monotonic Reasoning',
      'refresh-outline',
      'Drawing conclusions that new facts can overturn.',
      7,
      [
        pg(
          'Monotonic vs non-monotonic',
          p('Classical logic is **monotonic**: adding premises never removes conclusions. Everyday reasoning is not.'),
          ex(['Tweety is a bird.  ⇒  Tweety flies.', 'Tweety is a penguin.  ⇒  Tweety does not fly.'], 'Retracting a conclusion')
        ),
        pg(
          'Formalisms',
          list('**Default logic (Reiter):** if bird(x) holds and it is consistent to assume flies(x), conclude flies(x).', '**Circumscription (McCarthy):** minimise abnormality, assume things are normal unless told otherwise.', '**Closed-world assumption:** what is not known to be true is assumed false (databases, Prolog’s negation as failure).')
        ),
        pg(
          'Belief revision (AGM)',
          list('**Expansion:** add a belief.', '**Contraction:** remove a belief.', '**Revision:** add a belief that conflicts with existing ones while keeping consistency.'),
          tip('Non-monotonic reasoning underlies expert systems, AI planning and common-sense reasoning.')
        ),
      ],
      [
        mcq('A logic is monotonic if…', ['Adding premises never removes conclusions', 'It has only one connective', 'It is about numbers', 'It rejects negation'], 0, 'Classical logic has this property.'),
        tf('“Birds fly, Tweety is a bird, so Tweety flies” can be withdrawn when we learn Tweety is a penguin.', true, 'That is non-monotonic behaviour.'),
        match('Match each formalism to its idea.', [['Default logic', 'Assume typical cases unless inconsistent'], ['Circumscription', 'Minimise abnormality'], ['Closed-world assumption', 'Unknown means false'], ['Belief revision', 'Accept new information consistently']], 'Each tackles defeasible reasoning differently.'),
        mcq('Negation as failure in Prolog relies on…', ['The closed-world assumption', 'Modal logic', 'Fuzzy sets', 'Intuitionism'], 0, 'If it cannot be proved it is treated as false.'),
        mcq('AGM theory is about…', ['Belief revision', 'Group theory', 'Set theory', 'Temporal logic'], 0, 'Rational ways to change beliefs.'),
        tf('Classical propositional logic is non-monotonic.', false, 'It is monotonic.'),
      ]
    ),
  ]
);
