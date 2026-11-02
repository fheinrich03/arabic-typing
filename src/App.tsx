import { useLayoutEffect, useMemo, useRef, useState } from "react";
import { SettingsIcon } from "lucide-react";
import { CHAPTERS, LESSONS, LESSONS_BY_ID, BASE_LETTERS } from "./data/lessons";
import type { Lesson } from "./types";
import { useSettings } from "./hooks/useSettings";
import { useProgress } from "./hooks/useProgress";
import { LessonList } from "./components/LessonList";
import { LessonRunner } from "./components/LessonRunner";
import { SandboxPage } from "./components/SandboxPage";
import { SettingsPanel } from "./components/SettingsPanel";
import { Button } from "./components/ui/button";
import { Toaster } from "./components/ui/sonner";

const FREE_PRACTICE_LESSON: Lesson = {
  id: "free",
  title: "Freies Training",
  chapterId: "free",
  chars: BASE_LETTERS,
  mode: "chars",
  generatorConfig: { letters: BASE_LETTERS, length: 250 },
};

function App() {
  const [settings, setSettings] = useSettings();
  const { progress, recordResult } = useProgress();
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);
  // Bumped on every open so re-opening a generated lesson (same id) still remounts the runner.
  const [runId, setRunId] = useState(0);
  // Generated lessons (e.g. the focus drill) that don't live in LESSONS_BY_ID.
  const [adHocLesson, setAdHocLesson] = useState<Lesson | null>(null);
  const [practiceQueue, setPracticeQueue] = useState<Lesson[]>([]);
  const [showSettings, setShowSettings] = useState(false);
  const [openChapterIds, setOpenChapterIds] = useState<string[]>(() =>
    CHAPTERS.map((c) => c.id),
  );
  const listScrollYRef = useRef(0);

  const openLesson = (lessonId: string) => {
    if (activeLessonId === null) listScrollYRef.current = window.scrollY;
    setActiveLessonId(lessonId);
    setRunId((id) => id + 1);
  };

  const startLesson = (lesson: Lesson) => {
    if (!LESSONS_BY_ID[lesson.id]) setAdHocLesson(lesson);
    openLesson(lesson.id);
  };

  const startQueue = ([first, ...rest]: Lesson[]) => {
    setPracticeQueue(rest);
    startLesson(first);
  };

  const continueQueue = () => startQueue(practiceQueue);

  const navigateAway = (lessonId: string | null) => {
    setPracticeQueue([]);
    if (lessonId === null) setActiveLessonId(null);
    else openLesson(lessonId);
  };

  useLayoutEffect(() => {
    window.scrollTo(0, activeLessonId === null ? listScrollYRef.current : 0);
  }, [activeLessonId]);

  const learnedLetters = useMemo(() => {
    const seen = new Set<string>();
    const letters: string[] = [];
    for (const lesson of LESSONS) {
      if (!progress.results[lesson.id]?.passed) continue;
      for (const char of lesson.chars) {
        if (seen.has(char)) continue;
        seen.add(char);
        letters.push(char);
      }
    }
    return letters;
  }, [progress]);

  const recapLesson: Lesson = {
    id: "recap",
    title: "Recap",
    chapterId: "unit0",
    chars: learnedLetters,
    mode: "chars",
    kind: "review",
    estimate: "3 min",
    description:
      learnedLetters.length > 0
        ? "Wiederholt alle bisher gelernten Buchstaben"
        : "Noch keine Buchstaben gelernt",
    generatorConfig: { letters: learnedLetters, length: 150 },
  };

  const activeLesson =
    adHocLesson && activeLessonId === adHocLesson.id
      ? adHocLesson
      : activeLessonId === "free"
      ? FREE_PRACTICE_LESSON
      : activeLessonId === "recap"
        ? recapLesson
        : activeLessonId
          ? LESSONS_BY_ID[activeLessonId]
          : null;

  return (
    <div className="min-h-screen bg-dotted-grid pb-16">
      <header className="mb-8 flex items-center justify-between border-b border-border bg-card/50 px-6 py-4">
        <h1 className="font-heading text-xl font-bold text-foreground">
          ألف باء <span className="font-arabic text-accent-teal">تعلّم الطباعة</span>{" "}
          Arabisch Tippen
        </h1>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setShowSettings(true)}
          aria-label="Einstellungen"
        >
          <SettingsIcon />
        </Button>
      </header>

      <main className="px-4">
        {activeLessonId === "sandbox" ? (
          <SandboxPage
            fontSizePx={settings.fontSizePx}
            onBack={() => setActiveLessonId(null)}
          />
        ) : activeLesson ? (
          <LessonRunner
            key={runId}
            lesson={activeLesson}
            settings={settings}
            onFinish={recordResult}
            onBack={() => navigateAway(null)}
            onNavigate={navigateAway}
            queueNext={practiceQueue[0]}
            queueRemaining={practiceQueue.length}
            onStartQueue={startQueue}
            onContinueQueue={continueQueue}
          />
        ) : (
          <LessonList
            progress={progress}
            recapLesson={recapLesson}
            openChapterIds={openChapterIds}
            onOpenChapterIdsChange={setOpenChapterIds}
            onSelect={openLesson}
            onFreePractice={() => openLesson("free")}
            onSandbox={() => openLesson("sandbox")}
          />
        )}
      </main>

      <SettingsPanel
        open={showSettings}
        onOpenChange={setShowSettings}
        settings={settings}
        onChange={setSettings}
      />

      <Toaster position="bottom-center" />
    </div>
  );
}

export default App;
