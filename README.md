<h1 align="center">google-mcp-suite</h1>

<p align="center">
  <img src="https://img.shields.io/badge/coverage-100%25-brightgreen.svg" alt="Coverage 100%" />
  &nbsp;
  <img src="https://img.shields.io/badge/types-strict-3178c6.svg" alt="Strict TypeScript" />
  &nbsp;
  <img src="https://img.shields.io/badge/status-pre--release-orange.svg" alt="Pre-release" />
  &nbsp;
  <a href="./LICENSE"><img src="https://img.shields.io/badge/license-MIT-yellow.svg" alt="License: MIT" /></a>
</p>

<p align="center">
  <strong>A Google Workspace MCP server you can read in an afternoon.</strong><br />
  Two internal concepts (an operation and a server function), a folder tree that mirrors Google's own API reference page-for-page, every Google REST method plus a curated <a href="https://modelcontextprotocol.io/">MCP</a> toolset in one surface, and 100% test coverage. Gmail ships today.
</p>

<p align="center">
  <img src=".github/assets/gmail.svg" height="44" alt="Gmail" title="Gmail (shipping)" />
  &nbsp;&nbsp;&nbsp;
  <img src=".github/assets/drive.svg" height="44" alt="Drive (planned)" title="Drive (planned)" />
  &nbsp;&nbsp;&nbsp;
  <img src=".github/assets/sheets.svg" height="44" alt="Sheets (planned)" title="Sheets (planned)" />
  &nbsp;&nbsp;&nbsp;
  <img src=".github/assets/docs.svg" height="44" alt="Docs (planned)" title="Docs (planned)" />
  &nbsp;&nbsp;&nbsp;
  <img src=".github/assets/calendar.svg" height="44" alt="Calendar (planned)" title="Calendar (planned)" />
</p>

<p align="center">
  <sub><strong>Gmail</strong> ships today; Drive, Sheets, Docs, and Calendar are on the way (shown dimmed).</sub>
</p>

> **Status:** pre-release. Interfaces and layout will move until the first tagged release.

## What it does

Point an AI agent at your Google Workspace and let it do the work: triage and send mail today, manage files and edit documents as those services land. The end goal is an agent that operates your Workspace and hands you results.

The design has two internal concepts and nothing else:

1. An **operation** is a folder of `schema.ts` + `handler.ts` + `handler.test.ts`, built with `defineTool` or `defineMethod`.
2. A **server function**, `createServer(...)`, wires those operations into a running MCP server.

That is the whole surface. Read one operation folder and you understand all of them.

- **REST plus MCP in one surface.** Each server exposes the curated MCP toolset *and* the full REST method set of its Google API, so an agent gets the service's full capability, not a thin slice. Gmail ships with 33 operations today: 10 curated MCP tools plus 23 REST methods. Every server's live surface is generated into a `CAPABILITIES.md`.
- **The folder tree mirrors Google's docs.** A Google tools-list reference page becomes a `tools/` folder; a Google REST method reference page becomes a `methods/` folder. If you can find the operation in Google's docs, you can find it in this repo.

| Google's reference page | This repo's folder |
|---|---|
| A tools-list page (curated MCP toolset) | `tools/<operation>/` |
| A REST method reference page | `methods/<operation>/` |

- **Several accounts, in parallel.** Identity is bound to a running instance, not passed per call, so an agent can act across your accounts at once and cannot act on the wrong one.
- **Siloed by design.** Each service runs as its own independent server in its own lane; the orchestrating agent is the single thing that coordinates them.
- **Built to be trusted.** Input and output schemas are validated on every call, vocabulary is sourced from Google's own docs, types are strict (NodeNext ESM, `verbatimModuleSyntax`, `noUncheckedIndexedAccess`), and coverage is pinned at 100% in `bunfig.toml`.

Packaged as a Bun workspace monorepo. It publishes as `google-mcp-suite`, with each service also installable on its own as `google-mcp-<service>` (for example `google-mcp-gmail`).

## Quickstart

<!-- QUICKSTART: owned by the doctor/auth onboarding work; fill this in there. -->

> **Quickstart goes here.** Setup is driven by the `google-mcp-doctor` CLI (OAuth client, per-account authorization, and MCP-client wiring); this section lands with the doctor.

## Layout

```
packages/
  google-auth/    # shared OAuth: one client secret, per-account tokens
  mcp-harness/    # the protocol: makeDefineTool + createServer
services/
  gmail/          # reference (canary) server; new services mirror its shape
```

- **`packages/google-auth`** owns authentication. A service imports it and calls `authorizedClient(account)` to get an authenticated Google client.
- **`packages/mcp-harness`** owns the protocol: `makeDefineTool<Client>()` and `createServer(...)`. A service never reimplements the MCP server.
- **`services/*`** are the MCP servers. Each holds its source under `src/`: `index.ts` (bootstrap), then a folder per operation under `tools/` (MCP-sourced verbs) and `methods/` (REST-sourced verbs), each folder holding `schema.ts` + `handler.ts` + `handler.test.ts`. Shared zod nouns live in `entities/`, projection helpers in `lib/`, and the per-service factory bindings (`defineTool.ts`, `defineMethod.ts`) sit at `src/` root.

```
services/gmail/src/
  index.ts        # createServer({ name, tools, methods, client })
  defineTool.ts   # makeDefineTool<gmail_v1.Gmail>() for MCP-sourced ops
  defineMethod.ts # makeDefineTool<gmail_v1.Gmail>() for REST-sourced ops
  tools/          # curated MCP operations, one folder each
  methods/        # REST operations, same construction
  entities/       # shared zod nouns (Label, Thread, Draft, ...)
  lib/            # projection helpers (REST entity -> documented shape)
```

## The multi-account model

- **One OAuth app.** A single Google Cloud OAuth client (`client_secret`) is shared across every service.
- **One token per account.** Each account is authorized once, granted the full scope union for all services. Tokens are stored per account, outside the repo.
- **Identity by instance.** A running server is bound to one account via the `GOOGLE_MCP_ACCOUNT` environment variable. To command three accounts, you run three instances of a service, each with a different `GOOGLE_MCP_ACCOUNT`. There is no per-call account argument, so a server cannot act on the wrong account.

## Auth setup

Authorization is a one-time, per-account browser consent flow.

1. Create a Google Cloud project, enable the APIs you need (Gmail, Drive, ...), and create an **OAuth client** (Desktop app). Download the client secret JSON.
2. Place the client secret where `packages/google-auth` expects it (see its README), outside the repo tree.
3. Authorize each account once; this opens a browser consent flow and stores that account's token.
4. Run a service with `GOOGLE_MCP_ACCOUNT=<account>` to act as that account.

A `google-mcp-doctor` CLI that automates the OAuth-client check, per-account authorization, and MCP-client wiring is in progress; until it lands, the four steps above are the path.

Credentials never live in the repo. Tokens and the client secret live in the ignored `~/.google-mcp/` config directory, and `.gitignore` also blocks common credential filenames.

## Development

```sh
bun install
bun run check     # lint-fix, build, typecheck, test, knip across all workspaces
```

See [CONTRIBUTING.md](./CONTRIBUTING.md) for the full task list and [AGENTS.md](./AGENTS.md) for the per-service pattern.

## Services

| Service | Status |
|---|---|
| Gmail | reference / canary |
| Drive | planned |
| Sheets | planned |
| Docs | planned |
| Calendar | planned |

---

<p align="center">
  <a href="https://github.com/simiancraft/google-mcp-suite" title="google-mcp-suite on GitHub"><img src=".github/assets/github.svg" height="18" alt="GitHub" /></a>
  &nbsp;&nbsp;&nbsp;
  <a href="https://x.com/5imian" title="Jesse Harlin on X"><img src=".github/assets/x.svg" height="16" alt="X" /></a>
  &nbsp;&nbsp;&nbsp;
  <a href="https://ko-fi.com/the_simian0604" title="Tip on Ko-fi"><img src=".github/assets/coffee.svg" height="18" alt="Ko-fi" /></a>
</p>

<p align="center"><sub><a href="./LICENSE">MIT</a>. Google product names are used nominatively; see <a href="./NOTICE.md">NOTICE.md</a>; not affiliated with Google LLC. Crafted with care by <a href="https://simiancraft.com"><img src=".github/assets/simiancraft.svg" height="12" alt="" />&nbsp;Simiancraft</a>.</sub></p>
