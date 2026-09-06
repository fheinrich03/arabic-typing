import type { LessonResult } from "../types";
import { PASS_ERROR_RATE } from "../hooks/useLessonEngine";

interface StatsPanelProps {
  result: LessonResult;
  onRetry: () => void;
  onBack: () => void;
}

export function StatsPanel({ result, onRetry, onBack }: StatsPanelProps) {
  return (
    <div className="mx-auto max-w-sm rounded-xl bg-white p-6 text-center shadow-sm ring-1 ring-slate-200 dark:bg-slate-800 dark:ring-slate-700">
      <p
        className={`mb-4 text-lg font-semibold ${
          result.passed ? "text-emerald-600" : "text-amber-600"
        }`}
      >
        {result.passed ? "Bestanden!" : `Noch nicht — unter ${Math.round((1 - PASS_ERROR_RATE) * 100)}% Genauigkeit`}
      </p>
      <dl className="grid grid-cols-3 gap-4 text-sm">
        <div>
          <dt className="text-slate-500 dark:text-slate-400">Zeichen/Min</dt>
          <dd className="text-xl font-semibold text-slate-900 dark:text-white">
            {result.charsPerMinute}
          </dd>
        </div>
        <div>
          <dt className="text-slate-500 dark:text-slate-400">Fehlerquote</dt>
          <dd className="text-xl font-semibold text-slate-900 dark:text-white">
            {Math.round(result.errorRate * 100)}%
          </dd>
        </div>
        <div>
          <dt className="text-slate-500 dark:text-slate-400">Dauer</dt>
          <dd className="text-xl font-semibold text-slate-900 dark:text-white">
            {Math.round(result.durationMs / 1000)}s
          </dd>
        </div>
      </dl>
      <div className="mt-6 flex justify-center gap-3">
        <button
          onClick={onRetry}
          className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
        >
          Nochmal
        </button>
        <button
          onClick={onBack}
          className="rounded-lg bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600"
        >
          Zur Übersicht
        </button>
      </div>
    </div>
  );
}
