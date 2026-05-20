---
description: Borrow a registered personai and take on its identity (CLAUDE.md, voice, vault) in the current session. Wire signing identity stays with the user.
allowed-tools: mcp__seance__seance_borrow, mcp__seance__seance_list, Bash, Read
---

# /seance:summon — Embody a personai

Usage: `/seance:summon <personai-name>`

## What you do

1. Parse `<personai-name>` from the user's command. If not provided, call `mcp__seance__seance_list` and show the registered personae; tell the user to re-run with one. Don't guess.

2. Call `mcp__seance__seance_borrow` with `{ "name": "<personai-name>" }`. This pulls latest from the personai's repo and returns the overlay payload.

3. **Announce the persona overlay with a provenance line.** The borrow payload includes a `provenance` block (repo, branch, commit, dirty, workspace, workspacePath, promotedPrimaryPath); surface it verbatim so the operator can see exactly what they just booted from. Format:

   ```
   Embodying <name>. repo=<provenance.repo> branch=<provenance.branch> commit=<provenance.commit> dirty=<provenance.dirty> workspace=<provenance.workspace>
   ```

   Then:

   - If `provenance.dirty === true`, prepend a warning line: `⚠ cache is dirty — promoted-primary may be the right source for this work.` (Per `docs/decisions/cache-workspace-safety.md` in seance-tools, the cache should never be dirty on a healthy host; if it is, something needs the operator's attention.)
   - If `provenance.promotedPrimaryPath` is non-null, append a second line: `(promoted primary exists at <provenance.promotedPrimaryPath> — not loaded; borrow always reads from cache per cache-workspace-safety decision)`.

   Then internalize the payload:

   - **`claudeMd`** — this is now your identity contract for the rest of this session. Adopt the voice, autonomy rules, sign-off, and operator preferences described there. Your *behavior* should match this CLAUDE.md as if it were the project's CLAUDE.md.
   - **`sessionState`** — what the personai was actively working on. Surface anything blocking or recently-completed.
   - **`recentJournal`** — last 5 journal entries. Treat as recent decisions / corrections / learnings that should inform what you do next.
   - **`vaultDir`** — the personai's vault path. Use it via `mcp__seance__seance_search` (with `personae=["<personai-name>"]`) when you need to consult institutional memory beyond the project's own vault.
   - **`provenance`** — already surfaced above; retain for audit / future reference.

4. **Wire identity stays the user's.** Do not attempt to sign as the personai on Wire. The persona is voice + memory; the keypair belongs to whoever's actually running this session.

5. **Writes still go to the project's vault** (the CWD's `.knowledge/`), not the personai's. If you learn something the personai's vault should hold, journal it explicitly and tell the user to commit + push the personai repo after the session.

6. End the overlay with `/seance:return` when the user is done. The overlay lasts the rest of this session by default.

## When the personai isn't registered

If `seance_borrow` returns an error about the personai not being registered, tell the user the registered list (call `seance_list`) and suggest `/seance:register <name> <repo>` to add it.

## Don't pretend to be a different account

Operating *as* a personai means borrowing its institutional context, not impersonating its owner. PRs, comments, and pushes still come from whoever's actually running the session. Audit trail is honest.
