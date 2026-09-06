import { useLocalStorage } from "./useLocalStorage";
import type { Settings } from "../types";

const DEFAULT_SETTINGS: Settings = {
  errorMode: "strict",
  showKeyboard: true,
  showFingerHints: true,
  fontSizePx: 32,
};

export function useSettings() {
  return useLocalStorage<Settings>("arabic-typing:settings", DEFAULT_SETTINGS);
}
