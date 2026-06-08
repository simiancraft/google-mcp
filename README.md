# google-mcp-suite

[![CI](https://github.com/simiancraft/google-mcp-suite/actions/workflows/ci.yml/badge.svg)](https://github.com/simiancraft/google-mcp-suite/actions/workflows/ci.yml)
[![codecov](https://codecov.io/gh/simiancraft/google-mcp-suite/branch/main/graph/badge.svg)](https://codecov.io/gh/simiancraft/google-mcp-suite)
[![OpenSSF Scorecard](https://api.securityscorecards.dev/projects/github.com/simiancraft/google-mcp-suite/badge)](https://securityscorecards.dev/viewer/?uri=github.com/simiancraft/google-mcp-suite)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)

One [Model Context Protocol](https://modelcontextprotocol.io/) server per Google service, built to command **several Google accounts at once**. Each server is thin, authorized per account, and shares a single OAuth implementation.

> **Status:** Gmail is implemented and usable today; Drive, Sheets, Docs, and Calendar are next. Interfaces may still move before the first tagged release.

## Why

Commanding multiple Google accounts means running one server instance per account, and covering multiple services (Gmail, Drive, Sheets, Docs, Calendar) means one server each. Writing OAuth once and sharing it keeps every server a thin set of operations instead of a re-implemented auth client.

### MCP, and then some

This is an MCP server, and deliberately more than one. Google publishes an MCP toolset for some services, but that toolset is a small slice of what each API can do; you cannot fully instrument an account with it alone. The goal here is to **fully empower an agent across several Google accounts and services**, so each server exposes two surfaces under one wire protocol:

- **`tools/`** mirrors Google's **MCP toolset** reference, verbatim.
- **`methods/`** covers the broader **REST** reference, the operations the MCP toolset omits.

The split is Google's own (its MCP reference and its REST reference are separate trees); we keep it on disk on purpose and unify it operationally (one `Operation` type, one merged wire surface where everything is an MCP tool). The breadth of the operation list is the evidence that MCP alone is not enough for real work. Keeping the two sourced surfaces separate makes the suite self-documenting and enables **documentation-driven updates**: point at a Google reference page and generate the matching `schema.ts`/`handler.ts`/`index.ts`, with each source page bounding the context of one unit of work.

## Layout

```
src/
  auth/      # shared OAuth: one client secret, per-account tokens
  lib/       # the two MCP primitives: operation() + server()
  gmail/     # the Gmail server (reference/canary); new services mirror its shape
```

One package, one version. `auth`, `lib`, and each service are folders in one `src/` and compile to a single published package.

- **`src/auth`** owns authentication. A service imports it and calls `authorizedClient(account)` to get an authenticated Google client.
- **`src/lib`** owns the protocol with two primitives: `operation()` (a typed definition every operation conforms to) and `server()` (turns a service's operations into a running stdio MCP server). A service never reimplements the MCP server.
- **`src/<service>`** is a server: `index.ts` (bootstrap) plus a folder per operation under `tools/` (MCP-sourced verbs) and `methods/` (REST-sourced verbs), each holding `schema.ts` + `handler.ts` + `index.ts` + `handler.test.ts`; shared zod nouns live in `entities/` and projections in `lib/`.

## The multi-account model

- **One OAuth app.** A single Google Cloud OAuth client (`client_secret`) is shared across every service.
- **One token per account.** Each account is authorized once, granted the full scope union for all services. Tokens are stored per account, outside the repo.
- **Identity by instance.** A running server is bound to one account via the `GOOGLE_MCP_ACCOUNT` environment variable. To command three accounts, you run three instances of a service, each with a different `GOOGLE_MCP_ACCOUNT`. There is no per-call account argument, so a server cannot act on the wrong account.

## Auth setup

1. Create a Google Cloud project, enable the APIs you need (Gmail, Drive, ...), and create an **OAuth client** (Desktop app). Download the client secret JSON.
2. Place the client secret where `src/auth` expects it (see [its README](./src/auth/README.md)), outside the repo tree.
3. Authorize each account once; this opens a browser consent flow and stores that account's token.
4. Run a service with `GOOGLE_MCP_ACCOUNT=<account>` to act as that account.

Credentials never live in the repo. `.gitignore` blocks the common filenames; keep tokens and the client secret in the canonical config directory.

For the full, step-by-step Google Cloud walkthrough (enabling APIs, declaring scopes, consent-screen and test-user setup, and what an agent can automate), see [PROVISIONING.md](./PROVISIONING.md).

## Development

```sh
bun install
bun run check     # lint-fix, build, typecheck, test, knip
```

See [CONTRIBUTING.md](./CONTRIBUTING.md) for the full task list and [AGENTS.md](./AGENTS.md) for the per-service pattern.

## Services

| Service | Status | Coverage |
|---|---|---|
| **Gmail** | ✅ Implemented | [33 operations](./src/gmail/CAPABILITIES.md): threads, messages, drafts, labels, filters, attachments |
| Drive | 🔜 Planned | files, folders, sharing, revisions |
| Sheets | 🔜 Planned | spreadsheets, values, formatting |
| Docs | 🔜 Planned | documents, structured content |
| Calendar | 🔜 Planned | events, calendars, availability |

Gmail is the reference (canary) implementation; each new service mirrors its shape. See its [capability list](./src/gmail/CAPABILITIES.md) for the full operation set.

## License

[MIT](./LICENSE). Google product names are used nominatively; see [NOTICE.md](./NOTICE.md). This project is not affiliated with Google LLC.
