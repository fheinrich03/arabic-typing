import type { Settings } from "../types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Field, FieldGroup, FieldLabel, FieldLegend, FieldSet } from "./ui/field";
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

        <FieldGroup className="pt-2">
          <FieldSet>
            <FieldLegend variant="label">Fehler-Modus</FieldLegend>
            <RadioGroup
              value={settings.errorMode}
              onValueChange={(value) =>
                onChange({ ...settings, errorMode: value as Settings["errorMode"] })
              }
            >
              <FieldLabel className="font-normal">
                <RadioGroupItem value="strict" />
                Streng — erst weiter bei richtigem Zeichen
              </FieldLabel>
              <FieldLabel className="font-normal">
                <RadioGroupItem value="permissive" />
                Locker — Fehler zählen, weiter geht's trotzdem
              </FieldLabel>
            </RadioGroup>
          </FieldSet>

          <FieldLabel className="justify-between font-normal">
            Tastaturbild anzeigen
            <Switch
              checked={settings.showKeyboard}
              onCheckedChange={(checked) => onChange({ ...settings, showKeyboard: checked })}
            />
          </FieldLabel>

          <FieldLabel className="justify-between font-normal">
            Finger-Hinweise anzeigen
            <Switch
              checked={settings.showFingerHints}
              disabled={!settings.showKeyboard}
              onCheckedChange={(checked) =>
                onChange({ ...settings, showFingerHints: checked })
              }
            />
          </FieldLabel>

          <FieldLabel className="justify-between font-normal">
            Sandbox-Feld in Lektionen standardmäßig anzeigen
            <Switch
              checked={settings.showSandbox}
              onCheckedChange={(checked) => onChange({ ...settings, showSandbox: checked })}
            />
          </FieldLabel>

          <Field>
            <FieldLabel className="font-normal">Schriftgröße ({settings.fontSizePx}px)</FieldLabel>
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
          </Field>
        </FieldGroup>
      </DialogContent>
    </Dialog>
  );
}
