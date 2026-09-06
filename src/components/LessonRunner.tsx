import { useEffect, useMemo, useRef, useState } from "react";
import type { Lesson, LessonResult, Settings } from "../types";
import { resolveLessonText } from "../lib/lessonGenerator";
import { useLessonEngine } from "../hooks/useLessonEngine";
import { KeyboardView } from "./KeyboardView";
import { TypingArea } from "./TypingArea";
import { StatsPanel } from "./StatsPanel";

interface LessonRunnerProps {
  lesson: Lesson;
  settings: Settings;
  onFinish: (result: LessonResult) => void;
  onBack: () => void;
}

export function LessonRunner({ lesson, settings, onFinish, onBack }: LessonRunnerProps) {
  const [attempt, setAttempt] = useState(0);
  const text = useMemo(
    () => resolveLessonText(lesson),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [lesson.id, attempt],
  );
  const engine = useLessonEngine(text, settings.errorMode);

  const reportedRef = useRef(false);
  useEffect(() => {
    reportedRef.current = false;
  }, [lesson.id, attempt]);
  useEffect(() => {
    if (engine.isFinished && engine.result && !reportedRef.current) {
      reportedRef.current = true;
      onFinish({ ...engine.result, lessonId: lesson.id });
    }
  }, [engine.isFinished, engine.result, lesson.id, onFinish]);

  if (engine.isFinished && engine.result) {
    return (
      <StatsPanel
        result={{ ...engine.result, lessonId: lesson.id }}
        onRetry={() => setAttempt((a) => a + 1)}
        onBack={onBack}
      />
    );
  }

  const target = text[engine.currentIndex];

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="text-sm text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100"
        >
          ← Übersicht
        </button>
        <h1 className="text-base font-medium text-slate-700 dark:text-slate-200">
          {lesson.title}
        </h1>
        <span className="w-16" />
      </div>

      <TypingArea
        text={text}
        currentIndex={engine.currentIndex}
        charStates={engine.charStates}
        lastKeyWasWrong={engine.lastKeyWasWrong}
        fontSizePx={settings.fontSizePx}
        active={!engine.isFinished}
        onChar={engine.typeChar}
      />

      {settings.showKeyboard && (
        <KeyboardView targetChar={target} showFingerHints={settings.showFingerHints} />
      )}
    </div>
  );
}
