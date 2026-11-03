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

/** Marks the drilled characters as focus — the generator prefers words containing them. */
function focusWeights(chars: string[]): Record<string, number> {
  return Object.fromEntries(chars.map((c) => [c, 3]));
}

/**
 * Introduces a single new letter. Drill text draws on everything known so
 * far (so enough real words exist) and favors words containing the new letter.
 */
function letterLesson(chapterId: string, id: string, title: string, letter: string, goal: number, minutes = "5 min") {
  known = [...known, letter];
  push(chapterId, {
    id,
    title,
    chapterId,
    chars: [letter],
    mode: "chars",
    kind: "letter",
    goalAccuracy: goal,
    estimate: minutes,
    generatorConfig: { letters: [...known], length: 110, repeatWeight: focusWeights([letter]) },
  });
}

/** Drills a group of recently introduced letters together. */
function consolidateLesson(
  chapterId: string,
  id: string,
  title: string,
  newLetters: string[],
  goal: number,
  minutes = "5 min",
) {
  push(chapterId, {
    id,
    title,
    chapterId,
    chars: newLetters,
    mode: "chars",
    kind: "consolidate",
    goalAccuracy: goal,
    estimate: minutes,
    generatorConfig: { letters: [...known], length: 150, repeatWeight: focusWeights(newLetters) },
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
  generatorConfig: { letters: ["ت", "م"], length: 20 },
});

// ---- Unit 1: Home Row Foundation ------------------------------------------
// Right hand's letters first (one lesson each), consolidated, then reviewed
// against everything known so far — then the same for the left hand. Within
// each hand, letters come in the order that unlocks the most real words.
// و and ر sit on the bottom row but are among the most frequent letters, so
// they join here; ط comes last, since few words use it before the left hand.

letterLesson("unit1", "e00", "Home Row — Taa (ت)", "ت", 85);
letterLesson("unit1", "e01", "Home Row — Meem (م)", "م", 88);
letterLesson("unit1", "e02", "Home Row — Alif (ا)", "ا", 88);
letterLesson("unit1", "e03", "Bottom Row — Waaw (و)", "و", 90);
letterLesson("unit1", "e04", "Home Row — Noon (ن)", "ن", 90);
letterLesson("unit1", "e05", "Home Row — Kaaf (ك)", "ك", 90);
consolidateLesson("unit1", "e06", "Consolidate — Rechte Hand (ت م ا و ن ك)", ["ت", "م", "ا", "و", "ن", "ك"], 90);
reviewLesson("unit1", "e07", "Review — Nach rechter Hand", 90, "6 min");
sideQuest("unit1", 1, "E07");

letterLesson("unit1", "e08", "Home Row — Lam (ل)", "ل", 90);
letterLesson("unit1", "e09", "Home Row — Yaa (ي)", "ي", 90);
letterLesson("unit1", "e10", "Home Row — Baa (ب)", "ب", 90);
letterLesson("unit1", "e11", "Bottom Row — Raa (ر)", "ر", 90);
letterLesson("unit1", "e12", "Home Row — Seen (س)", "س", 90);
letterLesson("unit1", "e13", "Home Row — Sheen (ش)", "ش", 90);
consolidateLesson("unit1", "e14", "Consolidate — Linke Hand (ل ي ب ر س ش)", ["ل", "ي", "ب", "ر", "س", "ش"], 90);
letterLesson("unit1", "e15", "Home Row — Taa (ط)", "ط", 90);
reviewLesson("unit1", "e16", "Unit 1 Review — Home Row (13 Letters)", 90, "7 min");
sideQuest("unit1", 2, "E16");

// ---- Unit 2: Top Row Extension ---------------------------------------------

letterLesson("unit2", "e17", "Top Row — Ain (ع)", "ع", 92);
letterLesson("unit2", "e18", "Top Row — Daal (د)", "د", 92);
letterLesson("unit2", "e19", "Top Row — Haa (ه)", "ه", 92);
letterLesson("unit2", "e20", "Top Row — Jeem (ج)", "ج", 92);
letterLesson("unit2", "e21", "Top Row — Haa (ح)", "ح", 92);
letterLesson("unit2", "e22", "Top Row — Khaa (خ)", "خ", 92);
letterLesson("unit2", "e23", "Top Row — Ghain (غ)", "غ", 92);
consolidateLesson(
  "unit2",
  "e24",
  "Consolidate — Rechte Hand (ع د ه ج ح خ غ)",
  ["ع", "د", "ه", "ج", "ح", "خ", "غ"],
  92,
);
reviewLesson("unit2", "e25", "Review — Nach rechter Hand (Top Row)", 92, "6 min");
sideQuest("unit2", 3, "E25");

letterLesson("unit2", "e26", "Top Row — Faa (ف)", "ف", 92);
letterLesson("unit2", "e27", "Top Row — Qaaf (ق)", "ق", 92);
letterLesson("unit2", "e28", "Top Row — Saad (ص)", "ص", 92);
letterLesson("unit2", "e29", "Top Row — Daad (ض)", "ض", 92);
letterLesson("unit2", "e30", "Top Row — Thaa (ث)", "ث", 92);
consolidateLesson("unit2", "e31", "Consolidate — Linke Hand (ف ق ص ض ث)", ["ف", "ق", "ص", "ض", "ث"], 92);
reviewLesson("unit2", "e32", "Unit 2 Review — Cumulative", 92, "7 min");
sideQuest("unit2", 4, "E32");

// ---- Unit 3: Bottom Row -----------------------------------------------------
// ذ sits on the number row (Backquote), but it's the last unshifted letter
// left for the left pinky, so it joins the left-hand phase here.

letterLesson("unit3", "e33", "Bottom Row — Taa Marbuta (ة)", "ة", 92);
letterLesson("unit3", "e34", "Bottom Row — Alif Maqsura (ى)", "ى", 92);
letterLesson("unit3", "e35", "Bottom Row — Zaay (ز)", "ز", 92);
letterLesson("unit3", "e36", "Bottom Row — Dhaa (ظ)", "ظ", 92);
consolidateLesson("unit3", "e37", "Consolidate — Rechte Hand (ة ى ز ظ)", ["ة", "ى", "ز", "ظ"], 92);
reviewLesson("unit3", "e38", "Review — Nach rechter Hand (Bottom Row)", 92, "6 min");
sideQuest("unit3", 5, "E38");

letterLesson("unit3", "e39", "Number Row — Dhal (ذ)", "ذ", 92);
letterLesson("unit3", "e40", "Bottom Row — Hamza (ء)", "ء", 92);
letterLesson("unit3", "e41", "Bottom Row — Lam-Alif (لا)", "لا", 92);
letterLesson("unit3", "e42", "Bottom Row — Hamza on Yaa (ئ)", "ئ", 92);
letterLesson("unit3", "e43", "Bottom Row — Hamza on Waaw (ؤ)", "ؤ", 92);
consolidateLesson(
  "unit3",
  "e44",
  "Consolidate — Linke Hand (ذ ء لا ئ ؤ)",
  ["ذ", "ء", "لا", "ئ", "ؤ"],
  92,
);
reviewLesson("unit3", "e45", "Unit 3 Review — Bottom Row", 92, "7 min");
sideQuest("unit3", 6, "E45");

// ---- Unit 4: Shift Layer -----------------------------------------------------

letterLesson("unit4", "e46", "Shift Layer — Hamza on Alif (أ)", "أ", 92);
letterLesson("unit4", "e47", "Shift Layer — Hamza under Alif (إ)", "إ", 92);
letterLesson("unit4", "e48", "Shift Layer — Alif Madda (آ)", "آ", 92);
// Tatweel (ـ) has no dedicated lesson — it's a stroke elongation mark, not a
// letter — but joins the pool once the right-hand shift-layer set is complete.
known = [...known, "ـ"];
consolidateLesson("unit4", "e49", "Consolidate — Rechte Hand (أ إ آ ـ)", ["أ", "إ", "آ", "ـ"], 92);
reviewLesson("unit4", "e50", "Review — Nach rechter Hand (Shift Layer)", 92, "6 min");
sideQuest("unit4", 7, "E50");

letterLesson("unit4", "e51", "Shift Layer — Lam + Hamza on Alif (لأ)", "لأ", 92);
letterLesson("unit4", "e52", "Shift Layer — Lam + Hamza under Alif (لإ)", "لإ", 92);
letterLesson("unit4", "e53", "Shift Layer — Lam + Alif Madda (لآ)", "لآ", 92);
consolidateLesson("unit4", "e54", "Consolidate — Linke Hand (لأ لإ لآ)", ["لأ", "لإ", "لآ"], 92);
reviewLesson("unit4", "e55", "Unit 4 Review — Shift Layer", 92, "7 min");
sideQuest("unit4", 8, "E55");

// ---- Unit 5: Diacritics ------------------------------------------------------
// Harakat/tanween are combining marks typed after a base letter — drilled in
// voweled Quran words, showing only the marks learned so far. All of them
// sit on the left hand already, so there's no hand split here.

const baseLettersForDiacritics = [...known];

letterLesson("unit5", "e56", "Harakat — Fatha (Short a)", "َ", 92);
letterLesson("unit5", "e57", "Harakat — Kasra (Short i)", "ِ", 92);
letterLesson("unit5", "e58", "Harakat — Damma (Short u)", "ُ", 92);
consolidateLesson("unit5", "e59", "Consolidate — Short Vowels", ["َ", "ِ", "ُ"], 92, "6 min");
sideQuest("unit5", 9, "E59");
letterLesson("unit5", "e60", "Sukoon — Silent Marker", "ْ", 92);
letterLesson("unit5", "e61", "Shadda — Doubling Marker", "ّ", 92);
consolidateLesson("unit5", "e62", "Consolidate — Sukoon & Shadda", ["ْ", "ّ"], 92, "6 min");
sideQuest("unit5", 10, "E62");
letterLesson("unit5", "e63", "Tanween — Fathatan (-an)", "ً", 92);
letterLesson("unit5", "e64", "Tanween — Dammatan (-un)", "ٌ", 92);
letterLesson("unit5", "e65", "Tanween — Kasratan (-in)", "ٍ", 92);
consolidateLesson("unit5", "e66", "Consolidate — Tanween", ["ً", "ٌ", "ٍ"], 92, "6 min");
sideQuest("unit5", 11, "E66");
consolidateLesson(
  "unit5",
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

letterLesson("unit6", "e68", "Number Row — Digit ١ (One)", "١", 92);
letterLesson("unit6", "e69", "Number Row — Digit ٢ (Two)", "٢", 92);
letterLesson("unit6", "e70", "Number Row — Digit ٣ (Three)", "٣", 92);
letterLesson("unit6", "e71", "Number Row — Digit ٤ (Four)", "٤", 92);
letterLesson("unit6", "e72", "Number Row — Digit ٥ (Five)", "٥", 92);
consolidateLesson("unit6", "e73", "Consolidate — Linke Hand (١ ٢ ٣ ٤ ٥)", ["١", "٢", "٣", "٤", "٥"], 92);
reviewLesson("unit6", "e74", "Review — Nach linker Hand (Zahlen)", 92, "6 min");
sideQuest("unit6", 13, "E74");

letterLesson("unit6", "e75", "Number Row — Digit ٦ (Six)", "٦", 92);
letterLesson("unit6", "e76", "Number Row — Digit ٧ (Seven)", "٧", 92);
letterLesson("unit6", "e77", "Number Row — Digit ٨ (Eight)", "٨", 92);
letterLesson("unit6", "e78", "Number Row — Digit ٩ (Nine)", "٩", 92);
letterLesson("unit6", "e79", "Number Row — Digit ٠ (Zero)", "٠", 92);
consolidateLesson("unit6", "e80", "Consolidate — Rechte Hand (٦ ٧ ٨ ٩ ٠)", ["٦", "٧", "٨", "٩", "٠"], 92);
reviewLesson("unit6", "e81", "Review — Alle Ziffern ٠–٩", 92, "6 min");
sideQuest("unit6", 14, "E81");

letterLesson("unit6", "e82", "Punctuation — Comma (،)", "،", 92);
letterLesson("unit6", "e83", "Punctuation — Semicolon (؛)", "؛", 92);
letterLesson("unit6", "e84", "Punctuation — Question Mark (؟)", "؟", 92);
consolidateLesson("unit6", "e85", "Consolidate — Punctuation", ["،", "؛", "؟"], 92);
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
      "Right hand's home-row letters plus و first, then the left hand plus ر — each side consolidated and reviewed before moving on",
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
      "Reach down to the bottom row: ة ى ز ظ on the right hand, ء لا ئ ؤ on the left — plus ذ from the number row",
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
