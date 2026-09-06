import { KEY_ROWS, FINGER_COLORS, FINGER_LABELS, keyForChar } from "../data/keyboardLayout";
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
  targetChar: string | undefined;
  showFingerHints: boolean;
}

const ROW_OFFSET = ["ms-0", "ms-3", "ms-6"];

export function KeyboardView({ targetChar, showFingerHints }: KeyboardViewProps) {
  const activeKey = targetChar ? keyForChar(targetChar) : undefined;

  return (
    <div className="select-none rounded-xl bg-surface p-4 ring-1 ring-foreground/10" dir="ltr">
      <div className="flex flex-col gap-1.5">
        {KEY_ROWS.slice(0, 3).map((row, rowIndex) => (
          <div key={rowIndex} className={`flex gap-1.5 ${ROW_OFFSET[rowIndex]}`}>
            {row.map((key) => {
              const isActive = activeKey?.code === key.code;
              const color = FINGER_COLORS[key.finger];
              return (
                <div
                  key={key.code}
                  className={`flex h-11 w-11 items-center justify-center rounded-md border-2 text-lg font-arabic transition-all ${
                    isActive
                      ? "scale-110 border-accent-teal bg-accent-teal text-primary-foreground"
                      : "border-transparent bg-card text-foreground"
                  }`}
                  style={
                    showFingerHints && !isActive
                      ? { boxShadow: `inset 0 -3px 0 0 ${color}` }
                      : undefined
                  }
                  title={key.arabic}
                >
                  {key.arabic}
                </div>
              );
            })}
          </div>
        ))}
        <div className="flex justify-center pt-1">
          <div
            className={`h-9 w-64 rounded-md border-2 transition-all ${
              activeKey?.code === "Space"
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
