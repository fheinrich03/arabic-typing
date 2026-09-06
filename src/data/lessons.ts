import type { Chapter, Lesson } from "../types";
import {
  HOME_ROW_GROUPS,
  TOP_ROW_GROUPS,
  BOTTOM_ROW_GROUPS,
} from "./keyboardLayout";
import { WORDS, SENTENCES } from "./words";

function weightsFor(newLetters: string[], oldLetters: string[]): Record<string, number> {
  const weights: Record<string, number> = {};
  for (const l of newLetters) weights[l] = 3;
  for (const l of oldLetters) weights[l] = 1;
  return weights;
}

/**
 * Builds one lesson per group (drilling the newly introduced letters
 * against everything learned so far) plus a final lesson combining the
 * whole row.
 */
function buildRowChapter(
  chapterId: string,
  title: string,
  groups: string[][],
  startLetters: string[],
  groupLength: number,
  finalLength: number,
): { chapter: Chapter; lessons: Lesson[]; allLetters: string[] } {
  const lessons: Lesson[] = [];
  let known = [...startLetters];

  groups.forEach((group, i) => {
    const cumulative = [...known, ...group];
    lessons.push({
      id: `${chapterId}-${i + 1}`,
      title: `${title} ${i + 1}: ${group.join(" ")}`,
      chapterId,
      chars: group,
      mode: "chars",
      generatorConfig: {
        letters: cumulative,
        length: groupLength,
        repeatWeight: weightsFor(group, known),
      },
    });
    known = cumulative;
  });

  lessons.push({
    id: `${chapterId}-final`,
    title: `${title}: Zusammenfassung`,
    chapterId,
    chars: known,
    mode: "chars",
    generatorConfig: {
      letters: known,
      length: finalLength,
    },
  });

  return {
    chapter: { id: chapterId, title, lessonIds: lessons.map((l) => l.id) },
    lessons,
    allLetters: known,
  };
}

const home = buildRowChapter(
  "grundreihe",
  "Grundreihe",
  HOME_ROW_GROUPS,
  [],
  100,
  180,
);

const top = buildRowChapter(
  "obere-reihe",
  "Obere Reihe",
  TOP_ROW_GROUPS,
  home.allLetters,
  100,
  200,
);

const bottom = buildRowChapter(
  "untere-reihe",
  "Untere Reihe",
  BOTTOM_ROW_GROUPS,
  top.allLetters,
  100,
  220,
);

function chunk<T>(arr: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < arr.length; i += size) chunks.push(arr.slice(i, i + size));
  return chunks;
}

const wordChunks = chunk(WORDS, 20);
const wordLessons: Lesson[] = wordChunks.map((words, i) => ({
  id: `woerter-${i + 1}`,
  title: `Wörter ${i + 1}`,
  chapterId: "woerter",
  chars: bottom.allLetters,
  mode: "words",
  text: words.join(" "),
}));
const wordChapter: Chapter = {
  id: "woerter",
  title: "Wörter",
  lessonIds: wordLessons.map((l) => l.id),
};

const sentenceChunks = chunk(SENTENCES, 5);
const sentenceLessons: Lesson[] = sentenceChunks.map((sentences, i) => ({
  id: `saetze-${i + 1}`,
  title: `Sätze ${i + 1}`,
  chapterId: "saetze",
  chars: bottom.allLetters,
  mode: "sentences",
  text: sentences.join(" . "),
}));
const sentenceChapter: Chapter = {
  id: "saetze",
  title: "Sätze",
  lessonIds: sentenceLessons.map((l) => l.id),
};

export const CHAPTERS: Chapter[] = [
  home.chapter,
  top.chapter,
  bottom.chapter,
  wordChapter,
  sentenceChapter,
];

export const LESSONS: Lesson[] = [
  ...home.lessons,
  ...top.lessons,
  ...bottom.lessons,
  ...wordLessons,
  ...sentenceLessons,
];

export const LESSONS_BY_ID: Record<string, Lesson> = Object.fromEntries(
  LESSONS.map((l) => [l.id, l]),
);

/** All letters taught by the end of the curriculum — used for free practice. */
export const ALL_LETTERS = bottom.allLetters;
