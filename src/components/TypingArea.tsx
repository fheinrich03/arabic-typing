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
  pending: "text-slate-400 dark:text-slate-500",
  correct: "text-emerald-600 dark:text-emerald-400",
  incorrect: "text-red-500 underline decoration-wavy",
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
      <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200 dark:bg-slate-800 dark:ring-slate-700">
        {[...text].map((char, i) => {
          const isCurrent = i === currentIndex;
          return (
            <span
              key={i}
              className={`${STATUS_CLASSES[charStates[i]]} ${
                isCurrent
                  ? `rounded px-0.5 ${
                      lastKeyWasWrong
                        ? "bg-red-200 dark:bg-red-900"
                        : "bg-amber-200 dark:bg-amber-700"
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
