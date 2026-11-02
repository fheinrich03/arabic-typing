import { useCallback, useMemo, useRef, useState } from "react";
import type { ErrorMode, LessonResult } from "../types";

export type CharStatus = "pending" | "correct" | "incorrect";

export const PASS_ERROR_RATE = 0.1;

export interface WrongKey {
  typed: string;
  expected: string;
  /** Increments per wrong key so repeating the same mistake still re-triggers the toast. */
  id: number;
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
  };
}

export function useLessonEngine(text: string, errorMode: ErrorMode) {
  const [state, setState] = useState<EngineState>(() => initialState(text.length));
  const textRef = useRef(text);
  textRef.current = text;
  // Survives reset() so a retry's first mistake never reuses an already-dismissed toast id.
  const wrongKeyIdRef = useRef(0);

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
        const startedAt = prev.startedAt ?? Date.now();
        const keystrokes = prev.keystrokes + 1;

        if (isCorrect) {
          const charStates = [...prev.charStates];
          for (let i = 0; i < span; i++) charStates[prev.currentIndex + i] = "correct";
          const currentIndex = prev.currentIndex + span;
          const finishedAt =
            currentIndex >= textRef.current.length ? Date.now() : null;
          return {
            ...prev,
            charStates,
            currentIndex,
            startedAt,
            keystrokes,
            finishedAt,
            lastKeyWasWrong: false,
          };
        }

        const errorCount = prev.errorCount + 1;
        const wrongKey: WrongKey = {
          typed: input,
          expected: target,
          id: ++wrongKeyIdRef.current,
        };

        if (errorMode === "permissive") {
          const charStates = [...prev.charStates];
          for (let i = 0; i < span && prev.currentIndex + i < charStates.length; i++) {
            charStates[prev.currentIndex + i] = "incorrect";
          }
          const currentIndex = prev.currentIndex + span;
          const finishedAt =
            currentIndex >= textRef.current.length ? Date.now() : null;
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
    isFinished: state.finishedAt !== null,
    result,
    typeChar,
    reset,
  };
}
