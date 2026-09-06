import { useEffect } from "react";
import type { CharStatus } from "../hooks/useLessonEngine";

interface TypingAreaProps {
  text: string;
  currentIndex: number;
  charStates: CharStatus[];
  lastKeyWasWrong: boolean;
  fontSizePx: number;
  active: boolean;
  onChar: (char: string) => void;
}

const STATUS_CLASSES: Record<CharStatus, string> = {
  pending: "text-muted-foreground",
  correct: "text-accent-green",
  incorrect: "text-destructive underline decoration-wavy",
};

export function TypingArea({
  text,
  currentIndex,
  charStates,
  lastKeyWasWrong,
  fontSizePx,
  active,
  onChar,
}: TypingAreaProps) {
  useEffect(() => {
    if (!active) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key === " ") e.preventDefault();
      if (e.key.length !== 1) return;
      onChar(e.key);
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [active, onChar]);

  return (
    <div
      dir="rtl"
      lang="ar"
      className="font-arabic leading-relaxed"
      style={{ fontSize: fontSizePx }}
    >
      <div className="rounded-xl bg-card p-6 ring-1 ring-foreground/10">
        {[...text].map((char, i) => {
          const isCurrent = i === currentIndex;
          return (
            <span
              key={i}
              className={`${STATUS_CLASSES[charStates[i]]} ${
                isCurrent
                  ? `rounded px-0.5 ${
                      lastKeyWasWrong ? "bg-destructive/30" : "bg-accent-teal/30"
                    }`
                  : ""
              }`}
            >
              {char === " " ? " " : char}
            </span>
          );
        })}
      </div>
    </div>
  );
}
