import type { CharStat } from "../types";
import { isCombining } from "../data/charRules";

export type CharLevel = "unsicher" | "mittel" | "sicher";

export interface CharRating {
  char: string;
  occurrences: number;
  errors: number;
  /** correct keystrokes / all keystrokes on this char */
  accuracy: number;
  /** average time-to-type, pauses excluded; null if never timed */
  avgMs: number | null;
  /** 0–100, accuracy scaled down when the char is much slower than the run's average */
  score: number;
  level: CharLevel;
  /** most frequent wrong key typed instead, if any */
  topConfusion: { typed: string; count: number } | null;
}

export const SICHER_MIN_SCORE = 90;
export const MITTEL_MIN_SCORE = 75;
/** A char counts as slow only once it takes this much longer than the run's average. */
const SLOW_TOLERANCE = 1.25;
/** Slowness alone can at most halve the score — errors weigh more than hesitation. */
const MIN_SPEED_FACTOR = 0.5;

function levelFor(score: number): CharLevel {
  if (score >= SICHER_MIN_SCORE) return "sicher";
  if (score >= MITTEL_MIN_SCORE) return "mittel";
  return "unsicher";
}

function speedFactor(avgMs: number | null, baselineMs: number | null): number {
  if (avgMs === null || baselineMs === null || avgMs === 0) return 1;
  return Math.min(1, Math.max(MIN_SPEED_FACTOR, (baselineMs * SLOW_TOLERANCE) / avgMs));
}

function topConfusion(confusions: Record<string, number>): CharRating["topConfusion"] {
  const [entry] = Object.entries(confusions).sort(([, a], [, b]) => b - a);
  return entry ? { typed: entry[0], count: entry[1] } : null;
}

/** Rates every typed char of a run, weakest first. */
export function rateChars(stats: Record<string, CharStat>): CharRating[] {
  const all = Object.values(stats);
  const totalMs = all.reduce((sum, s) => sum + s.totalMs, 0);
  const timedCount = all.reduce((sum, s) => sum + s.timedCount, 0);
  const baselineMs = timedCount > 0 ? totalMs / timedCount : null;

  return Object.entries(stats)
    .map(([char, stat]) => {
      const keystrokes = stat.hits + stat.errors;
      const accuracy = keystrokes > 0 ? stat.hits / keystrokes : 0;
      const avgMs = stat.timedCount > 0 ? stat.totalMs / stat.timedCount : null;
      const score = Math.round(accuracy * speedFactor(avgMs, baselineMs) * 100);
      return {
        char,
        occurrences: stat.occurrences,
        errors: stat.errors,
        accuracy,
        avgMs,
        score,
        level: levelFor(score),
        topConfusion: topConfusion(stat.confusions),
      };
    })
    .sort((a, b) => a.score - b.score || b.errors - a.errors);
}

/** Combining marks are invisible on their own — show them on a dotted circle. */
export function displayChar(char: string): string {
  return isCombining(char) ? `◌${char}` : char;
}
