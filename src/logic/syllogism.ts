/**
 * Categorical syllogism engine.
 *
 * Three terms S (minor), P (major), M (middle) split the universe into 8 Venn regions.
 * Each region is either empty or inhabited, giving 256 possible "worlds". A syllogism is
 * valid iff every world satisfying both premises also satisfies the conclusion.
 */

export type Form = 'A' | 'E' | 'I' | 'O';
export type Figure = 1 | 2 | 3 | 4;
export type TermName = 'S' | 'P' | 'M';

export const FORM_TEXT: Record<Form, (x: string, y: string) => string> = {
  A: (x, y) => `All ${x} are ${y}`,
  E: (x, y) => `No ${x} are ${y}`,
  I: (x, y) => `Some ${x} are ${y}`,
  O: (x, y) => `Some ${x} are not ${y}`,
};

export const FORM_NAME: Record<Form, string> = {
  A: 'Universal affirmative',
  E: 'Universal negative',
  I: 'Particular affirmative',
  O: 'Particular negative',
};

/** Region index bits: S=4, P=2, M=1 → region r has S if r&4, etc. */
const hasS = (r: number) => !!(r & 4);
const hasP = (r: number) => !!(r & 2);
const hasM = (r: number) => !!(r & 1);
const has = (t: TermName, r: number) => (t === 'S' ? hasS(r) : t === 'P' ? hasP(r) : hasM(r));

export interface Statement {
  form: Form;
  subj: TermName;
  pred: TermName;
}

/** regions that a universal statement forces empty, or that a particular might occupy */
export function statementRegions(st: Statement): number[] {
  const regions: number[] = [];
  for (let r = 0; r < 8; r++) {
    const inSubj = has(st.subj, r);
    const inPred = has(st.pred, r);
    if (st.form === 'A' && inSubj && !inPred) regions.push(r); // must be empty
    if (st.form === 'E' && inSubj && inPred) regions.push(r); // must be empty
    if (st.form === 'I' && inSubj && inPred) regions.push(r); // at least one inhabited
    if (st.form === 'O' && inSubj && !inPred) regions.push(r); // at least one inhabited
  }
  return regions;
}

const isUniversal = (f: Form) => f === 'A' || f === 'E';

/** world: bitmask over 8 regions; bit r set => region r inhabited */
function satisfies(st: Statement, world: number): boolean {
  const rs = statementRegions(st);
  if (isUniversal(st.form)) return rs.every((r) => !(world & (1 << r)));
  return rs.some((r) => !!(world & (1 << r)));
}

export function premiseStatements(major: Form, minor: Form, fig: Figure): [Statement, Statement] {
  // Major premise relates P and M; minor premise relates S and M.
  const maj: Statement = fig === 1 || fig === 3 ? { form: major, subj: 'M', pred: 'P' } : { form: major, subj: 'P', pred: 'M' };
  const min: Statement = fig === 1 || fig === 2 ? { form: minor, subj: 'S', pred: 'M' } : { form: minor, subj: 'M', pred: 'S' };
  return [maj, min];
}

export type Verdict = 'valid' | 'conditional' | 'invalid';

export interface SyllogismResult {
  verdict: Verdict;
  mood: string;
  name?: string;
  statements: [Statement, Statement, Statement];
  reason: string;
}

const TRADITIONAL: Record<string, string> = {
  'AAA-1': 'Barbara',
  'EAE-1': 'Celarent',
  'AII-1': 'Darii',
  'EIO-1': 'Ferio',
  'AAI-1': 'Barbari',
  'EAO-1': 'Celaront',
  'EAE-2': 'Cesare',
  'AEE-2': 'Camestres',
  'EIO-2': 'Festino',
  'AOO-2': 'Baroco',
  'EAO-2': 'Cesaro',
  'AEO-2': 'Camestrop',
  'AII-3': 'Datisi',
  'IAI-3': 'Disamis',
  'EIO-3': 'Ferison',
  'OAO-3': 'Bocardo',
  'AAI-3': 'Darapti',
  'EAO-3': 'Felapton',
  'AEE-4': 'Calemes',
  'IAI-4': 'Dimatis',
  'EIO-4': 'Fresison',
  'AEO-4': 'Calemop',
  'AAI-4': 'Bamalip',
  'EAO-4': 'Fesapo',
};

export function analyze(major: Form, minor: Form, concl: Form, fig: Figure): SyllogismResult {
  const [maj, min] = premiseStatements(major, minor, fig);
  const c: Statement = { form: concl, subj: 'S', pred: 'P' };
  const mood = `${major}${minor}${concl}-${fig}`;

  const worlds: number[] = [];
  for (let w = 0; w < 256; w++) if (satisfies(maj, w) && satisfies(min, w)) worlds.push(w);

  const validBoolean = worlds.every((w) => satisfies(c, w));
  const inhabited = (t: TermName, w: number) => {
    for (let r = 0; r < 8; r++) if (has(t, r) && w & (1 << r)) return true;
    return false;
  };
  const withImport = worlds.filter((w) => inhabited('S', w) && inhabited('P', w) && inhabited('M', w));
  const validImport = withImport.every((w) => satisfies(c, w));

  let verdict: Verdict = 'invalid';
  if (validBoolean) verdict = 'valid';
  else if (validImport) verdict = 'conditional';

  const reason =
    verdict === 'valid'
      ? 'Every situation where both premises hold also makes the conclusion hold.'
      : verdict === 'conditional'
      ? 'Valid only if we assume every term names at least one thing (existential import). Under the modern Boolean reading it fails.'
      : 'There is a situation where both premises are true but the conclusion is false.';

  return { verdict, mood, name: TRADITIONAL[mood], statements: [maj, min, c], reason };
}

export function termLabel(t: TermName, names: { S: string; P: string; M: string }): string {
  return names[t];
}

export function statementText(st: Statement, names: { S: string; P: string; M: string }): string {
  return FORM_TEXT[st.form](names[st.subj], names[st.pred]);
}

/* ---------- Venn state for drawing ---------- */

export interface VennState {
  empty: Set<number>;
  /** each entry is the candidate region list for one "some" claim; length-1 => firmly placed */
  marks: number[][];
}

export function vennFor(statements: Statement[]): VennState {
  const empty = new Set<number>();
  for (const st of statements) if (isUniversal(st.form)) statementRegions(st).forEach((r) => empty.add(r));
  const marks: number[][] = [];
  for (const st of statements) {
    if (isUniversal(st.form)) continue;
    const cands = statementRegions(st).filter((r) => !empty.has(r));
    if (cands.length) marks.push(cands);
  }
  return { empty, marks };
}

export function allValidMoods(): { mood: string; name?: string; verdict: Verdict }[] {
  const forms: Form[] = ['A', 'E', 'I', 'O'];
  const out: { mood: string; name?: string; verdict: Verdict }[] = [];
  for (const a of forms)
    for (const b of forms)
      for (const c of forms)
        for (const f of [1, 2, 3, 4] as Figure[]) {
          const r = analyze(a, b, c, f);
          if (r.verdict !== 'invalid') out.push({ mood: r.mood, name: r.name, verdict: r.verdict });
        }
  return out;
}
