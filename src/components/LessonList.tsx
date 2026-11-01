import { Dice5Icon, GamepadIcon, PencilLineIcon } from "lucide-react";
import { CHAPTERS, LESSONS_BY_ID } from "../data/lessons";
import type { Lesson, LessonResult, Progress } from "../types";
import { Card } from "./ui/card";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "./ui/accordion";

interface LessonListProps {
  progress: Progress;
  recapLesson: Lesson;
  openChapterIds: string[];
  onOpenChapterIdsChange: (chapterIds: string[]) => void;
  onSelect: (lessonId: string) => void;
  onFreePractice: () => void;
  onSandbox: () => void;
}

interface LessonCardProps {
  lesson: Lesson;
  result?: LessonResult;
  disabled?: boolean;
  onSelect: () => void;
}

function LessonCard({ lesson, result, disabled, onSelect }: LessonCardProps) {
  return (
    <Card
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-disabled={disabled}
      className={`h-full p-0 transition-colors outline-none ${
        disabled
          ? "cursor-not-allowed opacity-50"
          : "cursor-pointer hover:ring-accent-teal/50 focus-visible:ring-2 focus-visible:ring-ring"
      } ${lesson.isSideQuest ? "border border-dashed border-border" : ""} ${
        result?.passed ? "ring-accent-green/40" : ""
      }`}
      onClick={disabled ? undefined : onSelect}
      onKeyDown={(e) => {
        if (disabled) return;
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect();
        }
      }}
    >
      <div className="flex h-full flex-col gap-1 p-3 text-start text-sm">
        <div className="flex items-center gap-1.5">
          {lesson.isSideQuest && (
            <GamepadIcon className="size-3.5 shrink-0 text-accent-indigo" />
          )}
          <span className="font-medium text-foreground">{lesson.title}</span>
        </div>
        {lesson.description && (
          <span className="text-xs text-muted-foreground">{lesson.description}</span>
        )}
        {lesson.chars.length > 0 && (
          <span className="font-arabic text-base text-accent-teal">
            {lesson.chars.join(" ")}
          </span>
        )}
        <div className="mt-auto flex items-center gap-2 pt-1 text-xs text-muted-foreground">
          {lesson.estimate && <span>{lesson.estimate}</span>}
          {lesson.goalAccuracy && <span>Ziel {lesson.goalAccuracy}%</span>}
        </div>
        {result && (
          <span className="block font-mono text-xs text-accent-green">
            {result.charsPerMinute} Z/Min · {Math.round(result.errorRate * 100)}% Fehler
          </span>
        )}
      </div>
    </Card>
  );
}

export function LessonList({
  progress,
  recapLesson,
  openChapterIds,
  onOpenChapterIdsChange,
  onSelect,
  onFreePractice,
  onSandbox,
}: LessonListProps) {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="grid gap-2 sm:grid-cols-2">
        <button
          onClick={onFreePractice}
          className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border p-4 text-center text-muted-foreground transition-colors hover:border-accent-teal hover:text-foreground"
        >
          <Dice5Icon className="size-5 text-accent-teal" />
          Freies Training — zufälliger Übungstext mit allen Buchstaben
        </button>
        <button
          onClick={onSandbox}
          className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border p-4 text-center text-muted-foreground transition-colors hover:border-accent-teal hover:text-foreground"
        >
          <PencilLineIcon className="size-5 text-accent-teal" />
          Sandbox — frei tippen ohne Textvorgabe
        </button>
      </div>

      <Accordion multiple value={openChapterIds} onValueChange={onOpenChapterIdsChange}>
        {CHAPTERS.map((chapter) => {
          const nonSideQuestIds = chapter.lessonIds.filter(
            (id) => !LESSONS_BY_ID[id].isSideQuest,
          );
          const doneCount = nonSideQuestIds.filter((id) => progress.results[id]?.passed).length;
          return (
            <AccordionItem key={chapter.id} value={chapter.id}>
              <AccordionTrigger>
                <div className="flex w-full items-baseline justify-between pr-2">
                  <span className="font-heading text-lg font-semibold text-foreground">
                    {chapter.title}
                  </span>
                  <span className="font-mono text-xs font-normal text-muted-foreground">
                    {doneCount}/{nonSideQuestIds.length}
                  </span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                {chapter.description && (
                  <p className="mb-3 text-sm text-muted-foreground">{chapter.description}</p>
                )}
                <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {chapter.id === "unit0" && (
                    <li>
                      <LessonCard
                        lesson={recapLesson}
                        result={progress.results[recapLesson.id]}
                        disabled={recapLesson.chars.length === 0}
                        onSelect={() => onSelect(recapLesson.id)}
                      />
                    </li>
                  )}
                  {chapter.lessonIds.map((lessonId) => {
                    const lesson = LESSONS_BY_ID[lessonId];
                    return (
                      <li key={lessonId} className={lesson.isSideQuest ? "sm:col-span-1" : ""}>
                        <LessonCard
                          lesson={lesson}
                          result={progress.results[lessonId]}
                          onSelect={() => onSelect(lessonId)}
                        />
                      </li>
                    );
                  })}
                </ul>
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
}
