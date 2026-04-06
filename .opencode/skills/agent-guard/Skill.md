---
name: agent-guard
description: Pausiert vor Agent-Ausführung mit Terminal-Benachrichtigung und wartet auf User-Bestätigung
license: MIT
compatibility: opencode
metadata:
  audience: developers
  workflow: agent-orchestration
  hooks: pre-agent-execution
---


## What I do

- Zeigt vor jedem Primary- oder Subagent-Start eine klare Terminal-Benachrichtigung mit Bell-Sound (`\a`)
- Stoppt die Ausführung sofort und wartet auf explizite User-Eingabe ("continue", "ja", "y")
- Ermöglicht Review von geplanten Tools/Tasks vor Ausführung
- Funktioniert für alle Agents via Hook-Integration in Prompts oder Permissions[web:32][web:35]


## When to use me

Verwende diesen Skill in sensiblen Projekten (z. B. TYPO3-Deployments, Server-Scripts), wo du Agent-Aktionen manuell bestätigen möchtest, um versehentliche Änderungen zu vermeiden.[cite:1][cite:3]


## Usage Instructions

1. **Installation**: Ordner-Struktur anlegen und SKILL.md speichern[web:21]
2. **Aktivierung in AGENTS.md** (z. B. Primary Agent):