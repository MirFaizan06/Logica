import { classify, cmp, ex, lesson, list, match, mcq, multi, order, p, pg, rule, sym, tf, tip, unit, venn, warn } from './helpers';

/* =========================================================================
   BEGINNER · UNIT 4 — Classic Syllogisms
   ========================================================================= */
export const syllogismsUnit = unit(
  'syllogisms',
  0,
  'Classic Syllogisms',
  'business-outline',
  35,
  'Aristotle’s logic of “all”, “no” and “some”.',
  [
    lesson(
      'syl-1',
      'All, No, Some',
      'ellipse-outline',
      'The four categorical statements A, E, I, O.',
      5,
      [
        pg(
          'Statements about categories',
          p('Aristotle studied statements that relate **two classes** (categories). Every such statement has a **subject term (S)** and a **predicate term (P)** and takes one of four forms:'),
          sym(
            { sym: 'A', name: 'All S are P', note: 'universal affirmative' },
            { sym: 'E', name: 'No S are P', note: 'universal negative' },
            { sym: 'I', name: 'Some S are P', note: 'particular affirmative' },
            { sym: 'O', name: 'Some S are not P', note: 'particular negative' }
          ),
          tip('Mnemonic: AffIrmo (A and I affirm), nEgO (E and O negate).')
        ),
        pg(
          'Quality and quantity',
          list('**Quality:** affirmative (A, I) or negative (E, O).', '**Quantity:** universal (A, E: all/none) or particular (I, O: some).'),
          warn('In logic, **“some” means “at least one”**. It does not mean “not all”. “Some S are P” leaves open that all S are P.')
        ),
        pg(
          'Seeing them as circles',
          p('Each statement says something about the overlap of the S and P circles. Shaded means **empty**; × means **something is there**.'),
          venn('A', 'E', 'I', 'O')
        ),
      ],
      [
        match('Match the form to its wording.', [['A', 'All S are P'], ['E', 'No S are P'], ['I', 'Some S are P'], ['O', 'Some S are not P']], 'A and E are universal; I and O are particular.'),
        mcq('“Some dogs are not friendly” is of form…', ['A', 'E', 'I', 'O'], 3, 'Particular + negative = O.'),
        mcq('“No cats are reptiles” has what quality and quantity?', ['Affirmative, universal', 'Negative, universal', 'Affirmative, particular', 'Negative, particular'], 1, 'E-statement: negative and universal.'),
        tf('In logic, “Some S are P” means exactly one S is P.', false, '“Some” means at least one.'),
        mcq('Which two forms are affirmative?', ['A and E', 'A and I', 'E and O', 'I and O'], 1, 'A and I affirm; E and O deny.'),
        mcq('The contradictory (exact denial) of “All S are P” is…', ['No S are P', 'Some S are P', 'Some S are not P', 'All P are S'], 2, 'To refute “all” you need just one counter-instance: “Some S are not P”.'),
      ]
    ),
    lesson(
      'syl-2',
      'The Syllogism',
      'extension-puzzle-outline',
      'Two premises, one conclusion, three terms.',
      5,
      [
        pg(
          'Anatomy of a syllogism',
          p('A **categorical syllogism** has **two premises** and a **conclusion**, using exactly **three terms**:'),
          list('**Minor term (S):** subject of the conclusion', '**Major term (P):** predicate of the conclusion', '**Middle term (M):** appears in both premises, never in the conclusion'),
          ex(['All mammals are warm-blooded.   (major premise: M–P)', 'All dogs are mammals.   (minor premise: S–M)', '∴ All dogs are warm-blooded.   (S–P)'], 'Barbara (AAA-1)')
        ),
        pg(
          'The middle term is the bridge',
          p('The middle term connects S and P. If it fails to connect them, the argument breaks.'),
          cmp(
            { title: 'Valid', lines: ['All roses are flowers.', 'All flowers are plants.', '∴ All roses are plants.'] },
            { title: 'Invalid', lines: ['All cats are animals.', 'All dogs are animals.', '∴ All cats are dogs.'] }
          )
        ),
        pg(
          'Quick sanity rules',
          list('A **negative** premise requires a **negative** conclusion.', 'Two **negative** premises: nothing follows.', 'Two **particular** premises: nothing follows.', 'The middle term must link S and P.'),
          tip('We will prove these rules in the Intermediate level. For now use them as red flags.')
        ),
      ],
      [
        mcq('“All poets are artists. All artists are dreamers. ∴ All poets are dreamers.” What is the middle term?', ['poets', 'artists', 'dreamers', 'all'], 1, '“Artists” appears in both premises and not in the conclusion.'),
        mcq('In the same argument, which is the major term?', ['poets', 'artists', 'dreamers'], 2, 'The major term is the predicate of the conclusion: dreamers.'),
        tf('“All roses are flowers. All flowers are plants. ∴ All roses are plants.” is valid.', true, 'This is Barbara: a chain of “all” statements.'),
        tf('“All cats are animals. All dogs are animals. ∴ All cats are dogs.” is valid.', false, 'The middle term (animals) does not connect cats to dogs.'),
        order('Arrange this syllogism properly (major premise, minor premise, conclusion).', ['All mammals are warm-blooded.', 'All dogs are mammals.', 'Therefore, all dogs are warm-blooded.'], 'The major premise contains the major term (warm-blooded); the minor premise contains the minor term (dogs).'),
        mcq('“No reptiles are mammals. All snakes are reptiles. ∴ No snakes are mammals.”', ['Valid (Celarent)', 'Invalid: undistributed middle', 'Invalid: two negatives', 'Invalid: affirmative from negative'], 0, 'Snakes ⊂ reptiles, and reptiles do not overlap mammals; so snakes do not either.'),
      ]
    ),
    lesson(
      'syl-3',
      'Testing with Venn Diagrams',
      'radio-button-off-outline',
      'Draw the premises, then see if the conclusion is forced.',
      6,
      [
        pg(
          'The two-circle recipe',
          list('**Shade** a region to say it is **empty**.', 'Put an **×** in a region to say **something exists** there.', '“All S are P” shades the part of S outside P.', '“No S are P” shades the overlap.'),
          venn('A', 'E')
        ),
        pg(
          'Three circles, three terms',
          p('For a syllogism draw three overlapping circles (S, P, M). Diagram **both premises**, then look at the picture.'),
          list('**Universal** premises first (shading), then particular premises (×).', 'If the **conclusion is already drawn** after the premises, the syllogism is valid.', 'If you had to add anything extra, it is invalid.'),
          tip('Try this in the Lab → Syllogism Checker: it draws the Venn diagram for you.')
        ),
        pg(
          'The circles never lie',
          p('Venn diagrams make intuition rigorous. They also reveal the subtle issue of **existential import**: does “All unicorns are magical” imply that unicorns exist? Modern logic says no; Aristotle said yes. We will revisit this.'),
          venn('I', 'O')
        ),
      ],
      [
        mcq('In a Venn diagram, shading a region means…', ['It contains exactly one thing', 'It is empty', 'It is the conclusion', 'It is the middle term'], 1, 'Shading eliminates a region.'),
        mcq('An × in the overlap of S and P represents…', ['All S are P', 'No S are P', 'Some S are P', 'Some S are not P'], 2, 'There exists something in both S and P.'),
        tf('When testing a syllogism you should draw the particular premises before the universal ones.', false, 'Draw universal premises first; shading tells you where an × may legitimately go.'),
        mcq('To diagram “No S are P” we shade…', ['S outside P', 'The overlap of S and P', 'P outside S', 'Everything'], 1, 'No S are P means the overlap is empty.'),
        mcq('To diagram “All S are P” we shade…', ['The overlap', 'The part of S outside P', 'The part of P outside S', 'Nothing'], 1, 'Anything in S must lie in P, so S-outside-P is empty.'),
        tf('If, after drawing both premises, the conclusion is already shown, the syllogism is valid.', true, 'That is the Venn test for validity.'),
      ]
    ),
  ]
);

/* =========================================================================
   BEGINNER · UNIT 5 — Fallacies
   ========================================================================= */
export const fallaciesUnit = unit(
  'fallacies',
  0,
  'Spotting Fallacies',
  'warning-outline',
  15,
  'Reasoning errors that look convincing, formal and informal.',
  [
    lesson(
      'fal-1',
      'Affirming & Denying',
      'repeat-outline',
      'Two valid conditional forms and their evil twins.',
      5,
      [
        pg(
          'Two valid forms',
          rule('Modus ponens', ['P → Q', 'P'], 'Q'),
          rule('Modus tollens', ['P → Q', '¬Q'], '¬P'),
          p('“Affirm the antecedent” (MP) and “deny the consequent” (MT) are valid. Their mirror images are not.')
        ),
        pg(
          'Affirming the consequent',
          rule('Fallacy', ['P → Q', 'Q'], 'P'),
          ex(['If it rains, the street is wet.', 'The street is wet.', '∴ It rained.   (fallacy)'], 'Not so fast'),
          p('The street could be wet because of a hose, a burst pipe, or a street cleaner. **Counterexample:** P false, Q true makes both premises true and the conclusion false.')
        ),
        pg(
          'Denying the antecedent',
          rule('Fallacy', ['P → Q', '¬P'], '¬Q'),
          ex(['If you study, you pass.', 'You did not study.', '∴ You will fail.   (fallacy)'], 'Not so fast'),
          p('You might still pass, by luck or prior knowledge. Same counterexample: P false, Q true.'),
          tip('Check which part the second premise talks about: the **antecedent** (first half) or **consequent** (second half) and whether it affirms or denies it. Only “affirm antecedent” and “deny consequent” are valid.')
        ),
      ],
      [
        mcq('“If you study, you pass. You passed. ∴ You studied.”', ['Modus ponens', 'Modus tollens', 'Affirming the consequent', 'Denying the antecedent'], 2, 'The second premise affirms the consequent.'),
        mcq('“If it is a square, it has four sides. It is not a square. ∴ It does not have four sides.”', ['Modus ponens', 'Modus tollens', 'Affirming the consequent', 'Denying the antecedent'], 3, 'The second premise denies the antecedent, which is invalid (rectangles have four sides too).'),
        tf('Modus tollens is a fallacy.', false, 'Modus tollens (P → Q, ¬Q ∴ ¬P) is perfectly valid.'),
        match('Match the pattern to its name.', [['P→Q, P ∴ Q', 'Modus ponens'], ['P→Q, ¬Q ∴ ¬P', 'Modus tollens'], ['P→Q, Q ∴ P', 'Affirming the consequent'], ['P→Q, ¬P ∴ ¬Q', 'Denying the antecedent']], 'The first two are valid; the last two are fallacies.'),
        mcq('Which truth assignment shows that affirming the consequent is invalid?', ['P = T, Q = T', 'P = F, Q = T', 'P = T, Q = F', 'P = F, Q = F'], 1, 'With P false and Q true, P → Q is true and Q is true, yet P is false.'),
        classify(
          'Valid or fallacy?',
          ['Valid', 'Fallacy'],
          [
            ['If it snows, school closes. It snows. So school closes.', 0],
            ['If it snows, school closes. School closed. So it snowed.', 1],
            ['If it snows, school closes. School is open. So it did not snow.', 0],
            ['If it snows, school closes. It did not snow. So school is open.', 1],
          ],
          'Affirm-the-antecedent and deny-the-consequent are valid. The other two are classic fallacies.'
        ),
      ]
    ),
    lesson(
      'fal-2',
      'Syllogistic Slip-ups',
      'git-compare-outline',
      'When the middle term fails and conclusions overreach.',
      6,
      [
        pg(
          'Undistributed middle',
          ex(['All dogs are mammals.', 'All cats are mammals.', '∴ All cats are dogs.   (fallacy)'], 'The classic'),
          p('A term is **distributed** if a statement says something about **all** members of it. The middle term must be distributed in at least one premise, otherwise the premises never really link S and P.'),
          list('**A:** subject distributed', '**E:** both distributed', '**I:** neither', '**O:** predicate distributed')
        ),
        pg(
          'Illicit major / minor',
          p('A term that is distributed in the conclusion must be distributed in its premise. Otherwise the conclusion claims too much.'),
          ex(['All dogs are mammals.', 'No cats are dogs.', '∴ No cats are mammals.   (fallacy)'], 'Illicit major'),
          p('“Mammals” is claimed about in full in the conclusion (“no cats are mammals”) but the premise only said dogs are mammals, not all mammals are dogs.')
        ),
        pg(
          'Negatives and particulars',
          list('**Exclusive premises:** two negative premises prove nothing.', '**Affirmative from negative:** a negative premise cannot give an affirmative conclusion.', '**Two particular premises** prove nothing.'),
          ex(['No reptiles are mammals.', 'No snakes are mammals.', '∴ No snakes are reptiles.   (fallacy)'], 'Exclusive premises')
        ),
      ],
      [
        tf('“All A are B. All C are B. ∴ All A are C.” is valid.', false, 'This is the undistributed middle fallacy. B is never distributed.'),
        mcq('“All poets are dreamers. All philosophers are dreamers. ∴ All poets are philosophers.” commits…', ['Illicit major', 'Undistributed middle', 'Exclusive premises', 'Nothing, it is valid'], 1, '“Dreamers” is the predicate of two A-statements, so it is never distributed.'),
        mcq('“No reptiles are mammals. No snakes are mammals. ∴ No snakes are reptiles.” commits…', ['Undistributed middle', 'Exclusive premises', 'Illicit minor', 'Nothing'], 1, 'Both premises are negative, so nothing follows.'),
        multi('Which statements distribute their SUBJECT term?', ['A (All S are P)', 'E (No S are P)', 'I (Some S are P)', 'O (Some S are not P)'], [0, 1], 'A and E (the universal forms) distribute their subjects.'),
        mcq('Which form distributes ONLY its predicate?', ['A', 'E', 'I', 'O'], 3, 'O: “Some S are not P” says all of P is excluded from some S.'),
        tf('Two particular premises can validly imply a conclusion.', false, 'Two particular premises (I/O) never yield a valid syllogism.'),
      ]
    ),
    lesson(
      'fal-3',
      'Everyday Fallacies',
      'megaphone-outline',
      'Informal fallacies you meet in arguments, ads and politics.',
      5,
      [
        pg(
          'Attacking the wrong target',
          list('**Ad hominem:** attack the person, not the argument. “Ignore his climate data, he can’t even drive well.”', '**Straw man:** distort the position, then refute the distortion. “She wants speed limits? So she wants us crawling!”', '**Red herring:** change the subject. “Why worry about the budget? Look at the weather!”', '**Tu quoque:** “You do it too.”')
        ),
        pg(
          'Bad structure, bad support',
          list('**False dilemma:** only two options offered. “Either you are with us or against us.”', '**Slippery slope:** unsupported chain of doom. “One pet and soon the house is a zoo.”', '**Circular reasoning:** the conclusion is assumed in the premise. “The book is true because it says so.”', '**Begging the question:** same family: assuming what is to be proved.')
        ),
        pg(
          'Bad evidence',
          list('**Hasty generalisation:** tiny sample, huge claim.', '**Post hoc:** “after, therefore because”. “I wore lucky socks and we won.”', '**Appeal to authority:** an irrelevant “expert”. “A famous actor says this supplement works.”', '**Bandwagon:** “Everyone is buying it, so it must be good.”'),
          tip('Spotting a fallacy does not prove the conclusion false. It shows the argument fails to support it.')
        ),
      ],
      [
        match('Match each fallacy to its description.', [['Ad hominem', 'Attacks the person'], ['Straw man', 'Distorts the position'], ['False dilemma', 'Only two options offered'], ['Slippery slope', 'Unjustified chain of consequences']], 'These four are among the most common informal fallacies.'),
        mcq('“Don’t trust her tax plan; she once lost an election.”', ['Ad hominem', 'Straw man', 'Red herring', 'Valid argument'], 0, 'It attacks the person rather than the plan.'),
        mcq('“My two neighbours are rude, so everyone in that town is rude.”', ['Hasty generalisation', 'Post hoc', 'Bandwagon', 'Circular reasoning'], 0, 'A tiny sample for a sweeping claim.'),
        mcq('“This law is right because the law says so.”', ['Circular reasoning', 'False dilemma', 'Slippery slope', 'Appeal to authority'], 0, 'The premise merely restates the conclusion.'),
        mcq('“Everyone is buying it, so it must be good.”', ['Bandwagon', 'Ad hominem', 'Straw man', 'Red herring'], 0, 'Popularity is not evidence of quality.'),
        mcq('“I wore my lucky socks and we won, so the socks caused the win.”', ['Post hoc', 'Straw man', 'False dilemma', 'Red herring'], 0, 'Post hoc ergo propter hoc: mistaking sequence for causation.'),
      ]
    ),
  ]
);

/* =========================================================================
   BEGINNER · UNIT 6 — Logic Puzzles
   ========================================================================= */
export const puzzlesUnit = unit(
  'puzzles',
  0,
  'Logic Puzzles',
  'extension-puzzle-outline',
  320,
  'Use your new skills on knights, knaves and cards.',
  [
    lesson(
      'puz-1',
      'Knights & Knaves',
      'shield-outline',
      'Truth-tellers, liars and case analysis.',
      6,
      [
        pg(
          'The island',
          p('On this island every inhabitant is a **knight** (always tells the truth) or a **knave** (always lies). You must work out who is who from what they say.'),
          tip('A statement tells you something no matter who says it: if a knight says S, then S is true. If a knave says S, then S is false.')
        ),
        pg(
          'Worked example',
          ex(['A says: “We are both knaves.”'], 'Puzzle'),
          list('Suppose A is a **knight**: then the statement is true, so A is a knave, a contradiction.', 'So A is a **knave**: the statement is false, so they are **not both** knaves.', 'A is a knave, hence B must be a **knight**.'),
          p('**Answer:** A is a knave, B is a knight.')
        ),
        pg(
          'Strategy',
          list('**Assume** one person’s type, follow the consequences, look for a contradiction.', 'If assuming “knight” breaks, they are a knave, and vice versa.', 'Rewrite what each person says as a formula, then compare with their type.'),
          tip('“I am a knave” is impossible for either kind to say. Nobody on the island can utter it.')
        ),
      ],
      [
        mcq('A says: “I am a knave.” Who could say this?', ['Only a knight', 'Only a knave', 'Either', 'Nobody'], 3, 'A knight would be lying and a knave would be telling the truth. Impossible.'),
        mcq('A says: “We are both knaves.” What are A and B?', ['Both knights', 'A knight, B knave', 'A knave, B knight', 'Both knaves'], 2, 'A cannot be a knight (the statement would be false). So A is a knave and B must be a knight.'),
        mcq('A says: “At least one of us is a knave.” What are A and B?', ['A knight, B knave', 'A knave, B knight', 'Both knights', 'Both knaves'], 0, 'If A were a knave the statement would be true. So A is a knight, and the true statement forces B to be a knave.'),
        mcq('A says: “B is a knave.” B says: “A and I are of the same type.” Who is who?', ['A knight, B knave', 'A knave, B knight', 'Both knights', 'Both knaves'], 0, 'If A is a knight then B is a knave; B’s claim “same type” is false, which a knave can say. The other cases contradict.'),
        mcq('A says: “B is a knight.” B says: “We are of opposite types.” Who is who?', ['Both knights', 'Both knaves', 'A knight, B knave', 'A knave, B knight'], 1, 'If A is a knight then B is a knight, but B’s claim would be false. So A is a knave, B is a knave, and B’s false claim is consistent.'),
        tf('A knight can truthfully say “I am a knight.”', true, 'It is true, so a knight can say it. A knave can say it as well, so it tells you nothing.'),
      ]
    ),
    lesson(
      'puz-2',
      'Grid Deduction',
      'calculator-outline',
      'Elimination, one clue at a time.',
      6,
      [
        pg(
          'The method',
          list('List the **items** and the **people** (a grid).', 'Convert every clue into **yes / no** marks.', 'When a row has all but one “no”, the remaining cell is a **yes**.', 'Repeat. Verify against every clue at the end.'),
          tip('Each person gets exactly one item, and each item exactly one person: a one-to-one matching.')
        ),
        pg(
          'Example',
          ex(['Ana, Ben and Cy each own one pet: cat, dog or fish.', '1. Ana does not own the dog.', '2. Cy owns neither the cat nor the fish.', '3. Ben does not own the cat.'], 'Clues'),
          list('Clue 2 → Cy owns the **dog**.', 'Clue 3 → Ben owns the **fish** (not cat, dog is taken).', 'So Ana owns the **cat**.')
        ),
        pg(
          'Contradiction as a tool',
          p('If assuming something leads to an impossibility, then that something is false. This is **proof by contradiction**, one of the most powerful ideas in logic.'),
          tip('When stuck, make a guess, push it through the clues, and see if it breaks.')
        ),
      ],
      [
        mcq('Using the clues above, which pet does Ana own?', ['Cat', 'Dog', 'Fish'], 0, 'Cy has the dog, Ben the fish, so Ana has the cat.'),
        mcq('Ali finished before Bea. Cy finished after Bea. Who finished second?', ['Ali', 'Bea', 'Cy'], 1, 'Order: Ali, Bea, Cy.'),
        mcq('Exactly one statement is true: (1) The prize is in box 1. (2) The prize is NOT in box 1. (3) The prize is in box 3. Where can the prize NOT be?', ['Box 1', 'Box 2', 'Box 3'], 2, '(1) and (2) are contradictory, so exactly one of them is true, so (3) must be false: the prize is not in box 3.'),
        tf('If clues rule out all options but one, that option must be correct.', true, 'That is the principle of elimination.'),
        mcq('Three boxes are labelled Apples, Oranges and Mixed, and every label is WRONG. You draw an apple from the box labelled Mixed. What is in the box labelled Oranges?', ['Apples', 'Oranges', 'Mixed'], 2, 'The “Mixed” box actually holds apples. The “Oranges” box can’t hold oranges (wrong label) or apples (taken), so it holds the mixed fruit.'),
        order('Order the steps for solving a grid puzzle.', ['List items and people', 'Turn clues into yes / no marks', 'Deduce forced cells', 'Repeat until done', 'Verify against every clue'], 'Systematic elimination beats guessing.'),
      ]
    ),
    lesson(
      'puz-3',
      'The Wason Card Task',
      'albums-outline',
      'The famous test that most people fail.',
      5,
      [
        pg(
          'The puzzle',
          p('Four cards lie on a table. Each has a **letter** on one side and a **number** on the other. You see:'),
          ex(['E      K      4      7'], 'Visible faces'),
          p('Rule: **“If a card has a vowel on one side, it has an even number on the other.”** Which cards must you turn over to test whether the rule is broken?')
        ),
        pg(
          'The answer: E and 7',
          p('The rule is **p → q** with p = vowel, q = even. It is broken only by **p ∧ ¬q**: a vowel with an odd number.'),
          list('**E** (p): could hide an odd number → check.', '**K** (¬p): nothing to learn.', '**4** (q): whatever is behind it, the rule survives.', '**7** (¬q): could hide a vowel → check.'),
          warn('Most people choose E and 4. Turning 4 is a flavour of **affirming the consequent**.')
        ),
        pg(
          'Why real cases feel easier',
          p('Rule: “If someone drinks alcohol, they must be 18 or older.” With a beer drinker, a cola drinker, a 25-year-old and a 16-year-old, you immediately check the **beer drinker** and the **16-year-old**, the same logical shape (p and ¬q).'),
          tip('Test a conditional by hunting for p-and-not-q.')
        ),
      ],
      [
        mcq('Rule: “If a card shows a vowel, the other side is even.” Cards: A, B, 2, 3. Which should you flip?', ['A and 2', 'A and 3', 'B and 2', 'All of them'], 1, 'Flip p (A) and ¬q (3).'),
        tf('Flipping a consonant card can disprove the rule.', false, 'A consonant says nothing about the rule “vowel → even”.'),
        mcq('Rule: “If you drink alcohol you must be 18+.” People: beer drinker, cola drinker, 25-year-old, 16-year-old. Whom do you check?', ['Beer drinker and cola drinker', 'Beer drinker and 16-year-old', 'Cola drinker and 25-year-old', 'Everyone'], 1, 'Check p (drinks alcohol) and ¬q (under 18).'),
        mcq('Which situation falsifies p → q?', ['p true and q true', 'p false and q true', 'p true and q false', 'p false and q false'], 2, 'The only counterexample is p ∧ ¬q.'),
        mcq('Rule: “If a card has a circle on one side, it is red on the other.” Cards: circle, square, red, blue. Which to flip?', ['Circle and red', 'Circle and blue', 'Square and blue', 'Square and red'], 1, 'Circle (p) and blue (¬q).'),
        tf('Turning over the “even number” card can disprove “vowel → even”.', false, 'Whether a vowel or consonant is behind it, the rule is not violated.'),
      ]
    ),
  ]
);
