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
  /** Arabic character(s) this key produces unshifted under the reference layout (Mac Arabic) */
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
  | "real-text";

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
  letters: string[];
  length: number;
  wordMode?: boolean;
  repeatWeight?: Record<string, number>;
  /** Diacritic drills: each token = one letter from this pool + one mark from `letters`. */
  pairBase?: string[];
}

export type ErrorMode = "strict" | "permissive";

export interface Settings {
  errorMode: ErrorMode;
  showKeyboard: boolean;
  showFingerHints: boolean;
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

export interface Progress {
  results: Record<string, LessonResult>;
}
