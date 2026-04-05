# TicTacToe - Spezifikation

## 1. Projektübersicht

- **Projektname**: TicTacToe
- **Typ**: Browser-basiertes Spiel
- **Kernfunktionalität**: Lokaler Multiplayer TicTacToe mit visuellem Spielfeld
- **Zielgruppe**: 2 Spieler am selben Gerät

---

## 2. Tech Stack

- HTML5
- CSS3
- TypeScript (kompiliert zu VanillaJS)
- Keine externen Abhängigkeiten

---

## 3. Funktionale Anforderungen

### 3.1 Spielfeld

| ID | Anforderung | Beschreibung |
|----|-------------|--------------|
| F01 | 3x3 Grid | Spielfeld mit 9 gleichmäßigen Zellen |
| F02 | Klickbare Zellen | Jede freie Zelle ist anklickbar |
| F03 | Spieler-Symbol | Setzen von X oder O in eine Zelle |
| F04 | Turn-Wechsel | Nach jedem Zug wechselt der aktive Spieler |
| F05 | Verhindern von Überschreiben | Belegte Zellen können nicht erneut geklickt werden |

### 3.2 Spielablauf

| ID | Anforderung | Beschreibung |
|----|-------------|--------------|
| F06 | Startspieler | Spieler X beginnt das Spiel |
| F07 | Spieler-Anzeige | Anzeige des aktuellen Spielers (X oder O) |
| F08 | Gewinn-Erkennung | Prüfung auf 3 gleiche Symbole in einer Reihe |
| F09 | Unentschieden-Erkennung | Alle 9 Felder belegt ohne Gewinner |
| F10 | Ergebnisanzeige | Anzeige "X gewinnt", "O gewinnt" oder "Unentschieden" |
| F11 | Neustart | Button zum Zurücksetzen des Spiels |

### 3.3 Gewinnmuster

```
Horizontal: [0,1,2], [3,4,5], [6,7,8]
Vertikal:   [0,3,6], [1,4,7], [2,5,8]
Diagonal:   [0,4,8], [2,4,6]
```

---

## 4. Nicht-funktionale Anforderungen

### 4.1 Design

| ID | Anforderung | Beschreibung |
|----|-------------|--------------|
| NF01 | Responsives Design | Funktioniert auf Desktop (min. 320px) und Mobile |
| NF02 | Zentriertes Layout | Spielfeld zentriert auf dem Bildschirm |
| NF03 | Klares visuelles Feedback | Hover-Effekt auf freien Feldern |

### 4.2 Technische Anforderungen

| ID | Anforderung | Beschreibung |
|----|-------------|--------------|
| NF04 | Keine externen Abhängigkeiten | Nur statische Dateien (HTML, CSS, TS/JS) |
| NF05 | TypeScript | Klare Typ-Definitionen |
| NF06 | Modulare Struktur | Trennung von Logik und Darstellung |

---

## 5. Benutzeroberfläche

### 5.1 Layout-Struktur

```
┌─────────────────────────┐
│      Spielername        │
│     (Aktueller Spieler) │
├─────────────────────────┤
│                         │
│    ┌───┬───┬───┐       │
│    │   │   │   │       │
│    ├───┼───┼───┤       │
│    │   │   │   │       │
│    ├───┼───┼───┤       │
│    │   │   │   │       │
│    └───┴───┴───┘       │
│                         │
├─────────────────────────┤
│      [Neustart]         │
└─────────────────────────┘
```

### 5.2 Farbschema

| Element | Farbe |
|---------|-------|
| Hintergrund | #f0f0f0 |
| Spielfeld | #ffffff |
| Spieler X | #e74c3c (Rot) |
| Spieler O | #3498db (Blau) |
| Linien | #333333 |
| Hover (freies Feld) | rgba(0,0,0,0.1) |

### 5.3 Typografie

- Schriftart: System-Font (sans-serif)
- Spieler-Symbol: 4rem, fett
- Statustext: 1.25rem
- Button: 1rem

---

## 6. TypeScript-Definitionen

```typescript
type Player = 'X' | 'O';
type CellValue = Player | null;
type Board = CellValue[];
type GameStatus = 'playing' | 'won' | 'draw';

interface GameState {
  board: Board;
  currentPlayer: Player;
  status: GameStatus;
  winner: Player | null;
}

interface WinPattern {
  indices: [number, number, number];
  player: Player;
}
```

---

## 7. Akzeptanzkriterien

### 7.1 Spielfeld

| Test-ID | Beschreibung | Erwartetes Ergebnis |
|---------|--------------|---------------------|
| AC01 | Spiel startet mit leerem 3x3 Grid | 9 leere Zellen werden angezeigt |
| AC02 | Klick auf freie Zelle setzt X | Zelle zeigt "X" |
| AC03 | Zweiter Klick setzt O | Zelle zeigt "O", aktiver Spieler wechselt |
| AC04 | Klick auf belegte Zelle | Keine Änderung, kein Fehler |

### 7.2 Gewinn-Erkennung

| Test-ID | Beschreibung | Erwartetes Ergebnis |
|---------|--------------|---------------------|
| AC05 | X gewinnt horizontal oben | "X gewinnt!" wird angezeigt |
| AC06 | O gewinnt vertikal links | "O gewinnt!" wird angezeigt |
| AC07 | X gewinnt diagonal | "X gewinnt!" wird angezeigt |
| AC08 | Gewinner setzt nicht mehr | Spiel endet, keine weiteren Züge möglich |

### 7.3 Unentschieden

| Test-ID | Beschreibung | Erwartetes Ergebnis |
|---------|--------------|---------------------|
| AC09 | 9 Züge ohne Gewinner | "Unentschieden!" wird angezeigt |
| AC10 | Nach Unentschieden klickbar | Keine Änderung bei Klick |

### 7.4 Neustart

| Test-ID | Beschreibung | Erwartetes Ergebnis |
|---------|--------------|---------------------|
| AC11 | Neustart-Button wird angezeigt | Button ist sichtbar |
| AC12 | Klick auf Neustart | Spielfeld leer, X beginnt |

### 7.5 Anzeige

| Test-ID | Beschreibung | Erwartetes Ergebnis |
|---------|--------------|---------------------|
| AC13 | Spielstart zeigt "X ist dran" | Status zeigt Spieler X |
| AC14 | Nach O-Zug zeigt "X ist dran" | Status aktualisiert nach jedem Zug |
| AC15 | Nach Gewinn zeigt "X/O gewinnt!" | Status zeigt Gewinner |

### 7.6 Responsivität

| Test-ID | Beschreibung | Erwartetes Ergebnis |
|---------|--------------|---------------------|
| AC16 | Mobile (< 480px) Darstellung | Spielfeld passt auf Bildschirm |
| AC17 | Desktop (> 480px) Darstellung | Spielfeld zentriert |

---

## 8. Dateistruktur

```
TicTacToe/
├── index.html      # Hauptdokument
├── styles.css      # Styling
├── app.ts          # Hauptlogik
├── types.ts        # TypeScript-Typen
└── SPEC.md         # Diese Spezifikation
```

---

## 9. Abnahmekriterien

Das Spiel gilt als fertiggestellt, wenn:

- [ ] Alle 17 Akzeptanzkriterien (AC01-AC17) erfüllt sind
- [ ] Keine TypeScript-Kompilierfehler vorliegen
- [ ] Das Spiel ohne externe Abhängigkeiten funktioniert
- [ ] Das Layout auf Mobile und Desktop korrekt dargestellt wird
