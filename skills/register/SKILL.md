---
description: Register a personai by GitHub repo so it can be summoned later.
allowed-tools: mcp__seance__seance_register, Bash
---

# /seance:register — Add a personai

Usage: `/seance:register <name> <repo-spec>`

`<repo-spec>` accepts `owner/repo` shorthand or full HTTPS / SSH URLs.

## What you do

1. Parse `<name>` and `<repo-spec>`. Validate `<name>` is a short kebab-case identifier (lowercase, letters/digits/hyphens). Reject anything else and ask the user for a clean name.

2. Call `mcp__seance__seance_register` with `{ "name": ..., "repo": ... }`.

3. Report the result: confirm the personai is registered, mention the cache path (`~/.agiterra/personai/<name>/`), and tell the user the next step: `/seance:summon <name>`.

4. If the personai is already registered, surface the error verbatim. Don't auto-overwrite. The user can `/seance:unregister <name>` first if they really want to re-register.

## Note on access

Registration only records the repo URL — the actual clone happens at first `seance:summon`. If the user's git can't reach the repo (private repo, no auth), that error surfaces at summon time, not here. Surface it cleanly when it appears.
