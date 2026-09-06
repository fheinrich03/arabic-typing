import type { KeyDef } from "../types";

/**
 * Reference layout: macOS "Arabic" keyboard (base letters match Windows
 * "Arabic (101)"). Used to look up which physical key + finger produces a
 * given Arabic character, for the on-screen keyboard and finger hints, and
 * to translate physical keydowns into Arabic characters directly (see
 * CODE_TO_ARABIC / CODE_TO_ARABIC_SHIFT) — the learner never needs an
 * Arabic input source active in the OS.
 *
 * Shift-layer mapping (hamza/alif forms, ligatures, diacritics, digits,
 * punctuation) per the standard Arabic 101 layout; the Shadda position
 * (Backquote+Shift) is a best-effort placement, unverified against a real
 * Mac — flag if it doesn't match your keyboard.
 */
export const NUMBER_ROW: KeyDef[] = [
  { code: "Backquote", arabic: "ذ", shiftArabic: "ّ", finger: "l-pinky", row: -1 },
  { code: "Digit1", arabic: "١", finger: "l-pinky", row: -1 },
  { code: "Digit2", arabic: "٢", finger: "l-ring", row: -1 },
  { code: "Digit3", arabic: "٣", finger: "l-middle", row: -1 },
  { code: "Digit4", arabic: "٤", finger: "l-index", row: -1 },
  { code: "Digit5", arabic: "٥", finger: "l-index", row: -1 },
  { code: "Digit6", arabic: "٦", finger: "r-index", row: -1 },
  { code: "Digit7", arabic: "٧", finger: "r-index", row: -1 },
  { code: "Digit8", arabic: "٨", finger: "r-middle", row: -1 },
  { code: "Digit9", arabic: "٩", finger: "r-ring", row: -1 },
  { code: "Digit0", arabic: "٠", finger: "r-pinky", row: -1 },
];

export const TOP_ROW: KeyDef[] = [
  { code: "KeyQ", arabic: "ض", shiftArabic: "َ", finger: "l-pinky", row: 0 },
  { code: "KeyW", arabic: "ص", shiftArabic: "ً", finger: "l-ring", row: 0 },
  { code: "KeyE", arabic: "ث", shiftArabic: "ُ", finger: "l-middle", row: 0 },
  { code: "KeyR", arabic: "ق", shiftArabic: "ٌ", finger: "l-index", row: 0 },
  { code: "KeyT", arabic: "ف", shiftArabic: "لإ", finger: "l-index", row: 0 },
  { code: "KeyY", arabic: "غ", shiftArabic: "إ", finger: "r-index", row: 0 },
  { code: "KeyU", arabic: "ع", finger: "r-index", row: 0 },
  { code: "KeyI", arabic: "ه", finger: "r-middle", row: 0 },
  { code: "KeyO", arabic: "خ", finger: "r-ring", row: 0 },
  { code: "KeyP", arabic: "ح", shiftArabic: "؛", finger: "r-pinky", row: 0 },
  { code: "BracketLeft", arabic: "ج", finger: "r-pinky", row: 0 },
  { code: "BracketRight", arabic: "د", finger: "r-pinky", row: 0 },
];

export const HOME_ROW: KeyDef[] = [
  { code: "KeyA", arabic: "ش", shiftArabic: "ِ", finger: "l-pinky", row: 1 },
  { code: "KeyS", arabic: "س", shiftArabic: "ٍ", finger: "l-ring", row: 1 },
  { code: "KeyD", arabic: "ي", finger: "l-middle", row: 1 },
  { code: "KeyF", arabic: "ب", finger: "l-index", row: 1 },
  { code: "KeyG", arabic: "ل", shiftArabic: "لأ", finger: "l-index", row: 1 },
  { code: "KeyH", arabic: "ا", shiftArabic: "أ", finger: "r-index", row: 1 },
  { code: "KeyJ", arabic: "ت", shiftArabic: "ـ", finger: "r-index", row: 1 },
  { code: "KeyK", arabic: "ن", shiftArabic: "،", finger: "r-middle", row: 1 },
  { code: "KeyL", arabic: "م", finger: "r-ring", row: 1 },
  { code: "Semicolon", arabic: "ك", finger: "r-pinky", row: 1 },
  { code: "Quote", arabic: "ط", finger: "r-pinky", row: 1 },
];

export const BOTTOM_ROW: KeyDef[] = [
  { code: "KeyZ", arabic: "ئ", finger: "l-pinky", row: 2 },
  { code: "KeyX", arabic: "ء", shiftArabic: "ْ", finger: "l-ring", row: 2 },
  { code: "KeyC", arabic: "ؤ", finger: "l-middle", row: 2 },
  { code: "KeyV", arabic: "ر", finger: "l-index", row: 2 },
  { code: "KeyB", arabic: "لا", shiftArabic: "لآ", finger: "l-index", row: 2 },
  { code: "KeyN", arabic: "ى", shiftArabic: "آ", finger: "r-index", row: 2 },
  { code: "KeyM", arabic: "ة", finger: "r-index", row: 2 },
  { code: "Comma", arabic: "و", finger: "r-middle", row: 2 },
  { code: "Period", arabic: "ز", finger: "r-ring", row: 2 },
  { code: "Slash", arabic: "ظ", shiftArabic: "؟", finger: "r-pinky", row: 2 },
];

export const SPACE_KEY: KeyDef = { code: "Space", arabic: " ", finger: "thumb", row: 3, width: 6 };

export const KEY_ROWS: KeyDef[][] = [NUMBER_ROW, TOP_ROW, HOME_ROW, BOTTOM_ROW];

export const ALL_KEYS: KeyDef[] = [...KEY_ROWS.flat(), SPACE_KEY];

export const CHAR_TO_KEY: Record<string, KeyDef> = Object.fromEntries(
  ALL_KEYS.filter((k) => k.arabic).map((k) => [k.arabic, k]),
);

export const SHIFT_CHAR_TO_KEY: Record<string, KeyDef> = Object.fromEntries(
  ALL_KEYS.filter((k) => k.shiftArabic).map((k) => [k.shiftArabic!, k]),
);

export function keyForChar(char: string): KeyDef | undefined {
  return CHAR_TO_KEY[char] ?? SHIFT_CHAR_TO_KEY[char];
}

export const CODE_TO_ARABIC: Record<string, string> = Object.fromEntries(
  ALL_KEYS.filter((k) => k.arabic).map((k) => [k.code, k.arabic]),
);

export const CODE_TO_ARABIC_SHIFT: Record<string, string> = Object.fromEntries(
  ALL_KEYS.filter((k) => k.shiftArabic).map((k) => [k.code, k.shiftArabic!]),
);

/** Multi-char keys (ligatures), longest-first, for lookahead matching. */
const MULTI_CHAR_KEYS = ALL_KEYS.flatMap((k) => {
  const entries: { token: string; key: KeyDef; isShift: boolean }[] = [];
  if (k.arabic.length > 1) entries.push({ token: k.arabic, key: k, isShift: false });
  if (k.shiftArabic && k.shiftArabic.length > 1) {
    entries.push({ token: k.shiftArabic, key: k, isShift: true });
  }
  return entries;
}).sort((a, b) => b.token.length - a.token.length);

/**
 * Resolves the next key the learner should press at `text[index]`,
 * accounting for multi-character ligature keys (e.g. "لا") that must be
 * matched as a whole rather than one codepoint at a time.
 */
export function resolveNextKey(
  text: string,
  index: number,
): { token: string; key: KeyDef; isShift: boolean } | undefined {
  for (const candidate of MULTI_CHAR_KEYS) {
    if (text.startsWith(candidate.token, index)) return candidate;
  }
  const char = text[index];
  if (char === undefined) return undefined;
  const key = CHAR_TO_KEY[char];
  if (key) return { token: char, key, isShift: false };
  const shiftKey = SHIFT_CHAR_TO_KEY[char];
  if (shiftKey) return { token: char, key: shiftKey, isShift: true };
  return undefined;
}

export const FINGER_COLORS: Record<KeyDef["finger"], string> = {
  "l-pinky": "#f87171",
  "l-ring": "#fb923c",
  "l-middle": "#fbbf24",
  "l-index": "#4ade80",
  "r-index": "#22d3ee",
  "r-middle": "#60a5fa",
  "r-ring": "#a78bfa",
  "r-pinky": "#f472b6",
  thumb: "#94a3b8",
};

export const FINGER_LABELS: Record<KeyDef["finger"], string> = {
  "l-pinky": "linker kleiner Finger",
  "l-ring": "linker Ringfinger",
  "l-middle": "linker Mittelfinger",
  "l-index": "linker Zeigefinger",
  "r-index": "rechter Zeigefinger",
  "r-middle": "rechter Mittelfinger",
  "r-ring": "rechter Ringfinger",
  "r-pinky": "rechter kleiner Finger",
  thumb: "Daumen",
};

/** Home row letters, in finger-training order (Tipp10-style progression). */
export const HOME_ROW_GROUPS: string[][] = [
  ["ت"],
  ["ن"],
  ["م"],
  ["ك"],
  ["ا"],
  ["ب"],
  ["ل"],
  ["ي"],
  ["س"],
  ["ش"],
];

export const TOP_ROW_GROUPS: string[][] = [
  ["ع"],
  ["غ"],
  ["ه"],
  ["خ"],
  ["ح"],
  ["ج"],
  ["ف"],
  ["ق"],
  ["ث"],
  ["ص"],
  ["ض"],
  ["ة"],
];

export const BOTTOM_ROW_GROUPS: string[][] = [
  ["ط"],
  ["ظ"],
  ["ذ"],
  ["د"],
  ["ز"],
  ["ر"],
  ["و"],
];
