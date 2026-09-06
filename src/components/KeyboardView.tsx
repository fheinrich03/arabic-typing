import { KEY_ROWS, FINGER_COLORS, FINGER_LABELS, resolveNextKey } from "../data/keyboardLayout";
import type { Finger } from "../types";

const LEGEND_ORDER: Finger[] = [
  "l-pinky",
  "l-ring",
  "l-middle",
  "l-index",
  "r-index",
  "r-middle",
  "r-ring",
  "r-pinky",
];

interface KeyboardViewProps {
  text: string;
  currentIndex: number;
  showFingerHints: boolean;
}

const ROW_OFFSET = ["ms-0", "ms-3", "ms-6", "ms-9"];

export function KeyboardView({ text, currentIndex, showFingerHints }: KeyboardViewProps) {
  const next = resolveNextKey(text, currentIndex);

  return (
    <div className="select-none rounded-xl bg-surface p-4 ring-1 ring-foreground/10" dir="ltr">
      {next?.isShift && (
        <p className="mb-2 text-center text-xs font-medium text-accent-indigo">
          ⇧ Shift halten
        </p>
      )}
      <div className="flex flex-col gap-1.5">
        {KEY_ROWS.map((row, rowIndex) => (
          <div key={rowIndex} className={`flex gap-1.5 ${ROW_OFFSET[rowIndex]}`}>
            {row.map((key) => {
              const isActive = next?.key.code === key.code;
              const color = FINGER_COLORS[key.finger];
              const glyph = isActive && next?.isShift ? key.shiftArabic : key.arabic;
              return (
                <div
                  key={key.code}
                  className={`relative flex h-11 w-11 items-center justify-center rounded-md border-2 text-lg font-arabic transition-all ${
                    isActive
                      ? next?.isShift
                        ? "scale-110 border-accent-indigo bg-accent-indigo text-primary-foreground"
                        : "scale-110 border-accent-teal bg-accent-teal text-primary-foreground"
                      : "border-transparent bg-card text-foreground"
                  }`}
                  style={
                    showFingerHints && !isActive
                      ? { boxShadow: `inset 0 -3px 0 0 ${color}` }
                      : undefined
                  }
                  title={key.shiftArabic ? `${key.arabic} · ⇧${key.shiftArabic}` : key.arabic}
                >
                  {glyph}
                  {key.shiftArabic && !isActive && (
                    <span className="absolute top-0.5 right-1 text-[9px] text-muted-foreground">
                      {key.shiftArabic}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        ))}
        <div className="flex justify-center gap-1.5 pt-1">
          <div
            className={`h-9 w-16 rounded-md border-2 transition-all ${
              next?.isShift
                ? "border-accent-indigo bg-accent-indigo"
                : "border-transparent bg-card"
            }`}
            title="Shift"
          />
          <div
            className={`h-9 w-64 rounded-md border-2 transition-all ${
              next?.key.code === "Space"
                ? "border-accent-teal bg-accent-teal"
                : "border-transparent bg-card"
            }`}
          />
        </div>
      </div>
      {showFingerHints && (
        <div className="mt-3 flex flex-wrap justify-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
          {LEGEND_ORDER.map((finger) => (
            <span key={finger} className="flex items-center gap-1">
              <span
                className="inline-block h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: FINGER_COLORS[finger] }}
              />
              {FINGER_LABELS[finger]}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
