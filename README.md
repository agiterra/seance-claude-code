# @agiterra/seance-claude-code

> Borrow AI personae in Claude Code. Slash commands + MCP tools on top of [`@agiterra/seance-tools`](https://github.com/agiterra/seance-tools).

A *personai* is data: a `CLAUDE.md` identity contract + a `.knowledge/` vault, both versioned in a GitHub repo. This plugin makes borrowing one a one-command operation:

```
/seance:register alex workshop162/Alex
/seance:summon alex
```

After `summon`, your session takes on the personai's identity (voice, autonomy rules, vault access) while you continue signing on Wire as yourself. Drop it with `/seance:return`.

## Quick setup

**Pre-release direct install** (current — soak-testing before central marketplace publish):

This repo is its own one-plugin marketplace.

```
/plugin marketplace add agiterra/seance-claude-code
/plugin install seance@seance-claude-code
```

**Once promoted to `agiterra/claude-marketplace`** (TBD — after v0.1.0 soak):

```
/plugin marketplace add agiterra/claude-marketplace
/plugin install seance@agiterra
```

### Prerequisites
- Bun (https://bun.sh) — the plugin bootstraps it via `ensure-bun.sh` if missing
- A registered personai repo

## Skills

- `/seance:register <name> <repo>` — add a personai to the local cache
- `/seance:list` — show registered personae
- `/seance:summon <name>` — pull latest, take on the persona
- `/seance:return` — drop the persona overlay
- `/seance:lookup <query> [<name>...]` — multi-vault search
- `/seance:unregister <name>` — remove from the registry

## MCP tools

Surfaced under namespace `seance`:

- `seance_register(name, repo)`
- `seance_list()`
- `seance_borrow(name)` — returns the overlay payload (`claudeMd`, `sessionState`, `recentJournal`, `vaultDir`)
- `seance_search(query, personae[], top_k?)` — multi-vault hybrid search
- `seance_unregister(name)`

LLMs and external clients can drive the same primitives without going through slash commands.

## How borrow works

1. `/seance:summon alex` runs `seance_borrow` via MCP.
2. The tool pulls latest of `workshop162/Alex` into `~/.agiterra/personai/alex/`.
3. Returns a JSON payload containing the personai's `CLAUDE.md`, current `session-state.md`, last 5 journal entries, and vault path.
4. The skill body tells Claude to *internalize* the CLAUDE.md as the session's identity contract for the duration of the borrow.
5. Wire signing identity remains the user's. The personai contributes voice + memory, not keypair.

## How search works

`seance_search` composes on `agiterra/knowledge-tools/vector-search.py --vault <path>`. Each loaded vault is queried at `--top 50`, results are merged by raw cosine score (same embedding model across vaults → directly comparable), and the unified top-K is returned with vault-origin labels. **Zero upstream change to `@agiterra/knowledge` required.**

## License

MIT
