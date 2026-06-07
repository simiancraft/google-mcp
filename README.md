# google-mcp

[![CI](https://github.com/simiancraft/google-mcp/actions/workflows/ci.yml/badge.svg)](https://github.com/simiancraft/google-mcp/actions/workflows/ci.yml)
[![codecov](https://codecov.io/gh/simiancraft/google-mcp/branch/main/graph/badge.svg)](https://codecov.io/gh/simiancraft/google-mcp)
[![OpenSSF Scorecard](https://api.securityscorecards.dev/projects/github.com/simiancraft/google-mcp/badge)](https://securityscorecards.dev/viewer/?uri=github.com/simiancraft/google-mcp)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)

One [Model Context Protocol](https://modelcontextprotocol.io/) server per Google service, built to command **several Google accounts at once**. Each server is thin, authorized per account, and shares a single OAuth implementation.

> **Status:** Gmail is implemented and usable today; Drive, Sheets, Docs, and Calendar are next. Interfaces may still move before the first tagged release.

## Why

Commanding multiple Google accounts means running one server instance per account, and covering multiple services (Gmail, Drive, Sheets, Docs, Calendar) means one server each. Writing OAuth once and sharing it keeps every server a thin set of operations instead of a re-implemented auth client.

## Layout

```
packages/
  google-auth/   # shared OAuth: one client secret, per-account tokens
services/
  gmail/         # reference (canary) server; new services mirror its shape
```

- **`packages/google-auth`** owns authentication. A service imports it and calls `authorizedClient(account)` to get an authenticated Google client.
- **`packages/mcp-harness`** owns the protocol: `makeDefineTool<Client>()` and `createServer(...)`. A service never reimplements the MCP server.
- **`services/*`** are the MCP servers. Each is `index.ts` (bootstrap) plus a folder per operation under `tools/` (MCP-sourced verbs) and `methods/` (REST-sourced verbs), each folder holding `schema.ts` + `handler.ts` + `handler.test.ts`; shared zod nouns live in `entities/` and projections in `lib/`.

## The multi-account model

- **One OAuth app.** A single Google Cloud OAuth client (`client_secret`) is shared across every service.
- **One token per account.** Each account is authorized once, granted the full scope union for all services. Tokens are stored per account, outside the repo.
- **Identity by instance.** A running server is bound to one account via the `GOOGLE_MCP_ACCOUNT` environment variable. To command three accounts, you run three instances of a service, each with a different `GOOGLE_MCP_ACCOUNT`. There is no per-call account argument, so a server cannot act on the wrong account.

## Auth setup

1. Create a Google Cloud project, enable the APIs you need (Gmail, Drive, ...), and create an **OAuth client** (Desktop app). Download the client secret JSON.
2. Place the client secret where `packages/google-auth` expects it (see its README), outside the repo tree.
3. Authorize each account once; this opens a browser consent flow and stores that account's token.
4. Run a service with `GOOGLE_MCP_ACCOUNT=<account>` to act as that account.

Credentials never live in the repo. `.gitignore` blocks the common filenames; keep tokens and the client secret in the canonical config directory.

## Development

```sh
bun install
bun run check     # lint-fix, build, typecheck, test, knip across all workspaces
```

See [CONTRIBUTING.md](./CONTRIBUTING.md) for the full task list and [AGENTS.md](./AGENTS.md) for the per-service pattern.

## Services

| Service | Status | Coverage |
|---|---|---|
| **Gmail** | ✅ Implemented | [33 operations](./services/gmail/CAPABILITIES.md): threads, messages, drafts, labels, filters, attachments |
| Drive | 🔜 Planned | files, folders, sharing, revisions |
| Sheets | 🔜 Planned | spreadsheets, values, formatting |
| Docs | 🔜 Planned | documents, structured content |
| Calendar | 🔜 Planned | events, calendars, availability |

Gmail is the reference (canary) implementation; each new service mirrors its shape. See its [capability list](./services/gmail/CAPABILITIES.md) for the full operation set.

## License

[MIT](./LICENSE). Google product names are used nominatively; see [NOTICE.md](./NOTICE.md). This project is not affiliated with Google LLC.
