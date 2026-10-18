import { cmp, ex, list, p, pg, rule, sym, tip, ttb, warn } from '../helpers';
import type { Page } from '../types';

/** Study notes: Beginner units. Each unit gets short, scannable pages for revision. */
export const NOTES_N1: Record<string, Page[]> = {
  arguments: [
    pg(
      'Key ideas',
      list(
        '**Statement:** a sentence that is true or false. Questions, commands and exclamations are not statements.',
        '**Argument:** premises offered as reasons for a conclusion.',
        '**Valid:** impossible for all premises to be true and the conclusion false.',
        '**Sound:** valid and all premises actually true.',
        '**Deductive** reasoning aims at certainty, **inductive** at probability, **abductive** at the best explanation.'
      ),
      cmp(
        { title: 'Premise words', lines: ['because', 'since', 'given that', 'for'] },
        { title: 'Conclusion words', lines: ['therefore', 'thus', 'hence', 'so'] }
      )
    ),
    pg(
      'The four combinations',
      list('Valid with true premises: **sound**, the conclusion must be true.', 'Valid with a false premise: **unsound**, the conclusion may be true or false.', 'Invalid: **unsound** whatever the premises.', 'Invalid with true premises and a false conclusion: this is a **counterexample**.'),
      tip('To test validity ask: can I describe a situation where the premises are true and the conclusion false? If yes, it is invalid.')
    ),
    pg(
      'Common mistakes',
      list('Thinking valid means “true” or “reasonable”.', 'Treating an explanation as an argument.', 'Calling an argument invalid because a premise is false (that makes it unsound at most).', 'Judging an argument by whether you like the conclusion.')
    ),
  ],

  'prop-basics': [
    pg(
      'Connectives at a glance',
      sym(
        { sym: '¬p', name: 'not p', note: 'flips the value' },
        { sym: 'p ∧ q', name: 'p and q', note: 'true only if both are true' },
        { sym: 'p ∨ q', name: 'p or q', note: 'false only if both are false' },
        { sym: 'p ⊕ q', name: 'p xor q', note: 'true if exactly one is true' },
        { sym: 'p → q', name: 'if p then q', note: 'false only for p true, q false' },
        { sym: 'p ↔ q', name: 'p iff q', note: 'true when p and q match' }
      ),
      ttb('p ∧ q', 'p ∨ q', 'p → q', 'p ↔ q')
    ),
    pg(
      'Translating English',
      list(
        '**but, although, yet** are ∧.',
        '**p only if q**, **p implies q**, **q is necessary for p**: p → q.',
        '**p if q**, **p provided that q**, **p whenever q**, **q is sufficient for p**: q → p.',
        '**p unless q:** ¬q → p (equivalent to p ∨ q).',
        '**neither p nor q:** ¬p ∧ ¬q.',
        '**not both:** ¬(p ∧ q).'
      ),
      warn('“Only if” reverses the direction of “if”.')
    ),
    pg(
      'Related conditionals',
      list('**Converse** of p → q: q → p (not equivalent).', '**Inverse:** ¬p → ¬q (not equivalent).', '**Contrapositive:** ¬q → ¬p (equivalent).'),
      tip('Precedence from tightest to loosest: ¬, ∧, ∨, →, ↔. Use brackets to be safe.')
    ),
  ],

  'truth-tables': [
    pg(
      'Method',
      list('List the variables; a formula with n variables has **2ⁿ rows**.', 'Order rows from all T down to all F.', 'Add a column for each sub-formula and finish with the whole formula.', 'Evaluate inside brackets first, then ¬, ∧, ∨, →, ↔.'),
      ex(['p  q | p → q', 'T  T |   T', 'T  F |   F', 'F  T |   T', 'F  F |   T'], 'The conditional')
    ),
    pg(
      'Classifying formulas',
      list('**Tautology:** true in every row (p ∨ ¬p).', '**Contradiction:** false in every row (p ∧ ¬p).', '**Contingent:** true in some rows, false in others.', '**Satisfiable:** true in at least one row.'),
      cmp(
        { title: 'Equivalent', lines: ['same final column', 'p → q and ¬p ∨ q'] },
        { title: 'Valid argument', lines: ['no row with all premises true and the conclusion false'] }
      )
    ),
    pg(
      'Shortcuts',
      list('A conjunction with a false part is false.', 'A disjunction with a true part is true.', 'A conditional with a false antecedent, or a true consequent, is true.', 'To refute an argument, try to make the conclusion false and all premises true.'),
      tip('If you only need to know whether something is a tautology, try to make it false. If you cannot, it is one.')
    ),
  ],

  syllogisms: [
    pg(
      'The four forms',
      sym(
        { sym: 'A', name: 'All S are P' },
        { sym: 'E', name: 'No S are P' },
        { sym: 'I', name: 'Some S are P', note: '“some” means at least one' },
        { sym: 'O', name: 'Some S are not P' }
      ),
      list('A and E are **universal**; I and O are **particular**.', '**Contradictories:** A–O and E–I.', 'A, E, I, O in a syllogism fill three slots: major premise, minor premise, conclusion.')
    ),
    pg(
      'Anatomy',
      list('**Minor term S:** subject of the conclusion.', '**Major term P:** predicate of the conclusion.', '**Middle term M:** in both premises, never in the conclusion.'),
      ex(['All M are P.   (major premise)', 'All S are M.   (minor premise)', '∴ All S are P.   Barbara (AAA-1)'], 'The model syllogism')
    ),
    pg(
      'Venn test',
      list('Draw three overlapping circles S, P, M.', 'Shade universal premises first, then place × for particular ones.', 'The syllogism is valid if the conclusion is already drawn.'),
      warn('Red flags: two negative premises, two particular premises, a negative premise with an affirmative conclusion, a middle term that is never distributed.')
    ),
  ],

  fallacies: [
    pg(
      'Formal fallacies',
      rule('Modus ponens (valid)', ['P → Q', 'P'], 'Q'),
      rule('Modus tollens (valid)', ['P → Q', '¬Q'], '¬P'),
      rule('Affirming the consequent (fallacy)', ['P → Q', 'Q'], 'P'),
      rule('Denying the antecedent (fallacy)', ['P → Q', '¬P'], '¬Q')
    ),
    pg(
      'Syllogistic slips',
      list('**Undistributed middle:** the middle term never covers a whole class.', '**Illicit major / minor:** a term is distributed in the conclusion but not in its premise.', '**Exclusive premises:** two negative premises.', '**Four terms:** a word shifts meaning.')
    ),
    pg(
      'Informal fallacies to know',
      list(
        '**Ad hominem:** attacks the person.',
        '**Straw man:** distorts the position.',
        '**False dilemma:** only two options offered.',
        '**Slippery slope:** unsupported chain of consequences.',
        '**Circular reasoning:** assumes the conclusion.',
        '**Hasty generalisation:** small sample, big claim.',
        '**Post hoc:** after, therefore because.',
        '**Appeal to authority / popularity.**'
      ),
      tip('A fallacy shows the argument fails, not that the conclusion is false.')
    ),
  ],

  puzzles: [
    pg(
      'Knights and knaves',
      list('Knights always tell the truth, knaves always lie.', 'Turn each statement into a condition on types.', 'Assume a type, follow consequences, look for a contradiction (case analysis).', '“I am a knave” cannot be said by anyone.'),
      ex(['A says: “We are both knaves.”', 'A cannot be a knight, so A is a knave and B is a knight.'], 'Worked example')
    ),
    pg(
      'Grid puzzles',
      list('Each person gets exactly one item.', 'Every clue becomes a yes or a no in the grid.', 'When a row has one possibility left, fill it in and propagate.', 'Check the final answer against every clue.')
    ),
    pg(
      'Testing conditionals',
      p('The Wason selection task: to test “if p then q”, turn over the **p** cards and the **not-q** cards. A conditional is falsified only by p together with not-q.'),
      tip('Most people choose the q card, which can never break the rule.')
    ),
  ],

  'critical-thinking': [
    pg(
      'Argument maps',
      list('Conclusion at the end of the arrows.', '**Linked** premises must work together; **convergent** premises each support alone.', 'Look for the **unstated premise** (enthymeme).', 'Be **charitable**: attack the strongest version, not a straw man.'),
      list('**Rebut:** give a reason the conclusion is false.', '**Undermine:** deny a premise.', '**Undercut:** deny that the premises support the conclusion.')
    ),
    pg(
      'Biases checklist',
      list('Confirmation bias, belief bias, hindsight bias.', 'Anchoring, availability, base rate neglect.', 'Framing, sunk cost.'),
      tip('Before looking at evidence ask what would change your mind.')
    ),
    pg(
      'Evidence checklist',
      list('Correlation is not causation: consider reverse cause, common cause and chance.', 'Who was sampled and how? Beware selection and survivorship bias.', 'Prefer controlled, randomised comparisons.', 'Beware p-hacking and anecdotes.'),
      p('Ask three questions: compared with what? how many? chosen how?')
    ),
  ],
};
