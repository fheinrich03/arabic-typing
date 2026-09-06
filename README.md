# Arabisch Tippen — 10-Finger-Trainer

Web-App zum Erlernen des arabischen 10-Finger-Schreibens. Details zu
Anforderungen und Architekturentscheidungen: [docs/PLAN.md](docs/PLAN.md).

## Voraussetzung

Ein arabisches Tastatur-Layout muss im Betriebssystem als Eingabequelle
aktiv sein (die App vergleicht den tatsächlich getippten Buchstaben, nicht
die physische Taste). Das Tastaturbild + die Finger-Hinweise gehen von der
**macOS-„Arabic"-Belegung** aus (Basis-Buchstaben identisch zu Windows
„Arabic (101)"); bei einem anderen Layout stimmt ggf. nur die Visualisierung
nicht mit der physischen Taste überein, das Tippen selbst funktioniert
trotzdem.

## Setup

```bash
npm install
npm run dev
```

Build:

```bash
npm run build
```

## Struktur

- `src/data/keyboardLayout.ts` — Zeichen-zu-Taste-Mapping + Finger-Zuordnung
- `src/data/words.ts` — kuratierte Wortliste / Beispielsätze
- `src/data/lessons.ts` — Kapitel & Lektionen (Grundreihe → obere/untere
  Reihe → Wörter → Sätze), kumulativer Buchstaben-Aufbau
- `src/lib/lessonGenerator.ts` — generiert Übungstext aus Buchstaben-Config
- `src/hooks/useLessonEngine.ts` — Tipp-Zustandsmaschine (Position, Fehler,
  Zeitmessung, strict/permissive)
- `src/components/` — `KeyboardView`, `TypingArea`, `SettingsPanel`,
  `StatsPanel`, `LessonList`, `LessonRunner`

## Umfang (MVP, alle Phasen aus dem Plan umgesetzt)

- Virtuelle Tastatur mit farbcodierten Fingern, aktuelle Taste hervorgehoben
- RTL-Textanzeige mit Zeichen-Highlighting (korrekt/falsch/aktuell)
- Fehler-Modi: streng (blockiert bis richtiges Zeichen) / locker (zählt nur)
- Freies Training (zufällig generierter Text mit allen gelernten Buchstaben)
- Fortschritt & Statistik (Zeichen/Min, Fehlerquote) persistiert in
  `localStorage`

## Bekannte Einschränkungen

- Kein Tashkil (Kurzvokal-Diakritika) — nur Konsonanten/Langvokale
- Kein Backspace/Korrektur während einer Lektion (wie bei den meisten
  Schreibtrainern; Fehler werden über den Fehler-Modus gehandhabt)
- Zahlenreihe der Tastatur nicht abgebildet (Fokus auf die drei Buchstabenreihen)
