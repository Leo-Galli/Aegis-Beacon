---
title: Translations
description: The state of wiki translations, how translations are maintained, and how to contribute one.
---

# Translations

The project's audience is international, and the wiki is currently English-first. Translations are planned, and this page is the policy for how they will work.

## Current state

- All wiki pages are written in English
- The website UI is English
- The firmware UI (OLED labels, Morse payload) uses international conventions that need no translation

## The translation policy

1. English is the source of truth; translations follow it, never lead.
2. A translation must cover a full group, not single pages, so navigation stays coherent.
3. Technical terms (Morse, RSSI, ISM, callsign) are kept in English in every language; they are international vocabulary.
4. Every translated page links back to the English original.

## How to contribute a translation

1. Copy the English pages into a language folder.
2. Translate the prose; keep code blocks, tables and identifiers unchanged.
3. Open a pull request (see [Contributing](contributing)) with the language clearly named.

## The pitfalls

| Pitfall | Rule |
| --- | --- |
| Half-translated navigation | Translate whole groups |
| Localized technical terms | Keep international vocabulary |
| Stale translations | Every English update requires a translation update; stale translations get flagged |

## Related pages

- [Contributing](contributing) for the contribution flow
- [GitHub Workflow Guide](github-workflow-guide) for the platform
- [Roadmap](roadmap) for the documentation goals