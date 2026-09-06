import type { Chapter, Lesson } from "../types";
import { REAL_TEXTS } from "./words";

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

/** Introduces a single new letter/character, drilled against everything known so far. */
function letterLesson(
  chapterId: string,
  id: string,
  title: string,
  letter: string,
  goal: number,
  minutes = "5 min",
) {
  const cumulative = [...known, letter];
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
      letters: cumulative,
      length: 110,
      repeatWeight: weightsFor([letter], known),
    },
  });
  known = cumulative;
}

/** Drills exactly the given letters against each other (no unrelated review noise). */
function consolidateLesson(
  chapterId: string,
  id: string,
  title: string,
  letters: string[],
  goal: number,
  minutes = "5 min",
) {
  push(chapterId, {
    id,
    title,
    chapterId,
    chars: letters,
    mode: "chars",
    kind: "consolidate",
    goalAccuracy: goal,
    estimate: minutes,
    generatorConfig: { letters, length: 150 },
  });
}

/** Cumulative review of everything learned so far. */
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
for (let i = 1; i <= 11; i++) GAME_NAMES[i] = "Letter Leap";
for (let i = 12; i <= 24; i++) GAME_NAMES[i] = "Word Leap";
for (let i = 25; i <= 30; i++) GAME_NAMES[i] = "Number Leap";

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

letterLesson("unit1", "e00", "Home Row — Taa (ت)", "ت", 85);
letterLesson("unit1", "e01", "Home Row — Noon (ن)", "ن", 88);
letterLesson("unit1", "e02", "Home Row — Meem (م)", "م", 88);
consolidateLesson("unit1", "e03", "Consolidate — ت ن م", ["ت", "ن", "م"], 90);
sideQuest("unit1", 1, "E03");
letterLesson("unit1", "e04", "Home Row — Kaaf (ك)", "ك", 90);
letterLesson("unit1", "e05", "Home Row — Alif (ا)", "ا", 90);
consolidateLesson(
  "unit1",
  "e06",
  "Consolidate — Right hand + Alif",
  ["ك", "ا", "م", "ن", "ت"],
  90,
);
sideQuest("unit1", 2, "E06");
letterLesson("unit1", "e07", "Home Row — Baa (ب)", "ب", 90);
letterLesson("unit1", "e08", "Home Row — Lam (ل)", "ل", 90);
consolidateLesson("unit1", "e09", "Consolidate — ب ل", ["ب", "ل"], 90);
sideQuest("unit1", 3, "E09");
letterLesson("unit1", "e10", "Home Row — Yaa (ي)", "ي", 90);
letterLesson("unit1", "e11", "Home Row — Seen (س)", "س", 90);
letterLesson("unit1", "e12", "Home Row — Sheen (ش)", "ش", 90);
consolidateLesson("unit1", "e13", "Consolidate — ي س ش", ["ي", "س", "ش"], 90);
sideQuest("unit1", 4, "E13");
reviewLesson("unit1", "e14", "Unit 1 Review — Home Row (10 Letters)", 90, "7 min");
sideQuest("unit1", 5, "E14");

// ---- Unit 2: Top Row Extension ---------------------------------------------

letterLesson("unit2", "e15", "Top Row — Ain (ع)", "ع", 92);
letterLesson("unit2", "e16", "Top Row — Ghain (غ)", "غ", 92);
consolidateLesson("unit2", "e17", "Consolidate — ع غ", ["ع", "غ"], 92);
sideQuest("unit2", 6, "E17");
letterLesson("unit2", "e18", "Top Row — Haa (ه)", "ه", 92);
letterLesson("unit2", "e19", "Top Row — Khaa (خ)", "خ", 92);
letterLesson("unit2", "e20", "Top Row — Haa (ح)", "ح", 92);
consolidateLesson("unit2", "e21", "Consolidate — ه خ ح", ["ه", "خ", "ح"], 92);
sideQuest("unit2", 7, "E21");
letterLesson("unit2", "e22", "Top Row — Jeem (ج)", "ج", 92);
letterLesson("unit2", "e23", "Top Row — Faa (ف)", "ف", 92);
consolidateLesson("unit2", "e24", "Consolidate — ج ف", ["ج", "ف"], 92);
sideQuest("unit2", 8, "E24");
letterLesson("unit2", "e25", "Top Row — Qaaf (ق)", "ق", 92);
letterLesson("unit2", "e26", "Top Row — Thaa (ث)", "ث", 92);
consolidateLesson("unit2", "e27", "Consolidate — ق ث", ["ق", "ث"], 92);
sideQuest("unit2", 9, "E27");
letterLesson("unit2", "e28", "Top Row — Saad (ص)", "ص", 92);
letterLesson("unit2", "e29", "Top Row — Daad (ض)", "ض", 92);
letterLesson("unit2", "e30", "Top Row — Taa Marbuta (ة)", "ة", 92);
consolidateLesson("unit2", "e31", "Consolidate — ص ض ة", ["ص", "ض", "ة"], 92);
sideQuest("unit2", 10, "E31");
reviewLesson("unit2", "e32", "Unit 2 Review — Cumulative", 92, "7 min");
sideQuest("unit2", 11, "E32");

// ---- Unit 3: Bottom Row -----------------------------------------------------

letterLesson("unit3", "e33", "Bottom Row — Taa (ط)", "ط", 92);
letterLesson("unit3", "e34", "Bottom Row — Dhaa (ظ)", "ظ", 92);
consolidateLesson("unit3", "e35", "Consolidate — ط ظ", ["ط", "ظ"], 92);
sideQuest("unit3", 12, "E35");
letterLesson("unit3", "e36", "Bottom Row — Dhal (ذ)", "ذ", 92);
letterLesson("unit3", "e37", "Bottom Row — Daal (د)", "د", 92);
consolidateLesson("unit3", "e38", "Consolidate — ذ د", ["ذ", "د"], 92);
sideQuest("unit3", 13, "E38");
letterLesson("unit3", "e39", "Bottom Row — Zaay (ز)", "ز", 92);
letterLesson("unit3", "e40", "Bottom Row — Raa (ر)", "ر", 92);
letterLesson("unit3", "e41", "Bottom Row — Waaw (و)", "و", 92);
consolidateLesson("unit3", "e42", "Consolidate — ز ر و", ["ز", "ر", "و"], 92);
sideQuest("unit3", 14, "E42");
reviewLesson("unit3", "e43", "Unit 3 Review — Bottom Row", 92, "7 min");
sideQuest("unit3", 15, "E43");

// ---- Unit 4: Shift Layer -----------------------------------------------------

letterLesson("unit4", "e44", "Shift Layer — Hamza (ء)", "ء", 92);
letterLesson("unit4", "e45", "Shift Layer — Hamza on Waaw (ؤ)", "ؤ", 92);
letterLesson("unit4", "e46", "Shift Layer — Hamza on Yaa (ئ)", "ئ", 92);
consolidateLesson("unit4", "e47", "Consolidate — ء ؤ ئ", ["ء", "ؤ", "ئ"], 92);
sideQuest("unit4", 16, "E47");
letterLesson("unit4", "e48", "Shift Layer — Hamza on Alif (أ)", "أ", 92);
letterLesson("unit4", "e49", "Shift Layer — Hamza under Alif (إ)", "إ", 92);
consolidateLesson("unit4", "e50", "Consolidate — أ إ", ["أ", "إ"], 92);
sideQuest("unit4", 17, "E50");
letterLesson("unit4", "e51", "Shift Layer — Alif Maqsura (ى)", "ى", 92);
letterLesson("unit4", "e52", "Shift Layer — Alif Madda (آ)", "آ", 92);
consolidateLesson("unit4", "e53", "Consolidate — ى آ", ["ى", "آ"], 92);
sideQuest("unit4", 18, "E53");
letterLesson("unit4", "e54", "Ligature — Lam-Alif (لا)", "لا", 92);
letterLesson("unit4", "e55", "Ligature — Lam + Hamza on Alif (لأ)", "لأ", 92);
letterLesson("unit4", "e56", "Ligature — Lam + Hamza under Alif (لإ)", "لإ", 92);
letterLesson("unit4", "e57", "Ligature — Lam + Alif Madda (لآ)", "لآ", 92);
known = [...known, "ـ"];
consolidateLesson(
  "unit4",
  "e58",
  "Consolidate — Lam-Alif Ligatures",
  ["لا", "لأ", "لإ", "لآ", "ـ"],
  92,
);
sideQuest("unit4", 19, "E58");
reviewLesson("unit4", "e59", "Unit 4 Review — Shift Layer", 92, "7 min");
sideQuest("unit4", 20, "E59");

// ---- Unit 5: Diacritics ------------------------------------------------------
// Harakat/tanween are combining marks typed after a base letter — drilled as
// (base letter + mark) pairs rather than freestanding characters.

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

diacriticLesson("e60", "Harakat — Fatha (Short a)", "َ", 92);
diacriticLesson("e61", "Harakat — Kasra (Short i)", "ِ", 92);
diacriticLesson("e62", "Harakat — Damma (Short u)", "ُ", 92);
diacriticConsolidate("e63", "Consolidate — Short Vowels", ["َ", "ِ", "ُ"], 92, "6 min");
sideQuest("unit5", 21, "E63");
diacriticLesson("e64", "Sukoon — Silent Marker", "ْ", 92);
diacriticLesson("e65", "Shadda — Doubling Marker", "ّ", 92);
diacriticConsolidate("e66", "Consolidate — Sukoon & Shadda", ["ْ", "ّ"], 92, "6 min");
sideQuest("unit5", 22, "E66");
diacriticLesson("e67", "Tanween — Fathatan (-an)", "ً", 92);
diacriticLesson("e68", "Tanween — Dammatan (-un)", "ٌ", 92);
diacriticLesson("e69", "Tanween — Kasratan (-in)", "ٍ", 92);
diacriticConsolidate("e70", "Consolidate — Tanween", ["ً", "ٌ", "ٍ"], 92, "6 min");
sideQuest("unit5", 23, "E70");
diacriticConsolidate(
  "e71",
  "Unit 5 Review — All Diacritics",
  ["َ", "ِ", "ُ", "ْ", "ّ", "ً", "ٌ", "ٍ"],
  92,
  "6 min",
);
sideQuest("unit5", 24, "E71");

// ---- Unit 6: Numbers & Punctuation ------------------------------------------

letterLesson("unit6", "e72", "Number Row — Digit ١ (One)", "١", 92);
letterLesson("unit6", "e73", "Number Row — Digit ٢ (Two)", "٢", 92);
letterLesson("unit6", "e74", "Number Row — Digit ٣ (Three)", "٣", 92);
consolidateLesson("unit6", "e75", "Consolidate — ١ ٢ ٣", ["١", "٢", "٣"], 92);
sideQuest("unit6", 25, "E75");
letterLesson("unit6", "e76", "Number Row — Digit ٤ (Four)", "٤", 92);
letterLesson("unit6", "e77", "Number Row — Digit ٥ (Five)", "٥", 92);
letterLesson("unit6", "e78", "Number Row — Digit ٦ (Six)", "٦", 92);
consolidateLesson("unit6", "e79", "Consolidate — ٤ ٥ ٦", ["٤", "٥", "٦"], 92);
sideQuest("unit6", 26, "E79");
letterLesson("unit6", "e80", "Number Row — Digit ٧ (Seven)", "٧", 92);
letterLesson("unit6", "e81", "Number Row — Digit ٨ (Eight)", "٨", 92);
letterLesson("unit6", "e82", "Number Row — Digit ٩ (Nine)", "٩", 92);
consolidateLesson("unit6", "e83", "Consolidate — ٧ ٨ ٩", ["٧", "٨", "٩"], 92);
sideQuest("unit6", 27, "E83");
letterLesson("unit6", "e84", "Number Row — Digit ٠ (Zero)", "٠", 92);
consolidateLesson(
  "unit6",
  "e85",
  "Consolidate — All Digits ٠–٩",
  ["١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩", "٠"],
  92,
  "6 min",
);
sideQuest("unit6", 28, "E85");
letterLesson("unit6", "e86", "Punctuation — Comma (،)", "،", 92);
letterLesson("unit6", "e87", "Punctuation — Semicolon (؛)", "؛", 92);
letterLesson("unit6", "e88", "Punctuation — Question Mark (؟)", "؟", 92);
consolidateLesson("unit6", "e89", "Consolidate — Punctuation", ["،", "؛", "؟"], 92);
sideQuest("unit6", 29, "E89");
reviewLesson("unit6", "e90", "Unit 6 Review — Numbers & Punctuation", 92, "7 min");
sideQuest("unit6", 30, "E90");

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

realTextLesson("e91", "Real Text — Greetings", REAL_TEXTS.greetings);
realTextLesson("e92", "Real Text — Daily Life", REAL_TEXTS["daily-life"]);
realTextLesson("e93", "Real Text — Numbers in Context", REAL_TEXTS.numbers);
realTextLesson("e94", "Real Text — Questions", REAL_TEXTS.questions);
realTextLesson("e95", "Real Text — A Short Story", REAL_TEXTS.story);
reviewLesson("unit7", "e96", "Course Complete — Final Review", 92, "6 min");

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
      "Start on the home row — one new letter at a time, with frequent consolidation and speed sprints",
    lessonIds: chapterLessonIds.unit1,
  },
  {
    id: "unit2",
    title: "Unit 2: Top Row Extension",
    description:
      "Reach up to the top row (including ة) — still one letter per lesson, with review games",
    lessonIds: chapterLessonIds.unit2,
  },
  {
    id: "unit3",
    title: "Unit 3: Bottom Row",
    description: "The macOS bottom row: ط ظ ذ د ز ر و",
    lessonIds: chapterLessonIds.unit3,
  },
  {
    id: "unit4",
    title: "Unit 4: Shift Layer",
    description: "The hamza family, alif forms, and lam-alif ligatures — all on the shift layer",
    lessonIds: chapterLessonIds.unit4,
  },
  {
    id: "unit5",
    title: "Unit 5: Diacritics",
    description: "Harakat and tanween — the short vowels and marks",
    lessonIds: chapterLessonIds.unit5,
  },
  {
    id: "unit6",
    title: "Unit 6: Numbers & Punctuation",
    description: "Arabic-Indic numerals ٠–٩ and the marks ، ؛ ؟ — one new key at a time",
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

/** Next lesson in course order after `lessonId` (course-order includes side quests), if any. */
export function getNextLesson(lessonId: string): Lesson | undefined {
  const index = LESSONS.findIndex((l) => l.id === lessonId);
  if (index === -1 || index === LESSONS.length - 1) return undefined;
  return LESSONS[index + 1];
}
