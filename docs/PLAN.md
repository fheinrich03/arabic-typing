# Arabisch 10-Finger-Schreiben lernen — Requirements & Plan

Referenzen: Tipp10 (deutsche Schreibtrainer-Akademie), [arabictyping101.com](https://arabictyping101.com/)

## 1. Ziel

Web-App zum Erlernen des arabischen 10-Finger-Systems. Nutzer tippt vorgegebene
Übungstexte ab, bekommt visuelles Feedback über virtuelle Tastatur +
Finger-Zuordnung, und Fortschritt wird über aufeinander aufbauende Lektionen
gesteuert (Grundreihe → Erweiterung → Wörter → Sätze), wie bei Tipp10.

## 2. Kernkonzepte

### 2.1 Lesson (Übungseinheit)

Eindeutig definierte Einheit, idealerweise als Datei (JSON), nicht nur
zur Laufzeit generiert — reproduzierbar, versionierbar, testbar.

```jsonc
{
  "id": "lesson-01-home-row",
  "title": "Grundreihe: ا ل ب ت",
  "chapter": "grundreihe",
  "chars": ["ا", "ل", "ب", "ت"],
  "mode": "chars",          // "chars" | "words" | "sentences"
  "text": "لا لا با تا لب بت ..."
}
```

- `text` kann fest hinterlegt sein (kuratierte Lektionen) **oder**
  zur Laufzeit aus einer Generator-Config erzeugt werden (siehe 2.2).
- Kapitel-Struktur analog Tipp10: neue Zeichen einzeln einführen, dann
  kombinieren, dann zu Wörtern/Sätzen steigern.

### 2.2 Lesson-Generator

Erzeugt `text` aus einer Config — nützlich für Wiederholungs-Drills und
freies Training außerhalb der kuratierten Lektionen.

```jsonc
{
  "letters": ["ا", "ل", "ب"],
  "length": 200,            // Zeichenanzahl
  "wordMode": false,        // echte Wörter aus Wortliste vs. Zeichen-Kombinationen
  "repeatWeight": { "ا": 2 } // manche Zeichen häufiger üben
}
```

Bei `wordMode: true` greift der Generator auf eine Wortliste zurück und
filtert Wörter, die nur die freigeschalteten Buchstaben enthalten.

### 2.3 Übungs-Engine (Laufzeit-Zustand)

Zustandsmaschine pro Lesson-Durchlauf:

- Position im Zieltext (aktueller Index)
- Getippte Zeichen vs. Soll-Zeichen (korrekt / falsch)
- Fehlerzähler, Zeitmessung → Zeichen/Min, Fehlerquote
- Modus-abhängiges Verhalten (siehe 3.3)

## 3. UI

### 3.1 Tastaturbild

- Virtuelle arabische Tastatur (Mac/Windows Arabic-101-Layout als
  Zeichen-zu-Taste-Mapping, als eigene Datenquelle/JSON)
- Aktuell zu tippende Taste farbig hervorgehoben
- Optional: Finger-Zuordnung farbcodiert wie Tipp10 (jeder Finger eigene
  Farbe, Taste zeigt welcher Finger zuständig ist)
- Ein-/ausblendbar (Einstellung, für Fortgeschrittene ohne visuelle Hilfe)

### 3.2 Textanzeige

- RTL-Darstellung (`dir="rtl"`, arabische Schriftart mit sauberen
  Ligaturen, z. B. Noto Naskh Arabic / Amiri)
- Zeichen-Highlighting: bereits getippt (korrekt/falsch unterschiedlich),
  aktuelles Zeichen, noch ausstehend

### 3.3 Einstellungen / Modi

- **Fehler-Modus**:
  - *Strict*: es geht erst weiter, wenn das richtige Zeichen getippt wurde
  - *Permissive*: falsches Zeichen wird gezählt, Cursor rückt trotzdem vor
- Tastaturbild an/aus
- Finger-Hinweise an/aus
- Schriftgröße

### 3.4 Statistik / Ergebnis

- Nach jeder Lesson: Zeichen/Min, Fehlerquote, Dauer
- Fortschritt pro Kapitel/Lesson (bestanden/nicht bestanden anhand
  Schwellenwert für Genauigkeit)

## 4. Architektur-Komponenten

- `KeyboardView` — rendert Tastatur, markiert aktive Taste/Finger
- `TypingArea` — zeigt Zieltext + Eingabe-Overlay, RTL
- `LessonEngine` — Zustandsmaschine (Position, Fehler, Timer, Modus-Logik)
- `LessonGenerator` — Config → Übungstext
- `SettingsPanel` — Fehler-Modus, Tastaturbild, Finger-Hinweise
- `StatsPanel` — Ergebnis nach Lesson
- `LessonList` — Kapitelübersicht, Fortschritt

## 5. Datenpersistenz

- MVP: `localStorage` für Einstellungen + Fortschritt (kein Backend nötig)
- Später optional: Backend/Sync für Multi-Device (out of scope für MVP)

## 6. Tech-Stack (Vorschlag)

| Bereich | Wahl | Begründung |
|---|---|---|
| Framework | React + TypeScript + Vite | schnell, kein Backend nötig, gute DX |
| Styling | Tailwind CSS | schnelles Prototyping, einfache Zustands-Styles (Highlighting) |
| State | React Context / kleiner Store (Zustand) | App-Zustand klein genug, kein Redux nötig |
| Schriftart | Noto Naskh Arabic / Amiri (self-hosted) | saubere Ligaturen, keine Abhängigkeit von System-Fonts |
| Persistenz | `localStorage` | ausreichend für Einzelnutzer-MVP |
| Tests | Vitest + React Testing Library | LessonEngine-Logik (Fehler-Modi, Fortschritt) gut unit-testbar |
| Deployment | statisches Hosting (Vercel/Netlify) | reine Client-App, kein Server nötig |

## 7. Umsetzungs-Phasen

1. **MVP**: Statische Lesson-JSONs, `TypingArea` ohne Tastaturbild, nur
   Strict-Modus, keine Statistik
2. **Tastaturbild**: `KeyboardView` + Finger-Farbcodierung
3. **Lesson-Generator**: dynamische Übungstexte aus Config
4. **Einstellungen**: Fehler-Modi umschaltbar, Tastaturbild/Finger-Hinweise togglebar
5. **Fortschritt & Statistik**: `localStorage`-Persistenz, Zeichen/Min, Fehlerquote, Kapitel-Fortschritt
6. **Feinschliff**: weitere Lektionen/Kapitel, Sound-Feedback (optional), Achievements (optional)

## 8. Offene Fragen

- Welches Tastatur-Layout als Standard (Mac Arabic vs. Windows Arabic-101)?
  Sollte konfigurierbar sein, da Nutzer unterschiedliche OS/Layouts haben.
  > Mac Arabic
- Nur Konsonanten/Langvokale oder auch Tashkil (Kurzvokal-Diakritika)?
  Beeinflusst Komplexität von Tastatur + Lesson-Generator erheblich.
  > kein tashkil
- Wortlisten-Quelle für `wordMode` (lizenzfreie arabische Frequenzliste nötig).
  > https://talkinarabic.com/arabic-words/
