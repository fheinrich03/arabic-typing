import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeftIcon, InfoIcon, KeyboardIcon, PencilLineIcon } from "lucide-react";
import type { Lesson, LessonResult, Settings } from "../types";
import { resolveLessonText } from "../lib/lessonGenerator";
import { getNextLessons } from "../data/lessons";
import { hintsFor } from "../data/charRules";
import { useLessonEngine } from "../hooks/useLessonEngine";
import { KeyboardView } from "./KeyboardView";
import { TypingArea } from "./TypingArea";
import { SandboxTyping } from "./SandboxTyping";
import { StatsPanel } from "./StatsPanel";
import { Button } from "./ui/button";

interface LessonRunnerProps {
  lesson: Lesson;
  settings: Settings;
  onFinish: (result: LessonResult) => void;
  onBack: () => void;
  onNavigate: (lessonId: string) => void;
}

export function LessonRunner({
  lesson,
  settings,
  onFinish,
  onBack,
  onNavigate,
}: LessonRunnerProps) {
  const [attempt, setAttempt] = useState(0);
  const [sandboxOpen, setSandboxOpen] = useState(settings.showSandbox);
  const [keyboardOpen, setKeyboardOpen] = useState(settings.showKeyboard);
  useEffect(() => setSandboxOpen(settings.showSandbox), [settings.showSandbox]);
  useEffect(() => setKeyboardOpen(settings.showKeyboard), [settings.showKeyboard]);
  const text = useMemo(
    () => resolveLessonText(lesson),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [lesson.id, attempt],
  );
  const engine = useLessonEngine(text, settings.errorMode);
  // Reviews drill every known letter — hints only where letters are introduced.
  const hints = lesson.kind === "letter" || lesson.kind === "consolidate" ? hintsFor(lesson.chars) : [];

  const reportedRef = useRef(false);
  useEffect(() => {
    reportedRef.current = false;
    engine.reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        nextLessons={getNextLessons(lesson.id)}
        onRetry={() => setAttempt((a) => a + 1)}
        onBack={onBack}
        onSelectLesson={onNavigate}
      />
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeftIcon />
          Übersicht
        </Button>
        <h1 className="font-heading text-base font-medium text-foreground">{lesson.title}</h1>
        <div className="flex gap-1">
          <Button
            variant={keyboardOpen ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setKeyboardOpen((v) => !v)}
          >
            <KeyboardIcon />
            Tastatur
          </Button>
          <Button
            variant={sandboxOpen ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setSandboxOpen((v) => !v)}
          >
            <PencilLineIcon />
            Sandbox
          </Button>
        </div>
      </div>

      {hints.length > 0 && (
        <div className="flex gap-2 rounded-md border bg-muted/50 px-3 py-2 text-sm text-muted-foreground">
          <InfoIcon className="mt-0.5 size-4 shrink-0" />
          <ul className="space-y-1">
            {hints.map((hint) => (
              <li key={hint}>{hint}</li>
            ))}
          </ul>
        </div>
      )}

      <TypingArea
        text={text}
        currentIndex={engine.currentIndex}
        charStates={engine.charStates}
        lastKeyWasWrong={engine.lastKeyWasWrong}
        fontSizePx={settings.fontSizePx}
        active={!engine.isFinished}
        onChar={engine.typeChar}
      />

      {sandboxOpen && <SandboxTyping fontSizePx={settings.fontSizePx} variant="embedded" />}

      {keyboardOpen && (
        <KeyboardView
          text={text}
          currentIndex={engine.currentIndex}
          showFingerHints={settings.showFingerHints}
        />
      )}
    </div>
  );
}
