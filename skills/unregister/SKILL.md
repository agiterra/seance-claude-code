---
description: Remove a personai from the local registry. Does not delete the cache directory.
allowed-tools: mcp__seance__seance_unregister, Bash
---

# /seance:unregister — Remove a personai

Usage: `/seance:unregister <name>`

## What you do

1. Parse `<name>`.
2. Call `mcp__seance__seance_unregister` with `{ "name": "<name>" }`.
3. Report success or "not registered."
4. **Inform the user the cache directory at `~/.agiterra/personai/<name>/` is NOT deleted** — they can `rm -rf` it manually if they want the disk space back. We don't auto-delete because it might contain a populated vector index they don't want to rebuild from scratch on re-register.
