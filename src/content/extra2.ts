import { cmp, ex, lesson, list, mcq, order, p, pg, rule, sym, tf, tip, unit, warn } from './helpers';

/* =========================================================================
   INTERMEDIATE · Puzzle Techniques
   ========================================================================= */
export const puzzles2Unit = unit(
  'puzzles-2',
  1,
  'Puzzle Techniques',
  'extension-puzzle-outline',
  100,
  'Constraint puzzles, hat puzzles and search: logic as a problem-solving tool.',
  [
    lesson(
      'pz2-1',
      'Constraint Puzzles',
      'grid-outline',
      'Zebra-style puzzles, solved systematically.',
      7,
      [
        pg(
          'Variables, domains, constraints',
          p('A **constraint puzzle** has entities (people, houses), attributes (drinks, colours, positions) and clues that restrict how they can combine. The famous “zebra” puzzle is the same idea with five houses and five attributes.'),
          list('**Variables:** what you must decide.', '**Domains:** the values each may take.', '**Constraints:** the clues.')
        ),
        pg(
          'A worked example',
          ex(['Ana, Ben and Cy sit in positions 1 to 3 and drink tea, coffee and juice.', '1. Ana sits left of Ben.', '2. Cy drinks coffee.', '3. Ben does not drink tea.', '4. The tea drinker sits in position 1.', '5. Cy sits in the middle.'], 'Clues'),
          list('Clue 2 and 3 leave only Ana for tea.', 'Ben, not tea, not coffee, drinks juice.', 'Clue 4: Ana is in position 1.', 'Clue 5: Cy is in position 2, so Ben is in position 3.')
        ),
        pg(
          'Technique',
          list('Use the most direct clues first.', 'Fill a grid and cross out impossible cells.', 'When a row has one possibility left, fill it in and propagate.', 'If stuck, assume something and follow the consequences (and backtrack on a contradiction).'),
          tip('Always check the final answer against every clue.')
        ),
        pg(
          'The SAT view',
          p('Computers solve such puzzles by turning clues into clauses. “Exactly one of x1, x2, x3 is true” becomes one clause (x1 ∨ x2 ∨ x3) plus the pairwise clauses (¬x1 ∨ ¬x2), (¬x1 ∨ ¬x3), (¬x2 ∨ ¬x3).'),
          p('The same machinery schedules exams, plans routes and verifies hardware.')
        ),
      ],
      [
        mcq('In the worked example, who drinks tea?', ['Ana', 'Ben', 'Cy'], 0, 'Cy has coffee and Ben does not drink tea.'),
        mcq('Who drinks juice?', ['Ana', 'Ben', 'Cy'], 1, 'The remaining drink.'),
        mcq('Who sits in position 3?', ['Ana', 'Ben', 'Cy'], 1, 'Ana is first and Cy is in the middle.'),
        mcq('A constraint in a puzzle is…', ['A condition restricting allowed combinations', 'A variable', 'A guess', 'A solution'], 0, 'Clues are constraints.'),
        mcq('Which clue should you use first?', ['The most direct one', 'The vaguest one', 'The longest one', 'None'], 0, 'Direct clues give immediate eliminations.'),
        tf('A well-formed puzzle has exactly one solution.', true, 'That is what makes it solvable by logic.'),
        mcq('To say “exactly one of three variables is true” in clauses you need…', ['One “at least one” clause and the three pairwise “not both” clauses', 'Only one clause', 'Three “at least one” clauses', 'No clauses'], 0, 'At least one, plus at most one.'),
        mcq('How many “not both” clauses forbid any two of three variables being true?', ['1', '2', '3', '6'], 2, 'Three pairs.'),
        mcq('Backtracking search…', ['Tries a value, continues, and undoes it on a dead end', 'Guesses forever', 'Never revisits', 'Ignores clues'], 0, 'It explores and retreats.'),
        tf('A puzzle with contradictory clues has no solution.', true, 'No assignment satisfies all clues.'),
        order('Order the steps for solving a constraint puzzle.', ['List the entities and attributes', 'Draw the grid', 'Apply the direct clues', 'Cross out impossible cells', 'Use the rest to deduce and check every clue'], 'Set up, apply, eliminate, deduce, verify.'),
        mcq('Why do SAT solvers help with puzzles?', ['Clues translate directly into clauses', 'They guess well', 'They read English', 'They avoid logic'], 0, 'Constraint satisfaction is a satisfiability problem.'),
      ]
    ),
    lesson(
      'pz2-2',
      'Hat Puzzles & Common Knowledge',
      'people-outline',
      'What silence and announcements tell you.',
      7,
      [
        pg(
          'Two hats',
          p('Ann and Ben each wear a red or blue hat. Each sees the other’s hat but not their own. They are told “at least one hat is red”. Ann says: “I do not know my colour.”'),
          list('If Ann saw a **blue** hat on Ben, she would know hers is red.', 'Because she does not know, Ben’s hat must be red.', 'Ben can reason the same way and finds his own colour: red.'),
          tip('Not knowing is information.')
        ),
        pg(
          'Cheryl’s birthday',
          ex(['Possible dates: May 15, 16, 19. June 17, 18. July 14, 16. August 14, 15, 17.', 'Cheryl tells Albert the month and Bernard the day.', 'Albert: “I don’t know the date, but I know Bernard doesn’t either.”', 'Bernard: “At first I didn’t know, but now I do.”', 'Albert: “Now I know too.”'], 'The puzzle'),
          list('Days 18 and 19 are unique, so Albert’s month cannot be May or June.', 'Bernard now knows: day 14 is ambiguous (July, August), so it is July 16, August 15 or August 17.', 'Albert now knows: August would leave two options, so it is **July 16**.')
        ),
        pg(
          'Common knowledge',
          p('Things everyone knows are not always **common knowledge**: everyone must also know that everyone knows, and so on. Public announcements create common knowledge.'),
          list('Muddy children: with k muddy children, they step forward in round k.', 'Blue-eyed islanders: with 4 blue-eyed people and an announcement “someone has blue eyes”, they leave on the 4th night.')
        ),
        pg(
          'Modelling it',
          p('Epistemic logic models such puzzles with **possible worlds**, one for each way the facts might be. A public announcement removes the worlds where it is false. Reasoners know what holds in all their remaining worlds.'),
          p('Dynamic epistemic logic studies how announcements change knowledge.')
        ),
      ],
      [
        mcq('In the two-hat puzzle, Ann says she does not know her colour. What is Ben’s hat?', ['Red', 'Blue', 'Cannot tell'], 0, 'If Ben’s hat were blue, Ann would know hers is red.'),
        mcq('If Ann saw a blue hat on Ben and knew at least one hat is red, she would know…', ['Her own hat is red', 'Her hat is blue', 'Nothing', 'Ben’s hat is red'], 0, 'The red must be hers.'),
        mcq('Cheryl’s birthday is…', ['May 16', 'June 17', 'July 16', 'August 15'], 2, 'The elimination steps lead to July 16.'),
        tf('A public announcement can give new knowledge even if everyone could already see the underlying facts.', true, 'It creates common knowledge.'),
        mcq('Common knowledge differs from “everyone knows” because it also requires…', ['Everyone knows that everyone knows, and so on', 'Everyone is certain', 'Everyone agrees', 'Nothing more'], 0, 'An infinite hierarchy.'),
        mcq('Saying “I do not know” can…', ['Reveal information to others', 'Never matter', 'Prove ignorance', 'Create a paradox'], 0, 'Others reason about why you cannot tell.'),
        mcq('With three muddy children, they first speak in round…', ['1', '2', '3', '4'], 2, 'With k muddy children it is round k.'),
        mcq('The usual technique for these puzzles is to…', ['Eliminate the worlds inconsistent with what was said', 'Guess', 'Count letters', 'Use probabilities'], 0, 'Each statement prunes possibilities.'),
        tf('In a hat puzzle, other people’s silence can be informative.', true, 'It tells you what they could not deduce.'),
        mcq('With 4 blue-eyed islanders and the announcement that someone has blue eyes, they all leave on night…', ['1', '2', '4', '8'], 2, 'On night n for n blue-eyed people.'),
        mcq('A Kripke model for such a puzzle has one world for each…', ['Possible assignment of the hidden facts', 'Person', 'Round', 'Announcement'], 0, 'The worlds are the ways things could be.'),
        mcq('Dynamic epistemic logic studies…', ['How announcements change knowledge', 'Truth tables', 'Set sizes', 'Loop invariants'], 0, 'It adds actions to epistemic logic.'),
      ]
    ),
    lesson(
      'pz2-3',
      'Search, Invariants & Planning',
      'boat-outline',
      'Puzzles as graphs, and proving things impossible.',
      7,
      [
        pg(
          'Puzzles as state graphs',
          p('Many puzzles are a **state space**: each configuration is a node and each legal move is an edge. Solving means finding a path from the start state to the goal state.'),
          ex(['A farmer must ferry a wolf, a goat and a cabbage across a river.', 'The boat holds the farmer and one item.', 'Never leave wolf with goat, or goat with cabbage, alone.', 'First move: take the goat. The shortest solution has 7 crossings.'], 'Wolf, goat, cabbage')
        ),
        pg(
          'Searching',
          list('**Breadth-first search** finds a solution with the fewest moves.', 'Keep a record of visited states to avoid going in circles.', 'Planning systems describe actions by **preconditions and effects** (STRIPS) and search or encode the problem as SAT.')
        ),
        pg(
          'Proving impossibility with invariants',
          p('An **invariant** is a property every legal move preserves. If the goal violates it, the puzzle cannot be solved.'),
          ex(['Remove two opposite corners of a chessboard. Can 31 dominoes cover it?', 'Each domino covers one black and one white square.', 'The removed corners are the same colour, so 30 of one colour and 32 of the other remain.', 'Impossible.'], 'The mutilated chessboard'),
          p('The sliding 15-puzzle works the same way: half of all starting positions are unsolvable because of a parity invariant.')
        ),
        pg(
          'Recursion: Towers of Hanoi',
          p('To move n disks from peg A to peg C, move n − 1 to B, move the largest to C, then move n − 1 onto it. The minimum number of moves is **2ⁿ − 1**.'),
          tip('A recursive description and an induction proof of its optimality go hand in hand.')
        ),
      ],
      [
        mcq('In the wolf, goat and cabbage puzzle, the first safe move is to take…', ['The goat', 'The wolf', 'The cabbage', 'Nothing'], 0, 'Leaving wolf and cabbage together is safe.'),
        mcq('The farmer needs at least how many crossings?', ['5', '7', '9', '11'], 1, 'Seven, in the classic solution.'),
        mcq('A state in a state-space is…', ['A complete configuration of the puzzle', 'A single move', 'A rule', 'A goal only'], 0, 'Nodes in the search graph.'),
        mcq('Breadth-first search finds…', ['A solution with the fewest moves', 'The longest solution', 'Any random solution', 'No solution'], 0, 'It explores level by level.'),
        mcq('Can 31 dominoes tile a chessboard with two opposite corners removed?', ['Yes', 'No, because of a colour-count invariant'], 1, 'The squares left are 32 of one colour and 30 of the other.'),
        mcq('An invariant is…', ['A property preserved by every legal move', 'A winning move', 'A random guess', 'A rule of inference'], 0, 'It does not change.'),
        tf('If the goal state violates an invariant, the puzzle is impossible.', true, 'No sequence of moves can change the invariant.'),
        mcq('The minimum number of moves for the Tower of Hanoi with 3 disks is…', ['3', '5', '7', '9'], 2, '2³ − 1.'),
        mcq('For n disks the minimum is…', ['2n', 'n²', '2ⁿ − 1', 'n!'], 2, 'Move n − 1, one, then n − 1 again.'),
        mcq('For the sliding 15-puzzle, what fraction of starting positions are unsolvable?', ['One half', 'One tenth', 'None', 'All'], 0, 'A parity invariant splits them.'),
        mcq('STRIPS describes actions by…', ['Preconditions and effects', 'Colours', 'Probabilities', 'Truth tables only'], 0, 'What must hold and what changes.'),
        tf('Planning problems can be encoded as SAT problems.', true, 'Each step and action becomes variables and clauses.'),
      ]
    ),
  ]
);

/* =========================================================================
   ADVANCED · Higher-Order Logic & Type Theory
   ========================================================================= */
export const higherOrderUnit = unit(
  'higher-order',
  2,
  'Higher-Order Logic & Types',
  'prism-outline',
  200,
  'Quantifying over properties, proof assistants and resource-sensitive logics.',
  [
    lesson(
      'ho-1',
      'Second-Order Logic',
      'layers-outline',
      'Quantifying over properties and sets.',
      8,
      [
        pg(
          'Quantifying over predicates',
          p('In **second-order logic** we may quantify not only over objects but over properties and relations.'),
          ex(['∀P ( P(0) ∧ ∀x (P(x) → P(x + 1)) → ∀x P(x) )', 'This single axiom is the induction principle for the natural numbers.'], 'Induction as one axiom'),
          p('First-order arithmetic needs an infinite **schema** of induction axioms instead.')
        ),
        pg(
          'What you gain',
          list('Second-order Peano arithmetic is **categorical**: all its models are isomorphic to the standard natural numbers.', 'You can say “the domain is finite” and define the transitive closure of a relation.', 'Identity can be defined: a = b iff ∀P (P(a) ↔ P(b)) (Leibniz).')
        ),
        pg(
          'What you lose',
          list('With full semantics there is **no complete proof system**.', 'Compactness and the Löwenheim–Skolem theorems **fail**.', 'Validity is not even arithmetically definable.'),
          warn('Expressive power and good meta-theory pull in opposite directions.')
        ),
        pg(
          'Henkin semantics and higher types',
          p('**Henkin semantics** lets the second-order quantifiers range over a chosen collection of sets rather than all of them. That restores completeness but also brings back non-standard models.'),
          p('**Higher-order logic** adds a hierarchy of types (functions of functions). It underlies proof assistants such as Isabelle/HOL.')
        ),
      ],
      [
        mcq('Second-order logic can quantify over…', ['Properties and relations', 'Only objects', 'Only numbers', 'Only sentences'], 0, 'That is what makes it second-order.'),
        mcq('In second-order Peano arithmetic induction is…', ['A single axiom', 'An infinite schema', 'Not available', 'A rule only'], 0, 'One axiom quantifying over all properties.'),
        mcq('Second-order Peano arithmetic is categorical, meaning…', ['All its models look like the standard naturals', 'It has no models', 'It is decidable', 'It is first-order'], 0, 'Unique up to isomorphism.'),
        tf('Second-order logic with full semantics has a complete proof system.', false, 'No effective proof system captures its validities.'),
        tf('First-order Peano arithmetic has non-standard models.', true, 'A consequence of compactness.'),
        mcq('Henkin semantics…', ['Lets second-order quantifiers range over a chosen collection of sets', 'Bans quantifiers', 'Uses fuzzy values', 'Is the same as full semantics'], 0, 'It behaves like many-sorted first-order logic.'),
        mcq('The formula ∃P … says…', ['There exists a property with such and such features', 'There exists a number', 'P is a premise', 'P is true'], 0, 'Quantification over properties.'),
        mcq('Can second-order logic express “the domain is finite”?', ['Yes', 'No'], 0, 'It can, which is why it is not compact.'),
        mcq('Which is expressible in second-order logic but not in first-order logic?', ['Transitive closure of a relation', 'Equality', 'Simple predication', 'Negation'], 0, 'Reachability needs quantification over sets.'),
        mcq('Isabelle/HOL is built on…', ['Higher-order logic', 'Modal logic', 'Fuzzy logic', 'Temporal logic'], 0, 'A typed λ-calculus-based logic.'),
        mcq('Compactness fails for second-order logic because it can…', ['Express finiteness', 'Express negation', 'Express conjunction', 'Be translated to SAT'], 0, 'Add constants and break finiteness.'),
        mcq('Leibniz’s definition of identity is…', ['a = b iff ∀P (P(a) ↔ P(b))', 'a = b iff a ∈ b', 'a = b iff a ∧ b', 'a = b iff a → b'], 0, 'Identical things share all properties.'),
      ]
    ),
    lesson(
      'ho-2',
      'Type Theory & Proof Assistants',
      'hammer-outline',
      'Programs that check mathematics.',
      8,
      [
        pg(
          'Types that depend on values',
          p('In **dependent type theory** a type can mention a value. The type **Vector A n** is the type of lists of length n.'),
          sym(
            { sym: 'Π x : A. B(x)', name: 'dependent function type', note: 'generalises A → B' },
            { sym: 'Σ x : A. B(x)', name: 'dependent pair type', note: 'generalises A ∧ B and ∃' }
          ),
          p('Under Curry–Howard, ∀x P(x) is a Π-type and ∃x P(x) is a Σ-type: a witness together with a proof.')
        ),
        pg(
          'Proof assistants',
          list('**Lean, Coq (Rocq), Agda, Isabelle** let you state theorems and build proofs the machine checks.', 'A small **trusted kernel** checks every step, so you only have to trust that kernel.', 'Proofs are written as terms or with **tactics**, commands that build a proof step by step.')
        ),
        pg(
          'What has been formalised',
          list('The **four colour theorem** (Gonthier, in Coq)', 'The **Feit–Thompson** odd-order theorem (Coq)', 'The **Kepler conjecture** (Flyspeck)', '**CompCert**, a verified C compiler, and **seL4**, a verified operating-system kernel'),
          warn('A formal proof is only as good as the statement. If you formalise the wrong claim, the proof proves the wrong thing.')
        ),
        pg(
          'Foundations',
          p('**Univalent foundations** (homotopy type theory) treats equality as a path and aims at a foundation of mathematics suited to computer verification.'),
          tip('Proof assistants have changed what “checked” means for large, intricate proofs.')
        ),
      ],
      [
        mcq('In a proof assistant a proof is checked by…', ['A small trusted kernel', 'A human referee only', 'A random test', 'The compiler of Python'], 0, 'Everything reduces to the kernel.'),
        mcq('Which is an example of a dependent type?', ['Vector A n', 'Int', 'Bool', 'String'], 0, 'The type mentions the length n.'),
        mcq('Which of these is a proof assistant?', ['Lean', 'Excel', 'Photoshop', 'Chrome'], 0, 'Along with Coq, Agda and Isabelle.'),
        mcq('The four colour theorem was formally verified in…', ['Coq', 'Excel', 'Prolog', 'SQL'], 0, 'By Georges Gonthier.'),
        mcq('CompCert is…', ['A formally verified C compiler', 'A web framework', 'A database', 'A game'], 0, 'Its correctness is proved in Coq.'),
        mcq('seL4 is…', ['A formally verified microkernel', 'A theorem', 'A logic', 'A language for databases'], 0, 'Its implementation is proved to match its specification.'),
        tf('A formal proof can still be pointless if the statement was formalised wrongly.', true, 'The machine checks the proof of the statement you wrote.'),
        mcq('A tactic is…', ['A command that builds a proof step by step', 'A truth value', 'A type', 'A kernel'], 0, 'It writes part of the proof term for you.'),
        mcq('The Π-type generalises…', ['The function type A → B', 'The pair type', 'The empty type', 'The list type'], 0, 'The result type may depend on the input.'),
        mcq('The Σ-type generalises…', ['The pair type and existential quantification', 'Functions', 'The unit type', 'Recursion'], 0, 'A witness with a proof about it.'),
        mcq('Under Curry–Howard ∃x. P(x) corresponds to…', ['A dependent pair', 'A function', 'A boolean', 'A list'], 0, 'A value and evidence about it.'),
        mcq('Univalent foundations is also known as…', ['Homotopy type theory', 'Linear logic', 'Fuzzy logic', 'Hoare logic'], 0, 'It connects types with spaces.'),
      ]
    ),
    lesson(
      'ho-3',
      'Linear & Substructural Logic',
      'sync-outline',
      'Logic where resources are used exactly once.',
      7,
      [
        pg(
          'Resources, not truths',
          p('Classical logic lets you ignore a premise (**weakening**) and use it as often as you like (**contraction**). Real resources do not behave like that: a coin you spend is gone.'),
          p('**Linear logic** (Girard, 1987) removes both rules, so every assumption is used **exactly once**.')
        ),
        pg(
          'The connectives',
          sym(
            { sym: 'A ⊗ B', name: 'both A and B', note: 'you hold both resources' },
            { sym: 'A ⊸ B', name: 'consume A to get B', note: 'linear implication' },
            { sym: 'A & B', name: 'you choose A or B', note: 'additive conjunction' },
            { sym: '!A', name: 'as many A as you like', note: 'the “of course” modality' }
          ),
          ex(['$1 ⊸ Coffee', '$1 ⊗ $1 is not the same as $1.', 'Spending the coin gives coffee and leaves no coin.'], 'A vending machine')
        ),
        pg(
          'Where it appears',
          list('Rust’s **ownership and borrowing** are close relatives of linear and affine types.', '**Session types** describe communication protocols.', 'Chemical reactions and Petri nets model consumption of resources.')
        ),
        pg(
          'Other substructural logics',
          list('**Relevance logic** drops weakening.', '**Affine logic** drops contraction but keeps weakening.', '**Ordered (Lambek) logic** drops exchange as well and models word order in grammar.'),
          cmp(
            { title: 'Classical', lines: ['p → (p ∧ p) is valid.', 'Assumptions can be reused.'] },
            { title: 'Linear', lines: ['p ⊸ (p ⊗ p) is not valid.', 'Assumptions are consumed.'] }
          )
        ),
      ],
      [
        mcq('The weakening rule lets you…', ['Ignore an assumption', 'Use an assumption twice', 'Swap two assumptions', 'Negate one'], 0, 'Add an unused premise.'),
        mcq('The contraction rule lets you…', ['Use an assumption twice', 'Ignore an assumption', 'Delete a conclusion', 'Swap assumptions'], 0, 'Duplicate a premise.'),
        mcq('Linear logic removes…', ['Weakening and contraction', 'Negation', 'Conjunction', 'Modus ponens'], 0, 'Resources are used exactly once.'),
        mcq('A ⊸ B reads as…', ['Consume A to produce B', 'A and B', 'A or B', 'Not A'], 0, 'Linear implication.'),
        mcq('The exponential !A means…', ['You may use A as many times as you like', 'A is false', 'A is possible', 'A is used once'], 0, 'It restores classical reuse for A.'),
        mcq('A ⊗ B means…', ['You hold both A and B', 'You choose one', 'A implies B', 'A is false'], 0, 'Multiplicative conjunction.'),
        mcq('A & B means…', ['You can choose A or B, but not both', 'Both A and B', 'Neither', 'A then B'], 0, 'Additive conjunction.'),
        mcq('Rust’s ownership system is inspired by…', ['Linear and affine types', 'Modal logic', 'Fuzzy logic', 'Set theory'], 0, 'Values are used at most once unless borrowed.'),
        mcq('Relevance logic drops…', ['Weakening', 'Contraction', 'Modus ponens', 'Negation'], 0, 'Premises must be used.'),
        mcq('The Lambek calculus is used for…', ['Grammar of natural language', 'Hardware', 'Arithmetic', 'Databases'], 0, 'Word order matters, so exchange is dropped.'),
        tf('In linear logic p ⊸ (p ⊗ p) is valid.', false, 'It would duplicate a resource.'),
        tf('In classical logic p → (p ∧ p) is valid.', true, 'Premises can be reused.'),
      ]
    ),
  ]
);

/* =========================================================================
   ADVANCED · Computability & Complexity
   ========================================================================= */
export const complexityUnit = unit(
  'complexity',
  2,
  'Computability & Complexity',
  'speedometer-outline',
  140,
  'What can be computed at all, what can be computed quickly, and how logic describes both.',
  [
    lesson(
      'cx-1',
      'Computability',
      'hardware-chip-outline',
      'Turing machines, decidability and reductions.',
      8,
      [
        pg(
          'Turing machines',
          p('A **Turing machine** has a tape, a head and a finite set of states. At each step it reads a symbol, writes one, moves left or right and changes state. The **Church–Turing thesis** says anything effectively computable can be computed this way.'),
          p('A **universal Turing machine** takes a description of another machine and simulates it, which is the idea behind stored programs.')
        ),
        pg(
          'Decidable, semi-decidable, undecidable',
          list('**Decidable:** some algorithm always halts with yes or no.', '**Semi-decidable:** an algorithm halts with yes when the answer is yes, but may run forever otherwise.', '**Undecidable:** no algorithm decides it.'),
          p('The halting problem is semi-decidable (run the program and wait) but undecidable. Its complement is not even semi-decidable.')
        ),
        pg(
          'Reductions',
          p('To show a problem X is undecidable, **reduce** a known undecidable problem to it: if X were decidable, so would the known one be. Many questions about programs fall to **Rice’s theorem**: any non-trivial property of what a program computes is undecidable.'),
          ex(['Does this program ever print “hello”?', 'Do these two programs compute the same function?', 'Does this program always terminate?'], 'All undecidable')
        ),
        pg(
          'Beyond',
          list('The **busy beaver** function grows faster than any computable function.', 'The **Ackermann function** is total and computable but not primitive recursive.', 'An **oracle** for the halting problem gives strictly more power, leading to a hierarchy of degrees of unsolvability.')
        ),
      ],
      [
        mcq('A decidable problem is one for which…', ['An algorithm always halts with the right yes or no', 'An algorithm sometimes finds the answer', 'No algorithm exists', 'The answer is always yes'], 0, 'It is fully solvable by computation.'),
        mcq('The halting problem is…', ['Undecidable but semi-decidable', 'Decidable', 'Not even semi-decidable', 'Solved by truth tables'], 0, 'You can confirm halting by running the program.'),
        mcq('The complement of the halting problem is…', ['Not semi-decidable', 'Decidable', 'Semi-decidable', 'Trivial'], 0, 'You cannot confirm that a program loops forever by running it.'),
        mcq('A reduction from problem A to problem B shows that…', ['If B were decidable, so would A be', 'A is harder than B always', 'A and B are equal', 'B is undecidable'], 0, 'A solver for B yields one for A.'),
        mcq('To prove a problem X undecidable you…', ['Reduce a known undecidable problem to X', 'Show X is hard to code', 'Run X for a long time', 'Show X has no inputs'], 0, 'That transfers undecidability.'),
        tf('Every semi-decidable problem is decidable.', false, 'The halting problem is a counterexample.'),
        mcq('A universal Turing machine…', ['Simulates any Turing machine given its description', 'Solves the halting problem', 'Is faster than others', 'Cannot exist'], 0, 'It is the model of a stored-program computer.'),
        mcq('Rice’s theorem says that every non-trivial semantic property of programs is…', ['Undecidable', 'Decidable', 'Always true', 'Always false'], 0, 'No general algorithm can test it.'),
        mcq('The busy beaver function…', ['Grows faster than any computable function', 'Is computable', 'Is linear', 'Is constant'], 0, 'It is uncomputable.'),
        mcq('The Ackermann function is…', ['Computable but not primitive recursive', 'Uncomputable', 'Primitive recursive', 'Not total'], 0, 'It outgrows every primitive recursive function.'),
        mcq('An oracle for the halting problem would give…', ['Strictly more computational power', 'No extra power', 'Faster arithmetic', 'A proof of P = NP'], 0, 'It allows solving problems no ordinary machine can.'),
        mcq('“Does this program ever print hello?” is…', ['Undecidable', 'Decidable', 'Trivial', 'In P'], 0, 'It is a non-trivial semantic property.'),
      ]
    ),
    lesson(
      'cx-2',
      'Complexity Classes',
      'timer-outline',
      'P, NP and the landscape around them.',
      8,
      [
        pg(
          'Fast and slow',
          p('Among decidable problems some take far longer than others. **P** is the class solvable in time polynomial in the input size; these are considered feasible.'),
          list('Sorting a list: in P.', 'Checking a truth assignment: in P.', 'Finding the best route through many cities: no known polynomial algorithm.')
        ),
        pg(
          'NP and NP-completeness',
          list('**NP:** a proposed solution can be **checked** in polynomial time.', '**NP-complete:** in NP, and every problem in NP reduces to it in polynomial time.'),
          p('SAT was the first NP-complete problem (Cook, Levin). Graph 3-colouring, Hamiltonian path and the subset-sum problem are also NP-complete.'),
          p('**P versus NP** asks whether every problem whose solutions are easy to check is also easy to solve. Nobody knows.')
        ),
        pg(
          'Beyond NP',
          list('**coNP:** the complements of NP problems. Checking that a formula is a tautology is coNP-complete.', '**PSPACE:** problems solvable with polynomial memory. Validity of quantified Boolean formulas is PSPACE-complete.', '**EXPTIME:** exponential time.'),
          p('We know P ⊆ NP ⊆ PSPACE ⊆ EXPTIME and that P ≠ EXPTIME. Whether the intermediate inclusions are strict is unknown.')
        ),
        pg(
          'Logic describes complexity',
          rule('Fagin’s theorem', ['A property of finite structures'], 'is in NP iff it is expressible in existential second-order logic'),
          p('In **descriptive complexity**, resource bounds correspond to logical resources. First-order logic with a least-fixed-point operator captures P on ordered structures.')
        ),
      ],
      [
        mcq('P is the class of problems solvable in…', ['Polynomial time', 'Exponential time', 'Constant time only', 'Any time'], 0, 'Time bounded by a polynomial in the input size.'),
        mcq('NP is the class of problems whose solutions can be…', ['Verified in polynomial time', 'Found in constant time', 'Found in logarithmic time', 'Never checked'], 0, 'Checking is easy.'),
        mcq('A problem is NP-complete when it is in NP and…', ['Every NP problem reduces to it in polynomial time', 'It is undecidable', 'It is in P', 'It has no solutions'], 0, 'It is among the hardest in NP.'),
        mcq('Checking whether a formula is a tautology is…', ['coNP-complete', 'In P', 'Undecidable', 'NP-complete'], 0, 'It is the complement of unsatisfiability.'),
        mcq('Validity of quantified Boolean formulas is…', ['PSPACE-complete', 'In P', 'NP-complete', 'Decidable only in theory'], 0, 'It is the canonical PSPACE-complete problem.'),
        mcq('Is it known whether P = NP?', ['No, it is open', 'Yes, they are equal', 'Yes, they are different', 'It was disproved'], 0, 'It is one of the Millennium Prize problems.'),
        tf('Every problem in P is also in NP.', true, 'If you can solve it quickly, you can check it quickly.'),
        mcq('Fagin’s theorem says that NP equals…', ['Existential second-order logic over finite structures', 'First-order logic', 'Modal logic', 'Propositional logic'], 0, 'A pillar of descriptive complexity.'),
        mcq('If one NP-complete problem is in P, then…', ['P = NP', 'P ≠ NP', 'NP = EXPTIME', 'Nothing follows'], 0, 'Every NP problem would reduce to it.'),
        mcq('The Hamiltonian path problem is…', ['NP-complete', 'In P', 'Undecidable', 'Trivial'], 0, 'It is a classic NP-complete problem.'),
        tf('It is known that P is strictly smaller than EXPTIME.', true, 'The time hierarchy theorem separates them.'),
        mcq('A polynomial-time reduction…', ['Transforms instances of one problem into another, preserving the answer', 'Solves both', 'Shortens the input', 'Removes variables'], 0, 'Yes-instances map to yes-instances.'),
      ]
    ),
    lesson(
      'cx-3',
      'Logic, Automata & Model Checking',
      'git-branch-outline',
      'Decidable logics and how programs are verified.',
      8,
      [
        pg(
          'Finite automata',
          p('A **finite automaton** reads a word one symbol at a time and ends in an accepting or rejecting state. The languages they recognise are the **regular languages**. The **pumping lemma** shows some languages (such as equal numbers of a’s and b’s) are not regular.')
        ),
        pg(
          'Automata on infinite words',
          p('**Büchi automata** accept infinite words by requiring that an accepting state is visited infinitely often. Every LTL formula can be translated into a Büchi automaton.'),
          list('**Model checking** builds an automaton for the system and one for the negated property.', 'The property holds if their product accepts nothing: an **emptiness check**.')
        ),
        pg(
          'Decidable logics',
          list('**Presburger arithmetic** (addition only) is decidable.', '**Monadic second-order logic on words** (MSO) defines exactly the regular languages (Büchi–Elgot–Trakhtenbrot).', '**Rabin’s theorem:** MSO on the infinite binary tree is decidable.', '**Basic modal logic K** has PSPACE-complete satisfiability; the **guarded fragment** generalises it while staying decidable.'),
          warn('Full first-order logic is undecidable, so useful decidable fragments matter in practice.')
        ),
        pg(
          'State explosion',
          p('The number of states of a system can grow exponentially with its components. Techniques such as **symbolic model checking** (BDDs, SAT) and **abstraction** keep verification feasible.'),
          tip('Model checking is used on hardware designs, protocols and parts of operating systems.')
        ),
      ],
      [
        mcq('Regular languages are recognised by…', ['Finite automata', 'Pushdown automata only', 'Turing machines only', 'Truth tables'], 0, 'That is their definition.'),
        mcq('A Büchi automaton accepts…', ['Infinite words', 'Only finite words', 'Nothing', 'Only the empty word'], 0, 'By visiting an accepting state infinitely often.'),
        mcq('LTL model checking reduces to…', ['Automata emptiness checking', 'A truth table', 'Resolution', 'Induction'], 0, 'Product of the system with the automaton for the negated property.'),
        mcq('MSO over finite words defines exactly…', ['The regular languages', 'All languages', 'The decidable languages', 'The context-free languages'], 0, 'The Büchi–Elgot–Trakhtenbrot theorem.'),
        mcq('Presburger arithmetic is…', ['Decidable', 'Undecidable', 'Inconsistent', 'Not first-order'], 0, 'Addition without multiplication is tame.'),
        mcq('Satisfiability of basic modal logic K is…', ['PSPACE-complete', 'In P', 'Undecidable', 'Trivial'], 0, 'Decidable but not easy.'),
        tf('Full first-order logic is decidable.', false, 'Validity is only semi-decidable.'),
        mcq('The guarded fragment of first-order logic is…', ['A decidable generalisation of modal logic', 'Undecidable', 'Empty', 'Propositional'], 0, 'Quantifiers are “guarded” by atoms.'),
        mcq('Rabin’s theorem says that MSO on the infinite binary tree is…', ['Decidable', 'Undecidable', 'Incomplete', 'Inconsistent'], 0, 'A deep result linking logic and automata.'),
        mcq('The state explosion problem is that…', ['The state space can grow exponentially', 'Programs explode', 'Automata are infinite', 'Proofs are long'], 0, 'Many components multiply the states.'),
        mcq('Symbolic model checking uses…', ['BDDs or SAT to represent sets of states', 'Truth tables only', 'Venn diagrams', 'Syllogisms'], 0, 'It avoids enumerating states one by one.'),
        tf('The pumping lemma can be used to show a language is not regular.', true, 'Long enough words in a regular language can be “pumped”.'),
      ]
    ),
  ]
);

