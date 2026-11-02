import { ChevronRightIcon, SparklesIcon } from "lucide-react";
import type { Lesson, LessonResult } from "../types";
import { PASS_ERROR_RATE } from "../hooks/useLessonEngine";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";

interface StatsPanelProps {
  result: LessonResult;
  nextLessons: Lesson[];
  onRetry: () => void;
  onBack: () => void;
  onSelectLesson: (lessonId: string) => void;
}

export function StatsPanel({
  result,
  nextLessons,
  onRetry,
  onBack,
  onSelectLesson,
}: StatsPanelProps) {
  const [recommended, ...upcoming] = nextLessons;

  return (
    <Card className="mx-auto max-w-md text-center">
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

        {recommended && (
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
