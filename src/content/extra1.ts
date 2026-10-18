import { classify, cmp, ex, lesson, list, match, mcq, order, p, pg, rule, tf, tip, unit, warn } from './helpers';

/* =========================================================================
   BEGINNER · Critical Thinking Toolkit
   ========================================================================= */
export const criticalThinkingUnit = unit(
  'critical-thinking',
  0,
  'Critical Thinking Toolkit',
  'eye-outline',
  20,
  'Map arguments, spot biases and weigh evidence before you accept a claim.',
  [
    lesson(
      'ct-1',
      'Mapping Arguments',
      'map-outline',
      'Draw the structure of an argument to see what holds it up.',
      6,
      [
        pg(
          'Drawing an argument',
          p('An **argument map** shows claims as boxes and support as arrows. The main conclusion sits at the end of the arrows, premises feed into it.'),
          ex(['Conclusion: We should adopt a four-day week.', '  ← Premise 1: Rested workers are more productive.', '  ← Premise 2: Staff wellbeing improves with more time off.'], 'A small map'),
          tip('Mapping forces you to ask “what is this claim actually resting on?”.')
        ),
        pg(
          'Linked or convergent?',
          cmp(
            { title: 'Linked premises', lines: ['Work together.', 'Remove one and the support collapses.', 'All humans are mortal + Socrates is human.'] },
            { title: 'Convergent premises', lines: ['Each supports the conclusion alone.', 'Remove one and the other still helps.', 'The test is accurate; a second lab agrees.'] }
          )
        ),
        pg(
          'Unstated assumptions and charity',
          p('Many arguments leave a premise unsaid. Such an argument is an **enthymeme**: “It is raining, so take an umbrella” assumes you want to stay dry.'),
          list('**Principle of charity:** read an argument in its strongest reasonable form.', '**Steel man:** build the best version of the view you disagree with before you answer it.', 'A **straw man** does the opposite and is a fallacy.')
        ),
        pg(
          'Three ways to object',
          list('**Rebutting:** give a reason the conclusion is false.', '**Undermining:** deny a premise.', '**Undercutting:** accept the premises but deny they support the conclusion.'),
          ex(['“Every sample I tested conducts electricity, so the whole metal does.”', 'Undermine: your samples were not tested.', 'Undercut: your samples all came from one batch.', 'Rebut: this metal is an insulator.'], 'The same argument, three replies')
        ),
      ],
      [
        mcq('In an argument map the main conclusion is…', ['Where the arrows end', 'Where the arrows start', 'The longest box', 'Omitted'], 0, 'Support flows towards it.'),
        mcq('Premises that must work together are…', ['Linked', 'Convergent', 'Redundant', 'Rebutting'], 0, 'Removing one breaks the support.'),
        mcq('Premises that each support the conclusion on their own are…', ['Linked', 'Convergent', 'Hidden', 'Circular'], 1, 'They converge on one conclusion.'),
        classify('Linked or convergent?', ['Linked', 'Convergent'], [['All birds have wings; Tweety is a bird', 0], ['The test is reliable; a second lab independently agrees', 1], ['If it rains the match is off; it rains', 0], ['The recipe is cheap; the recipe is also quick', 1]], 'Linked premises depend on each other; convergent ones stand alone.'),
        mcq('An enthymeme is an argument…', ['With an unstated premise', 'With no conclusion', 'With two conclusions', 'That is invalid'], 0, 'Something is left implicit.'),
        mcq('The principle of charity asks you to…', ['Read an argument in its strongest reasonable form', 'Donate to the speaker', 'Assume it is valid', 'Ignore weak points'], 0, 'It avoids attacking a weak version.'),
        tf('A steel man is a deliberately weakened version of an opponent’s view.', false, 'That is a straw man. A steel man is the strongest version.'),
        mcq('Denying one of the premises is called…', ['Undermining', 'Undercutting', 'Rebutting', 'Charity'], 0, 'You attack the support itself.'),
        mcq('Accepting the premises but denying that they support the conclusion is…', ['Undercutting', 'Undermining', 'Rebutting', 'Equivocation'], 0, 'You cut the link.'),
        mcq('Giving a reason the conclusion is false is…', ['Rebutting', 'Undermining', 'Undercutting', 'Mapping'], 0, 'A direct counter-argument.'),
        match('Match each term with its meaning.', [['Rebutting', 'A reason the conclusion is false'], ['Undercutting', 'Denies that the premises support the conclusion'], ['Undermining', 'Denies a premise'], ['Steel man', 'The strongest version of a view']], 'These are the standard moves in argument analysis.'),
        order('Put the mapping steps in order.', ['Find the main conclusion', 'Mark the premises', 'Group the linked premises', 'Add unstated assumptions', 'Add objections and replies'], 'From the point being made out to what could challenge it.'),
      ]
    ),
    lesson(
      'ct-2',
      'Cognitive Traps',
      'warning-outline',
      'Why smart people reason badly, and what to do about it.',
      6,
      [
        pg(
          'Biases are not stupidity',
          p('Human reasoning uses shortcuts that usually work and sometimes fail in predictable ways. Knowing the common failures is the first defence.'),
          list('**Confirmation bias:** noticing and remembering only what fits what you already believe.', '**Belief bias:** judging an argument by whether you like its conclusion, not by its form.', '**Hindsight bias:** feeling that an outcome was obvious after you know it.')
        ),
        pg(
          'Estimates and numbers',
          list('**Anchoring:** a number you heard first pulls later estimates towards it.', '**Availability:** judging how likely something is by how easily examples come to mind.', '**Base rate neglect:** ignoring how common something is in the first place.')
        ),
        pg(
          'Decisions',
          list('**Framing:** the same facts described as gains or as losses lead to different choices.', '**Sunk cost:** continuing something because of what you have already spent.'),
          warn('A valid argument remains valid even if you hate the conclusion. Check the form first, then the premises.')
        ),
        pg(
          'Using logic against bias',
          list('Ask “what would change my mind?” before you look at the evidence.', 'Actively look for counterexamples.', 'List alternative explanations, not just your favourite.', 'Run a **pre-mortem**: imagine the plan failed and ask why.'),
          tip('Being clever does not protect you. Clever people are good at defending conclusions they reached for other reasons.')
        ),
      ],
      [
        mcq('Seeking only evidence that supports what you already think is…', ['Confirmation bias', 'Anchoring', 'Framing', 'Hindsight bias'], 0, 'You filter the evidence.'),
        mcq('Judging how likely something is by how easily you can recall examples is…', ['The availability heuristic', 'Anchoring', 'Sunk cost', 'Framing'], 0, 'Vivid cases feel common.'),
        mcq('The first number you hear influences later estimates. This is…', ['Anchoring', 'Confirmation bias', 'Belief bias', 'Hindsight bias'], 0, 'The anchor drags the estimate.'),
        mcq('“We cannot stop now, we have already spent a fortune.” is the…', ['Sunk cost fallacy', 'Availability heuristic', 'Straw man', 'Slippery slope'], 0, 'Past, unrecoverable costs should not drive the decision.'),
        mcq('Choosing differently when the same facts are described as gains versus losses is the…', ['Framing effect', 'Anchoring effect', 'Hindsight bias', 'Confirmation bias'], 0, 'The description changes the choice.'),
        mcq('Ignoring how common a condition is when judging a test result is…', ['Base rate neglect', 'Anchoring', 'Framing', 'Belief bias'], 0, 'The prior matters.'),
        tf('High intelligence reliably protects people from cognitive biases.', false, 'Smart people can rationalise just as well.'),
        mcq('A good debiasing habit is to…', ['Actively look for counterexamples', 'Trust your first impression', 'Avoid thinking about it', 'Ask only friends'], 0, 'Try to break your own view.'),
        mcq('A pre-mortem means…', ['Imagining a plan failed and asking why', 'Reviewing after success', 'Avoiding planning', 'Listing only strengths'], 0, 'It surfaces risks early.'),
        classify('Which bias?', ['Confirmation', 'Sunk cost', 'Availability', 'Anchoring'], [['Only reading articles that agree with you', 0], ['Keeping a bad investment because you have lost so much', 1], ['Fearing flying after news of a crash', 2], ['Estimating a price from a very high listing', 3]], 'Each is a named pattern of error.'),
        mcq('Belief bias is judging an argument by…', ['Whether its conclusion seems believable', 'Its form', 'Its length', 'Its source only'], 0, 'It confuses truth of conclusion with validity.'),
        mcq('Hindsight bias is the feeling that…', ['An outcome was obvious once you know it', 'The future is certain', 'Your memory is perfect', 'Everyone agrees'], 0, '“I knew it all along.”'),
      ]
    ),
    lesson(
      'ct-3',
      'Weighing Evidence',
      'flask-outline',
      'Correlation, cause, sampling and good tests.',
      6,
      [
        pg(
          'Correlation is not causation',
          p('Two things moving together can be explained in several ways:'),
          list('A causes B', 'B causes A', 'A **third factor** causes both (a confounder)', 'Coincidence'),
          ex(['Ice cream sales and drownings both rise in summer.', 'Hot weather drives both; ice cream does not cause drowning.'], 'A common cause')
        ),
        pg(
          'Biased samples',
          list('**Selection bias:** the people you study are not typical.', '**Survivorship bias:** you only see what survived, such as studying successful firms to find what “makes” success.', '**Small samples** swing wildly by chance, and a **large biased sample** is still biased.'),
          p('In the Second World War, analysts first proposed armouring the places where returning bombers had bullet holes. Abraham Wald pointed out that the planes hit elsewhere never came back.')
        ),
        pg(
          'Finding causes',
          list('**Controlled experiment:** change one factor, hold others fixed.', '**Randomisation** spreads unknown confounders evenly between groups.', '**Mill’s method of difference:** if two cases are identical except for factor X and only one has the effect, X is (part of) the cause.', '**Necessary** vs **sufficient** conditions: oxygen is necessary for fire but not sufficient.')
        ),
        pg(
          'Watch for…',
          list('**P-hacking:** trying many hypotheses until one looks significant.', '**Anecdotes:** vivid but not representative.', '**Placebo effects:** improvement caused by expectation.'),
          tip('Ask: compared with what? how many? chosen how?')
        ),
      ],
      [
        mcq('Ice cream sales and drownings both rise in summer. The best explanation is…', ['A common cause: hot weather', 'Ice cream causes drowning', 'Drowning causes ice cream sales', 'Pure coincidence'], 0, 'Heat drives both.'),
        mcq('Studying only successful companies to find the “secrets of success” risks…', ['Survivorship bias', 'Anchoring', 'Framing', 'Base rate neglect'], 0, 'You never see the failures.'),
        tf('Correlation proves causation.', false, 'It is only a clue.'),
        mcq('Randomly assigning people to groups helps because it…', ['Balances unknown confounders on average', 'Makes the study larger', 'Removes all error', 'Proves the hypothesis'], 0, 'Differences left should be due to the treatment.'),
        mcq('Two cases are identical except for factor X, and only one shows the effect. By Mill’s method of difference…', ['X is probably (part of) the cause', 'X is irrelevant', 'The cases are wrong', 'Nothing follows'], 0, 'The single difference carries the effect.'),
        mcq('Surveying only people who answer an unknown phone number risks…', ['Selection bias', 'Hindsight bias', 'Sunk cost', 'Equivocation'], 0, 'The sample may not represent everyone.'),
        mcq('A very large sample that was chosen in a biased way is…', ['Still biased', 'Unbiased', 'Randomised', 'Controlled'], 0, 'Size does not fix selection.'),
        tf('A single vivid anecdote is strong evidence for a general claim.', false, 'It may be unrepresentative.'),
        mcq('Oxygen is a ___ condition for fire.', ['Necessary but not sufficient', 'Sufficient but not necessary', 'Necessary and sufficient', 'Neither'], 0, 'Fire needs it, but oxygen alone does not cause fire.'),
        mcq('The placebo effect is…', ['Improvement caused by expectation', 'A side effect of the drug', 'A control group', 'Measurement error'], 0, 'Beliefs change outcomes.'),
        mcq('A confounder is…', ['A third variable influencing both things being compared', 'A faulty instrument', 'A random sample', 'A premise'], 0, 'It can create a misleading association.'),
        mcq('P-hacking means…', ['Testing many hypotheses until one looks significant', 'Hiding data', 'Using a bigger sample', 'Randomising'], 0, 'Chance alone will eventually give a “result”.'),
      ]
    ),
  ]
);

/* =========================================================================
   INTERMEDIATE · Reasoning Under Uncertainty
   ========================================================================= */
export const probabilityUnit = unit(
  'probability',
  1,
  'Reasoning Under Uncertainty',
  'dice-outline',
  335,
  'Probability as the logic of partial belief, Bayes’ theorem and classic probability traps.',
  [
    lesson(
      'prob-1',
      'Probability Basics',
      'pie-chart-outline',
      'From true and false to degrees between 0 and 1.',
      6,
      [
        pg(
          'Probability as a number',
          p('A **probability** is a number from 0 (impossible) to 1 (certain) measuring how likely a statement is. It extends truth values: true is 1, false is 0.'),
          list('Fair die: P(even) = 3/6 = 1/2.', 'The **complement rule:** P(not A) = 1 − P(A).'),
          p('The set of all possible outcomes is the **sample space**.')
        ),
        pg(
          'And, or, not',
          list('**Independent events:** P(A and B) = P(A) × P(B).', '**Any events:** P(A or B) = P(A) + P(B) − P(A and B).', '**Mutually exclusive events:** P(A or B) = P(A) + P(B).'),
          ex(['Two fair coins both heads: 1/2 × 1/2 = 1/4.', 'P(A) = 0.6, P(B) = 0.5, P(A and B) = 0.3 gives', 'P(A or B) = 0.6 + 0.5 − 0.3 = 0.8.'], 'Examples')
        ),
        pg(
          'Conditional probability',
          rule('Conditional probability', ['P(A and B)', 'P(B) > 0'], 'P(A | B) = P(A and B) / P(B)'),
          p('“A given B” asks how likely A is among the cases where B holds. Events are **independent** when P(A | B) = P(A).'),
          warn('P(A | B) and P(B | A) are different. Confusing them is the core of many errors.')
        ),
        pg(
          'Expected value',
          p('The **expected value** of a bet is the sum of each outcome times its probability. A fair die has expected value 3.5.'),
          tip('Probability is not logic’s rival. It is logic extended to uncertain statements.')
        ),
      ],
      [
        mcq('A fair die is rolled. P(even) is…', ['1/6', '1/3', '1/2', '2/3'], 2, 'Three of six outcomes.'),
        mcq('A fair die is rolled. P(not a six) is…', ['1/6', '5/6', '1/2', '4/6'], 1, '1 − 1/6.'),
        mcq('Two fair coin flips. P(both heads) is…', ['1/2', '1/4', '1/3', '3/4'], 1, 'Independent: 1/2 × 1/2.'),
        mcq('A and B are mutually exclusive, P(A) = 0.3 and P(B) = 0.4. P(A or B) is…', ['0.12', '0.7', '0.1', '1.2'], 1, 'Add them.'),
        mcq('A and B are independent with P(A) = 0.5 and P(B) = 0.5. P(A and B) is…', ['0.25', '0.5', '1', '0.75'], 0, 'Multiply.'),
        mcq('P(A) = 0.6, P(B) = 0.5, P(A and B) = 0.3. P(A or B) is…', ['0.8', '1.1', '0.3', '0.9'], 0, '0.6 + 0.5 − 0.3.'),
        mcq('P(A and B) = 0.2 and P(B) = 0.5. P(A | B) is…', ['0.4', '0.1', '0.7', '0.2'], 0, '0.2 / 0.5.'),
        tf('P(A | B) is always equal to P(B | A).', false, 'They differ unless P(A) = P(B).'),
        mcq('Two dice are rolled. P(sum = 7) is…', ['1/36', '1/12', '1/6', '1/4'], 2, 'Six of 36 outcomes.'),
        mcq('The expected value of one roll of a fair die is…', ['3', '3.5', '4', '6'], 1, '(1 + 2 + … + 6) / 6.'),
        tf('For independent events A and B, P(A | B) = P(A).', true, 'Knowing B tells you nothing about A.'),
        mcq('P(A and not A) is…', ['0', '1', '0.5', 'Undefined'], 0, 'A contradiction has probability 0.'),
        mcq('One card is drawn from a standard 52-card deck. P(heart or king) is…', ['16/52', '17/52', '13/52', '4/52'], 0, '13 hearts + 4 kings − the king of hearts.'),
      ]
    ),
    lesson(
      'prob-2',
      'Bayes’ Theorem',
      'analytics-outline',
      'How to update what you believe when evidence arrives.',
      7,
      [
        pg(
          'The rule',
          rule('Bayes’ theorem', ['P(E | H)', 'P(H)', 'P(E)'], 'P(H | E) = P(E | H) · P(H) / P(E)'),
          p('**H** is a hypothesis, **E** is evidence. P(H) is the **prior**, P(E | H) the **likelihood**, P(H | E) the **posterior**.')
        ),
        pg(
          'A medical test',
          p('A disease affects 1% of people. A test catches 90% of cases (sensitivity) and wrongly flags 9% of healthy people. You test positive. How likely are you to be ill?'),
          ex(['Imagine 1,000 people.', '10 are ill: 9 test positive.', '990 are healthy: about 89 test positive.', 'Of 98 positives, 9 are ill: roughly 9%.'], 'Natural frequencies'),
          tip('Counting people is easier than multiplying probabilities and avoids most mistakes.')
        ),
        pg(
          'Base rate neglect',
          p('Most people answer “about 90%” because they ignore how rare the disease is. A rare condition with a good-but-imperfect test still gives mostly false alarms.'),
          list('A higher prior gives a higher posterior for the same evidence.', 'Evidence that is much likelier under H than under not-H moves belief a lot.', 'Posterior odds = prior odds × likelihood ratio.')
        ),
        pg(
          'Updating over and over',
          p('Today’s posterior becomes tomorrow’s prior. Bayesian updating can be repeated as evidence arrives, which is how the theorem becomes a model of learning.'),
          warn('The prosecutor’s fallacy confuses P(evidence | innocent) with P(innocent | evidence).')
        ),
      ],
      [
        mcq('In P(H | E), the hypothesis H is considered…', ['Given the evidence E', 'Before any evidence', 'Impossible', 'Independent of E'], 0, 'The bar means “given”.'),
        mcq('Prevalence 1%, sensitivity 90%, false positive rate 9%. P(ill | positive) is about…', ['90%', '50%', '9%', '1%'], 2, 'Most positives are false alarms.'),
        mcq('Out of 1,000 people, 10 are ill and 9 of them test positive, while 89 of the 990 healthy people also test positive. Among the 98 positives, the fraction ill is about…', ['9%', '90%', '50%', '99%'], 0, '9 out of 98.'),
        mcq('Base rate neglect means…', ['Ignoring the prior probability', 'Using too large a sample', 'Trusting experts', 'Rounding numbers'], 0, 'You forget how common the thing is.'),
        mcq('With the same evidence, a higher prior gives…', ['A higher posterior', 'A lower posterior', 'The same posterior', 'Zero'], 0, 'The prior sets the starting point.'),
        tf('P(E | H) and P(H | E) are the same thing.', false, 'They are generally different.'),
        mcq('A test is 99% sensitive with 1% false positives, for a disease with prevalence 0.1%. P(ill | positive) is roughly…', ['99%', '50%', '9%', '1%'], 2, 'About 1 true positive per 10 false ones.'),
        mcq('The likelihood ratio is…', ['P(E | H) / P(E | not H)', 'P(H) / P(not H)', 'P(H | E) / P(E)', 'P(E) / P(H)'], 0, 'How much more likely the evidence is if H is true.'),
        mcq('Posterior odds equal prior odds times…', ['The likelihood ratio', 'The prior', 'The sample size', 'The evidence'], 0, 'Bayes in odds form.'),
        mcq('Absence of evidence is…', ['Weak evidence of absence, depending on how likely evidence would be', 'Proof of absence', 'Never relevant', 'Proof of presence'], 0, 'It counts for something when you would expect to see evidence.'),
        tf('Bayesian updating can be repeated as new evidence arrives.', true, 'The posterior becomes the new prior.'),
        mcq('The prosecutor’s fallacy confuses…', ['P(evidence | innocent) with P(innocent | evidence)', 'Innocent and guilty', 'Two witnesses', 'Evidence and proof'], 0, 'A conditional probability reversed.'),
      ]
    ),
    lesson(
      'prob-3',
      'Probability Traps',
      'trending-up-outline',
      'Famous ways intuition goes wrong.',
      6,
      [
        pg(
          'Gambler’s fallacy',
          p('A fair coin has landed heads five times. The next flip is still 50:50. Independent events have no memory.'),
          warn('The law of large numbers describes long-run averages. It does not say a coin “owes” you tails.')
        ),
        pg(
          'The conjunction fallacy',
          ex(['Linda is outspoken and studied philosophy.', 'Which is more probable?', '(a) Linda is a bank teller.', '(b) Linda is a bank teller and a feminist.'], 'Tversky and Kahneman'),
          p('Most people choose (b), but a conjunction can never be more probable than one of its parts: **P(A and B) ≤ P(A)**.')
        ),
        pg(
          'Simpson’s paradox and regression',
          list('**Simpson’s paradox:** a trend in several groups can reverse when the groups are combined.', '**Regression to the mean:** extreme results tend to be followed by less extreme ones, with no cause needed.'),
          p('A treatment can look worse overall but be better in each group if the groups differ in size and severity.')
        ),
        pg(
          'Surprising results',
          list('**Birthday problem:** among 23 people the chance of a shared birthday exceeds 50%.', '**Monty Hall:** after a goat is revealed, switching doors wins 2/3 of the time.'),
          tip('When intuition and arithmetic disagree, count cases.')
        ),
      ],
      [
        mcq('A fair coin has landed heads five times. The probability of heads next is…', ['Less than 1/2', '1/2', 'More than 1/2', 'Zero'], 1, 'Independent flips.'),
        mcq('The gambler’s fallacy is the belief that…', ['Past independent outcomes make the opposite more likely', 'Coins are biased', 'Heads is luckier', 'Randomness is impossible'], 0, 'It misreads independence.'),
        mcq('Which is more probable?', ['Linda is a bank teller', 'Linda is a bank teller and a feminist', 'They are equally probable', 'Cannot be compared'], 0, 'A conjunction cannot beat one of its parts.'),
        tf('P(A and B) can never exceed P(A).', true, 'Cases with both are among the cases with A.'),
        mcq('Simpson’s paradox is when…', ['A trend in groups reverses when they are combined', 'A coin lands the same way twice', 'Averages are zero', 'A sample is too small'], 0, 'Group sizes matter.'),
        mcq('How many people are needed for a shared birthday to be more likely than not?', ['23', '100', '183', '366'], 0, 'There are many pairs.'),
        mcq('In the Monty Hall problem, switching doors wins with probability…', ['1/3', '1/2', '2/3', '1'], 2, 'Your first pick is right only one time in three.'),
        mcq('Regression to the mean says that extreme results are…', ['Usually followed by less extreme ones', 'Always repeated', 'Caused by luck only', 'Impossible'], 0, 'Chance contributes to extremes.'),
        tf('The law of large numbers means a coin “owes” tails after many heads.', false, 'It describes long-run averages, not compensation.'),
        mcq('A bet pays $10 with probability 0.1 and loses $1 with probability 0.9. Its expected value is…', ['−$0.90', '$0.10', '$1', '$0'], 1, '10 × 0.1 − 1 × 0.9 = 0.1.'),
        mcq('The probability of at least one head in three fair flips is…', ['1/2', '3/4', '7/8', '1/8'], 2, '1 − (1/2)³.'),
        mcq('Which approach helps most when intuition and arithmetic disagree?', ['Count the cases', 'Trust intuition', 'Ask a friend', 'Round up'], 0, 'Enumerating outcomes exposes the error.'),
      ]
    ),
  ]
);
