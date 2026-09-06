import { useState } from "react";
import { SettingsIcon } from "lucide-react";
import { LESSONS_BY_ID, ALL_LETTERS } from "./data/lessons";
import type { Lesson } from "./types";
import { useSettings } from "./hooks/useSettings";
import { useProgress } from "./hooks/useProgress";
import { LessonList } from "./components/LessonList";
import { LessonRunner } from "./components/LessonRunner";
import { SettingsPanel } from "./components/SettingsPanel";
import { Button } from "./components/ui/button";

const FREE_PRACTICE_LESSON: Lesson = {
  id: "free",
  title: "Freies Training",
  chapterId: "free",
  chars: ALL_LETTERS,
  mode: "chars",
  generatorConfig: { letters: ALL_LETTERS, length: 250 },
};

function App() {
  const [settings, setSettings] = useSettings();
  const { progress, recordResult } = useProgress();
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);

  const activeLesson =
    activeLessonId === "free" ? FREE_PRACTICE_LESSON : activeLessonId ? LESSONS_BY_ID[activeLessonId] : null;

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
        {activeLesson ? (
          <LessonRunner
            lesson={activeLesson}
            settings={settings}
            onFinish={recordResult}
            onBack={() => setActiveLessonId(null)}
          />
        ) : (
          <LessonList
            progress={progress}
            onSelect={setActiveLessonId}
            onFreePractice={() => setActiveLessonId("free")}
          />
        )}
      </main>

      <SettingsPanel
        open={showSettings}
        onOpenChange={setShowSettings}
        settings={settings}
        onChange={setSettings}
      />
    </div>
  );
}

export default App;
