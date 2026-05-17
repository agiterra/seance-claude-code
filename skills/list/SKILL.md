---
description: Show locally registered personae with their repos and last-pulled commits.
allowed-tools: mcp__seance__seance_list
---

# /seance:list — Show registered personae

## What you do

1. Call `mcp__seance__seance_list`.
2. Format as a compact table or list: `<name> — <repo> — <last-commit-short-sha> (pulled <when>)`.
3. If empty, tell the user "no personae registered yet — `/seance:register <name> <repo>` to add one."
