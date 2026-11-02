import type { CharLevel, CharRating } from "../lib/charAnalysis";
import { displayChar } from "../lib/charAnalysis";
import { PAUSE_THRESHOLD_MS } from "../hooks/useLessonEngine";
import { Badge } from "./ui/badge";

const LEVELS: { level: CharLevel; label: string; className: string }[] = [
  { level: "unsicher", label: "Noch unsicher", className: "border-destructive/40 text-destructive" },
  { level: "mittel", label: "Mittel", className: "border-amber-400/40 text-amber-400" },
  { level: "sicher", label: "Sicher", className: "border-accent-green/40 text-accent-green" },
];

function formatSeconds(ms: number): string {
  return `${(ms / 1000).toLocaleString("de-DE", { minimumFractionDigits: 1, maximumFractionDigits: 1 })} s`;
}

function RatingRow({ rating }: { rating: CharRating }) {
  return (
    <li className="grid grid-cols-[3rem_1fr_auto] items-center gap-3 rounded-md bg-muted/40 px-3 py-1.5">
      <span className="font-arabic text-2xl text-foreground" dir="rtl">
        {displayChar(rating.char)}
      </span>
      <span className="text-xs text-muted-foreground">
        {rating.errors} Fehler · {rating.occurrences}× getippt
        {rating.avgMs !== null && <> · Ø {formatSeconds(rating.avgMs)}</>}
        {rating.topConfusion && (
          <>
            {" "}
            · oft{" "}
            <span className="font-arabic text-sm text-foreground">
              {displayChar(rating.topConfusion.typed)}
            </span>{" "}
            statt
          </>
        )}
      </span>
      <span className="font-mono text-sm font-semibold text-foreground">{rating.score}</span>
    </li>
  );
}

export function CharAnalysis({ ratings }: { ratings: CharRating[] }) {
  return (
    <section className="space-y-4 text-start">
      <div>
        <p className="text-sm font-medium text-muted-foreground">Buchstaben-Analyse</p>
        <p className="text-xs text-muted-foreground">
          Bewertung aus Trefferquote und Tempo (Pausen über {PAUSE_THRESHOLD_MS / 1000} s zählen
          nicht).
        </p>
      </div>
      {LEVELS.map(({ level, label, className }) => {
        const group = ratings.filter((r) => r.level === level);
        if (group.length === 0) return null;
        return (
          <div key={level} className="space-y-1.5">
            <Badge variant="outline" className={className}>
              {label} · {group.length}
            </Badge>
            {level === "sicher" ? (
              <p className="font-arabic text-xl leading-relaxed text-accent-green" dir="rtl">
                {group.map((r) => displayChar(r.char)).join("  ")}
              </p>
            ) : (
              <ul className="space-y-1">
                {group.map((r) => (
                  <RatingRow key={r.char} rating={r} />
                ))}
              </ul>
            )}
          </div>
        );
      })}
    </section>
  );
}
