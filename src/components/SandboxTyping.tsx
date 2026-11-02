import { useRef, useState } from "react";
import { XIcon } from "lucide-react";
import { CODE_TO_ARABIC, CODE_TO_ARABIC_SHIFT } from "../data/keyboardLayout";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";

interface SandboxTypingProps {
  fontSizePx: number;
  /** "standalone" grows with the page; "embedded" is a fixed few-row scrollable panel. */
  variant?: "standalone" | "embedded";
  autoFocus?: boolean;
}

function autoGrow(el: HTMLTextAreaElement) {
  el.style.height = "auto";
  el.style.height = `${el.scrollHeight}px`;
}

export function SandboxTyping({
  fontSizePx,
  variant = "standalone",
  autoFocus = true,
}: SandboxTypingProps) {
  const [hasText, setHasText] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    // Never let keystrokes reach a lesson's global keydown listener while the
    // sandbox textarea itself is focused.
    e.stopPropagation();

    // Modifier combos (Cmd+Backspace, Cmd+A, arrow-key navigation, …) are left
    // to the browser's native textarea behavior.
    if (e.metaKey || e.ctrlKey || e.altKey) return;

    const char = e.shiftKey ? CODE_TO_ARABIC_SHIFT[e.code] : CODE_TO_ARABIC[e.code];
    if (char === undefined) return; // Backspace, Enter, arrows, … — native behavior

    e.preventDefault();
    const el = e.currentTarget;
    const start = el.selectionStart ?? el.value.length;
    const end = el.selectionEnd ?? el.value.length;
    el.setRangeText(char, start, end, "end");
    setHasText(el.value.length > 0);
    if (variant === "standalone") autoGrow(el);
  }

  function handleClear() {
    const el = textareaRef.current;
    if (!el) return;
    el.value = "";
    setHasText(false);
    if (variant === "standalone") autoGrow(el);
    el.focus();
  }

  return (
    <div className="space-y-2">
      <Textarea
        ref={textareaRef}
        dir="rtl"
        lang="ar"
        rows={variant === "embedded" ? 3 : 10}
        placeholder="Sandbox — hier frei tippen, ohne Textvorgabe…"
        onKeyDown={handleKeyDown}
        onInput={(e) => {
          setHasText(e.currentTarget.value.length > 0);
          if (variant === "standalone") autoGrow(e.currentTarget);
        }}
        // Sizing stays manual: fixed rows when embedded, autoGrow() when standalone.
        className={`field-sizing-fixed resize-none rounded-xl bg-card p-6 font-arabic leading-relaxed md:text-base ${
          variant === "embedded" ? "overflow-y-auto" : "min-h-[50vh]"
        }`}
        style={{ fontSize: fontSizePx }}
        // eslint-disable-next-line jsx-a11y/no-autofocus
        autoFocus={autoFocus}
      />
      {hasText && (
        <Button variant="ghost" size="sm" onClick={handleClear}>
          <XIcon />
          Leeren
        </Button>
      )}
    </div>
  );
}
