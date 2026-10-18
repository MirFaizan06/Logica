import { FALLACIES_EXTRA, GLOSSARY_EXTRA } from './libraryExtra';
import type { Level } from './types';

/* ---------------------------- Glossary ---------------------------- */

export interface Term {
  id: string;
  term: string;
  def: string;
  cat: 'Basics' | 'Propositional' | 'Syllogistic' | 'Predicate' | 'Proof' | 'Advanced';
}

const t = (term: string, cat: Term['cat'], def: string): Term => ({ id: term.toLowerCase().replace(/[^a-z0-9]+/g, '-'), term, cat, def });

const GLOSSARY_BASE: Term[] = [
  t('Argument', 'Basics', 'A set of statements in which some (the premises) are offered as reasons for another (the conclusion).'),
  t('Premise', 'Basics', 'A statement offered as support for the conclusion of an argument.'),
  t('Conclusion', 'Basics', 'The statement an argument tries to establish.'),
  t('Proposition', 'Basics', 'A declarative sentence that is either true or false.'),
  t('Validity', 'Basics', 'An argument is valid when it is impossible for all its premises to be true and its conclusion false.'),
  t('Soundness', 'Basics', 'A valid argument with all true premises.'),
  t('Deduction', 'Basics', 'Reasoning in which the conclusion follows necessarily from the premises.'),
  t('Induction', 'Basics', 'Reasoning from specific cases to a probable general conclusion.'),
  t('Abduction', 'Basics', 'Inference to the best explanation of the evidence.'),
  t('Fallacy', 'Basics', 'A mistake in reasoning that makes an argument look better than it is.'),
  t('Counterexample', 'Basics', 'A case where the premises are true but the conclusion is false; it proves invalidity.'),
  t('Atomic proposition', 'Propositional', 'A proposition with no logical connectives inside it.'),
  t('Connective', 'Propositional', 'A symbol such as ¬, ∧, ∨, → or ↔ that forms compound statements.'),
  t('Negation', 'Propositional', '¬p. True exactly when p is false.'),
  t('Conjunction', 'Propositional', 'p ∧ q. True exactly when both p and q are true.'),
  t('Disjunction', 'Propositional', 'p ∨ q. True when at least one of p, q is true (inclusive or).'),
  t('Exclusive or', 'Propositional', 'p ⊕ q. True when exactly one of p, q is true.'),
  t('Conditional', 'Propositional', 'p → q. False only when p is true and q is false.'),
  t('Biconditional', 'Propositional', 'p ↔ q. True when p and q have the same truth value.'),
  t('Antecedent', 'Propositional', 'The “if” part of a conditional.'),
  t('Consequent', 'Propositional', 'The “then” part of a conditional.'),
  t('Contrapositive', 'Propositional', 'For p → q, the statement ¬q → ¬p. Logically equivalent to the original.'),
  t('Converse', 'Propositional', 'For p → q, the statement q → p. Not equivalent to the original.'),
  t('Inverse', 'Propositional', 'For p → q, the statement ¬p → ¬q. Not equivalent to the original.'),
  t('Truth table', 'Propositional', 'A table listing a formula’s truth value for every combination of its variables’ values.'),
  t('Tautology', 'Propositional', 'A formula that is true under every assignment.'),
  t('Contradiction', 'Propositional', 'A formula that is false under every assignment.'),
  t('Contingent', 'Propositional', 'A formula that is true under some assignments and false under others.'),
  t('Satisfiable', 'Propositional', 'True under at least one assignment.'),
  t('Logical equivalence', 'Propositional', 'Two formulas with the same truth value under every assignment.'),
  t('De Morgan’s laws', 'Propositional', '¬(p ∧ q) ≡ ¬p ∨ ¬q and ¬(p ∨ q) ≡ ¬p ∧ ¬q.'),
  t('Normal form', 'Propositional', 'A standard shape for formulas: CNF (AND of ORs) or DNF (OR of ANDs).'),
  t('Modus ponens', 'Proof', 'From p → q and p, infer q.'),
  t('Modus tollens', 'Proof', 'From p → q and ¬q, infer ¬p.'),
  t('Hypothetical syllogism', 'Proof', 'From p → q and q → r, infer p → r.'),
  t('Disjunctive syllogism', 'Proof', 'From p ∨ q and ¬p, infer q.'),
  t('Conditional proof', 'Proof', 'To prove p → q, assume p and derive q.'),
  t('Reductio ad absurdum', 'Proof', 'To prove φ, assume ¬φ and derive a contradiction.'),
  t('Mathematical induction', 'Proof', 'Prove a base case and an inductive step to prove a claim for all natural numbers.'),
  t('Categorical statement', 'Syllogistic', 'A statement of the form A, E, I or O relating two classes.'),
  t('Syllogism', 'Syllogistic', 'A deductive argument with two premises and a conclusion built from three terms.'),
  t('Middle term', 'Syllogistic', 'The term that appears in both premises but not the conclusion.'),
  t('Major term', 'Syllogistic', 'The predicate of the conclusion.'),
  t('Minor term', 'Syllogistic', 'The subject of the conclusion.'),
  t('Distribution', 'Syllogistic', 'A term is distributed in a statement if the statement says something about all members of its class.'),
  t('Mood', 'Syllogistic', 'The three letters (A, E, I, O) of a syllogism’s statements.'),
  t('Figure', 'Syllogistic', 'One of four arrangements of the middle term in the premises.'),
  t('Existential import', 'Syllogistic', 'The assumption that the classes mentioned in a statement are non-empty.'),
  t('Venn diagram', 'Syllogistic', 'Overlapping circles used to represent and test statements about classes.'),
  t('Predicate', 'Predicate', 'A property or relation, such as Prime(x) or Loves(x, y).'),
  t('Quantifier', 'Predicate', 'A symbol (∀ or ∃) saying how many objects satisfy a condition.'),
  t('Universal quantifier', 'Predicate', '∀x. “For all x”.'),
  t('Existential quantifier', 'Predicate', '∃x. “There exists an x”.'),
  t('Domain of discourse', 'Predicate', 'The collection of objects a variable ranges over.'),
  t('Free variable', 'Predicate', 'A variable not bound by any quantifier.'),
  t('Bound variable', 'Predicate', 'A variable governed by a quantifier.'),
  t('Model', 'Predicate', 'A domain together with an interpretation of the symbols of a language.'),
  t('Skolemisation', 'Predicate', 'Replacing existentially quantified variables by new constants or functions.'),
  t('Unification', 'Predicate', 'Finding a substitution that makes two expressions identical.'),
  t('Soundness (system)', 'Advanced', 'A proof system is sound if everything it proves is true (⊢ implies ⊨).'),
  t('Completeness', 'Advanced', 'A proof system is complete if it proves everything that is true (⊨ implies ⊢).'),
  t('Compactness', 'Advanced', 'If every finite subset of a set of sentences has a model, so does the whole set.'),
  t('Decidable', 'Advanced', 'There is an algorithm that answers the question for every input.'),
  t('Resolution', 'Advanced', 'An inference rule on clauses: from A ∨ x and ¬x ∨ B infer A ∨ B.'),
  t('SAT', 'Advanced', 'The problem of deciding whether a Boolean formula can be made true. NP-complete.'),
  t('Modal logic', 'Advanced', 'Logic of necessity (□) and possibility (◇).'),
  t('Kripke frame', 'Advanced', 'A set of worlds with an accessibility relation.'),
  t('Temporal logic', 'Advanced', 'Logic with operators such as next, eventually, always and until.'),
  t('Epistemic logic', 'Advanced', 'Logic of knowledge and belief.'),
  t('Deontic logic', 'Advanced', 'Logic of obligation, permission and prohibition.'),
  t('Intuitionistic logic', 'Advanced', 'Constructive logic without the law of excluded middle.'),
  t('Paraconsistent logic', 'Advanced', 'A logic in which contradictions do not entail everything.'),
  t('Fuzzy logic', 'Advanced', 'Logic with truth values between 0 and 1.'),
  t('Non-monotonic', 'Advanced', 'A reasoning style where new information can retract earlier conclusions.'),
  t('Hoare triple', 'Advanced', '{P} C {Q}: if P holds before C, Q holds after.'),
  t('Curry–Howard', 'Advanced', 'The correspondence between proofs and programs, propositions and types.'),
  t('Gödel incompleteness', 'Advanced', 'Strong consistent formal systems contain true but unprovable statements.'),
];

const dedupe = <T extends { id: string }>(items: T[]): T[] => {
  const seen = new Set<string>();
  return items.filter((i) => (seen.has(i.id) ? false : (seen.add(i.id), true)));
};

export const GLOSSARY: Term[] = dedupe([...GLOSSARY_BASE, ...GLOSSARY_EXTRA]);

/* ---------------------------- Fallacies ---------------------------- */

export interface Fallacy {
  id: string;
  name: string;
  kind: 'Formal' | 'Informal';
  def: string;
  example: string;
  fix: string;
}

const f = (name: string, kind: Fallacy['kind'], def: string, example: string, fix: string): Fallacy => ({
  id: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
  name,
  kind,
  def,
  example,
  fix,
});

const FALLACIES_BASE: Fallacy[] = [
  f('Affirming the consequent', 'Formal', 'Concluding p from p → q and q.', 'If it rained, the street is wet. The street is wet. So it rained.', 'Look for other causes of q.'),
  f('Denying the antecedent', 'Formal', 'Concluding ¬q from p → q and ¬p.', 'If you study you pass. You did not study. So you will fail.', 'The conditional gives no information when p is false.'),
  f('Affirming a disjunct', 'Formal', 'Concluding ¬q from p ∨ q and p.', 'Either the cat or the dog broke the vase. The cat did. So the dog did not.', 'Inclusive “or” allows both.'),
  f('Undistributed middle', 'Formal', 'The middle term of a syllogism is never distributed.', 'All dogs are mammals. All cats are mammals. So all cats are dogs.', 'Check that the middle term covers a whole class.'),
  f('Illicit major', 'Formal', 'The major term is distributed in the conclusion but not in its premise.', 'All dogs are mammals. No cats are dogs. So no cats are mammals.', 'Do not claim more about a term than the premise does.'),
  f('Exclusive premises', 'Formal', 'Both premises of a syllogism are negative.', 'No reptiles are mammals. No snakes are mammals. So no snakes are reptiles.', 'At least one premise must be affirmative.'),
  f('Four-term fallacy', 'Formal', 'A syllogism effectively uses four terms through equivocation.', 'Nothing is better than happiness. A sandwich is better than nothing. So a sandwich is better than happiness.', 'Keep each term’s meaning fixed.'),
  f('Existential fallacy', 'Formal', 'Drawing a particular conclusion from two universal premises.', 'All unicorns are magical. All magical things are rare. So some unicorns are rare.', 'Particulars need existence assumptions.'),
  f('Quantifier shift', 'Formal', 'Swapping ∀∃ into ∃∀.', 'Everyone has a mother. So there is someone who is everyone’s mother.', 'Quantifier order matters.'),
  f('Ad hominem', 'Informal', 'Attacking the person instead of the argument.', 'You cannot trust his climate data, he drives badly.', 'Address the evidence itself.'),
  f('Straw man', 'Informal', 'Misrepresenting a position to refute it more easily.', 'She wants speed limits, so she wants us all to crawl.', 'Restate the opponent’s view fairly.'),
  f('Red herring', 'Informal', 'Introducing an irrelevant topic.', 'Why worry about the budget? Look at the weather.', 'Stick to the issue.'),
  f('Tu quoque', 'Informal', 'Rejecting a claim because the speaker is inconsistent.', 'You tell me not to smoke, but you smoked once.', 'A hypocrite can still be right.'),
  f('False dilemma', 'Informal', 'Presenting two options when more exist.', 'You are either with us or against us.', 'Look for a third option.'),
  f('Slippery slope', 'Informal', 'Claiming one step will inevitably lead to extreme consequences without support.', 'Allow one pet and soon the house is a zoo.', 'Ask for evidence of each link.'),
  f('Circular reasoning', 'Informal', 'The conclusion is assumed in a premise.', 'This book is true because it says so.', 'Find independent support.'),
  f('Hasty generalisation', 'Informal', 'Drawing a broad conclusion from a small or biased sample.', 'Two rude neighbours, so the whole town is rude.', 'Gather a larger, representative sample.'),
  f('Post hoc', 'Informal', 'Assuming that because B followed A, A caused B.', 'I wore my lucky socks and we won.', 'Look for a mechanism or a controlled comparison.'),
  f('Appeal to authority', 'Informal', 'Citing an irrelevant or unreliable authority.', 'A famous actor says this supplement works.', 'Check that the expert is relevant and the claim is supported.'),
  f('Bandwagon', 'Informal', 'Arguing something is true because many believe it.', 'Everyone is buying it, so it must be good.', 'Popularity is not proof.'),
  f('Appeal to ignorance', 'Informal', 'Claiming something is true because it has not been disproved.', 'No one has proved ghosts do not exist, so they do.', 'Burden of proof lies with the claimant.'),
  f('Equivocation', 'Informal', 'Using a word in two different senses.', 'A feather is light. What is light cannot be dark. So a feather cannot be dark.', 'Fix the meaning of each key word.'),
  f('Begging the question', 'Informal', 'Assuming what one is trying to prove.', 'Paranormal phenomena exist because there are events science cannot explain.', 'Prove the key premise independently.'),
  f('No true Scotsman', 'Informal', 'Redefining a group to dismiss a counterexample.', 'No Scotsman puts sugar on porridge. My uncle does. Then he is no true Scotsman.', 'Do not change the definition after the fact.'),
  f('Appeal to emotion', 'Informal', 'Using feelings in place of reasons.', 'Think of the children. We must pass this bill.', 'Ask what the evidence says.'),
];
export const FALLACIES: Fallacy[] = dedupe([...FALLACIES_BASE, ...FALLACIES_EXTRA]);

/* ---------------------------- Symbol cheat sheet ---------------------------- */

export interface SymbolGroup {
  title: string;
  level: Level;
  items: { sym: string; name: string; note: string }[];
}

export const SYMBOLS: SymbolGroup[] = [
  {
    title: 'Propositional',
    level: 0,
    items: [
      { sym: '¬', name: 'not', note: 'Negation' },
      { sym: '∧', name: 'and', note: 'Conjunction' },
      { sym: '∨', name: 'or', note: 'Inclusive disjunction' },
      { sym: '⊕', name: 'xor', note: 'Exclusive disjunction' },
      { sym: '→', name: 'if … then', note: 'Conditional' },
      { sym: '↔', name: 'iff', note: 'Biconditional' },
      { sym: '⊤', name: 'true', note: 'Tautology constant' },
      { sym: '⊥', name: 'false', note: 'Contradiction constant' },
      { sym: '↑', name: 'nand', note: 'Sheffer stroke' },
      { sym: '↓', name: 'nor', note: 'Peirce arrow' },
    ],
  },
  {
    title: 'Proof & Meta',
    level: 1,
    items: [
      { sym: '∴', name: 'therefore', note: 'Conclusion marker' },
      { sym: '⊢', name: 'proves', note: 'Syntactic consequence' },
      { sym: '⊨', name: 'entails', note: 'Semantic consequence' },
      { sym: '≡', name: 'equivalent', note: 'Same truth table' },
      { sym: '∎', name: 'QED', note: 'End of proof' },
    ],
  },
  {
    title: 'Predicate & Sets',
    level: 1,
    items: [
      { sym: '∀', name: 'for all', note: 'Universal quantifier' },
      { sym: '∃', name: 'there exists', note: 'Existential quantifier' },
      { sym: '∃!', name: 'exactly one', note: 'Unique existence' },
      { sym: '∈', name: 'is an element of', note: 'Membership' },
      { sym: '⊆', name: 'subset of', note: 'Inclusion' },
      { sym: '∪', name: 'union', note: 'Set or' },
      { sym: '∩', name: 'intersection', note: 'Set and' },
      { sym: '∅', name: 'empty set', note: 'No elements' },
    ],
  },
  {
    title: 'Modal & Temporal',
    level: 2,
    items: [
      { sym: '□', name: 'necessarily', note: 'Box' },
      { sym: '◇', name: 'possibly', note: 'Diamond' },
      { sym: 'X', name: 'next', note: 'LTL' },
      { sym: 'F', name: 'eventually', note: 'LTL' },
      { sym: 'G', name: 'always', note: 'LTL' },
      { sym: 'U', name: 'until', note: 'LTL' },
      { sym: 'K', name: 'knows', note: 'Epistemic' },
      { sym: 'O', name: 'ought', note: 'Deontic' },
    ],
  },
];

/* ---------------------------- Flashcards ---------------------------- */

export interface Card {
  id: string;
  front: string;
  back: string;
  tag: string;
}

export const CARDS: Card[] = [
  ...GLOSSARY.map((g) => ({ id: `g:${g.id}`, front: g.term, back: g.def, tag: g.cat })),
  ...FALLACIES.map((x) => ({ id: `f:${x.id}`, front: x.name, back: `${x.def}\n\nExample: ${x.example}`, tag: 'Fallacy' })),
  ...SYMBOLS.flatMap((g) => g.items.map((s) => ({ id: `s:${s.sym}`, front: s.sym, back: `${s.name}. ${s.note}.`, tag: 'Symbol' }))),
];
