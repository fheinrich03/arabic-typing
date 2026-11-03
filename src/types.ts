export type Finger =
  | "l-pinky"
  | "l-ring"
  | "l-middle"
  | "l-index"
  | "r-index"
  | "r-middle"
  | "r-ring"
  | "r-pinky"
  | "thumb";

export interface KeyDef {
  /** KeyboardEvent.code — physical key, independent of active input layout */
  code: string;
  /** Arabic character(s) this key produces unshifted under the reference layout (Arabic 101, macOS "Arabic – PC") */
  arabic: string;
  /** Arabic character(s) this key produces when held with Shift */
  shiftArabic?: string;
  finger: Finger;
  row: -1 | 0 | 1 | 2 | 3;
  /** relative width in key units, default 1 */
  width?: number;
}

export type LessonMode = "chars" | "words" | "sentences";

export type LessonKind =
  | "intro"
  | "letter"
  | "consolidate"
  | "review"
  | "real-text"
  | "hand";

export interface Lesson {
  id: string;
  title: string;
  chapterId: string;
  /** letters newly introduced or drilled in this lesson */
  chars: string[];
  mode: LessonMode;
  /** Fixed practice text (used for words/sentences lessons). */
  text?: string;
  /** Generates fresh practice text on each attempt (used for chars lessons). */
  generatorConfig?: GeneratorConfig;
  kind?: LessonKind;
  /** e.g. "5 min" */
  estimate?: string;
  goalAccuracy?: number;
  description?: string;
  isSideQuest?: boolean;
}

export interface Chapter {
  id: string;
  title: string;
  description?: string;
  lessonIds: string[];
}

export interface GeneratorConfig {
  /** Every character the learner can type at this point, in learning order. */
  letters: string[];
  length: number;
  /** Characters weighted above 1 are the drill's focus. */
  repeatWeight?: Record<string, number>;
}

export type ErrorMode = "strict" | "permissive";

export interface Settings {
  errorMode: ErrorMode;
  showKeyboard: boolean;
  showFingerHints: boolean;
  showSandbox: boolean;
  fontSizePx: number;
}

export interface LessonResult {
  lessonId: string;
  charsPerMinute: number;
  errorRate: number;
  durationMs: number;
  passed: boolean;
  completedAt: number;
}

/** Per-target typing stats collected during one lesson run. */
export interface CharStat {
  /** times the cursor passed this target */
  occurrences: number;
  /** correct keystrokes on this target */
  hits: number;
  /** wrong keystrokes while this target was expected */
  errors: number;
  /** summed time-to-type over timed hits (pauses excluded) */
  totalMs: number;
  timedCount: number;
  /** what was typed instead, with counts */
  confusions: Record<string, number>;
}

export interface Progress {
  results: Record<string, LessonResult>;
}
