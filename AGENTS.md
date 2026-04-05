# TicTacToe Agenten Dokumentation

## Überblick

Dieses Projekt nutzt spezialisierte Agenten für verschiedene Aufgabenbereiche. Die Agenten sind im OpenCode Markdown-Format im Verzeichnis `.opencode/agents/` definiert.

---

## Verfügbare Agenten

| Agent | Beschreibung | Verwendung |
|-------|-------------|------------|
| `@requirements-engineering` | Erstellt SPEC.md mit allen Anforderungen | `npx opencode -a requirements-engineering` |
| `@development` | Implementiert Code basierend auf SPEC.md | `npx opencode -a development` |
| `@testing` | Erstellt und führt Tests aus | `npx opencode -a testing` |

---

## Workflow

```
┌─────────────────────────┐
│  Requirements Eng.     │
│  @requirements-engineering │
│   (SPEC.md erstellen)   │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│    Development          │
│      @development       │
│  (Code implementieren)  │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│      Testing            │
│       @testing          │
│  (Tests ausführen)     │
└─────────────────────────┘
```

---

## Benutzer-Interaktion

1. Benutzer startet Workflow
2. Requirements Engineering Agent fragt Details ab
3. Alle drei Agenten erstellen ihre Pläne
4. Benutzer bestätigt Pläne
5. Development Agent implementiert Code
6. Testing Agent führt Tests aus
7. Ergebnisse werden präsentiert

---

## Nächste Schritte

1. Requirements Engineering Agent starten
2. Fragen an Benutzer stellen
3. Pläne erstellen
4. **Vor Implementierung: Benutzer fragen**
5. Implementierung durchführen

---

## Agenten-Dateien

Die Agenten sind im OpenCode Markdown-Format definiert:

```
.opencode/agents/
├── requirements-engineering.md
├── development.md
└── testing.md
```
