import { useCallback } from "react";
import { useLocalStorage } from "./useLocalStorage";
import type { LessonResult, Progress } from "../types";

const DEFAULT_PROGRESS: Progress = { results: {} };

export function useProgress() {
  const [progress, setProgress] = useLocalStorage<Progress>(
    "arabic-typing:progress",
    DEFAULT_PROGRESS,
  );

  const recordResult = useCallback(
    (result: LessonResult) => {
      setProgress((prev) => {
        const existing = prev.results[result.lessonId];
        // keep the best (highest chars/min among passed attempts) result
        const keepNew =
          !existing || (result.passed && result.charsPerMinute > existing.charsPerMinute);
        if (!keepNew) return prev;
        return { results: { ...prev.results, [result.lessonId]: result } };
      });
    },
    [setProgress],
  );

  return { progress, recordResult };
}
