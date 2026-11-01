export type WordPosition = "initial" | "medial" | "final";

export interface CharRule {
  /** Positions within a word where the character may appear; unrestricted if omitted. */
  positions?: WordPosition[];
  /** false = never carries a haraka/tanween (excluded as base for diacritic marks). */
  takesMarks?: boolean;
  /** Diacritic mark that attaches to the preceding letter. */
  combining?: boolean;
  /** Short note shown in lessons that introduce or drill the character. */
  hint?: string;
}

const NOT_INITIAL: WordPosition[] = ["medial", "final"];

/**
 * Orthographic constraints of Arabic script, used by the drill generator so
 * pseudo-words stay plausible (e.g. ى never mid-word). For diacritic marks,
 * `positions` refers to the letter carrying the mark.
 */
export const CHAR_RULES: Record<string, CharRule> = {
  "ى": {
    positions: ["final"],
    takesMarks: false,
    hint: "ى (Alif Maqsura) steht nur am Wortende, z. B. على، إلى.",
  },
  "ة": {
    positions: ["final"],
    hint: "ة (Taa Marbuta) steht nur am Wortende, z. B. مدرسة.",
  },
  "ء": {
    positions: NOT_INITIAL,
    hint: "ء steht nie am Wortanfang — dort sitzt Hamza immer auf Alif (أ/إ).",
  },
  "ئ": {
    positions: NOT_INITIAL,
    hint: "ئ steht nie am Wortanfang — dort sitzt Hamza immer auf Alif (أ/إ).",
  },
  "ؤ": {
    positions: NOT_INITIAL,
    hint: "ؤ steht nie am Wortanfang — dort sitzt Hamza immer auf Alif (أ/إ).",
  },
  "إ": {
    positions: ["initial"],
    hint: "إ steht praktisch nur am Wortanfang, z. B. إلى، إسلام.",
  },
  "لإ": {
    positions: ["initial"],
    hint: "لإ steht praktisch nur am Wortanfang (Präfix لِ + إ), z. B. لإسلام.",
  },
  "ـ": {
    positions: ["medial"],
    takesMarks: false,
    hint: "ـ (Tatweel) dehnt die Verbindung zwischen zwei Buchstaben — nur mitten im Wort.",
  },
  "ا": { takesMarks: false },
  "آ": { takesMarks: false },
  "لا": { takesMarks: false },
  "لآ": { takesMarks: false },

  "،": { positions: ["final"], hint: "Satzzeichen hängen direkt am Wortende, z. B. بيت،" },
  "؛": { positions: ["final"], hint: "Satzzeichen hängen direkt am Wortende, z. B. بيت؛" },
  "؟": { positions: ["final"], hint: "Satzzeichen hängen direkt am Wortende, z. B. بيت؟" },

  "َ": { combining: true },
  "ِ": { combining: true },
  "ُ": { combining: true },
  "ْ": {
    combining: true,
    positions: NOT_INITIAL,
    hint: "Sukun steht nie auf dem ersten Buchstaben — kein Wort beginnt vokallos.",
  },
  "ّ": {
    combining: true,
    positions: NOT_INITIAL,
    hint: "Shadda steht nie auf dem ersten Buchstaben eines Wortes.",
  },
  "ً": {
    combining: true,
    positions: ["final"],
    hint: "Tanween steht nur auf dem letzten Buchstaben eines Wortes.",
  },
  "ٌ": {
    combining: true,
    positions: ["final"],
    hint: "Tanween steht nur auf dem letzten Buchstaben eines Wortes.",
  },
  "ٍ": {
    combining: true,
    positions: ["final"],
    hint: "Tanween steht nur auf dem letzten Buchstaben eines Wortes.",
  },
};

export function isAllowedAt(char: string, position: WordPosition): boolean {
  const positions = CHAR_RULES[char]?.positions;
  return !positions || positions.includes(position);
}

export function takesMarks(char: string): boolean {
  return CHAR_RULES[char]?.takesMarks !== false;
}

export function isCombining(char: string): boolean {
  return CHAR_RULES[char]?.combining === true;
}

/** Distinct hints for the given characters, in order. */
export function hintsFor(chars: string[]): string[] {
  const hints = chars.map((c) => CHAR_RULES[c]?.hint).filter((h): h is string => !!h);
  return [...new Set(hints)];
}
