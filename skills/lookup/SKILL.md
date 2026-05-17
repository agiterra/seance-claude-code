---
description: Multi-vault hybrid search across the current project vault and named personai vaults.
allowed-tools: mcp__seance__seance_search
---

# /seance:lookup — Multi-vault search

Usage: `/seance:lookup <query> [<personai>...]`

## What you do

1. Parse the query and any personai names. If no personae are passed, search only the CWD's `.knowledge/`.
2. Call `mcp__seance__seance_search` with `{ "query": "...", "personae": [...] }`.
3. Present results in a tight format. Each hit has `source`, `type` (vault | journal), `score`, `summary`, and `vault` (the origin label).
4. Group by vault if results span multiple — makes it obvious which knowledge came from which personai.
5. If the result is empty: tell the user no matches; suggest broader phrasing or registering relevant personae.

## When to use this vs /knowledge:enrich

- **`/knowledge:enrich`** — deep hybrid search in the current project's vault only. Higher recall, possibly LLM-filtered. Use for the bulk of in-project work.
- **`/seance:lookup`** — same shape but spans multiple vaults. Use when you need to consult a personai's cross-project knowledge or to compare what two personae have learned.

## Note on score comparability

Scores across vaults are directly comparable because all agiterra vaults use the same embedding model (`all-MiniLM-L6-v2`). The ranking you see is a true unified ranking, not a stitched-together one.
