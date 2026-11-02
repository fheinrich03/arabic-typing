import { ChevronRightIcon, ListOrderedIcon, SparklesIcon, TargetIcon } from "lucide-react";
import type { Lesson, LessonResult } from "../types";
import type { CharRating } from "../lib/charAnalysis";
import { displayChar } from "../lib/charAnalysis";
import { FOCUS_LESSON_ID } from "../lib/practiceRecommendations";
import { PASS_ERROR_RATE } from "../hooks/useLessonEngine";
import { CharAnalysis } from "./CharAnalysis";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";

interface StatsPanelProps {
  result: LessonResult;
  nextLessons: Lesson[];
  ratings: CharRating[];
  practice: Lesson[];
  /** next lesson of a running practice queue */
  queueNext?: Lesson;
  queueRemaining: number;
  onRetry: () => void;
  onBack: () => void;
  onSelectLesson: (lessonId: string) => void;
  onStartQueue: (lessons: Lesson[]) => void;
  onContinueQueue: () => void;
}

export function StatsPanel({
  result,
  nextLessons,
  ratings,
  practice,
  queueNext,
  queueRemaining,
  onRetry,
  onBack,
  onSelectLesson,
  onStartQueue,
  onContinueQueue,
}: StatsPanelProps) {
  const [recommended, ...upcoming] = nextLessons;

  return (
    <Card className="mx-auto max-w-lg text-center">
      <CardContent>
        <p
          className={`mb-4 text-lg font-semibold ${
            result.passed ? "text-accent-green" : "text-amber-400"
          }`}
        >
          {result.passed
            ? "Bestanden!"
            : `Noch nicht — unter ${Math.round((1 - PASS_ERROR_RATE) * 100)}% Genauigkeit`}
        </p>
        <dl className="grid grid-cols-3 gap-4 font-mono text-sm">
          <div>
            <dt className="font-sans text-muted-foreground">Zeichen/Min</dt>
            <dd className="text-xl font-semibold text-foreground">
              {result.charsPerMinute}
            </dd>
          </div>
          <div>
            <dt className="font-sans text-muted-foreground">Fehlerquote</dt>
            <dd className="text-xl font-semibold text-foreground">
              {Math.round(result.errorRate * 100)}%
            </dd>
          </div>
          <div>
            <dt className="font-sans text-muted-foreground">Dauer</dt>
            <dd className="text-xl font-semibold text-foreground">
              {Math.round(result.durationMs / 1000)}s
            </dd>
          </div>
        </dl>
        <div className="mt-6 flex justify-center gap-3">
          <Button onClick={onRetry}>Nochmal</Button>
          <Button variant="secondary" onClick={onBack}>
            Zur Übersicht
          </Button>
        </div>

        {queueNext && (
          <div className="mt-5 rounded-lg border-2 border-accent-indigo bg-accent-indigo/10 p-3 text-start">
            <div className="mb-1 flex items-center gap-1.5">
              <ListOrderedIcon className="size-3.5 text-accent-indigo" />
              <span className="text-xs font-medium text-accent-indigo">
                Übungs-Queue · noch {queueRemaining}
              </span>
            </div>
            <p className="font-medium text-foreground">{queueNext.title}</p>
            <Button className="mt-3 w-full" onClick={onContinueQueue}>
              Weiter in der Queue
            </Button>
          </div>
        )}

        {ratings.length > 0 && (
          <>
            <Separator className="my-5" />
            <CharAnalysis ratings={ratings} />
          </>
        )}

        {practice.length > 0 && (
          <>
            <Separator className="my-5" />
            <div className="space-y-2 text-start">
              <p className="text-sm font-medium text-muted-foreground">Üben, was noch hakt</p>
              {practice.map((lesson) => (
                <Button
                  key={lesson.id}
                  variant="outline"
                  onClick={() => onStartQueue([lesson])}
                  className="h-auto w-full justify-between p-2.5 hover:border-accent-teal/50"
                >
                  <span className="flex items-center gap-2">
                    {lesson.id === FOCUS_LESSON_ID && (
                      <TargetIcon className="text-accent-teal" />
                    )}
                    {lesson.title}
                    <span className="font-arabic text-base text-accent-teal">
                      {lesson.chars.map(displayChar).join(" ")}
                    </span>
                  </span>
                  <ChevronRightIcon className="text-muted-foreground" />
                </Button>
              ))}
              {practice.length > 1 && (
                <Button className="w-full" onClick={() => onStartQueue(practice)}>
                  <ListOrderedIcon />
                  Alle {practice.length} nacheinander üben
                </Button>
              )}
            </div>
          </>
        )}

        {recommended && !queueNext && (
          <>
            <Separator className="my-5" />
            <p className="mb-3 text-start text-sm font-medium text-muted-foreground">
              Weiter geht's
            </p>

            <div className="rounded-lg border-2 border-accent-teal bg-accent-teal/10 p-3 text-start">
              <div className="mb-1 flex items-center gap-1.5">
                <SparklesIcon className="size-3.5 text-accent-teal" />
                <span className="text-xs font-medium text-accent-teal">Empfohlen</span>
              </div>
              <p className="font-medium text-foreground">{recommended.title}</p>
              {recommended.chars.length > 0 && (
                <p className="font-arabic text-base text-accent-teal">
                  {recommended.chars.join(" ")}
                </p>
              )}
              {recommended.estimate && (
                <p className="text-xs text-muted-foreground">{recommended.estimate}</p>
              )}
              <Button className="mt-3 w-full" onClick={() => onSelectLesson(recommended.id)}>
                Übung beginnen
              </Button>
            </div>

            {upcoming.length > 0 && (
              <div className="mt-2 space-y-1.5">
                {upcoming.map((lesson) => (
                  <Button
                    key={lesson.id}
                    variant="outline"
                    onClick={() => onSelectLesson(lesson.id)}
                    className="h-auto w-full justify-between p-2.5 hover:border-accent-teal/50"
                  >
                    {lesson.title}
                    <ChevronRightIcon className="text-muted-foreground" />
                  </Button>
                ))}
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
