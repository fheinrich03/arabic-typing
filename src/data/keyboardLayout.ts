import type { KeyDef } from "../types";

/**
 * Reference layout: macOS "Arabic" keyboard (matches Windows "Arabic (101)"
 * for base letters). Used to look up which physical key + finger produces a
 * given Arabic character, for the on-screen keyboard and finger hints.
 *
 * Keyed by KeyboardEvent.code so the app works no matter which layout the
 * OS actually has active — the trainer assumes the learner has an Arabic
 * input source enabled and compares the resulting typed character, while
 * this table only drives the visual guide.
 */
export const KEY_ROWS: KeyDef[][] = [
  [
    { code: "KeyQ", arabic: "ض", finger: "l-pinky", row: 0 },
    { code: "KeyW", arabic: "ص", finger: "l-ring", row: 0 },
    { code: "KeyE", arabic: "ث", finger: "l-middle", row: 0 },
    { code: "KeyR", arabic: "ق", finger: "l-index", row: 0 },
    { code: "KeyT", arabic: "ف", finger: "l-index", row: 0 },
    { code: "KeyY", arabic: "غ", finger: "r-index", row: 0 },
    { code: "KeyU", arabic: "ع", finger: "r-index", row: 0 },
    { code: "KeyI", arabic: "ه", finger: "r-middle", row: 0 },
    { code: "KeyO", arabic: "خ", finger: "r-ring", row: 0 },
    { code: "KeyP", arabic: "ح", finger: "r-pinky", row: 0 },
    { code: "BracketLeft", arabic: "ج", finger: "r-pinky", row: 0 },
    { code: "BracketRight", arabic: "د", finger: "r-pinky", row: 0 },
  ],
  [
    { code: "KeyA", arabic: "ش", finger: "l-pinky", row: 1 },
    { code: "KeyS", arabic: "س", finger: "l-ring", row: 1 },
    { code: "KeyD", arabic: "ي", finger: "l-middle", row: 1 },
    { code: "KeyF", arabic: "ب", finger: "l-index", row: 1 },
    { code: "KeyG", arabic: "ل", finger: "l-index", row: 1 },
    { code: "KeyH", arabic: "ا", finger: "r-index", row: 1 },
    { code: "KeyJ", arabic: "ت", finger: "r-index", row: 1 },
    { code: "KeyK", arabic: "ن", finger: "r-middle", row: 1 },
    { code: "KeyL", arabic: "م", finger: "r-ring", row: 1 },
    { code: "Semicolon", arabic: "ك", finger: "r-pinky", row: 1 },
    { code: "Quote", arabic: "ط", finger: "r-pinky", row: 1 },
  ],
  [
    { code: "KeyZ", arabic: "ئ", finger: "l-pinky", row: 2 },
    { code: "KeyX", arabic: "ء", finger: "l-ring", row: 2 },
    { code: "KeyC", arabic: "ؤ", finger: "l-middle", row: 2 },
    { code: "KeyV", arabic: "ر", finger: "l-index", row: 2 },
    { code: "KeyB", arabic: "لا", finger: "l-index", row: 2 },
    { code: "KeyN", arabic: "ى", finger: "r-index", row: 2 },
    { code: "KeyM", arabic: "ة", finger: "r-index", row: 2 },
    { code: "Comma", arabic: "و", finger: "r-middle", row: 2 },
    { code: "Period", arabic: "ز", finger: "r-ring", row: 2 },
    { code: "Slash", arabic: "ظ", finger: "r-pinky", row: 2 },
  ],
  [{ code: "Space", arabic: " ", finger: "thumb", row: 3, width: 6 }],
];

export const ALL_KEYS: KeyDef[] = KEY_ROWS.flat();

export const CHAR_TO_KEY: Record<string, KeyDef> = Object.fromEntries(
  ALL_KEYS.map((k) => [k.arabic, k]),
);

export function keyForChar(char: string): KeyDef | undefined {
  return CHAR_TO_KEY[char];
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
  ["ب", "ت"], // F J
  ["ي", "ن"], // D K
  ["س", "م"], // S L
  ["ش", "ك"], // A ;
  ["ل", "ا"], // G H
];

export const TOP_ROW_GROUPS: string[][] = [
  ["ف", "ع"], // T U
  ["ث", "ه"], // E I
  ["ص", "خ"], // W O
  ["ض", "ح"], // Q P
  ["ق", "غ"], // R Y
  ["ج", "د"], // [ ]
];

export const BOTTOM_ROW_GROUPS: string[][] = [
  ["ر", "و"], // V ,
  ["لا", "ز"], // B .
  ["ئ", "ى"], // Z N
  ["ء", "ة"], // X M
  ["ؤ", "ظ"], // C /
];
