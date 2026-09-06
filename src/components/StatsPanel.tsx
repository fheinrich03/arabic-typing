import type { LessonResult } from "../types";
import { PASS_ERROR_RATE } from "../hooks/useLessonEngine";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";

interface StatsPanelProps {
  result: LessonResult;
  onRetry: () => void;
  onBack: () => void;
}

export function StatsPanel({ result, onRetry, onBack }: StatsPanelProps) {
  return (
    <Card className="mx-auto max-w-sm text-center">
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
      </CardContent>
    </Card>
  );
}
