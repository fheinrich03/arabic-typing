import type { Settings } from "../types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Switch } from "./ui/switch";
import { Slider } from "./ui/slider";

interface SettingsPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  settings: Settings;
  onChange: (next: Settings) => void;
}

export function SettingsPanel({ open, onOpenChange, settings, onChange }: SettingsPanelProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Einstellungen</DialogTitle>
        </DialogHeader>

        <div className="space-y-5 pt-2 text-sm text-foreground">
          <fieldset>
            <legend className="mb-2 font-medium">Fehler-Modus</legend>
            <RadioGroup
              value={settings.errorMode}
              onValueChange={(value) =>
                onChange({ ...settings, errorMode: value as Settings["errorMode"] })
              }
            >
              <label className="flex items-center gap-2 py-1">
                <RadioGroupItem value="strict" />
                Streng — erst weiter bei richtigem Zeichen
              </label>
              <label className="flex items-center gap-2 py-1">
                <RadioGroupItem value="permissive" />
                Locker — Fehler zählen, weiter geht's trotzdem
              </label>
            </RadioGroup>
          </fieldset>

          <label className="flex items-center justify-between">
            Tastaturbild anzeigen
            <Switch
              checked={settings.showKeyboard}
              onCheckedChange={(checked) => onChange({ ...settings, showKeyboard: checked })}
            />
          </label>

          <label className="flex items-center justify-between">
            Finger-Hinweise anzeigen
            <Switch
              checked={settings.showFingerHints}
              disabled={!settings.showKeyboard}
              onCheckedChange={(checked) =>
                onChange({ ...settings, showFingerHints: checked })
              }
            />
          </label>

          <div className="flex flex-col gap-2">
            <span>Schriftgröße ({settings.fontSizePx}px)</span>
            <Slider
              min={20}
              max={56}
              step={2}
              value={[settings.fontSizePx]}
              onValueChange={(value) =>
                onChange({
                  ...settings,
                  fontSizePx: Array.isArray(value) ? value[0] : value,
                })
              }
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
