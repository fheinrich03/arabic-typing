# Arabisch 10-Finger-Schreiben — Über das Projekt

## Ansatz

- Arabisch blind tippen lernen, Schritt für Schritt nach dem Vorbild von Tipp10 und TypingClub
- Geübt wird von Anfang an mit **echten, häufigen Wörtern** aus dem Koran und dem modernen Hocharabisch (MSA), nicht mit zufälligen Buchstabenfolgen
- Keine zufällig erzeugten Zeichenketten, also auch keine versehentlich entstehenden unpassenden Wörter
- Referenz-Layout: **Arabic 101**, auf macOS „Arabisch – PC“, unter Windows der Standard
- Es muss kein arabisches Tastaturlayout im Betriebssystem aktiv sein: Die App übersetzt jede physische Taste selbst in das passende arabische Zeichen

## Methodik

### Kursaufbau

- **Unit 0 — Getting Started:** Einstieg und Handhaltung
- **Unit 1 — Grundreihe:** 13 Buchstaben
  - rechte Hand: ت م ا و ن ك
  - linke Hand: ل ي ب ر س ش
  - danach ط
- **Unit 2 — Obere Reihe:**
  - rechte Hand: ع د ه ج ح خ غ
  - linke Hand: ف ق ص ض ث
- **Unit 3 — Untere Reihe:**
  - rechte Hand: ة ى ز ظ
  - linke Hand: ذ ء لا ئ ؤ
- **Unit 4 — Shift-Ebene:** أ إ آ, Tatweel ـ und die Lam-Alif-Ligaturen لأ لإ لآ
- **Unit 5 — Vokalzeichen:** Fatha, Kasra, Damma, Sukun, Shadda, Tanween
- **Unit 6 — Zahlen und Satzzeichen:** ٠–٩ sowie ، ؛ ؟
- **Unit 7 — Echte Texte:** Begrüßungen, Alltag, Zahlen im Kontext, Fragen, eine kurze Geschichte, Abschlusswiederholung

### Lektionsarten

- **Buchstaben-Lektion:** führt ein neues Zeichen ein
- **Festigen:** übt die neuen Zeichen einer Hand gemeinsam
- **Wiederholung:** alles bisher Gelernte
- **Side Quests:** 15 optionale Wiederholungsspiele zwischen den Abschnitten
- Jede Lektion hat ein Genauigkeitsziel zwischen 85 und 92 %

### Reihenfolge der Buchstaben

- Pro Reihe zuerst die rechte, dann die linke Hand
- Innerhalb einer Hand kommen die Buchstaben in der Reihenfolge, die am schnellsten echte Wörter möglich macht
- و und ر liegen auf der unteren Reihe, gehören aber zu den häufigsten Buchstaben. Deshalb kommen sie schon in Unit 1
- Ergebnis: Am Ende der Grundreihe sind rund 570 echte Wörter tippbar, am Ende der oberen Reihe rund 2.700

### Wie Übungstexte entstehen

- **Muster nach TypingClub-Art** (`تتت تمت متم`): solange mit den bekannten Buchstaben weniger als 20 echte Wörter möglich sind, also in den ersten etwa 4 Lektionen
- **Echte Wörter:** danach, gewichtet nach Häufigkeit. Wörter mit dem neuen Buchstaben kommen bevorzugt
- **Kunstwörter:** aussprechbar, aus einer festen, geprüften Liste. Sie ergänzen nur, solange weniger als 10 echte Wörter den neuen Buchstaben enthalten
- **Vokalzeichen:** werden an vokalisierten Koranwörtern geübt. Jede Wortform zeigt nur die Zeichen, die bis dahin gelernt sind
- **Zahlen:** ein- bis vierstellige Zahlen aus den gelernten Ziffern, gemischt mit Wörtern
- **Satzzeichen:** hängen direkt am Wortende, z. B. `كتاب،`
- Jeder Durchlauf erzeugt einen neuen Text

## Wortquellen

- **Koran:** Text des [Tanzil Project](https://tanzil.net)
  - „simple-clean“ für die Wortliste ohne Vokalzeichen
  - „simple“ für die vokalisierten Wortformen
  - Lizenz: freie Nutzung mit Quellenangabe und Link auf tanzil.net
- **Modernes Hocharabisch:** Häufigkeitsliste von [Talk In Arabic](https://talkinarabic.com/arabic-words/) mit über 1.000 Wörtern
- **Kontroll-Korpora:** [Leipzig Corpora Collection](https://wortschatz.uni-leipzig.de), arabische News 2020 und Wikipedia 2021 (CC BY)
  - fehlerhafte Einträge der MSA-Liste aussortieren
  - prüfen, dass kein Kunstwort ein echtes Wort ist
- **Umfang:**
  - 4.565 Wörter ohne Vokalzeichen
  - 2.500 vokalisierte Wortformen
  - rund 2.200 Kunstwörter
- **Ausgeschlossen:**
  - die einzelnen Buchstaben am Anfang mancher Suren (الم, كهيعص, …)
  - Bausteine, die keine eigenen Wörter sind (ال, ات)
  - Wörter zu Töten, Fluch und Unzucht, weil sie ohne Zusammenhang unpassend wirken
- **Kunstwörter:**
  - stammen aus einem Modell aus Buchstabenpaaren, das auf der Wortliste trainiert ist
  - verworfen wird jedes Kunstwort, das in Koran, News oder Wikipedia vorkommt oder eine vulgäre Wurzel enthält
- **Neu erzeugen:** `python3 scripts/word-list/build.py`. Das Skript zeigt auch, wie viele Wörter jede Lektion zur Verfügung hat

## Features

- **Bildschirmtastatur:**
  - zeigt die nächste Taste an, mit Shift-Hinweis
  - Finger-Farben für alle zehn Finger
- **Fehler-Modus:**
  - streng: erst weiter, wenn das richtige Zeichen getippt ist
  - locker: Fehler werden gezählt, es geht trotzdem weiter
- **Hinweise:** Bei falschen Tasten erscheint eine Meldung mit dem erwarteten Zeichen. Zu Rechtschreibregeln gibt es Tipps, z. B. „ة steht nur am Wortende“
- **Auswertung nach jeder Lektion:**
  - Tempo in Zeichen pro Minute und Fehlerquote
  - Analyse pro Buchstabe: unsicher, mittel oder sicher
- **Übungsvorschläge:**
  - Fokus-Training mit den unsicheren Buchstaben
  - passende Lektionen aus dem Kurs, als Warteschlange abarbeitbar
- **Fortschritt:** bestandene Lektionen, Bestwerte und nächste Lektionen. Alles wird lokal im Browser gespeichert
- **Freies Training und Recap:** über alle Grundbuchstaben bzw. alle bisher gelernten Zeichen
- **Sandbox:** freies Tippfeld zum Ausprobieren, auch innerhalb von Lektionen
- **Einstellungen:** Tastaturbild, Finger-Hinweise, Sandbox, Schriftgröße
- **ISO-Tastaturen am Mac** (z. B. die deutsche) werden erkannt. Die vertauschten Codes der Taste unter Esc und der `<`-Taste werden korrigiert
