#!/usr/bin/env bun
// MCP server for seance — exposes personai borrow primitives as tools.
//
// Composes on @agiterra/seance-tools (runtime-agnostic core). Skills in
// skills/ wrap these tools with prompts that tell Claude how to invoke
// them and what to do with the result (e.g. inject borrow payload as
// persona overlay).

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import {
  borrowPersonai,
  listPersonae,
  multiVaultSearch,
  registerPersonai,
  unregisterPersonai,
} from "@agiterra/seance-tools";
import { homedir } from "node:os";
import { join } from "node:path";

const TOOLS = [
  {
    name: "seance_register",
    description:
      "Register a personai by GitHub repo. After this, the personai can be borrowed via seance_borrow.",
    inputSchema: {
      type: "object",
      properties: {
        name: {
          type: "string",
          description: "Short kebab-case name (e.g. 'alex', 'mochi').",
        },
        repo: {
          type: "string",
          description:
            "Repo spec — 'owner/repo' shorthand or full HTTPS/SSH URL.",
        },
      },
      required: ["name", "repo"],
    },
  },
  {
    name: "seance_list",
    description: "List locally registered personae with their repos and last-pulled commit SHAs.",
    inputSchema: { type: "object", properties: {} },
  },
  {
    name: "seance_borrow",
    description:
      "Pull latest of a registered personai and return the overlay payload (CLAUDE.md, session-state, recent journal entries, vault path).",
    inputSchema: {
      type: "object",
      properties: {
        name: { type: "string", description: "Personai name." },
      },
      required: ["name"],
    },
  },
  {
    name: "seance_search",
    description:
      "Multi-vault hybrid search across the current project vault (CWD/.knowledge) and any number of borrowed personai vaults. Returns top-K results labeled by vault.",
    inputSchema: {
      type: "object",
      properties: {
        query: { type: "string", description: "Search query." },
        personae: {
          type: "array",
          items: { type: "string" },
          description: "Personae to include in the search (besides CWD's vault).",
        },
        top_k: {
          type: "number",
          description: "Number of merged results to return (default: 10).",
        },
      },
      required: ["query"],
    },
  },
  {
    name: "seance_unregister",
    description: "Remove a personai from the local registry. Does not delete the cache directory.",
    inputSchema: {
      type: "object",
      properties: { name: { type: "string" } },
      required: ["name"],
    },
  },
] as const;

const server = new Server(
  { name: "seance", version: "0.1.0" },
  {
    capabilities: { tools: {} },
    instructions:
      "Personai borrow primitives. Use seance_borrow to load a personai's overlay payload, then deliver its CLAUDE.md content as a user-message-style persona overlay in the running session. Wire signing identity stays with the user; the borrowed personai contributes voice, vault, and history.",
  },
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [...TOOLS],
}));

server.setRequestHandler(CallToolRequestSchema, async (req) => {
  const { name, arguments: args = {} } = req.params;
  const a = args as Record<string, unknown>;
  try {
    let result: unknown;
    switch (name) {
      case "seance_register":
        result = registerPersonai(a.name as string, a.repo as string);
        break;
      case "seance_list":
        result = listPersonae();
        break;
      case "seance_borrow":
        result = borrowPersonai(a.name as string);
        break;
      case "seance_search": {
        const cwd = process.cwd();
        const personae = (a.personae as string[]) ?? [];
        const vaults = [
          { label: "project", vaultDir: join(cwd, ".knowledge") },
          ...personae.map((p) => ({
            label: p,
            vaultDir: join(homedir(), ".agiterra", "personai", p, ".knowledge"),
          })),
        ];
        result = multiVaultSearch(a.query as string, vaults, (a.top_k as number) ?? 10);
        break;
      }
      case "seance_unregister": {
        const ok = unregisterPersonai(a.name as string);
        result = { unregistered: ok ? (a.name as string) : null };
        break;
      }
      default:
        throw new Error(`Unknown tool: ${name}`);
    }
    return {
      content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
    };
  } catch (e) {
    return {
      isError: true,
      content: [{ type: "text", text: `error: ${(e as Error).message}` }],
    };
  }
});

await server.connect(new StdioServerTransport());
