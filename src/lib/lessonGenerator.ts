import type { GeneratorConfig, Lesson } from "../types";
import { WORDS } from "../data/words";

function pickWeighted(letters: string[], weights: Record<string, number>): string {
  const total = letters.reduce((sum, l) => sum + (weights[l] ?? 1), 0);
  let roll = Math.random() * total;
  for (const letter of letters) {
    roll -= weights[letter] ?? 1;
    if (roll <= 0) return letter;
  }
  return letters[letters.length - 1];
}

function usesOnlyLetters(word: string, letters: Set<string>): boolean {
  return [...word].every((ch) => letters.has(ch));
}

/** Generates a pseudo-word of 2-4 letters from the allowed letter set. */
function generatePseudoWord(letters: string[], weights: Record<string, number>): string {
  const length = 2 + Math.floor(Math.random() * 3);
  let word = "";
  for (let i = 0; i < length; i++) {
    word += pickWeighted(letters, weights);
  }
  return word;
}

/** Generates a pseudo-word of 2-3 (base letter + diacritic mark) pairs. */
function generatePseudoPairWord(
  pairBase: string[],
  marks: string[],
  weights: Record<string, number>,
): string {
  const pairs = 2 + Math.floor(Math.random() * 2);
  let word = "";
  for (let i = 0; i < pairs; i++) {
    const base = pairBase[Math.floor(Math.random() * pairBase.length)];
    const mark = pickWeighted(marks, weights);
    word += base + mark;
  }
  return word;
}

/**
 * Generates drill text of roughly `length` characters from a config.
 * In word mode, draws real words limited to the allowed letters (falls
 * back to pseudo-words if too few matching words exist).
 */
export function generateDrillText(config: GeneratorConfig): string {
  const { letters, length, wordMode = false, repeatWeight = {}, pairBase } = config;
  if (letters.length === 0) return "";

  const letterSet = new Set(letters);
  const candidateWords = wordMode
    ? WORDS.filter((w) => usesOnlyLetters(w, letterSet))
    : [];

  const tokens: string[] = [];
  let charCount = 0;
  while (charCount < length) {
    const token =
      candidateWords.length > 0
        ? candidateWords[Math.floor(Math.random() * candidateWords.length)]
        : pairBase
          ? generatePseudoPairWord(pairBase, letters, repeatWeight)
          : generatePseudoWord(letters, repeatWeight);
    tokens.push(token);
    charCount += token.length;
  }
  return tokens.join(" ");
}

/** Fixed text for words/sentences lessons, freshly generated drill text otherwise. */
export function resolveLessonText(lesson: Lesson): string {
  if (lesson.text) return lesson.text;
  if (lesson.generatorConfig) return generateDrillText(lesson.generatorConfig);
  throw new Error(`Lesson ${lesson.id} has neither text nor generatorConfig`);
}
