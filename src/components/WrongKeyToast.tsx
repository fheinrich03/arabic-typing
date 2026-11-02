import { toast } from "sonner";
import { isCombining } from "../data/charRules";
import type { WrongKey } from "../hooks/useLessonEngine";

const TOAST_ID = "wrong-key";

/** Combining marks (harakat) need a base to render on; spaces are invisible on their own. */
function displayChar(char: string): string {
  if (char === " ") return "␣";
  return isCombining(char) ? `◌${char}` : char;
}

/** Reuses one toast id, so a new mistake replaces the previous toast instead of stacking. */
export function showWrongKeyToast({ typed, expected }: WrongKey) {
  toast.custom(
    () => (
      <div className="mx-auto flex w-fit items-center gap-4 rounded-xl bg-popover px-4 py-2 text-popover-foreground shadow-lg ring-1 ring-destructive/40">
        <span className="flex items-center gap-2 text-sm text-muted-foreground">
          Getippt
          <span dir="rtl" lang="ar" className="font-arabic text-3xl leading-none text-destructive">
            {displayChar(typed)}
          </span>
        </span>
        <span className="flex items-center gap-2 text-sm text-muted-foreground">
          Erwartet
          <span dir="rtl" lang="ar" className="font-arabic text-3xl leading-none text-accent-green">
            {displayChar(expected)}
          </span>
        </span>
      </div>
    ),
    { id: TOAST_ID, duration: 1800 },
  );
}
