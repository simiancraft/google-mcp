# Build the Gmail Canary on a Shared Tool Factory

**Status:** Draft
**Scope:** cross-stack
**Date:** 2026-06-04
**Last reviewed:** 2026-06-04
**Context:** The monorepo surround is shipped; what's missing is the noun/verb pattern every service copies. Build the shared auth + tool-factory harness, rebuild Gmail in the final shape, prove it live against the real inbox, and distill the repeatable recipe.

## Goal

The surround (tooling, community-health, CI) is live; the actual idiom is not. This plan builds the two shared packages, `@google-mcp/auth` (authorize once per account) and `@google-mcp/harness` (`makeDefineTool` + `createServer`), and rebuilds Gmail as the canary: `tools/` (verbs) and `entities/` (nouns), both zod, all vocabulary lifted from Google's MCP reference pages, which are used for **discovery only** (we reimplement over the Gmail REST API, never call Google's hosted MCP). It covers the official 10 Gmail tools, using the old standalone server as the cheat sheet for handler bodies, proves them live against the real mailbox (old server as oracle), and distills the result into a durable `EXTENDING.md`. Done looks like: `bun run check` green; the new Gmail server lists the 10 tools and returns real mail; `EXTENDING.md` tells you how to add a tool, an entity, and a service. Superset tools and the other four services are recipe-driven follow-ons, out of scope here.

## Domain context

- **Nouns, verbs, one factory.** `entities/<Pascal>.ts` are zod schemas (type inferred) for documented domain objects (`Label`, `LabelColor`, `Thread`, `Draft`, ...). `tools/<tool_name>/` are the verbs, snake_case verbatim from Google. `makeDefineTool<Client>()` (shared) is bound once per service; `createServer({ name, scopes, tools, client })` (shared) spreads the registry into a running server and owns all cross-cutting concerns (error mapping, pagination convention, account injection, `structuredContent` + text fallback, middleware).
- **Per-tool folder.** `schema.ts` (input/output zod, composing entities) + `handler.ts` (the work + `defineTool` assembly, exports the tool) + `handler.test.ts` (colocated; coverage obvious).
- **Docs are discovery only.** The MCP reference pages are the authoritative vocabulary and a diff oracle. The handler reimplements over REST and projects the response into the documented shape (the docs say `labelId`, REST says `id`; the handler bridges). The old standalone server is the cheat sheet for that projection, especially MIME/body parsing.
- **Entity rule (mechanical).** A doc field typed `object (X)` becomes `entities/X.ts`; follow its chain (`Label.color` → `LabelColor`). Inline primitives (`pageToken`, `pageSize`) stay in the tool `schema.ts`. Open `entities/` and it is the complete catalog of nouns.
- **Token reuse for verification.** The old grant at `~/.gmail-mcp/` (`gmail.modify` + `gmail.settings.basic`) authenticates the new server with no re-consent; enough for all 10 tools.
- **Two tiers, one here.** Tier 1 = official MCP 10 (sourced from MCP pages). Tier 2 (send, delete, filters, attachments, batch, sourced from REST) is out of scope; it follows `EXTENDING.md`.

## Current surface area

| Path | State |
|---|---|
| repo root | Surround shipped. `package.json` declares `packages/*` + `services/*` (empty). |
| `packages/`, `services/` | Do not exist yet. |
| `../Gmail-MCP-Server/` | Old standalone server. **Untouched**; live oracle and handler cheat sheet. |
| `~/.gmail-mcp/` | Existing client secret + working token (real account); read for live verification. |

Tier-1 tools: `create_draft`, `create_label`, `get_thread`, `label_message`, `label_thread`, `list_drafts`, `list_labels`, `search_threads`, `unlabel_message`, `unlabel_thread`.

## File structure: after

**Legend:** `+` created, `🔥` deleted

```
google-mcp/
├── 🔥 scaffold-google-mcp-monorepo.md      // retired; surround shipped, remainder folded here
├── + build-gmail-canary-and-harness.md     // this plan
├── + EXTENDING.md                          // durable recipe (extracted at the end)
├── + packages/
│   ├── + google-auth/ { package.json, tsconfig.json, src/{index,config,oauth}.ts }
│   └── + mcp-harness/ { package.json, tsconfig.json, src/{index,defineTool,createServer}.ts }
└── + services/
    └── + gmail/
        ├── + package.json   // private; deps @google-mcp/auth, @google-mcp/harness, googleapis
        ├── + tsconfig.json
        ├── + README.md
        └── + src/
            ├── + index.ts          // createServer({ name:'gmail', scopes, tools, client })
            ├── + defineTool.ts     // makeDefineTool<gmail_v1.Gmail>()
            ├── + scopes.ts         // ['gmail.modify']
            ├── + entities/         // PascalCase zod nouns, discovered page by page
            │   ├── + Label.ts   + LabelColor.ts   + Thread.ts   + Message.ts   + Draft.ts ...
            └── + tools/
                ├── + index.ts      // registry: { search_threads, list_labels, ... }
                ├── + search_threads/ { schema.ts, handler.ts, handler.test.ts }
                ├── + list_labels/    { schema.ts, handler.ts, handler.test.ts }
                ├── + get_thread/     { ... }
                ├── + create_draft/   { ... }
                ├── + list_drafts/    { ... }
                ├── + create_label/   { ... }
                ├── + label_message/  { ... }
                ├── + label_thread/   { ... }
                ├── + unlabel_message/{ ... }
                └── + unlabel_thread/ { ... }
```

## Commits

### Commit 1: Build the shared harness
- `packages/mcp-harness/src/defineTool.ts`: `makeDefineTool<Client>()`, `Tool<Client,I,O>` type.
- `packages/mcp-harness/src/createServer.ts`: stdio server; `ListTools` (input+output JSON Schema via `zod-to-json-schema`); `CallTool` (validate input, run handler, validate output, return `structuredContent` + text fallback, error-wrap); `auth` subcommand hook.
- `index.ts`, `package.json`, `tsconfig.json`.

**Gate:** builds, lints; unit test stamps a fake tool through `defineTool` and drives it through `createServer` (mocked client), asserting in/out validation and `structuredContent`.

### Commit 2: Implement google-auth
- `config.ts` (dir `GOOGLE_MCP_DIR` || `~/.google-mcp`; `GOOGLE_MCP_ACCOUNT`; `SCOPES` union; back-compat resolve of `~/.gmail-mcp`), `oauth.ts` (`authorizedClient(account)`, `runAuthFlow` with `access_type:offline`, `prompt:consent`, `login_hint`, token `0o600`), `index.ts`.

**Gate:** builds, lints; unit test resolves a client from a fixture token.

### Commit 3: Scaffold the Gmail service shell
- `services/gmail` `package.json`/`tsconfig`/`README`; `src/{defineTool,scopes,index}.ts`; empty `tools/index.ts` and `entities/`.

**Gate:** build + typecheck green; server starts, lists zero tools.

### Commit 4: First read tool — search_threads (+ entities it discovers)
- `tools/search_threads/{schema.ts,handler.ts,handler.test.ts}`; `entities/Thread.ts` (and any it chains to). Source URL cited. Registered.

**Gate:** unit test (mocked gmail) passes; build/lint/typecheck; tool listed.

### Commit 5: Live verification against the real inbox
- Run the new server with the `~/.gmail-mcp` token; `search_threads` + `list_labels` return real data; cross-check against the old server (oracle).

**Gate:** new server returns real mail matching the oracle. The "see my email" proof. No writes.

### Commits 6a-6i: Remaining nine Tier-1 tools (same shape)
Each follows Commit 4 verbatim, name swapped, source cited, entities added as discovered: `list_labels` (6a), `get_thread` (6b), `create_label` (6c), `list_drafts` (6d), `create_draft` (6e), `label_message` (6f), `label_thread` (6g), `unlabel_message` (6h), `unlabel_thread` (6i).

**Gate (per tool):** unit test passes; tool listed. **Extra on `create_draft` (6e):** live reversible write — create a draft, confirm it appears, delete it. No send.

### Commit 7: Coverage and conformance note
- `services/gmail/COVERAGE.md`: maps the 10 tools to source pages; Tier-1 = 10/10; lists Tier-2 deliberately deferred (from the discovery doc).

**Gate:** build/lint green; map matches shipped `tools/`.

### Commit 8: Extract the durable recipe
- `EXTENDING.md`: add-a-tool (folder anatomy, source the page, mirror input/output, discover entities, write the projection), add-an-entity, add-a-service (bind `makeDefineTool`, scopes, `createServer`).

**Gate:** `bun run check` green; references real files.

### Commit 9: Delete this plan
- Delete `build-gmail-canary-and-harness.md` (recipe lives in `EXTENDING.md`).

**Gate:** `bun run check` green; no references to the plan file remain.

## Verification checklist

- [ ] `bun run check` green across workspaces.
- [ ] `@google-mcp/harness` stamps and drives a tool with in/out validation + `structuredContent`.
- [ ] `@google-mcp/auth` resolves a client per account; tokens `0o600`.
- [ ] New Gmail server lists all 10 Tier-1 tools.
- [ ] **Live:** reads return real mail matching the old server (oracle).
- [ ] **Live:** `create_draft` creates a visible draft, then it's deleted; nothing sent.
- [ ] `entities/` holds every documented noun the 10 tools reference; each tool cites its source URL.
- [ ] `EXTENDING.md` documents add-a-tool, add-an-entity, add-a-service.
- [ ] Old standalone server untouched.
- [ ] Plan file deleted (Inspector Gadget Rule).

## References

- Gmail MCP tool reference (discovery source): `https://developers.google.com/workspace/gmail/api/reference/mcp/tools_list/<tool>`
- Gmail discovery document: `https://gmail.googleapis.com/$discovery/rest?version=v1`
- `../Gmail-MCP-Server/src/{auth,index,mime}.ts` — lifted OAuth flow, bootstrap shape, body projection cheat sheet.
- `~/.gmail-mcp/` — existing client secret + token for live verification.
