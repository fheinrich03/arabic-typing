import type { GeneratorConfig, Lesson } from "../types";
import { VOWELED_WORDS, WORD_LIST } from "../data/wordList";
import { PSEUDO_WORDS } from "../data/pseudoWords";
import { isCombining } from "../data/charRules";

/** Below this many typeable real words, drills use TypingClub-style patterns instead. */
const MIN_WORDS_FOR_WORD_DRILLS = 20;
/** Real words containing a focus letter needed before no pseudo-words are mixed in. */
const FULL_REAL_WORD_POOL = 10;
/** Share of tokens that target a focus character; the rest review everything known. */
const FOCUS_SHARE = 0.7;
/** In pattern drills, share of tokens that are one of the few real words available. */
const REAL_WORD_SHARE_IN_PATTERNS = 0.3;

const LIGATURES = ["لآ", "لأ", "لإ", "لا"];
const DIGITS = "٠١٢٣٤٥٦٧٨٩";
const PUNCTUATION = "،؛؟";
const TATWEEL = "ـ";
/** Letters that never join the following letter, so no tatweel can follow them. */
const NON_JOINING = "اأإآدذرزوؤةىء";

interface Candidate {
  text: string;
  weight: number;
}

/** Splits text into keystroke units — lam-alif ligatures are a single key. */
function keystrokeUnits(text: string): string[] {
  const units: string[] = [];
  let i = 0;
  while (i < text.length) {
    const unit = LIGATURES.find((l) => text.startsWith(l, i)) ?? text[i];
    units.push(unit);
    i += unit.length;
  }
  return units;
}

/** Frequency weight from a most-common-first list position (Zipf-like falloff). */
function rankWeight(index: number): number {
  return 1 / Math.sqrt(index + 10);
}

const REAL_WORDS = WORD_LIST.map(([word], index) => ({
  word,
  units: keystrokeUnits(word),
  weight: rankWeight(index),
}));

const VOWELED = VOWELED_WORDS.map((word, index) => ({
  word,
  bareUnits: keystrokeUnits([...word].filter((c) => !isCombining(c)).join("")),
  weight: rankWeight(index),
}));

function pickWeighted<T>(items: T[], weightOf: (item: T) => number): T {
  const total = items.reduce((sum, item) => sum + weightOf(item), 0);
  let roll = Math.random() * total;
  for (const item of items) {
    roll -= weightOf(item);
    if (roll <= 0) return item;
  }
  return items[items.length - 1];
}

function pickRandom<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

function pickText(candidates: Candidate[]): string {
  return pickWeighted(candidates, (c) => c.weight).text;
}

/** Everything the drill can draw from, precomputed once per generated text. */
interface DrillContext {
  known: Set<string>;
  /** Base letters in the order they were learned. */
  baseLetters: string[];
  marks: string[];
  digits: string[];
  punctuation: string[];
  words: (Candidate & { units: string[] })[];
  /** Voweled words showing only the known marks, each with at least one. */
  voweled: Candidate[];
}

function buildContext(letters: string[]): DrillContext {
  const known = new Set(letters);
  const marks = letters.filter(isCombining);
  const knownMarks = new Set(marks);
  const voweled = VOWELED.filter((v) => v.bareUnits.every((u) => known.has(u)))
    .map((v) => ({
      text: [...v.word].filter((c) => !isCombining(c) || knownMarks.has(c)).join(""),
      weight: v.weight,
    }))
    .filter((v) => [...v.text].some(isCombining));

  return {
    known,
    baseLetters: letters.filter((l) => !isCombining(l) && !DIGITS.includes(l) && !PUNCTUATION.includes(l)),
    marks,
    digits: letters.filter((l) => DIGITS.includes(l)),
    punctuation: letters.filter((l) => PUNCTUATION.includes(l)),
    words: REAL_WORDS.filter((w) => w.units.every((u) => known.has(u))).map((w) => ({
      text: w.word,
      units: w.units,
      weight: w.weight,
    })),
    voweled,
  };
}

function isPatternPhase(ctx: DrillContext): boolean {
  return ctx.words.length < MIN_WORDS_FOR_WORD_DRILLS;
}

/** TypingClub-style drill: the letter repeated and alternated with the two most recent others. */
function pattern(letter: string, ctx: DrillContext): string {
  const others = ctx.baseLetters.filter((l) => l !== letter).slice(-2);
  if (others.length === 0) return letter.repeat(2 + Math.floor(Math.random() * 3));
  const o = pickRandom(others);
  const a = letter;
  return pickRandom([a + a + a, a + o + a, o + a + o, a + a + o, o + a + a, a + o + a + o]);
}

function realWord(ctx: DrillContext): string | undefined {
  return ctx.words.length > 0 ? pickText(ctx.words) : undefined;
}

/** Real words containing the letter; pseudo-words fill in while too few exist. */
function letterToken(letter: string, ctx: DrillContext): string {
  if (isPatternPhase(ctx)) {
    const words = ctx.words.filter((w) => w.units.includes(letter));
    return words.length > 0 && Math.random() < REAL_WORD_SHARE_IN_PATTERNS ? pickText(words) : pattern(letter, ctx);
  }
  const real = ctx.words.filter((w) => w.units.includes(letter));
  const pseudo = (PSEUDO_WORDS[letter] ?? []).filter((w) => keystrokeUnits(w).every((u) => ctx.known.has(u)));
  const realShare = pseudo.length === 0 ? 1 : Math.min(1, real.length / FULL_REAL_WORD_POOL);
  if (real.length > 0 && Math.random() < realShare) return pickText(real);
  return pseudo.length > 0 ? pickRandom(pseudo) : pattern(letter, ctx);
}

function voweledToken(ctx: DrillContext, mark?: string): string | undefined {
  const candidates = mark ? ctx.voweled.filter((v) => v.text.includes(mark)) : ctx.voweled;
  return candidates.length > 0 ? pickText(candidates) : undefined;
}

/** A 1-4 digit number from the known digits, containing `digit` if given. */
function numberToken(ctx: DrillContext, digit?: string): string {
  const length = 1 + Math.floor(Math.random() * 4);
  const digits = Array.from({ length }, () => pickRandom(ctx.digits));
  if (digit) digits[Math.floor(Math.random() * length)] = digit;
  // A leading zero only reads naturally as the number zero itself.
  if (digits.length > 1 && digits[0] === "٠") digits.reverse();
  return digits.join("");
}

/** Stretches a word with a tatweel after a letter that joins the next one. */
function tatweelToken(ctx: DrillContext): string | undefined {
  const words = ctx.words.filter((w) => w.text.length >= 3 && !NON_JOINING.includes(w.text[0]));
  if (words.length === 0) return undefined;
  const word = pickText(words);
  return word[0] + TATWEEL + word.slice(1);
}

function focusToken(char: string, ctx: DrillContext): string | undefined {
  if (isCombining(char)) return voweledToken(ctx, char);
  if (DIGITS.includes(char)) return numberToken(ctx, char);
  if (PUNCTUATION.includes(char)) return (realWord(ctx) ?? pattern(ctx.baseLetters[0], ctx)) + char;
  if (char === TATWEEL) return tatweelToken(ctx);
  return letterToken(char, ctx);
}

/** A token reviewing everything known: mostly common words, plus marks, numbers and punctuation once learned. */
function reviewToken(ctx: DrillContext): string {
  if (isPatternPhase(ctx)) {
    const word = Math.random() < REAL_WORD_SHARE_IN_PATTERNS ? realWord(ctx) : undefined;
    return word ?? pattern(pickRandom(ctx.baseLetters), ctx);
  }
  const roll = Math.random();
  if (ctx.marks.length > 0 && roll < 0.3) return voweledToken(ctx) ?? pickText(ctx.words);
  if (ctx.digits.length > 0 && roll < 0.45) return numberToken(ctx);
  if (ctx.punctuation.length > 0 && roll < 0.55) return pickText(ctx.words) + pickRandom(ctx.punctuation);
  return pickText(ctx.words);
}

/**
 * Generates drill text of roughly `length` characters. Characters weighted
 * above 1 in `repeatWeight` are the drill's focus: most tokens contain one of
 * them, the rest review everything in `letters`. Tokens are real words from
 * the frequency list where possible, pseudo-words while too few real words
 * contain a new letter, and repetition patterns at the very start of the course.
 */
export function generateDrillText(config: GeneratorConfig): string {
  const { letters, length, repeatWeight = {} } = config;
  const ctx = buildContext(letters);
  if (ctx.baseLetters.length === 0) return "";

  const focus = letters.filter((l) => (repeatWeight[l] ?? 1) > 1);
  const nextToken = () => {
    const target = focus.length > 0 && Math.random() < FOCUS_SHARE ? pickWeighted(focus, (c) => repeatWeight[c]) : undefined;
    return (target && focusToken(target, ctx)) || reviewToken(ctx);
  };

  const tokens: string[] = [];
  let charCount = 0;
  while (charCount < length) {
    let token = nextToken();
    // Avoid the same token twice in a row, unless the pool leaves no choice.
    for (let retry = 0; retry < 5 && token === tokens[tokens.length - 1]; retry++) token = nextToken();
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
