import type { Settings } from "../types";

interface SettingsPanelProps {
  settings: Settings;
  onChange: (next: Settings) => void;
  onClose: () => void;
}

export function SettingsPanel({ settings, onChange, onClose }: SettingsPanelProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl dark:bg-slate-800">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
            Einstellungen
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
            aria-label="Schließen"
          >
            ✕
          </button>
        </div>

        <div className="space-y-5 text-sm text-slate-700 dark:text-slate-200">
          <fieldset>
            <legend className="mb-1 font-medium">Fehler-Modus</legend>
            <label className="flex items-center gap-2 py-1">
              <input
                type="radio"
                name="errorMode"
                checked={settings.errorMode === "strict"}
                onChange={() => onChange({ ...settings, errorMode: "strict" })}
              />
              Streng — erst weiter bei richtigem Zeichen
            </label>
            <label className="flex items-center gap-2 py-1">
              <input
                type="radio"
                name="errorMode"
                checked={settings.errorMode === "permissive"}
                onChange={() => onChange({ ...settings, errorMode: "permissive" })}
              />
              Locker — Fehler zählen, weiter geht's trotzdem
            </label>
          </fieldset>

          <label className="flex items-center justify-between">
            Tastaturbild anzeigen
            <input
              type="checkbox"
              checked={settings.showKeyboard}
              onChange={(e) => onChange({ ...settings, showKeyboard: e.target.checked })}
            />
          </label>

          <label className="flex items-center justify-between">
            Finger-Hinweise anzeigen
            <input
              type="checkbox"
              checked={settings.showFingerHints}
              onChange={(e) =>
                onChange({ ...settings, showFingerHints: e.target.checked })
              }
              disabled={!settings.showKeyboard}
            />
          </label>

          <label className="flex flex-col gap-1">
            Schriftgröße ({settings.fontSizePx}px)
            <input
              type="range"
              min={20}
              max={56}
              step={2}
              value={settings.fontSizePx}
              onChange={(e) =>
                onChange({ ...settings, fontSizePx: Number(e.target.value) })
              }
            />
          </label>
        </div>
      </div>
    </div>
  );
}
