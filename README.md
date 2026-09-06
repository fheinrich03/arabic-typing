# Arabisch Tippen — 10-Finger-Trainer

Web-App zum Erlernen des arabischen 10-Finger-Schreibens. Details zu
Anforderungen und Architekturentscheidungen: [docs/PLAN.md](docs/PLAN.md).

## Voraussetzung

Keine — die App liest die **physische Taste** (`KeyboardEvent.code`) und
übersetzt sie selbst anhand der macOS-„Arabic"-Belegung (Basis-Buchstaben
identisch zu Windows „Arabic (101)") in den arabischen Buchstaben. Ein
arabisches OS-Tastatur-Layout muss dafür **nicht** aktiv sein; getippt wird
stur nach physischer Tastenposition, wie auf dem Tastaturbild gezeigt.

## Setup

```bash
npm install
npm run dev
```

Build:

```bash
npm run build
```

## UI / Design

- shadcn (Preset `nova`, Base UI statt Radix) — Komponenten in
  `src/components/ui/`
- Dark-only Farbpalette + Schriftstack (Inter/Space Grotesk/JetBrains Mono +
  Scheherazade New/Amiri/Noto Naskh Arabic für Arabisch) übernommen vom
  Design der Referenzseite arabictyping101.com (siehe `docs/PLAN.md`)

## Kurs

7 Units, an das Curriculum von arabictyping101.com (Desktop Touch Typing V2)
angelehnt, 97 Lektionen + 30 optionale Review-Games:

1. Home Row Foundation (10 Buchstaben)
2. Top Row Extension (12 Buchstaben inkl. ة)
3. Bottom Row (7 Buchstaben inkl. ذ)
4. Shift Layer (Hamza-Familie ء ؤ ئ أ إ, Alif-Formen ى آ, Lam-Alif-Ligaturen
   لا لأ لإ لآ, Tatweel ـ)
5. Diacritics (Harakat/Sukun/Shadda/Tanween — als Basis-Buchstabe+Zeichen-Paar
   geübt)
6. Numbers & Punctuation (arabisch-indische Ziffern ٠–٩, ، ؛ ؟)
7. Real-World Texts (Begrüßung, Alltag, Zahlen im Kontext, Fragen, Kurzgeschichte)

Keine Lock/Unlock-Progression, kein PRO — alle Lektionen sofort spielbar.
Review-Games sind normale (optionale) Wiederholungs-Lektionen mit
Spielemodus-Titel ("Letter/Word/Number Leap"), kein eigenes Mini-Game.

Ligaturen (لا لأ لإ لآ) sind Mehrzeichen-Tasten — ein Tastendruck erzeugt 2
Zeichen gleichzeitig; die Engine vergleicht Tastatureingaben deshalb als
String (nicht Einzelzeichen), siehe `useLessonEngine.ts`.

## Struktur

- `src/data/keyboardLayout.ts` — Zeichen-zu-Taste-Mapping (inkl. Shift-Layer
  + Zahlenreihe) + Finger-Zuordnung + `resolveNextKey` (Mehrzeichen-Lookahead)
- `src/data/words.ts` — kuratierte Wortliste / Beispielsätze / Real-World-Texte
- `src/data/lessons.ts` — alle 7 Units + Lektionen, kumulativer
  Buchstaben-Aufbau
- `src/lib/lessonGenerator.ts` — generiert Übungstext aus Buchstaben-Config
  (inkl. Diacritic-Pairing-Modus)
- `src/hooks/useLessonEngine.ts` — Tipp-Zustandsmaschine (Position, Fehler,
  Zeitmessung, strict/permissive, Mehrzeichen-Tasten)
- `src/components/` — `KeyboardView`, `TypingArea`, `SettingsPanel`,
  `StatsPanel`, `LessonList`, `LessonRunner`

## Umfang

- Virtuelle Tastatur mit farbcodierten Fingern, aktuelle Taste (inkl.
  Shift-Hinweis) hervorgehoben
- RTL-Textanzeige mit Zeichen-Highlighting (korrekt/falsch/aktuell)
- Fehler-Modi: streng (blockiert bis richtiges Zeichen) / locker (zählt nur)
- Freies Training (zufällig generierter Text mit dem Basis-Alphabet)
- Fortschritt & Statistik (Zeichen/Min, Fehlerquote) persistiert in
  `localStorage`

## Bekannte Einschränkungen

- Shadda-Position (Backquote+Shift) ist ein Best-Effort-Wert, nicht gegen
  eine echte Mac-Tastatur verifiziert — bei Abweichung bitte melden
- Kein Backspace/Korrektur während einer Lektion (wie bei den meisten
  Schreibtrainern; Fehler werden über den Fehler-Modus gehandhabt)
- Bei Mehrzeichen-Ligaturen wird nur das erste Zeichen im Text farblich als
  "aktuell" markiert (kosmetisch, Tastaturbild + Tippverhalten sind korrekt)
