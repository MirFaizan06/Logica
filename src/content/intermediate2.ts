import { classify, cmp, ex, lesson, list, match, mcq, p, pg, rule, sym, tf, tip, ttb, unit, warn } from './helpers';

/* =========================================================================
   INTERMEDIATE · UNIT 4 — Syllogisms Deep Dive
   ========================================================================= */
export const syllogismsDeepUnit = unit(
  'syllogisms-deep',
  1,
  'Syllogisms Deep Dive',
  'layers-outline',
  40,
  'Opposition, figures, moods and the rules of validity.',
  [
    lesson(
      'sd-1',
      'The Square of Opposition',
      'square-outline',
      'How A, E, I and O statements relate.',
      6,
      [
        pg(
          'Four relationships',
          list(
            '**Contradictories (A–O, E–I):** exactly one is true. They always have opposite truth values.',
            '**Contraries (A–E):** they cannot both be true, but both can be false.',
            '**Subcontraries (I–O):** they cannot both be false, but both can be true.',
            '**Subalternation (A to I, E to O):** if the universal is true, the particular is true (traditional view).'
          ),
          ex(['A: All dogs are brown.      E: No dogs are brown.', 'I: Some dogs are brown.   O: Some dogs are not brown.'], 'The square, spelled out')
        ),
        pg(
          'Existential import',
          p('Does “All unicorns are white” imply that unicorns exist?'),
          cmp(
            { title: 'Traditional (Aristotle)', lines: ['Terms are assumed non-empty.', 'All four relationships hold.', 'A implies I; E implies O.'] },
            { title: 'Modern (Boole, Frege)', lines: ['Terms may be empty.', 'Only contradictories survive.', 'A and E can both be true (vacuously).'] }
          ),
          tip('Modern logic reads “All S are P” as: there is nothing that is S and not P.')
        ),
        pg(
          'Using the square',
          ex(['“All S are P” is false.', '⇒ its contradictory “Some S are not P” is true.'], 'Contradictories'),
          ex(['“No S are P” is true (and S exists).', '⇒ “Some S are not P” is true.'], 'Subalternation (traditional only)'),
          warn('Under the modern reading you cannot derive “Some S are P” from “All S are P”.')
        ),
      ],
      [
        match('Match the relation with the pair.', [['Contradictories', 'A and O'], ['Contraries', 'A and E'], ['Subcontraries', 'I and O'], ['Subalternation', 'A to I']], 'Contradictories are always opposite; contraries clash from above; subcontraries from below.'),
        mcq('If “All S are P” is false, then…', ['“No S are P” is true', '“Some S are not P” is true', '“Some S are P” is false', 'Nothing follows'], 1, 'A and O are contradictories.'),
        tf('Contraries can both be false.', true, 'For example “All dogs are brown” and “No dogs are brown” are both false.'),
        tf('Subcontraries can both be true.', true, '“Some dogs are brown” and “Some dogs are not brown” can both be true.'),
        mcq('Which relationship survives in modern (Boolean) logic?', ['Contraries', 'Subcontraries', 'Subalternation', 'Contradictories'], 3, 'Without existential import, only contradictories remain.'),
        mcq('Which pair CANNOT both be true?', ['I and O', 'A and E (traditional)', 'A and I', 'E and O'], 1, 'Contraries cannot both be true when the subject exists.'),
      ]
    ),
    lesson(
      'sd-2',
      'Figures & Moods',
      'apps-outline',
      'The 256 syllogistic forms and the 24 valid ones.',
      6,
      [
        pg(
          'Mood and figure',
          list('The **mood** is the three letters of the statements: major premise, minor premise, conclusion. Example: **AAA**.', '4 forms × 4 forms × 4 forms = **64 moods**.', 'The **figure** is where the middle term M sits in the premises.'),
          sym(
            { sym: '1', name: 'M–P, S–M', note: 'middle is subject then predicate' },
            { sym: '2', name: 'P–M, S–M', note: 'middle is predicate twice' },
            { sym: '3', name: 'M–P, M–S', note: 'middle is subject twice' },
            { sym: '4', name: 'P–M, M–S', note: 'middle is predicate then subject' }
          ),
          p('64 moods × 4 figures = **256** possible forms.')
        ),
        pg(
          'Only a few survive',
          p('Of the 256, exactly **24** are valid in traditional logic: **15** unconditionally, plus **9** that need existential import.'),
          tip('Latin names such as Barbara, Celarent, Darii, Ferio encode the mood in their vowels: B-A-R-B-A-R-A is AAA.')
        ),
        pg(
          'The 15 unconditionally valid forms',
          sym(
            { sym: '1', name: 'Barbara AAA · Celarent EAE · Darii AII · Ferio EIO' },
            { sym: '2', name: 'Cesare EAE · Camestres AEE · Festino EIO · Baroco AOO' },
            { sym: '3', name: 'Datisi AII · Disamis IAI · Ferison EIO · Bocardo OAO' },
            { sym: '4', name: 'Calemes AEE · Dimatis IAI · Fresison EIO' }
          ),
          p('The Lab’s Syllogism Checker can verify any of the 256 for you.')
        ),
      ],
      [
        mcq('How many syllogistic forms (mood and figure combinations) are there?', ['24', '64', '128', '256'], 3, '4 × 4 × 4 moods, times 4 figures.'),
        mcq('The figure of a syllogism is determined by…', ['The quantity of the premises', 'The position of the middle term', 'The truth of the premises', 'The conclusion’s quality'], 1, 'Figure 1–4 describes where M sits.'),
        match('Match the name to its mood and figure.', [['Barbara', 'AAA-1'], ['Celarent', 'EAE-1'], ['Darii', 'AII-1'], ['Ferio', 'EIO-1']], 'These four are the valid forms of the first figure.'),
        mcq('In Figure 2 the middle term is…', ['Subject of both premises', 'Predicate of both premises', 'Subject then predicate', 'Predicate then subject'], 1, 'Figure 2 is P–M, S–M.'),
        tf('All 256 forms are valid.', false, 'Only 24 (or 15 without existential import) are valid.'),
        mcq('Which mood does the name “Barbara” stand for?', ['AAA', 'EAE', 'AII', 'EIO'], 0, 'The vowels in B-A-R-B-A-R-A.'),
      ]
    ),
    lesson(
      'sd-3',
      'The Rules of Validity',
      'checkmark-done-outline',
      'Six rules that decide every syllogism.',
      7,
      [
        pg(
          'The six rules',
          list(
            '1. Exactly **three terms**, each used in the same sense.',
            '2. The **middle term** must be distributed at least once.',
            '3. A term distributed in the **conclusion** must be distributed in its **premise**.',
            '4. **No two negative** premises.',
            '5. A **negative premise** if and only if a **negative conclusion**.',
            '6. Two **universal** premises cannot give a **particular** conclusion (modern reading).'
          )
        ),
        pg(
          'The matching fallacies',
          list('Rule 1: **Four terms** (equivocation)', 'Rule 2: **Undistributed middle**', 'Rule 3: **Illicit major / illicit minor**', 'Rule 4: **Exclusive premises**', 'Rule 5: **Affirmative conclusion from a negative premise** (or vice versa)', 'Rule 6: **Existential fallacy**'),
          ex(['Nothing is better than eternal happiness.', 'A ham sandwich is better than nothing.', '∴ A ham sandwich is better than eternal happiness.'], 'Four terms: “nothing” changes meaning')
        ),
        pg(
          'Running the checklist',
          ex(['All M are P.', 'Some S are M.', '∴ Some S are P.   (Darii)'], 'Rules 1–6 all pass: valid'),
          ex(['All P are M.', 'All S are M.', '∴ All S are P.'], 'Rule 2 fails: M is never distributed')
        ),
      ],
      [
        mcq('“All P are M. All S are M. ∴ All S are P.” breaks which rule?', ['Rule 1', 'Rule 2 (undistributed middle)', 'Rule 4', 'Rule 5'], 1, 'M is the predicate of two A statements, so it is never distributed.'),
        mcq('“No M are P. No S are M. ∴ No S are P.” breaks which rule?', ['Rule 2', 'Rule 3', 'Rule 4 (exclusive premises)', 'Rule 6'], 2, 'Both premises are negative.'),
        mcq('“All M are P. No S are M. ∴ No S are P.” breaks which rule?', ['Rule 3 (illicit major)', 'Rule 2', 'Rule 5', 'Rule 6'], 0, 'P is distributed in the conclusion but not in its premise (predicate of A).'),
        tf('A valid syllogism with a negative premise must have a negative conclusion.', true, 'Rule 5.'),
        mcq('“Nothing is better than happiness. Pizza is better than nothing. ∴ Pizza is better than happiness.” commits…', ['Four-term fallacy (equivocation)', 'Illicit major', 'Exclusive premises', 'Nothing, it is valid'], 0, '“Nothing” is used in two senses.'),
        mcq('“All M are P. All S are M. ∴ Some S are P.” is valid only on the traditional view because…', ['It breaks rule 1', 'It needs existential import (rule 6)', 'It has two negatives', 'M is undistributed'], 1, 'From universal premises, a particular conclusion needs non-empty classes.'),
      ]
    ),
    lesson(
      'sd-4',
      'Immediate Inferences',
      'shuffle-outline',
      'Conversion, obversion and contraposition.',
      6,
      [
        pg(
          'Conversion',
          p('Swap subject and predicate.'),
          list('**E:** No S are P ⇒ No P are S (valid).', '**I:** Some S are P ⇒ Some P are S (valid).', '**A:** All S are P ⇒ All P are S is **invalid**. (All dogs are mammals, but not all mammals are dogs.) Only “Some P are S” survives, in traditional logic.', '**O:** cannot be converted.')
        ),
        pg(
          'Obversion',
          p('Change the quality and replace the predicate with its complement (non-P). **Valid for all four forms.**'),
          ex(['A: All S are P  ⇒  No S are non-P', 'E: No S are P  ⇒  All S are non-P', 'I: Some S are P  ⇒  Some S are not non-P', 'O: Some S are not P  ⇒  Some S are non-P'], 'Obverses')
        ),
        pg(
          'Contraposition',
          p('Swap subject and predicate **and** replace both with complements.'),
          list('**A:** All S are P ⇒ All non-P are non-S (valid).', '**O:** Some S are not P ⇒ Some non-P are not non-S (valid).', '**E and I:** not valid in general.'),
          tip('Contraposition for A is the categorical version of the conditional’s contrapositive.')
        ),
      ],
      [
        mcq('The converse of “No S are P” is…', ['No P are S', 'All P are S', 'Some P are S', 'No non-P are non-S'], 0, 'E statements convert validly.'),
        tf('“All S are P” can be validly converted to “All P are S”.', false, 'All dogs are mammals does not give all mammals are dogs.'),
        mcq('The obverse of “All S are P” is…', ['No S are non-P', 'All non-P are non-S', 'Some S are non-P', 'No P are S'], 0, 'Change quality, complement the predicate.'),
        mcq('Which operation is valid for all four forms?', ['Conversion', 'Obversion', 'Contraposition', 'None'], 1, 'Obversion never loses truth.'),
        mcq('The contrapositive of “All S are P” is…', ['All non-P are non-S', 'All P are S', 'No S are P', 'All non-S are non-P'], 0, 'Swap and complement both terms.'),
        classify(
          'Is the inference valid?',
          ['Valid', 'Invalid'],
          [
            ['Some S are P  ⇒  Some P are S', 0],
            ['All S are P  ⇒  All P are S', 1],
            ['No S are P  ⇒  No P are S', 0],
            ['Some S are not P  ⇒  Some P are not S', 1],
          ],
          'I and E convert; A and O do not (in the strict sense).'
        ),
      ]
    ),
  ]
);

/* =========================================================================
   INTERMEDIATE · UNIT 5 — Predicate Logic I
   ========================================================================= */
export const predicate1Unit = unit(
  'predicate-1',
  1,
  'Predicate Logic: Quantifiers',
  'code-slash-outline',
  190,
  'Talk about objects, properties and “all” and “some”.',
  [
    lesson(
      'pred-1',
      'Predicates & Quantifiers',
      'cube-outline',
      'Going beyond whole statements.',
      6,
      [
        pg(
          'Why propositional logic is not enough',
          ex(['All humans are mortal.', 'Socrates is a human.', '∴ Socrates is mortal.'], 'Obviously valid'),
          p('Propositional logic sees three unrelated atoms p, q, r. The validity depends on the **inner structure**: classes, individuals, “all”.'),
          p('First-order (predicate) logic opens up the statements.')
        ),
        pg(
          'Predicates, constants and domains',
          list('**Predicate:** a property or relation, e.g. Human(x), Loves(x, y).', '**Constant:** names an individual, e.g. s for Socrates.', '**Domain of discourse:** what the variables range over.'),
          ex(['Human(s)', 'Loves(a, b)', 'Prime(7)'], 'Atomic formulas')
        ),
        pg(
          'The quantifiers',
          sym(
            { sym: '∀x', name: 'for all x', note: 'universal' },
            { sym: '∃x', name: 'there exists an x', note: 'existential' },
            { sym: '∃!x', name: 'exactly one x' }
          ),
          p('In a finite domain: **∀x P(x)** is a long ∧ over all objects, and **∃x P(x)** is a long ∨.'),
          tip('Always know your domain: ∀x (x > 0) is true over the positive integers, false over all integers.')
        ),
      ],
      [
        mcq('What does ∃x (Even(x) ∧ Prime(x)) say?', ['Every even number is prime', 'Some number is both even and prime', 'No even number is prime', 'Some even number is not prime'], 1, 'There exists an x that is even and prime (2).'),
        tf('Over the domain {1, 2, 3}, ∀x (x > 0) is true.', true, 'All three elements are positive.'),
        tf('Over the domain {2, 4, 6}, ∃x Odd(x) is true.', false, 'No element is odd.'),
        mcq('Over the domain {2, 3, 5, 9}, ∀x Prime(x) is…', ['True', 'False'], 1, '9 = 3 × 3 is not prime.'),
        match('Match the symbol to its reading.', [['∀', 'for all'], ['∃', 'there exists'], ['∃!', 'exactly one exists'], ['P(x)', 'a predicate applied to x']], 'The quantifiers bind variables inside predicates.'),
        mcq('“Someone loves Sam.” (s = Sam)', ['∃x Loves(x, s)', '∀x Loves(x, s)', '∃x Loves(s, x)', 'Loves(s, s)'], 0, 'There is an x who loves Sam.'),
      ]
    ),
    lesson(
      'pred-2',
      'Translating with Quantifiers',
      'language-outline',
      'The A, E, I, O forms in first-order logic.',
      7,
      [
        pg(
          'The four translations',
          sym(
            { sym: '∀x (S(x) → P(x))', name: 'All S are P' },
            { sym: '∀x (S(x) → ¬P(x))', name: 'No S are P' },
            { sym: '∃x (S(x) ∧ P(x))', name: 'Some S are P' },
            { sym: '∃x (S(x) ∧ ¬P(x))', name: 'Some S are not P' }
          ),
          tip('Rule of thumb: ∀ goes with →, ∃ goes with ∧.')
        ),
        pg(
          'Two classic mistakes',
          cmp(
            { title: 'Wrong', lines: ['∀x (Cat(x) ∧ Mammal(x))', '“Everything is a cat and a mammal”'] },
            { title: 'Right', lines: ['∀x (Cat(x) → Mammal(x))', '“Every cat is a mammal”'] }
          ),
          cmp(
            { title: 'Wrong', lines: ['∃x (Dog(x) → Friendly(x))', 'True if anything is not a dog!'] },
            { title: 'Right', lines: ['∃x (Dog(x) ∧ Friendly(x))', '“Some dog is friendly”'] }
          )
        ),
        pg(
          'Relations and nesting',
          ex(['“Every student reads some book.”', '∀x (Student(x) → ∃y (Book(y) ∧ Reads(x, y)))'], 'Nested'),
          p('Read it from the outside in: for every student x, there is a book y such that x reads y.')
        ),
      ],
      [
        mcq('“All cats are mammals.”', ['∀x (Cat(x) → Mammal(x))', '∀x (Cat(x) ∧ Mammal(x))', '∃x (Cat(x) ∧ Mammal(x))', '∃x (Cat(x) → Mammal(x))'], 0, 'Universal statements pair with a conditional.'),
        mcq('“Some dogs are friendly.”', ['∃x (Dog(x) ∧ Friendly(x))', '∃x (Dog(x) → Friendly(x))', '∀x (Dog(x) → Friendly(x))', '∀x (Dog(x) ∧ Friendly(x))'], 0, 'Existential statements pair with a conjunction.'),
        tf('∃x (S(x) → P(x)) is true whenever something is not an S.', true, 'A false antecedent makes the conditional true.'),
        mcq('“No birds are mammals.”', ['∀x (Bird(x) → ¬Mammal(x))', '∃x (Bird(x) ∧ ¬Mammal(x))', '¬∀x (Bird(x) → Mammal(x))', '∀x (Bird(x) ∧ ¬Mammal(x))'], 0, 'Every bird is a non-mammal.'),
        mcq('“Every student reads some book.”', ['∀x (Student(x) → ∃y (Book(y) ∧ Reads(x, y)))', '∃y ∀x (Student(x) → Reads(x, y))', '∀x ∃y (Student(x) ∧ Book(y) ∧ Reads(x, y))', '∃x (Student(x) ∧ ∀y Reads(x, y))'], 0, 'The first is the faithful translation.'),
        mcq('“Some cats are not black.”', ['∃x (Cat(x) ∧ ¬Black(x))', '∀x (Cat(x) → ¬Black(x))', '∃x (Cat(x) → ¬Black(x))', '¬∃x (Cat(x) ∧ Black(x))'], 0, 'There exists a cat that is not black.'),
      ]
    ),
    lesson(
      'pred-3',
      'Negating Quantifiers',
      'remove-circle-outline',
      'Quantifier duality, scope and bound variables.',
      6,
      [
        pg(
          'Quantifier duality',
          rule('Negating ∀', ['¬∀x P(x)'], '∃x ¬P(x)'),
          rule('Negating ∃', ['¬∃x P(x)'], '∀x ¬P(x)'),
          ex(['“Not everyone passed.”  ≡  “Someone failed.”', '“Nobody is perfect.”  ≡  “Everyone is imperfect.”'], 'In English'),
          p('This is De Morgan for quantifiers: ∀ behaves like a huge ∧, ∃ like a huge ∨.')
        ),
        pg(
          'Negating translated statements',
          ex(['¬∀x (S(x) → P(x))', '≡ ∃x ¬(S(x) → P(x))', '≡ ∃x (S(x) ∧ ¬P(x))'], '“Not all S are P” = “Some S are not P”')
        ),
        pg(
          'Scope and variables',
          list('A variable is **bound** if a quantifier governs it; otherwise it is **free**.', 'In ∀x (P(x) → Q(x)) both x are bound.', 'In ∀x P(x) → Q(x) the last x is free: the quantifier covers only P(x).', 'Bound variables can be renamed: ∀x P(x) ≡ ∀y P(y).'),
          warn('Parentheses change meaning. Always check how far a quantifier reaches.')
        ),
      ],
      [
        mcq('¬∀x P(x) is equivalent to…', ['∀x ¬P(x)', '∃x ¬P(x)', '∃x P(x)', '¬∃x P(x)'], 1, 'Not everything is P means something is not P.'),
        mcq('¬∃x P(x) is equivalent to…', ['∀x ¬P(x)', '∃x ¬P(x)', '∀x P(x)', '∃x P(x)'], 0, 'There is no P means everything is not P.'),
        mcq('The negation of “Every student passed” is…', ['No student passed', 'Some student did not pass', 'Some student passed', 'Every student failed'], 1, 'Only one failure is needed to refute “every”.'),
        tf('¬∀x (S(x) → P(x)) is equivalent to ∃x (S(x) ∧ ¬P(x)).', true, 'Push the negation inward and use ¬(p → q) ≡ p ∧ ¬q.'),
        mcq('In ∀x P(x) → Q(x), the variable x in Q(x) is…', ['Bound', 'Free', 'A constant', 'Renamed'], 1, 'The quantifier ends after P(x).'),
        tf('∀x P(x) is equivalent to ∀y P(y).', true, 'Renaming a bound variable does not change meaning.'),
      ]
    ),
  ]
);

/* =========================================================================
   INTERMEDIATE · UNIT 6 — Boolean Algebra & Digital Logic
   ========================================================================= */
export const booleanUnit = unit(
  'boolean',
  1,
  'Boolean Algebra & Digital Logic',
  'hardware-chip-outline',
  205,
  'Logic made of silicon: gates, simplification and adders.',
  [
    lesson(
      'bool-1',
      'Logic Gates',
      'flash-outline',
      'AND, OR, NOT and their friends.',
      5,
      [
        pg(
          'Gates are logic in hardware',
          p('A **logic gate** takes bits (1 = true, 0 = false) and outputs a bit. Engineers write Boolean algebra with **·** (and), **+** (or) and a **bar or prime** (not).'),
          sym(
            { sym: 'A · B', name: 'AND', note: 'A ∧ B' },
            { sym: 'A + B', name: 'OR', note: 'A ∨ B' },
            { sym: "A'", name: 'NOT', note: '¬A' }
          )
        ),
        pg(
          'More gates',
          ttb('p ↑ q', 'p ↓ q', 'p ⊕ q', 'p ↔ q'),
          list('**NAND** (↑): NOT of AND', '**NOR** (↓): NOT of OR', '**XOR** (⊕): 1 when inputs differ', '**XNOR** (↔): 1 when inputs are equal')
        ),
        pg(
          'NAND is universal',
          p('You can build every other gate from NAND alone:'),
          ex(['NOT a  =  NAND(a, a)', 'a AND b  =  NOT(NAND(a, b))  =  NAND(NAND(a, b), NAND(a, b))', 'a OR b  =  NAND(NOT a, NOT b)   (De Morgan)'], 'NAND constructions'),
          tip('Real chips are made mostly from NAND or NOR for this reason.')
        ),
      ],
      [
        mcq('NAND(1, 1) =', ['0', '1'], 0, 'AND gives 1, so NAND gives 0.'),
        tf('NOR(0, 0) = 1.', true, 'OR(0, 0) = 0, NOT gives 1.'),
        mcq('Which gate outputs 1 only when its inputs differ?', ['AND', 'OR', 'XOR', 'XNOR'], 2, 'Exclusive or.'),
        mcq('How do you build NOT x from a NAND gate?', ['NAND(x, 0)', 'NAND(x, x)', 'NAND(x, 1)', 'You cannot'], 1, 'NAND(x, x) = NOT(x AND x) = NOT x.'),
        tf('Any Boolean function can be built using only NAND gates.', true, 'NAND is functionally complete.'),
        match('Match the gate to its Boolean expression.', [['AND', 'A · B'], ['OR', 'A + B'], ['NOT', "A'"], ['XOR', 'A ⊕ B']], 'The same operations, different notation.'),
      ]
    ),
    lesson(
      'bool-2',
      'Boolean Algebra & Simplification',
      'color-wand-outline',
      'Fewer gates, same behaviour.',
      7,
      [
        pg(
          'The laws, with 0 and 1',
          list('A + 0 = A,   A + 1 = 1', 'A · 1 = A,   A · 0 = 0', 'A + A = A,   A · A = A', "A + A' = 1,   A · A' = 0", "(AB)' = A' + B',   (A + B)' = A'B'   (De Morgan)"),
          p('A very useful identity:'),
          ex(["A + A'B", "= (A + A')(A + B)      distribution", '= 1 · (A + B)', '= A + B'], "A + A'B = A + B")
        ),
        pg(
          'Simplifying',
          ex(["AB + AB' = A(B + B') = A", 'A + AB = A(1 + B) = A', "(A + B)(A + B') = A + BB' = A"], 'Quick wins'),
          tip('Every gate you remove saves money, space and power in real hardware.')
        ),
        pg(
          'Karnaugh maps',
          p('A **Karnaugh map** lays out a truth table in a grid where neighbouring cells differ in one variable. Circle groups of 1s whose size is a power of two (1, 2, 4, 8…); each group becomes one simple term.'),
          list('Cells are ordered in **Gray code** (00, 01, 11, 10).', 'The map wraps around the edges.', 'Bigger groups mean simpler terms.')
        ),
      ],
      [
        mcq("Simplify A + A'B.", ['A', 'B', 'A + B', 'AB'], 2, 'Using distribution: (A + A\')(A + B) = A + B.'),
        mcq("Simplify AB + AB'.", ['A', 'B', 'AB', '1'], 0, "A(B + B') = A."),
        tf("(A + B)(A + B') equals A.", true, "A + BB' = A + 0 = A."),
        mcq("A · A' =", ['A', '1', '0', "A'"], 2, 'A thing and its negation never both hold.'),
        mcq('In a Karnaugh map, groups of 1s must have a size that is…', ['Any number', 'A power of two', 'A prime number', 'Even only'], 1, 'Groups of 1, 2, 4, 8…'),
        mcq('Why are Karnaugh map cells ordered 00, 01, 11, 10?', ['Alphabetical order', 'Neighbours differ in exactly one bit (Gray code)', 'It looks nice', 'Binary counting'], 1, 'That adjacency lets groups represent simpler terms.'),
      ]
    ),
    lesson(
      'bool-3',
      'Circuits That Compute',
      'calculator-outline',
      'Half adders, full adders and multiplexers.',
      6,
      [
        pg(
          'The half adder',
          p('Adds two bits A and B, producing a **sum** and a **carry**:'),
          list('Sum = A ⊕ B', 'Carry = A · B'),
          ex(['1 + 1 = 10 in binary:', 'sum = 0, carry = 1'], 'Example')
        ),
        pg(
          'The full adder',
          p('Adds A, B and an incoming carry C:'),
          list('Sum = A ⊕ B ⊕ C', 'Carry out = AB + C(A ⊕ B)'),
          ex(['1 + 1 + 1 = 11 in binary:', 'sum = 1, carry out = 1'], 'Example'),
          p('Chain full adders and you can add numbers of any width.')
        ),
        pg(
          'Multiplexer',
          p('A **multiplexer** selects one of its inputs.'),
          ex(["out = S'·A + S·B", 'S = 0 → out = A', 'S = 1 → out = B'], '2-to-1 mux'),
          tip('A CPU is, at heart, an enormous collection of these small circuits.')
        ),
      ],
      [
        mcq('A half adder with inputs 1 and 1 gives…', ['sum 0, carry 1', 'sum 1, carry 0', 'sum 1, carry 1', 'sum 0, carry 0'], 0, '1 + 1 = 10 in binary.'),
        mcq('A full adder with inputs 1, 1, 1 gives…', ['sum 0, carry 1', 'sum 1, carry 1', 'sum 1, carry 0', 'sum 0, carry 0'], 1, '1 + 1 + 1 = 11.'),
        tf('The sum bit of a half adder is an XOR of the inputs.', true, 'Sum = A ⊕ B.'),
        mcq('The carry bit of a half adder is…', ['A ⊕ B', 'A + B', 'A · B', "A'"], 2, 'A carry occurs only when both bits are 1.'),
        mcq('In a 2-to-1 multiplexer with S = 1, the output is…', ['A', 'B', 'S', '0'], 1, 'S selects input B.'),
        mcq('What is 101 + 011 in binary?', ['1000', '0110', '1010', '1100'], 0, '5 + 3 = 8 = 1000.'),
      ]
    ),
  ]
);

/* =========================================================================
   INTERMEDIATE · UNIT 7 — Sets, Relations & Functions
   ========================================================================= */
export const setsUnit = unit(
  'sets-relations',
  1,
  'Sets, Relations & Functions',
  'git-network-outline',
  150,
  'The mathematical language logic is written in.',
  [
    lesson(
      'set-1',
      'Sets as Logic',
      'ellipse-outline',
      'Every set operation has a logical twin.',
      6,
      [
        pg(
          'Set operations ↔ connectives',
          sym(
            { sym: 'A ∪ B', name: 'x ∈ A  ∨  x ∈ B', note: 'union' },
            { sym: 'A ∩ B', name: 'x ∈ A  ∧  x ∈ B', note: 'intersection' },
            { sym: 'Aᶜ', name: '¬ (x ∈ A)', note: 'complement' },
            { sym: 'A \\ B', name: 'x ∈ A  ∧  x ∉ B', note: 'difference' },
            { sym: 'A ⊆ B', name: '∀x (x ∈ A → x ∈ B)', note: 'subset' }
          )
        ),
        pg(
          'Same laws, new clothes',
          list('De Morgan: (A ∪ B)ᶜ = Aᶜ ∩ Bᶜ and (A ∩ B)ᶜ = Aᶜ ∪ Bᶜ', 'Distribution: A ∩ (B ∪ C) = (A ∩ B) ∪ (A ∩ C)', 'Empty set ∅ plays the role of ⊥; the universal set U plays ⊤.'),
          tip('Any proposition law has a set version: draw Venn diagrams to see why.')
        ),
        pg(
          'Counting',
          p('The inclusion–exclusion formula for two sets:'),
          ex(['|A ∪ B| = |A| + |B| − |A ∩ B|'], 'Do not count the overlap twice'),
          p('A set with n elements has **2ⁿ** subsets (its power set).')
        ),
      ],
      [
        mcq('A ⊆ B means in logical terms…', ['∃x (x ∈ A ∧ x ∈ B)', '∀x (x ∈ A → x ∈ B)', '∀x (x ∈ B → x ∈ A)', 'x ∈ A ∨ x ∈ B'], 1, 'Every element of A is an element of B.'),
        mcq('Union corresponds to which connective?', ['∧', '∨', '→', '¬'], 1, 'x ∈ A ∪ B iff x ∈ A or x ∈ B.'),
        tf('(A ∪ B)ᶜ = Aᶜ ∩ Bᶜ', true, 'De Morgan for sets.'),
        mcq('|A| = 5, |B| = 4 and |A ∩ B| = 2. What is |A ∪ B|?', ['9', '7', '6', '11'], 1, '5 + 4 − 2 = 7.'),
        mcq('How many subsets does a 3-element set have?', ['3', '6', '8', '9'], 2, '2³ = 8.'),
        mcq('A \\ B is the same as…', ['A ∩ Bᶜ', 'A ∪ Bᶜ', 'Aᶜ ∩ B', 'B \\ A'], 0, 'In A and not in B.'),
      ]
    ),
    lesson(
      'set-2',
      'Relations',
      'swap-vertical-outline',
      'Reflexive, symmetric, transitive and what they build.',
      6,
      [
        pg(
          'Properties of a relation R on a set',
          list('**Reflexive:** ∀x  xRx', '**Symmetric:** xRy → yRx', '**Antisymmetric:** xRy ∧ yRx → x = y', '**Transitive:** xRy ∧ yRz → xRz'),
          ex(['“=” on numbers: reflexive, symmetric, transitive.', '“<” on numbers: transitive and antisymmetric, but not reflexive.', '“is a sibling of”: symmetric, not reflexive (usually).', '“is a parent of”: none of the above.'], 'Examples')
        ),
        pg(
          'Equivalence relations',
          p('Reflexive + symmetric + transitive. They slice a set into disjoint **equivalence classes**.'),
          ex(['“same remainder when divided by 3” on the integers gives three classes: {…,−3,0,3,…}, {…,1,4,…}, {…,2,5,…}'], 'Congruence mod 3')
        ),
        pg(
          'Partial orders',
          p('Reflexive + antisymmetric + transitive. Examples: ≤ on numbers, ⊆ on sets, divides on positive integers.'),
          tip('In a partial order some elements may be incomparable: neither {1} ⊆ {2} nor {2} ⊆ {1}.')
        ),
      ],
      [
        tf('“<” on the integers is reflexive.', false, 'x < x is never true.'),
        tf('“≤” on numbers is antisymmetric.', true, 'If x ≤ y and y ≤ x then x = y.'),
        mcq('An equivalence relation must be…', ['Reflexive, symmetric, transitive', 'Reflexive, antisymmetric, transitive', 'Symmetric only', 'Transitive only'], 0, 'Those three properties together.'),
        mcq('How many equivalence classes does “same remainder mod 3” have on the integers?', ['1', '2', '3', 'Infinitely many'], 2, 'Remainders 0, 1, 2.'),
        mcq('“Divides” on the positive integers is…', ['An equivalence relation', 'A partial order', 'Neither', 'Symmetric'], 1, 'Reflexive, antisymmetric, transitive.'),
        mcq('“Is a parent of” is NOT…', ['Transitive', 'Reflexive', 'Both', 'Neither'], 2, 'A parent of a parent is a grandparent, and no one is their own parent.'),
      ]
    ),
    lesson(
      'set-3',
      'Functions & Cardinality',
      'trending-up-outline',
      'One-to-one, onto, and different sizes of infinity.',
      7,
      [
        pg(
          'Functions',
          p('A **function** f: A → B gives each element of A exactly one output in B.'),
          list('**Injective** (one-to-one): different inputs give different outputs.', '**Surjective** (onto): every element of B is hit.', '**Bijective:** both. A perfect pairing.'),
          ex(['f(x) = 2x on the integers is injective but not onto (odd numbers are never hit).', 'f(x) = x² on the integers is neither injective (f(2) = f(−2)) nor onto.'], 'Examples')
        ),
        pg(
          'Counting infinite sets',
          p('Two sets have the **same cardinality** if there is a bijection between them. A set is **countable** if it can be matched with the natural numbers.'),
          list('The integers and the even numbers are both countable.', 'Surprise: the even numbers are “as many” as all natural numbers: n ↦ 2n.')
        ),
        pg(
          'Cantor’s diagonal argument',
          p('Suppose you could list all real numbers between 0 and 1. Build a new number whose n-th digit differs from the n-th digit of the n-th listed number. It is not on the list. So no list works: the reals are **uncountable**.'),
          tip('Some infinities really are bigger than others.')
        ),
      ],
      [
        mcq('An injective function is…', ['Every output is hit', 'Different inputs give different outputs', 'It has no inputs', 'Both injective and surjective'], 1, 'One-to-one.'),
        mcq('f(x) = x² on the integers is…', ['Injective only', 'Surjective only', 'Both', 'Neither'], 3, 'f(2) = f(−2), and negative numbers are never hit.'),
        tf('If there is a bijection between two sets, they have the same cardinality.', true, 'That is the definition of equal cardinality.'),
        mcq('Which set is uncountable?', ['The integers', 'The even numbers', 'The real numbers', 'The rational numbers'], 2, 'Cantor’s diagonal argument.'),
        mcq('How many functions are there from a 2-element set to a 3-element set?', ['5', '6', '8', '9'], 3, 'Each of the 2 inputs has 3 choices: 3² = 9.'),
        tf('The even numbers are countable.', true, 'The bijection n ↦ 2n pairs them with the natural numbers.'),
      ]
    ),
  ]
);
