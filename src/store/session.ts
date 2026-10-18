import { create } from 'zustand';
import type { Level, Question } from '@/content/types';
import type { CompletionOutcome, SessionMode, SessionResult } from '@/store';

export interface SessionConfig {
  mode: SessionMode;
  title: string;
  subtitle?: string;
  questions: Question[];
  unitId?: string;
  lessonId?: string;
  level?: Level;
  passMark?: number;
  /** seconds, for speed rounds */
  timeLimit?: number;
  /** route to open when the user leaves results with "Continue" */
  nextLessonId?: string | null;
  firstTime?: boolean;
}

interface SessionState {
  config: SessionConfig | null;
  result: SessionResult | null;
  outcome: CompletionOutcome | null;
  /** bumped for each new session so screens reset cleanly */
  nonce: number;
  start: (c: SessionConfig) => void;
  finish: (r: SessionResult, o: CompletionOutcome) => void;
  clear: () => void;
}

export const useSession = create<SessionState>((set) => ({
  config: null,
  result: null,
  outcome: null,
  nonce: 0,
  start: (config) => set((s) => ({ config, result: null, outcome: null, nonce: s.nonce + 1 })),
  finish: (result, outcome) => set({ result, outcome }),
  clear: () => set({ config: null, result: null, outcome: null }),
}));
