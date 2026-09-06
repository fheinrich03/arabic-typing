import { Dice5Icon } from "lucide-react";
import { CHAPTERS, LESSONS_BY_ID } from "../data/lessons";
import type { Progress } from "../types";
import { Card } from "./ui/card";

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
        className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border p-4 text-center text-muted-foreground transition-colors hover:border-accent-teal hover:text-foreground"
      >
        <Dice5Icon className="size-5 text-accent-teal" />
        Freies Training — zufälliger Übungstext mit allen Buchstaben
      </button>

      {CHAPTERS.map((chapter) => (
        <section key={chapter.id}>
          <h2 className="mb-2 font-heading text-lg font-semibold text-foreground">
            {chapter.title}
          </h2>
          <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {chapter.lessonIds.map((lessonId) => {
              const lesson = LESSONS_BY_ID[lessonId];
              const result = progress.results[lessonId];
              return (
                <li key={lessonId}>
                  <Card
                    role="button"
                    tabIndex={0}
                    className={`cursor-pointer p-0 transition-colors outline-none hover:ring-accent-teal/50 focus-visible:ring-2 focus-visible:ring-ring ${
                      result?.passed ? "ring-accent-green/40" : ""
                    }`}
                    onClick={() => onSelect(lessonId)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        onSelect(lessonId);
                      }
                    }}
                  >
                    <div className="p-3 text-start text-sm">
                      <span className="block font-medium text-foreground">
                        {lesson.title}
                      </span>
                      {result && (
                        <span className="mt-1 block font-mono text-xs text-muted-foreground">
                          {result.charsPerMinute} Z/Min · {Math.round(result.errorRate * 100)}%
                          Fehler
                        </span>
                      )}
                    </div>
                  </Card>
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </div>
  );
}
