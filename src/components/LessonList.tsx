import { CHAPTERS, LESSONS_BY_ID } from "../data/lessons";
import type { Progress } from "../types";

interface LessonListProps {
  progress: Progress;
  onSelect: (lessonId: string) => void;
  onFreePractice: () => void;
}

export function LessonList({ progress, onSelect, onFreePractice }: LessonListProps) {
  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <button
        onClick={onFreePractice}
        className="w-full rounded-xl border-2 border-dashed border-slate-300 p-4 text-center text-slate-600 hover:border-slate-400 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800"
      >
        🎲 Freies Training — zufälliger Übungstext mit allen Buchstaben
      </button>

      {CHAPTERS.map((chapter) => (
        <section key={chapter.id}>
          <h2 className="mb-2 text-lg font-semibold text-slate-900 dark:text-white">
            {chapter.title}
          </h2>
          <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {chapter.lessonIds.map((lessonId) => {
              const lesson = LESSONS_BY_ID[lessonId];
              const result = progress.results[lessonId];
              return (
                <li key={lessonId}>
                  <button
                    onClick={() => onSelect(lessonId)}
                    className={`w-full rounded-lg border p-3 text-start text-sm transition-colors ${
                      result?.passed
                        ? "border-emerald-300 bg-emerald-50 dark:border-emerald-700 dark:bg-emerald-900/30"
                        : "border-slate-200 bg-white hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700"
                    }`}
                  >
                    <span className="block font-medium text-slate-800 dark:text-slate-100">
                      {lesson.title}
                    </span>
                    {result && (
                      <span className="mt-1 block text-xs text-slate-500 dark:text-slate-400">
                        {result.charsPerMinute} Z/Min · {Math.round(result.errorRate * 100)}% Fehler
                      </span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </div>
  );
}
