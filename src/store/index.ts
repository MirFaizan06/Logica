import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSyncExternalStore } from 'react';
import type { Level, Question, QuestionType } from '@/content/types';
import type { ThemeId } from '@/theme/themes';
import { addDays, dayKey, daysBetween } from '@/utils/date';
import { evaluateAchievements } from '@/content/achievements';
import { levelFromXp } from './levels';

/** Bump when the persisted shape changes in a way that needs a migration. */
export const STORE_VERSION = 1;
export const STORE_KEY = 'logica-store';

export type GoalId = 'school' | 'career' | 'curious' | 'exam' | 'cs' | 'philosophy';

export interface Profile {
  name: string;
  avatar: string;
  goal: GoalId | null;
  experience: 0 | 1 | 2 | 3;
  dailyGoalXp: number;
  startLevel: Level;
  placementDone: boolean;
  placementScore: number;
  onboarded: boolean;
  joinedAt: string;
}

export interface Settings {
  theme: ThemeId | 'auto';
  haptics: boolean;
  reduceMotion: boolean;
  reminder: { enabled: boolean; hour: number; minute: number };
  autoUpdateCheck: boolean;
}

export interface LessonRecord {
  stars: number;
  best: number;
  plays: number;
  at: string;
}

export interface Progress {
  xp: number;
  gems: number;
  freezes: number;
  lessons: Record<string, LessonRecord>;
  tests: Record<string, { best: number; passed: boolean; at: string }>;
  exams: Record<string, { best: number; passed: boolean; at: string }>;
  unlockedThemes: ThemeId[];
}

export interface Streak {
  current: number;
  longest: number;
  lastDay: string | null;
}

export interface DayStat {
  xp: number;
  a: number;
  c: number;
  secs: number;
  goal?: boolean;
}

export interface Stats {
  answered: number;
  correct: number;
  secs: number;
  sessions: number;
  perfect: number;
  byUnit: Record<string, { a: number; c: number }>;
  byType: Partial<Record<QuestionType, { a: number; c: number }>>;
  daily: Record<string, DayStat>;
  speedBest: number;
  dailyChallenges: Record<string, number>;
  flashReviews: number;
  labUses: number;
  fallacyCorrect: number;
}

export interface Updates {
  lastCheck: number;
  skipped: string | null;
  snoozeUntil: number;
  lastSeenVersion: string | null;
}

export interface CardState {
  box: number;
  due: string;
}

export interface Data {
  profile: Profile;
  settings: Settings;
  progress: Progress;
  streak: Streak;
  stats: Stats;
  mistakes: Question[];
  cards: Record<string, CardState>;
  achievements: Record<string, string>;
  updates: Updates;
}

export type SessionMode =
  | 'lesson'
  | 'unitTest'
  | 'exam'
  | 'practice'
  | 'daily'
  | 'speed'
  | 'mistakes'
  | 'placement'
  | 'fallacy';

export interface AnswerRecord {
  q: Question;
  correct: boolean;
}

export interface SessionResult {
  mode: SessionMode;
  title: string;
  unitId?: string;
  lessonId?: string;
  level?: Level;
  total: number;
  correct: number;
  secs: number;
  answers: AnswerRecord[];
  xp: number;
  gems: number;
  passed: boolean;
  stars: number;
  firstTime: boolean;
  speedScore?: number;
}

export interface CompletionOutcome {
  newAchievements: string[];
  leveledUp: boolean;
  newLevel: number;
  streakContinued: boolean;
  goalJustHit: boolean;
}

export interface Actions {
  setProfile: (p: Partial<Profile>) => void;
  setSettings: (s: Partial<Settings>) => void;
  setUpdates: (u: Partial<Updates>) => void;
  completeSession: (r: SessionResult) => CompletionOutcome;
  buyTheme: (id: ThemeId, price: number) => boolean;
  buyFreeze: (price: number) => boolean;
  reviewCard: (id: string, knew: boolean) => void;
  noteLabUse: () => void;
  removeMistake: (id: string) => void;
  grantGems: (n: number) => void;
  exportData: () => string;
  importData: (json: string) => { ok: boolean; error?: string };
  resetAll: () => void;
}

export type AppState = Data & Actions;

export const defaultData = (): Data => ({
  profile: {
    name: '',
    avatar: 'bulb',
    goal: null,
    experience: 0,
    dailyGoalXp: 50,
    startLevel: 0,
    placementDone: false,
    placementScore: 0,
    onboarded: false,
    joinedAt: dayKey(),
  },
  settings: {
    theme: 'auto',
    haptics: true,
    reduceMotion: false,
    reminder: { enabled: false, hour: 19, minute: 0 },
    autoUpdateCheck: true,
  },
  progress: {
    xp: 0,
    gems: 20,
    freezes: 0,
    lessons: {},
    tests: {},
    exams: {},
    unlockedThemes: ['light', 'dark', 'blossom', 'neon'],
  },
  streak: { current: 0, longest: 0, lastDay: null },
  stats: {
    answered: 0,
    correct: 0,
    secs: 0,
    sessions: 0,
    perfect: 0,
    byUnit: {},
    byType: {},
    daily: {},
    speedBest: 0,
    dailyChallenges: {},
    flashReviews: 0,
    labUses: 0,
    fallacyCorrect: 0,
  },
  mistakes: [],
  cards: {},
  achievements: {},
  updates: { lastCheck: 0, skipped: null, snoozeUntil: 0, lastSeenVersion: null },
});

const DATA_KEYS = Object.keys(defaultData()) as (keyof Data)[];

function isObj(v: unknown): v is Record<string, unknown> {
  return !!v && typeof v === 'object' && !Array.isArray(v);
}

/** Deep-merge saved values over defaults. A saved value of the wrong type never replaces a default. */
function mergeDeep(base: unknown, saved: unknown): unknown {
  if (saved === undefined) return base;
  if (base === null) return saved;
  if (isObj(base)) {
    if (!isObj(saved)) return base;
    const out: Record<string, unknown> = { ...base };
    for (const k of Object.keys(saved)) out[k] = k in base ? mergeDeep(base[k], saved[k]) : saved[k];
    return out;
  }
  if (Array.isArray(base)) return Array.isArray(saved) ? saved : base;
  return typeof base === typeof saved ? saved : base;
}

/**
 * Merge persisted data over fresh defaults so fields added by newer app
 * versions always exist, and unknown or corrupt fields never crash the app.
 */
function mergeData(base: Data, saved: unknown): Data {
  if (!isObj(saved)) return base;
  const out: Record<string, unknown> = {};
  for (const k of DATA_KEYS) {
    out[k] = mergeDeep((base as unknown as Record<string, unknown>)[k], saved[k]);
  }
  const o = out as unknown as Data;
  // the starter themes are always owned
  for (const id of base.progress.unlockedThemes) {
    if (!o.progress.unlockedThemes.includes(id)) o.progress.unlockedThemes = [...o.progress.unlockedThemes, id];
  }
  return o;
}

/** Migrations between persisted versions. Add a case when STORE_VERSION is bumped. */
function migrate(persisted: unknown, fromVersion: number): unknown {
  let state = persisted;
  if (fromVersion < 1) {
    // pre-release builds: nothing special to carry over
    state = persisted;
  }
  return state;
}

export { xpForLevel, levelFromXp, RANKS, rankForLevel, levelProgress } from './levels';

/** Streak as it should be displayed right now (a stale streak shows 0 unless frozen). */
export function effectiveStreak(s: Streak, freezes: number, today = dayKey()): number {
  if (!s.lastDay || s.current === 0) return 0;
  const gap = daysBetween(s.lastDay, today);
  if (gap <= 1) return s.current;
  return gap - 1 <= freezes ? s.current : 0;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      ...defaultData(),

      setProfile: (p) => set((s) => ({ profile: { ...s.profile, ...p } })),
      setSettings: (p) => set((s) => ({ settings: { ...s.settings, ...p } })),
      setUpdates: (p) => set((s) => ({ updates: { ...s.updates, ...p } })),

      completeSession: (r) => {
        const s = get();
        const today = dayKey();
        const prevLevel = levelFromXp(s.progress.xp);

        /* ---- streak ---- */
        const streak = { ...s.streak };
        let freezes = s.progress.freezes;
        let streakContinued = false;
        if (r.xp > 0) {
          if (streak.lastDay === today) {
            // already counted today
          } else if (!streak.lastDay) {
            streak.current = 1;
            streakContinued = true;
          } else {
            const gap = daysBetween(streak.lastDay, today);
            if (gap === 1) {
              streak.current += 1;
              streakContinued = true;
            } else if (gap > 1 && gap - 1 <= freezes) {
              freezes -= gap - 1;
              streak.current += 1;
              streakContinued = true;
            } else {
              streak.current = 1;
              streakContinued = true;
            }
          }
          streak.lastDay = today;
          streak.longest = Math.max(streak.longest, streak.current);
        }

        /* ---- stats ---- */
        const stats: Stats = { ...s.stats };
        stats.answered += r.total;
        stats.correct += r.correct;
        stats.secs += r.secs;
        stats.sessions += 1;
        if (r.total > 0 && r.correct === r.total) stats.perfect += 1;
        stats.byUnit = { ...stats.byUnit };
        stats.byType = { ...stats.byType };
        for (const a of r.answers) {
          const u = a.q.unit || 'misc';
          const cu = stats.byUnit[u] || { a: 0, c: 0 };
          stats.byUnit[u] = { a: cu.a + 1, c: cu.c + (a.correct ? 1 : 0) };
          const ct = stats.byType[a.q.type] || { a: 0, c: 0 };
          stats.byType[a.q.type] = { a: ct.a + 1, c: ct.c + (a.correct ? 1 : 0) };
          if (r.mode === 'fallacy' && a.correct) stats.fallacyCorrect += 1;
        }
        const prevDay = stats.daily[today] || { xp: 0, a: 0, c: 0, secs: 0 };
        const day: DayStat = {
          xp: prevDay.xp + r.xp,
          a: prevDay.a + r.total,
          c: prevDay.c + r.correct,
          secs: prevDay.secs + r.secs,
          goal: prevDay.goal,
        };
        let goalJustHit = false;
        let bonusGems = 0;
        if (!day.goal && day.xp >= s.profile.dailyGoalXp) {
          day.goal = true;
          goalJustHit = true;
          bonusGems = 10;
        }
        stats.daily = { ...stats.daily, [today]: day };
        if (r.mode === 'speed' && r.speedScore !== undefined) {
          stats.speedBest = Math.max(stats.speedBest, r.speedScore);
        }
        if (r.mode === 'daily') {
          stats.dailyChallenges = { ...stats.dailyChallenges, [today]: r.correct };
        }

        /* ---- progress ---- */
        const progress: Progress = {
          ...s.progress,
          xp: s.progress.xp + r.xp,
          gems: s.progress.gems + r.gems + bonusGems,
          freezes,
          lessons: { ...s.progress.lessons },
          tests: { ...s.progress.tests },
          exams: { ...s.progress.exams },
        };
        const pct = r.total ? Math.round((r.correct / r.total) * 100) : 0;
        if (r.mode === 'lesson' && r.lessonId && r.passed) {
          const prev = progress.lessons[r.lessonId];
          progress.lessons[r.lessonId] = {
            stars: Math.max(prev?.stars || 0, r.stars),
            best: Math.max(prev?.best || 0, pct),
            plays: (prev?.plays || 0) + 1,
            at: today,
          };
        }
        if (r.mode === 'unitTest' && r.unitId) {
          const prev = progress.tests[r.unitId];
          progress.tests[r.unitId] = {
            best: Math.max(prev?.best || 0, pct),
            passed: !!prev?.passed || r.passed,
            at: today,
          };
        }
        if (r.mode === 'exam' && r.level !== undefined) {
          const k = String(r.level);
          const prev = progress.exams[k];
          progress.exams[k] = {
            best: Math.max(prev?.best || 0, pct),
            passed: !!prev?.passed || r.passed,
            at: today,
          };
        }

        /* ---- mistakes queue ---- */
        let mistakes = s.mistakes.slice();
        for (const a of r.answers) {
          const idx = mistakes.findIndex((m) => m.id === a.q.id);
          if (a.correct) {
            if (idx >= 0 && (r.mode === 'mistakes' || r.mode === 'practice')) mistakes.splice(idx, 1);
          } else if (idx < 0) {
            mistakes.unshift(a.q);
          }
        }
        mistakes = mistakes.slice(0, 80);

        const draft: Data = {
          profile: s.profile,
          settings: s.settings,
          progress,
          streak,
          stats,
          mistakes,
          cards: s.cards,
          achievements: s.achievements,
          updates: s.updates,
        };
        const newAchievements = evaluateAchievements(draft, r);
        const achievements = { ...s.achievements };
        let gemsFromAch = 0;
        for (const id of newAchievements) {
          achievements[id] = today;
          gemsFromAch += 15;
        }
        draft.achievements = achievements;
        draft.progress.gems += gemsFromAch;

        set(draft);

        const newLevel = levelFromXp(draft.progress.xp);
        return {
          newAchievements,
          leveledUp: newLevel > prevLevel,
          newLevel,
          streakContinued,
          goalJustHit,
        };
      },

      buyTheme: (id, price) => {
        const s = get();
        if (s.progress.unlockedThemes.includes(id)) return true;
        if (s.progress.gems < price) return false;
        set({
          progress: {
            ...s.progress,
            gems: s.progress.gems - price,
            unlockedThemes: [...s.progress.unlockedThemes, id],
          },
        });
        return true;
      },

      buyFreeze: (price) => {
        const s = get();
        if (s.progress.gems < price || s.progress.freezes >= 3) return false;
        set({ progress: { ...s.progress, gems: s.progress.gems - price, freezes: s.progress.freezes + 1 } });
        return true;
      },

      reviewCard: (id, knew) => {
        const s = get();
        const cur = s.cards[id] || { box: 0, due: dayKey() };
        const box = knew ? Math.min(4, cur.box + 1) : 0;
        const gaps = [0, 1, 3, 7, 14];
        const due = addDays(dayKey(), gaps[box]);
        set({
          cards: { ...s.cards, [id]: { box, due } },
          stats: { ...s.stats, flashReviews: s.stats.flashReviews + 1 },
        });
      },

      noteLabUse: () => set((s) => ({ stats: { ...s.stats, labUses: s.stats.labUses + 1 } })),

      removeMistake: (id) => set((s) => ({ mistakes: s.mistakes.filter((m) => m.id !== id) })),

      grantGems: (n) => set((s) => ({ progress: { ...s.progress, gems: s.progress.gems + n } })),

      exportData: () => {
        const s = get();
        const data: Data = {} as Data;
        for (const k of DATA_KEYS) (data as unknown as Record<string, unknown>)[k] = s[k];
        return JSON.stringify({ app: 'logica', version: STORE_VERSION, exportedAt: new Date().toISOString(), data });
      },

      importData: (json) => {
        try {
          const parsed = JSON.parse(json.trim());
          if (!parsed || parsed.app !== 'logica' || !isObj(parsed.data)) {
            return { ok: false, error: 'This does not look like a Logica backup.' };
          }
          const migrated = migrate(parsed.data, typeof parsed.version === 'number' ? parsed.version : 0);
          set(mergeData(defaultData(), migrated));
          return { ok: true };
        } catch {
          return { ok: false, error: 'The backup text could not be read.' };
        }
      },

      resetAll: () => set(defaultData()),
    }),
    {
      name: STORE_KEY,
      version: STORE_VERSION,
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (s) => {
        const out: Record<string, unknown> = {};
        for (const k of DATA_KEYS) out[k] = s[k];
        return out as unknown as AppState;
      },
      migrate: (persisted, version) => migrate(persisted, version) as AppState,
      merge: (persisted, current) => ({ ...current, ...mergeData(defaultData(), persisted) }),
    }
  )
);

/** True once persisted state has been read from disk. */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    (onChange) => useStore.persist.onFinishHydration(onChange),
    () => useStore.persist.hasHydrated(),
    () => false
  );
}
