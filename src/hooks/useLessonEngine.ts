import { useCallback, useMemo, useRef, useState } from "react";
import type { CharStat, ErrorMode, LessonResult } from "../types";

export type CharStatus = "pending" | "correct" | "incorrect";

export const PASS_ERROR_RATE = 0.1;

/** Gaps longer than this count as a pause and are left out of per-char timing. */
export const PAUSE_THRESHOLD_MS = 5000;

export interface WrongKey {
  typed: string;
  expected: string;
}

interface EngineState {
  currentIndex: number;
  charStates: CharStatus[];
  errorCount: number;
  keystrokes: number;
  startedAt: number | null;
  finishedAt: number | null;
  lastKeyWasWrong: boolean;
  wrongKey: WrongKey | null;
  /** Time the cursor last advanced — per-char timing is measured from here. */
  lastAdvanceAt: number | null;
  charStats: Record<string, CharStat>;
}

function emptyStat(): CharStat {
  return { occurrences: 0, hits: 0, errors: 0, totalMs: 0, timedCount: 0, confusions: {} };
}

function isTracked(target: string): boolean {
  return target.trim().length > 0;
}

function recordHit(
  stats: Record<string, CharStat>,
  target: string,
  elapsedMs: number | null,
): Record<string, CharStat> {
  if (!isTracked(target)) return stats;
  const stat = stats[target] ?? emptyStat();
  const timed = elapsedMs !== null && elapsedMs <= PAUSE_THRESHOLD_MS;
  return {
    ...stats,
    [target]: {
      ...stat,
      occurrences: stat.occurrences + 1,
      hits: stat.hits + 1,
      totalMs: stat.totalMs + (timed ? elapsedMs : 0),
      timedCount: stat.timedCount + (timed ? 1 : 0),
    },
  };
}

function recordMiss(
  stats: Record<string, CharStat>,
  target: string,
  typed: string,
  advanced: boolean,
): Record<string, CharStat> {
  if (!isTracked(target)) return stats;
  const stat = stats[target] ?? emptyStat();
  return {
    ...stats,
    [target]: {
      ...stat,
      occurrences: stat.occurrences + (advanced ? 1 : 0),
      errors: stat.errors + 1,
      confusions: { ...stat.confusions, [typed]: (stat.confusions[typed] ?? 0) + 1 },
    },
  };
}

function initialState(length: number): EngineState {
  return {
    currentIndex: 0,
    charStates: Array<CharStatus>(length).fill("pending"),
    errorCount: 0,
    keystrokes: 0,
    startedAt: null,
    finishedAt: null,
    lastKeyWasWrong: false,
    wrongKey: null,
    lastAdvanceAt: null,
    charStats: {},
  };
}

export function useLessonEngine(text: string, errorMode: ErrorMode) {
  const [state, setState] = useState<EngineState>(() => initialState(text.length));
  const textRef = useRef(text);
  textRef.current = text;

  const reset = useCallback(() => {
    setState(initialState(textRef.current.length));
  }, []);

  const typeChar = useCallback(
    (input: string) => {
      setState((prev) => {
        if (prev.finishedAt !== null || prev.currentIndex >= textRef.current.length) {
          return prev;
        }
        const span = input.length;
        const target = textRef.current.slice(prev.currentIndex, prev.currentIndex + span);
        const isCorrect = input === target;
        const now = Date.now();
        const startedAt = prev.startedAt ?? now;
        const keystrokes = prev.keystrokes + 1;

        if (isCorrect) {
          // The very first char has no reference point, so it stays untimed.
          const elapsedMs = prev.lastAdvanceAt === null ? null : now - prev.lastAdvanceAt;
          const charStates = [...prev.charStates];
          for (let i = 0; i < span; i++) charStates[prev.currentIndex + i] = "correct";
          const currentIndex = prev.currentIndex + span;
          const finishedAt = currentIndex >= textRef.current.length ? now : null;
          return {
            ...prev,
            charStates,
            currentIndex,
            startedAt,
            keystrokes,
            finishedAt,
            lastKeyWasWrong: false,
            lastAdvanceAt: now,
            charStats: recordHit(prev.charStats, target, elapsedMs),
          };
        }

        const errorCount = prev.errorCount + 1;
        const wrongKey: WrongKey = { typed: input, expected: target };

        if (errorMode === "permissive") {
          const charStates = [...prev.charStates];
          for (let i = 0; i < span && prev.currentIndex + i < charStates.length; i++) {
            charStates[prev.currentIndex + i] = "incorrect";
          }
          const currentIndex = prev.currentIndex + span;
          const finishedAt = currentIndex >= textRef.current.length ? now : null;
          return {
            ...prev,
            charStates,
            currentIndex,
            startedAt,
            keystrokes,
            errorCount,
            finishedAt,
            lastKeyWasWrong: true,
            wrongKey,
            lastAdvanceAt: now,
            charStats: recordMiss(prev.charStats, target, input, true),
          };
        }

        // strict: stay on the same character(s)
        return {
          ...prev,
          startedAt,
          keystrokes,
          errorCount,
          lastKeyWasWrong: true,
          wrongKey,
          charStats: recordMiss(prev.charStats, target, input, false),
        };
      });
    },
    [errorMode],
  );

  const result: LessonResult | null = useMemo(() => {
    if (state.finishedAt === null || state.startedAt === null) return null;
    const durationMs = state.finishedAt - state.startedAt;
    const minutes = Math.max(durationMs / 60000, 1 / 60000);
    const charsPerMinute = Math.round(textRef.current.length / minutes);
    const errorRate = state.keystrokes > 0 ? state.errorCount / state.keystrokes : 0;
    return {
      lessonId: "",
      charsPerMinute,
      errorRate,
      durationMs,
      passed: errorRate <= PASS_ERROR_RATE,
      completedAt: state.finishedAt,
    };
  }, [state.finishedAt, state.startedAt, state.keystrokes, state.errorCount]);

  return {
    currentIndex: state.currentIndex,
    charStates: state.charStates,
    errorCount: state.errorCount,
    lastKeyWasWrong: state.lastKeyWasWrong,
    wrongKey: state.wrongKey,
    charStats: state.charStats,
    isFinished: state.finishedAt !== null,
    result,
    typeChar,
    reset,
  };
}
