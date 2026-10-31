import type { Chapter, Lesson } from "../types";
import { REAL_TEXTS } from "./words";
import { keyForChar } from "./keyboardLayout";

// ---- helpers -------------------------------------------------------------

let known: string[] = [];
const LESSONS: Lesson[] = [];
const chapterLessonIds: Record<string, string[]> = {};

function push(chapterId: string, lesson: Lesson) {
  LESSONS.push(lesson);
  (chapterLessonIds[chapterId] ??= []).push(lesson.id);
}

function weightsFor(newLetters: string[], oldLetters: string[]): Record<string, number> {
  const weights: Record<string, number> = {};
  for (const l of newLetters) weights[l] = 3;
  for (const l of oldLetters) weights[l] = 1;
  return weights;
}

function handOf(letter: string): "l" | "r" | undefined {
  const key = keyForChar(letter);
  if (!key) return undefined;
  if (key.finger.startsWith("l-")) return "l";
  if (key.finger.startsWith("r-")) return "r";
  return undefined;
}

// Letters introduced so far in the current hand phase — reset via
// resetPhase() at the start of each phase so the drill pool for a new letter
// stays small (this phase's own letters + a couple of others), instead of
// ballooning to every letter ever learned on that hand.
let phaseKnown: string[] = [];
function resetPhase() {
  phaseKnown = [];
}

/**
 * Introduces a single new letter, drilled only against the letters already
 * known in this hand phase (plus a couple of recently-known letters from the
 * other hand for light spaced repetition) — keeps the pool small while a
 * new letter is being learned.
 */
function handLetterLesson(
  chapterId: string,
  id: string,
  title: string,
  letter: string,
  hand: "l" | "r",
  goal: number,
  minutes = "5 min",
) {
  const otherHandSample = known.filter((l) => handOf(l) !== hand).slice(-2);
  const oldLetters = [...phaseKnown, ...otherHandSample];
  push(chapterId, {
    id,
    title,
    chapterId,
    chars: [letter],
    mode: "chars",
    kind: "letter",
    goalAccuracy: goal,
    estimate: minutes,
    generatorConfig: {
      letters: [...oldLetters, letter],
      length: 110,
      repeatWeight: weightsFor([letter], oldLetters),
    },
  });
  known = [...known, letter];
  phaseKnown = [...phaseKnown, letter];
}

/** Drills all newly-introduced letters of one hand together, plus a few already-known letters from the same hand. */
function handConsolidateLesson(
  chapterId: string,
  id: string,
  title: string,
  newLetters: string[],
  hand: "l" | "r",
  goal: number,
  minutes = "5 min",
) {
  const extra = known.filter((l) => handOf(l) === hand && !newLetters.includes(l)).slice(-3);
  push(chapterId, {
    id,
    title,
    chapterId,
    chars: newLetters,
    mode: "chars",
    kind: "consolidate",
    goalAccuracy: goal,
    estimate: minutes,
    generatorConfig: { letters: [...newLetters, ...extra], length: 150, repeatWeight: weightsFor(newLetters, extra) },
  });
}

/** Cumulative review of everything learned so far, across both hands and all rows. */
function reviewLesson(
  chapterId: string,
  id: string,
  title: string,
  goal: number,
  minutes = "7 min",
) {
  push(chapterId, {
    id,
    title,
    chapterId,
    chars: [...known],
    mode: "chars",
    kind: "review",
    goalAccuracy: goal,
    estimate: minutes,
    generatorConfig: { letters: [...known], length: 220 },
  });
}

const GAME_NAMES: Record<number, string> = {};
for (let i = 1; i <= 6; i++) GAME_NAMES[i] = "Letter Leap";
for (let i = 7; i <= 12; i++) GAME_NAMES[i] = "Word Leap";
for (let i = 13; i <= 15; i++) GAME_NAMES[i] = "Number Leap";

/** Optional side quest: reviews everything learned up to `upToLabel`. */
function sideQuest(chapterId: string, gameNum: number, upToLabel: string) {
  const id = `w${String(gameNum).padStart(2, "0")}`;
  push(chapterId, {
    id,
    title: `Review Game ${gameNum} · ${GAME_NAMES[gameNum]}`,
    chapterId,
    chars: [...known],
    mode: "chars",
    kind: "review",
    isSideQuest: true,
    description: `Reviews E00–${upToLabel}`,
    estimate: "3 min",
    generatorConfig: { letters: [...known], length: 100 },
  });
}

// ---- Unit 0: Getting Started ----------------------------------------------

push("unit0", {
  id: "intro",
  title: "Intro",
  chapterId: "unit0",
  chars: [],
  mode: "chars",
  kind: "intro",
  estimate: "~2 min",
  description: "Quick setup & hand-placement basics",
  generatorConfig: { letters: ["ت", "ن"], length: 20 },
});

// ---- Unit 1: Home Row Foundation ------------------------------------------
// Right hand's six letters first (one lesson each), consolidated, then
// reviewed against everything known so far — then the same for the left hand.

resetPhase();
handLetterLesson("unit1", "e00", "Home Row — Taa (ت)", "ت", "r", 85);
handLetterLesson("unit1", "e01", "Home Row — Noon (ن)", "ن", "r", 88);
handLetterLesson("unit1", "e02", "Home Row — Meem (م)", "م", "r", 88);
handLetterLesson("unit1", "e03", "Home Row — Kaaf (ك)", "ك", "r", 90);
handLetterLesson("unit1", "e04", "Home Row — Alif (ا)", "ا", "r", 90);
handLetterLesson("unit1", "e05", "Home Row — Taa (ط)", "ط", "r", 90);
handConsolidateLesson("unit1", "e06", "Consolidate — Rechte Hand (ت ن م ك ا ط)", ["ت", "ن", "م", "ك", "ا", "ط"], "r", 90);
reviewLesson("unit1", "e07", "Review — Nach rechter Hand", 90, "6 min");
sideQuest("unit1", 1, "E07");

resetPhase();
handLetterLesson("unit1", "e08", "Home Row — Baa (ب)", "ب", "l", 90);
handLetterLesson("unit1", "e09", "Home Row — Lam (ل)", "ل", "l", 90);
handLetterLesson("unit1", "e10", "Home Row — Yaa (ي)", "ي", "l", 90);
handLetterLesson("unit1", "e11", "Home Row — Seen (س)", "س", "l", 90);
handLetterLesson("unit1", "e12", "Home Row — Sheen (ش)", "ش", "l", 90);
handConsolidateLesson("unit1", "e13", "Consolidate — Linke Hand (ب ل ي س ش)", ["ب", "ل", "ي", "س", "ش"], "l", 90);
reviewLesson("unit1", "e14", "Unit 1 Review — Home Row (11 Letters)", 90, "7 min");
sideQuest("unit1", 2, "E14");

// ---- Unit 2: Top Row Extension ---------------------------------------------

resetPhase();
handLetterLesson("unit2", "e15", "Top Row — Ain (ع)", "ع", "r", 92);
handLetterLesson("unit2", "e16", "Top Row — Ghain (غ)", "غ", "r", 92);
handLetterLesson("unit2", "e17", "Top Row — Haa (ه)", "ه", "r", 92);
handLetterLesson("unit2", "e18", "Top Row — Khaa (خ)", "خ", "r", 92);
handLetterLesson("unit2", "e19", "Top Row — Haa (ح)", "ح", "r", 92);
handLetterLesson("unit2", "e20", "Top Row — Jeem (ج)", "ج", "r", 92);
handLetterLesson("unit2", "e21", "Top Row — Daal (د)", "د", "r", 92);
handConsolidateLesson(
  "unit2",
  "e22",
  "Consolidate — Rechte Hand (ع غ ه خ ح ج د)",
  ["ع", "غ", "ه", "خ", "ح", "ج", "د"],
  "r",
  92,
);
reviewLesson("unit2", "e23", "Review — Nach rechter Hand (Top Row)", 92, "6 min");
sideQuest("unit2", 3, "E23");

resetPhase();
handLetterLesson("unit2", "e24", "Top Row — Faa (ف)", "ف", "l", 92);
handLetterLesson("unit2", "e25", "Top Row — Qaaf (ق)", "ق", "l", 92);
handLetterLesson("unit2", "e26", "Top Row — Thaa (ث)", "ث", "l", 92);
handLetterLesson("unit2", "e27", "Top Row — Saad (ص)", "ص", "l", 92);
handLetterLesson("unit2", "e28", "Top Row — Daad (ض)", "ض", "l", 92);
handConsolidateLesson("unit2", "e29", "Consolidate — Linke Hand (ف ق ث ص ض)", ["ف", "ق", "ث", "ص", "ض"], "l", 92);
reviewLesson("unit2", "e30", "Unit 2 Review — Cumulative", 92, "7 min");
sideQuest("unit2", 4, "E30");

// ---- Unit 3: Bottom Row -----------------------------------------------------
// ذ sits on the number row (Backquote), but it's the last unshifted letter
// left for the left pinky, so it closes out the left-hand phase here.

resetPhase();
handLetterLesson("unit3", "e31", "Bottom Row — Alif Maqsura (ى)", "ى", "r", 92);
handLetterLesson("unit3", "e32", "Bottom Row — Taa Marbuta (ة)", "ة", "r", 92);
handLetterLesson("unit3", "e33", "Bottom Row — Waaw (و)", "و", "r", 92);
handLetterLesson("unit3", "e34", "Bottom Row — Zaay (ز)", "ز", "r", 92);
handLetterLesson("unit3", "e35", "Bottom Row — Dhaa (ظ)", "ظ", "r", 92);
handConsolidateLesson("unit3", "e36", "Consolidate — Rechte Hand (ى ة و ز ظ)", ["ى", "ة", "و", "ز", "ظ"], "r", 92);
reviewLesson("unit3", "e37", "Review — Nach rechter Hand (Bottom Row)", 92, "6 min");
sideQuest("unit3", 5, "E37");

resetPhase();
handLetterLesson("unit3", "e38", "Bottom Row — Raa (ر)", "ر", "l", 92);
handLetterLesson("unit3", "e39", "Bottom Row — Lam-Alif (لا)", "لا", "l", 92);
handLetterLesson("unit3", "e40", "Bottom Row — Hamza on Waaw (ؤ)", "ؤ", "l", 92);
handLetterLesson("unit3", "e41", "Bottom Row — Hamza (ء)", "ء", "l", 92);
handLetterLesson("unit3", "e42", "Bottom Row — Hamza on Yaa (ئ)", "ئ", "l", 92);
handLetterLesson("unit3", "e43", "Number Row — Dhal (ذ)", "ذ", "l", 92);
handConsolidateLesson(
  "unit3",
  "e44",
  "Consolidate — Linke Hand (ر لا ؤ ء ئ ذ)",
  ["ر", "لا", "ؤ", "ء", "ئ", "ذ"],
  "l",
  92,
);
reviewLesson("unit3", "e45", "Unit 3 Review — Bottom Row", 92, "7 min");
sideQuest("unit3", 6, "E45");

// ---- Unit 4: Shift Layer -----------------------------------------------------

resetPhase();
handLetterLesson("unit4", "e46", "Shift Layer — Hamza on Alif (أ)", "أ", "r", 92);
handLetterLesson("unit4", "e47", "Shift Layer — Hamza under Alif (إ)", "إ", "r", 92);
handLetterLesson("unit4", "e48", "Shift Layer — Alif Madda (آ)", "آ", "r", 92);
// Tatweel (ـ) has no dedicated lesson — it's a stroke elongation mark, not a
// letter — but joins the pool once the right-hand shift-layer set is complete.
known = [...known, "ـ"];
handConsolidateLesson("unit4", "e49", "Consolidate — Rechte Hand (أ إ آ ـ)", ["أ", "إ", "آ", "ـ"], "r", 92);
reviewLesson("unit4", "e50", "Review — Nach rechter Hand (Shift Layer)", 92, "6 min");
sideQuest("unit4", 7, "E50");

resetPhase();
handLetterLesson("unit4", "e51", "Shift Layer — Lam + Hamza on Alif (لأ)", "لأ", "l", 92);
handLetterLesson("unit4", "e52", "Shift Layer — Lam + Hamza under Alif (لإ)", "لإ", "l", 92);
handLetterLesson("unit4", "e53", "Shift Layer — Lam + Alif Madda (لآ)", "لآ", "l", 92);
handConsolidateLesson("unit4", "e54", "Consolidate — Linke Hand (لأ لإ لآ)", ["لأ", "لإ", "لآ"], "l", 92);
reviewLesson("unit4", "e55", "Unit 4 Review — Shift Layer", 92, "7 min");
sideQuest("unit4", 8, "E55");

// ---- Unit 5: Diacritics ------------------------------------------------------
// Harakat/tanween are combining marks typed after a base letter — drilled as
// (base letter + mark) pairs rather than freestanding characters. All of them
// sit on the left hand already, so there's no hand split here.

const baseLettersForDiacritics = [...known];

function diacriticLesson(
  id: string,
  title: string,
  mark: string,
  goal: number,
  minutes = "5 min",
) {
  const priorMarks = known.filter((c) => !baseLettersForDiacritics.includes(c));
  const cumulative = [...known, mark];
  push("unit5", {
    id,
    title,
    chapterId: "unit5",
    chars: [mark],
    mode: "chars",
    kind: "letter",
    goalAccuracy: goal,
    estimate: minutes,
    generatorConfig: {
      letters: [...priorMarks, mark],
      pairBase: baseLettersForDiacritics,
      length: 130,
      repeatWeight: weightsFor([mark], priorMarks),
    },
  });
  known = cumulative;
}

function diacriticConsolidate(
  id: string,
  title: string,
  marks: string[],
  goal: number,
  minutes = "5 min",
) {
  push("unit5", {
    id,
    title,
    chapterId: "unit5",
    chars: marks,
    mode: "chars",
    kind: "consolidate",
    goalAccuracy: goal,
    estimate: minutes,
    generatorConfig: { letters: marks, pairBase: baseLettersForDiacritics, length: 160 },
  });
}

diacriticLesson("e56", "Harakat — Fatha (Short a)", "َ", 92);
diacriticLesson("e57", "Harakat — Kasra (Short i)", "ِ", 92);
diacriticLesson("e58", "Harakat — Damma (Short u)", "ُ", 92);
diacriticConsolidate("e59", "Consolidate — Short Vowels", ["َ", "ِ", "ُ"], 92, "6 min");
sideQuest("unit5", 9, "E59");
diacriticLesson("e60", "Sukoon — Silent Marker", "ْ", 92);
diacriticLesson("e61", "Shadda — Doubling Marker", "ّ", 92);
diacriticConsolidate("e62", "Consolidate — Sukoon & Shadda", ["ْ", "ّ"], 92, "6 min");
sideQuest("unit5", 10, "E62");
diacriticLesson("e63", "Tanween — Fathatan (-an)", "ً", 92);
diacriticLesson("e64", "Tanween — Dammatan (-un)", "ٌ", 92);
diacriticLesson("e65", "Tanween — Kasratan (-in)", "ٍ", 92);
diacriticConsolidate("e66", "Consolidate — Tanween", ["ً", "ٌ", "ٍ"], 92, "6 min");
sideQuest("unit5", 11, "E66");
diacriticConsolidate(
  "e67",
  "Unit 5 Review — All Diacritics",
  ["َ", "ِ", "ُ", "ْ", "ّ", "ً", "ٌ", "ٍ"],
  92,
  "6 min",
);
sideQuest("unit5", 12, "E67");

// ---- Unit 6: Numbers & Punctuation ------------------------------------------
// Digits ١–٥ sit on the left hand, ٦–٠ on the right — same hand-first pattern
// as the letter units. Punctuation is entirely right-hand.

resetPhase();
handLetterLesson("unit6", "e68", "Number Row — Digit ١ (One)", "١", "l", 92);
handLetterLesson("unit6", "e69", "Number Row — Digit ٢ (Two)", "٢", "l", 92);
handLetterLesson("unit6", "e70", "Number Row — Digit ٣ (Three)", "٣", "l", 92);
handLetterLesson("unit6", "e71", "Number Row — Digit ٤ (Four)", "٤", "l", 92);
handLetterLesson("unit6", "e72", "Number Row — Digit ٥ (Five)", "٥", "l", 92);
handConsolidateLesson("unit6", "e73", "Consolidate — Linke Hand (١ ٢ ٣ ٤ ٥)", ["١", "٢", "٣", "٤", "٥"], "l", 92);
reviewLesson("unit6", "e74", "Review — Nach linker Hand (Zahlen)", 92, "6 min");
sideQuest("unit6", 13, "E74");

resetPhase();
handLetterLesson("unit6", "e75", "Number Row — Digit ٦ (Six)", "٦", "r", 92);
handLetterLesson("unit6", "e76", "Number Row — Digit ٧ (Seven)", "٧", "r", 92);
handLetterLesson("unit6", "e77", "Number Row — Digit ٨ (Eight)", "٨", "r", 92);
handLetterLesson("unit6", "e78", "Number Row — Digit ٩ (Nine)", "٩", "r", 92);
handLetterLesson("unit6", "e79", "Number Row — Digit ٠ (Zero)", "٠", "r", 92);
handConsolidateLesson("unit6", "e80", "Consolidate — Rechte Hand (٦ ٧ ٨ ٩ ٠)", ["٦", "٧", "٨", "٩", "٠"], "r", 92);
reviewLesson("unit6", "e81", "Review — Alle Ziffern ٠–٩", 92, "6 min");
sideQuest("unit6", 14, "E81");

resetPhase();
handLetterLesson("unit6", "e82", "Punctuation — Comma (،)", "،", "r", 92);
handLetterLesson("unit6", "e83", "Punctuation — Semicolon (؛)", "؛", "r", 92);
handLetterLesson("unit6", "e84", "Punctuation — Question Mark (؟)", "؟", "r", 92);
handConsolidateLesson("unit6", "e85", "Consolidate — Punctuation", ["،", "؛", "؟"], "r", 92);
reviewLesson("unit6", "e86", "Unit 6 Review — Numbers & Punctuation", 92, "7 min");
sideQuest("unit6", 15, "E86");

// ---- Unit 7: Real-World Texts ------------------------------------------------

function realTextLesson(id: string, title: string, text: string, minutes = "6 min") {
  push("unit7", {
    id,
    title,
    chapterId: "unit7",
    chars: [...known],
    mode: "sentences",
    kind: "real-text",
    goalAccuracy: 92,
    estimate: minutes,
    text,
  });
}

realTextLesson("e87", "Real Text — Greetings", REAL_TEXTS.greetings);
realTextLesson("e88", "Real Text — Daily Life", REAL_TEXTS["daily-life"]);
realTextLesson("e89", "Real Text — Numbers in Context", REAL_TEXTS.numbers);
realTextLesson("e90", "Real Text — Questions", REAL_TEXTS.questions);
realTextLesson("e91", "Real Text — A Short Story", REAL_TEXTS.story);
reviewLesson("unit7", "e92", "Course Complete — Final Review", 92, "6 min");

// ---- exports ----------------------------------------------------------------

export const CHAPTERS: Chapter[] = [
  {
    id: "unit0",
    title: "Unit 0: Getting Started",
    lessonIds: chapterLessonIds.unit0,
  },
  {
    id: "unit1",
    title: "Unit 1: Home Row Foundation",
    description:
      "Right hand's home-row letters first, then the left hand — each side consolidated and reviewed before moving on",
    lessonIds: chapterLessonIds.unit1,
  },
  {
    id: "unit2",
    title: "Unit 2: Top Row Extension",
    description:
      "Reach up to the top row — right hand's new letters first, then the left hand",
    lessonIds: chapterLessonIds.unit2,
  },
  {
    id: "unit3",
    title: "Unit 3: Bottom Row",
    description:
      "Reach down to the bottom row: ى ة و ز ظ on the right hand, ر لا ؤ ء ئ on the left — plus ذ from the number row",
    lessonIds: chapterLessonIds.unit3,
  },
  {
    id: "unit4",
    title: "Unit 4: Shift Layer",
    description:
      "Alif forms أ إ آ (right hand) first, then the lam-alif ligatures لأ لإ لآ (left hand)",
    lessonIds: chapterLessonIds.unit4,
  },
  {
    id: "unit5",
    title: "Unit 5: Diacritics",
    description: "Harakat and tanween — the short vowels and marks (all left hand)",
    lessonIds: chapterLessonIds.unit5,
  },
  {
    id: "unit6",
    title: "Unit 6: Numbers & Punctuation",
    description:
      "Arabic-Indic numerals ٠–٩ — left hand's digits first, then the right — and the marks ، ؛ ؟",
    lessonIds: chapterLessonIds.unit6,
  },
  {
    id: "unit7",
    title: "Unit 7: Real-World Texts",
    description:
      "Full sentences and a short story — putting it all together to complete the course",
    lessonIds: chapterLessonIds.unit7,
  },
];

export { LESSONS };

export const LESSONS_BY_ID: Record<string, Lesson> = Object.fromEntries(
  LESSONS.map((l) => [l.id, l]),
);

/** Every letter/mark/digit/punctuation taught by course end. */
export const ALL_LETTERS = [...known];

/** Base alphabet only (units 1-4, no diacritics/digits/punctuation) — used for free practice. */
export const BASE_LETTERS = [...baseLettersForDiacritics];

/** Up to `count` lessons following `lessonId` in course order (side quests included). */
export function getNextLessons(lessonId: string, count = 3): Lesson[] {
  const index = LESSONS.findIndex((l) => l.id === lessonId);
  if (index === -1) return [];
  return LESSONS.slice(index + 1, index + 1 + count);
}
