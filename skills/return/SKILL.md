---
description: Drop the active personai overlay and return to default identity.
allowed-tools: Read
---

# /seance:return — Drop the persona overlay

## What you do

If you are currently embodying a personai (loaded via `/seance:summon`), revert to your default identity:

1. Stop applying the borrowed `CLAUDE.md`'s voice / autonomy rules / sign-off.
2. Stop biasing responses against the borrowed vault. Future `/knowledge:*` calls go back to operating on the CWD's vault only (unless the user explicitly invokes `/seance:lookup` with personae again).
3. Briefly acknowledge to the user: "Persona overlay dropped. Back to default."

No MCP call is required — the overlay is conversational state, not durable state. Nothing on disk changes.

## If you weren't embodying anyone

Just tell the user there was no overlay active. No-op is fine.
