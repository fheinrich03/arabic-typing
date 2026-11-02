import type { Lesson } from "../types";
import { ALL_LETTERS, LESSONS } from "../data/lessons";
import type { CharRating } from "./charAnalysis";

export const FOCUS_LESSON_ID = "focus";

/** Below this many occurrences a single slip says too little to recommend practice. */
const MIN_OCCURRENCES = 3;
const MAX_COURSE_LESSONS = 2;
const FOCUS_LENGTH = 120;

function isWeak(rating: CharRating): boolean {
  return rating.level !== "sicher" && rating.occurrences >= MIN_OCCURRENCES;
}

/**
 * Short drill over the same letter pool as the finished lesson, with the weak
 * letters weighted up — keeps the familiar context while hammering the gaps.
 */
function focusLesson(weak: CharRating[], source: Lesson, rated: CharRating[]): Lesson {
  const repeatWeight: Record<string, number> = {};
  for (const r of weak) repeatWeight[r.char] = r.level === "unsicher" ? 4 : 2;

  const base = source.generatorConfig ?? {
    letters: rated.map((r) => r.char).filter((c) => ALL_LETTERS.includes(c)),
    length: FOCUS_LENGTH,
  };

  return {
    id: FOCUS_LESSON_ID,
    title: "Fokus-Training",
    chapterId: source.chapterId,
    chars: weak.map((r) => r.char),
    mode: "chars",
    kind: "review",
    estimate: "2 min",
    description: "Deine unsicheren Buchstaben, gemischt mit denen aus dieser Übung",
    generatorConfig: { ...base, length: FOCUS_LENGTH, repeatWeight },
  };
}

function letterLessonFor(char: string): Lesson | undefined {
  return LESSONS.find((l) => l.kind === "letter" && l.chars.includes(char));
}

/** The consolidate lesson with `char` that covers the most of `others` — only if it covers at least one. */
function consolidateLessonFor(char: string, others: string[]): Lesson | undefined {
  let best: Lesson | undefined;
  let bestHits = 1;
  for (const lesson of LESSONS) {
    if (lesson.kind !== "consolidate" || !lesson.chars.includes(char)) continue;
    const hits = 1 + others.filter((c) => lesson.chars.includes(c)).length;
    if (hits > bestHits) {
      best = lesson;
      bestHits = hits;
    }
  }
  return best;
}

/**
 * Course lessons for the weak letters, weakest first: one consolidate lesson
 * when several weak letters share one, otherwise the letter's own intro lesson.
 */
function courseLessons(weak: CharRating[], currentLessonId: string): Lesson[] {
  const weakChars = weak.map((r) => r.char);
  const covered = new Set<string>();
  const picked: Lesson[] = [];

  for (const char of weakChars) {
    if (picked.length >= MAX_COURSE_LESSONS) break;
    if (covered.has(char)) continue;
    const others = weakChars.filter((c) => c !== char && !covered.has(c));
    const lesson = consolidateLessonFor(char, others) ?? letterLessonFor(char);
    if (!lesson || lesson.id === currentLessonId || picked.includes(lesson)) {
      covered.add(char);
      continue;
    }
    picked.push(lesson);
    for (const c of lesson.chars) covered.add(c);
    covered.add(char);
  }
  return picked;
}

/** Up to three follow-up exercises for the weak letters of a run — focus drill first. */
export function recommendPractice(ratings: CharRating[], source: Lesson): Lesson[] {
  const weak = ratings.filter(isWeak);
  if (weak.length === 0) return [];
  return [focusLesson(weak, source, ratings), ...courseLessons(weak, source.id)];
}
