import { useState } from "react";
import { LESSONS_BY_ID, ALL_LETTERS } from "./data/lessons";
import type { Lesson } from "./types";
import { useSettings } from "./hooks/useSettings";
import { useProgress } from "./hooks/useProgress";
import { LessonList } from "./components/LessonList";
import { LessonRunner } from "./components/LessonRunner";
import { SettingsPanel } from "./components/SettingsPanel";

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
    <div className="min-h-screen bg-slate-50 pb-16 dark:bg-slate-900">
      <header className="mb-8 flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4 dark:border-slate-800 dark:bg-slate-800/50">
        <h1 className="text-xl font-bold text-slate-900 dark:text-white">
          ألف باء ⌨️ Arabisch Tippen
        </h1>
        <button
          onClick={() => setShowSettings(true)}
          className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-700"
          aria-label="Einstellungen"
        >
          ⚙️
        </button>
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

      {showSettings && (
        <SettingsPanel
          settings={settings}
          onChange={setSettings}
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  );
}

export default App;
