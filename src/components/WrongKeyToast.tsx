import { useEffect, useState } from "react";
import { isCombining } from "../data/charRules";
import type { WrongKey } from "../hooks/useLessonEngine";

const VISIBLE_MS = 1800;

/** Combining marks (harakat) need a base to render on; spaces are invisible on their own. */
function displayChar(char: string): string {
  if (char === " ") return "␣";
  return isCombining(char) ? `◌${char}` : char;
}

export function WrongKeyToast({ wrongKey }: { wrongKey: WrongKey | null }) {
  const [dismissedId, setDismissedId] = useState<number | null>(null);

  useEffect(() => {
    if (!wrongKey) return;
    const timeout = setTimeout(() => setDismissedId(wrongKey.id), VISIBLE_MS);
    return () => clearTimeout(timeout);
  }, [wrongKey]);

  const visible = wrongKey && wrongKey.id !== dismissedId ? wrongKey : null;
  if (!visible) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 bottom-6 z-50 flex justify-center px-4"
    >
      <div
        key={visible.id}
        className="flex items-center gap-4 rounded-xl bg-card px-4 py-2 shadow-lg ring-1 ring-destructive/40 animate-in fade-in slide-in-from-bottom-2"
      >
        <span className="flex items-center gap-2 text-sm text-muted-foreground">
          Getippt
          <span dir="rtl" lang="ar" className="font-arabic text-3xl leading-none text-destructive">
            {displayChar(visible.typed)}
          </span>
        </span>
        <span className="flex items-center gap-2 text-sm text-muted-foreground">
          Erwartet
          <span dir="rtl" lang="ar" className="font-arabic text-3xl leading-none text-accent-green">
            {displayChar(visible.expected)}
          </span>
        </span>
      </div>
    </div>
  );
}
