import type { KeyDef } from "../types";

/**
 * Reference layout: the standard Arabic PC layout, officially "Arabic (101)"
 * on Windows. On macOS it is the input source "Arabic – PC" ("Arabisch – PC"
 * in German), not Apple's own "Arabic" layout. Used to look up which physical key + finger produces a
 * given Arabic character, for the on-screen keyboard and finger hints, and
 * to translate physical keydowns into Arabic characters directly (see
 * CODE_TO_ARABIC / CODE_TO_ARABIC_SHIFT) — the learner never needs an
 * Arabic input source active in the OS.
 *
 * Shift-layer mapping (hamza/alif forms, ligatures, diacritics, digits,
 * punctuation) per the standard Arabic 101 layout, verified against the
 * macOS "Arabic – PC" Accessibility Keyboard.
 */
export const NUMBER_ROW: KeyDef[] = [
  { code: "Backquote", arabic: "ذ", shiftArabic: "ّ", finger: "l-pinky", row: -1 },
  { code: "Digit1", arabic: "١", shiftArabic: "!", finger: "l-pinky", row: -1 },
  { code: "Digit2", arabic: "٢", shiftArabic: "@", finger: "l-ring", row: -1 },
  { code: "Digit3", arabic: "٣", shiftArabic: "#", finger: "l-middle", row: -1 },
  { code: "Digit4", arabic: "٤", shiftArabic: "$", finger: "l-index", row: -1 },
  { code: "Digit5", arabic: "٥", shiftArabic: "%", finger: "l-index", row: -1 },
  { code: "Digit6", arabic: "٦", shiftArabic: "^", finger: "r-index", row: -1 },
  { code: "Digit7", arabic: "٧", shiftArabic: "&", finger: "r-index", row: -1 },
  { code: "Digit8", arabic: "٨", shiftArabic: "*", finger: "r-middle", row: -1 },
  { code: "Digit9", arabic: "٩", shiftArabic: ")", finger: "r-ring", row: -1 },
  { code: "Digit0", arabic: "٠", shiftArabic: "(", finger: "r-pinky", row: -1 },
  { code: "Minus", arabic: "-", shiftArabic: "_", finger: "r-pinky", row: -1 },
  { code: "Equal", arabic: "=", shiftArabic: "+", finger: "r-pinky", row: -1 },
];

export const TOP_ROW: KeyDef[] = [
  { code: "KeyQ", arabic: "ض", shiftArabic: "َ", finger: "l-pinky", row: 0 },
  { code: "KeyW", arabic: "ص", shiftArabic: "ً", finger: "l-ring", row: 0 },
  { code: "KeyE", arabic: "ث", shiftArabic: "ُ", finger: "l-middle", row: 0 },
  { code: "KeyR", arabic: "ق", shiftArabic: "ٌ", finger: "l-index", row: 0 },
  { code: "KeyT", arabic: "ف", shiftArabic: "لإ", finger: "l-index", row: 0 },
  { code: "KeyY", arabic: "غ", shiftArabic: "إ", finger: "r-index", row: 0 },
  { code: "KeyU", arabic: "ع", shiftArabic: "‘", finger: "r-index", row: 0 },
  { code: "KeyI", arabic: "ه", shiftArabic: "÷", finger: "r-middle", row: 0 },
  { code: "KeyO", arabic: "خ", shiftArabic: "×", finger: "r-ring", row: 0 },
  { code: "KeyP", arabic: "ح", shiftArabic: "؛", finger: "r-pinky", row: 0 },
  { code: "BracketLeft", arabic: "ج", shiftArabic: "<", finger: "r-pinky", row: 0 },
  { code: "BracketRight", arabic: "د", shiftArabic: ">", finger: "r-pinky", row: 0 },
];

export const HOME_ROW: KeyDef[] = [
  { code: "KeyA", arabic: "ش", shiftArabic: "ِ", finger: "l-pinky", row: 1 },
  { code: "KeyS", arabic: "س", shiftArabic: "ٍ", finger: "l-ring", row: 1 },
  { code: "KeyD", arabic: "ي", shiftArabic: "]", finger: "l-middle", row: 1 },
  { code: "KeyF", arabic: "ب", shiftArabic: "[", finger: "l-index", row: 1 },
  { code: "KeyG", arabic: "ل", shiftArabic: "لأ", finger: "l-index", row: 1 },
  { code: "KeyH", arabic: "ا", shiftArabic: "أ", finger: "r-index", row: 1 },
  { code: "KeyJ", arabic: "ت", shiftArabic: "ـ", finger: "r-index", row: 1 },
  { code: "KeyK", arabic: "ن", shiftArabic: "،", finger: "r-middle", row: 1 },
  { code: "KeyL", arabic: "م", shiftArabic: "/", finger: "r-ring", row: 1 },
  { code: "Semicolon", arabic: "ك", shiftArabic: ":", finger: "r-pinky", row: 1 },
  { code: "Quote", arabic: "ط", shiftArabic: "\"", finger: "r-pinky", row: 1 },
  // Sits next to Enter on ISO keyboards (as here), above it on ANSI.
  { code: "Backslash", arabic: "\\", shiftArabic: "|", finger: "r-pinky", row: 1 },
];

export const BOTTOM_ROW: KeyDef[] = [
  { code: "KeyZ", arabic: "ئ", shiftArabic: "~", finger: "l-pinky", row: 2 },
  { code: "KeyX", arabic: "ء", shiftArabic: "ْ", finger: "l-ring", row: 2 },
  { code: "KeyC", arabic: "ؤ", shiftArabic: "}", finger: "l-middle", row: 2 },
  { code: "KeyV", arabic: "ر", shiftArabic: "{", finger: "l-index", row: 2 },
  { code: "KeyB", arabic: "لا", shiftArabic: "لآ", finger: "l-index", row: 2 },
  { code: "KeyN", arabic: "ى", shiftArabic: "آ", finger: "r-index", row: 2 },
  { code: "KeyM", arabic: "ة", shiftArabic: "'", finger: "r-index", row: 2 },
  { code: "Comma", arabic: "و", shiftArabic: ",", finger: "r-middle", row: 2 },
  { code: "Period", arabic: "ز", shiftArabic: ".", finger: "r-ring", row: 2 },
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

const CODE_TO_ARABIC: Record<string, string> = {
  ...Object.fromEntries(ALL_KEYS.filter((k) => k.arabic).map((k) => [k.code, k.arabic])),
  // Extra ISO key left of Z; not shown on the on-screen keyboard.
  IntlBackslash: ",",
};

const CODE_TO_ARABIC_SHIFT: Record<string, string> = {
  ...Object.fromEntries(ALL_KEYS.filter((k) => k.shiftArabic).map((k) => [k.code, k.shiftArabic!])),
  IntlBackslash: "'",
};

const IS_MAC = /Mac/.test(navigator.userAgent);
const MAC_ISO_STORAGE_KEY = "macIsoKeyboard";

/**
 * Browsers on macOS swap the codes of the two ISO-specific keys: the key below
 * Esc reports "IntlBackslash" and the key left of Z reports "Backquote" (macOS
 * itself types correctly). An ANSI keyboard never sends "IntlBackslash", so
 * seeing it once proves an ISO keyboard; from then on (persisted) the codes
 * are swapped back. Until then, "Backquote" is assumed to be the key below Esc.
 */
let macIsoDetected = readMacIsoFlag();

function readMacIsoFlag(): boolean {
  try {
    return localStorage.getItem(MAC_ISO_STORAGE_KEY) === "true";
  } catch {
    return false;
  }
}

function markMacIso() {
  if (macIsoDetected) return;
  macIsoDetected = true;
  try {
    localStorage.setItem(MAC_ISO_STORAGE_KEY, "true");
  } catch {
    // Detection still holds for this session.
  }
}

function toPhysicalCode(code: string): string {
  if (!IS_MAC) return code;
  if (code === "IntlBackslash") {
    markMacIso();
    return "Backquote";
  }
  if (code === "Backquote" && macIsoDetected) return "IntlBackslash";
  return code;
}

/** Translates a physical keydown into the Arabic character(s) it produces. */
export function translateKeydown(code: string, shift: boolean): string | undefined {
  const physical = toPhysicalCode(code);
  return shift ? CODE_TO_ARABIC_SHIFT[physical] : CODE_TO_ARABIC[physical];
}

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
