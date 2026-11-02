import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import type { CharStatus } from "../hooks/useLessonEngine";
import { MousePointerClickIcon } from "lucide-react";
import { CODE_TO_ARABIC, CODE_TO_ARABIC_SHIFT, resolveNextKey } from "../data/keyboardLayout";
import { Button } from "./ui/button";

interface TypingAreaProps {
  text: string;
  currentIndex: number;
  charStates: CharStatus[];
  lastKeyWasWrong: boolean;
  fontSizePx: number;
  active: boolean;
  onChar: (char: string) => void;
}

interface Rect {
  left: number;
  top: number;
  width: number;
  height: number;
}

/**
 * Arabic letters are shaped in context (joined to their neighbors) — splitting
 * the practice text into one <span> per character, as this used to do, breaks
 * that shaping for whichever character sits in its own span (most visibly for
 * letters like ain and the lam-alif ligature) and made the highlight look
 * misaligned. Rendering the text as a single, unsplit node keeps shaping
 * correct; progress/cursor highlights are drawn as separately-positioned
 * boxes measured from the real, shaped glyphs via the Range API — decoration
 * only, so it never affects the text's own layout.
 */
function rectsForRange(container: HTMLElement, textNode: Text, start: number, end: number): Rect[] {
  if (start >= end || start < 0 || end > textNode.length) return [];
  const range = document.createRange();
  range.setStart(textNode, start);
  range.setEnd(textNode, end);
  const containerRect = container.getBoundingClientRect();
  return Array.from(range.getClientRects()).map((r) => ({
    left: r.left - containerRect.left,
    top: r.top - containerRect.top,
    width: r.width,
    height: r.height,
  }));
}

export function TypingArea({
  text,
  currentIndex,
  charStates,
  lastKeyWasWrong,
  fontSizePx,
  active,
  onChar,
}: TypingAreaProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const [focused, setFocused] = useState(false);
  const [decorations, setDecorations] = useState<{
    correct: Rect[];
    incorrect: Rect[];
    current: Rect[];
  }>({ correct: [], incorrect: [], current: [] });

  const measure = useCallback(() => {
    const container = textRef.current;
    const node = container && Array.from(container.childNodes).find((n) => n instanceof Text);
    if (!container || !(node instanceof Text) || text.length === 0) {
      setDecorations({ correct: [], incorrect: [], current: [] });
      return;
    }

    const correct: Rect[] = [];
    const incorrect: Rect[] = [];
    let i = 0;
    while (i < currentIndex) {
      const status = charStates[i];
      let j = i + 1;
      while (j < currentIndex && charStates[j] === status) j++;
      const rects = rectsForRange(container, node, i, j);
      (status === "incorrect" ? incorrect : correct).push(...rects);
      i = j;
    }

    const tokenLength = resolveNextKey(text, currentIndex)?.token.length ?? 1;
    const current = rectsForRange(
      container,
      node,
      currentIndex,
      Math.min(currentIndex + tokenLength, text.length),
    );

    setDecorations({ correct, incorrect, current });
  }, [text, currentIndex, charStates]);

  useLayoutEffect(() => {
    measure();
  }, [measure]);

  useEffect(() => {
    const el = textRef.current;
    if (!el) return;
    const observer = new ResizeObserver(() => measure());
    observer.observe(el);
    return () => observer.disconnect();
  }, [measure]);

  // Layout effect so the initial focus lands before paint — no overlay flash.
  useLayoutEffect(() => {
    if (active) wrapperRef.current?.focus();
  }, [active, text]);

  function refocus() {
    wrapperRef.current?.focus();
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (!active) return;
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    const char = e.shiftKey ? CODE_TO_ARABIC_SHIFT[e.code] : CODE_TO_ARABIC[e.code];
    if (char === undefined) return;
    if (char === " ") e.preventDefault();
    onChar(char);
  }

  const showFocusOverlay = active && !focused;

  return (
    <div className="relative">
      <div
        ref={wrapperRef}
        tabIndex={active ? 0 : -1}
        onKeyDown={handleKeyDown}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className={`rounded-xl bg-card p-6 outline-none ring-1 ring-foreground/10 transition-opacity focus-visible:ring-2 focus-visible:ring-accent-teal/50 ${
          showFocusOverlay ? "opacity-40 grayscale" : ""
        }`}
      >
        <div
          ref={textRef}
          dir="rtl"
          lang="ar"
          className="relative font-arabic leading-relaxed text-foreground"
          style={{ fontSize: fontSizePx }}
        >
          <div className="pointer-events-none absolute inset-0">
            {decorations.correct.map((r, i) => (
              <div
                key={`correct-${i}`}
                className="absolute rounded-sm bg-accent-green/15"
                style={{ left: r.left, top: r.top, width: r.width, height: r.height }}
              />
            ))}
            {decorations.incorrect.map((r, i) => (
              <div
                key={`incorrect-${i}`}
                className="absolute rounded-sm border-b-2 border-destructive bg-destructive/15"
                style={{ left: r.left, top: r.top, width: r.width, height: r.height }}
              />
            ))}
            {decorations.current.map((r, i) => (
              <div
                key={`current-${i}`}
                className={`absolute rounded-sm ${
                  lastKeyWasWrong ? "bg-destructive/30" : "bg-accent-teal/30"
                }`}
                style={{
                  left: r.left - 2,
                  top: r.top - 1,
                  width: r.width + 4,
                  height: r.height + 2,
                }}
              />
            ))}
          </div>
          {text}
        </div>
      </div>
      {showFocusOverlay && (
        // A sibling of the focusable wrapper (not a child), so focusing the
        // button itself doesn't count as the exercise being focused. Any click
        // on the backdrop refocuses the exercise, not just the button.
        <div
          className="absolute inset-0 flex cursor-pointer items-center justify-center rounded-xl"
          onMouseDown={(e) => {
            e.preventDefault();
            refocus();
          }}
        >
          <Button variant="secondary" onClick={refocus}>
            <MousePointerClickIcon />
            Fokus
          </Button>
        </div>
      )}
    </div>
  );
}
