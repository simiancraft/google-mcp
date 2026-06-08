<h1 align="center">google-mcp-suite</h1>

<p align="center">
  <strong>Drive your entire Google Workspace agentically, across every account you have.</strong><br />
  A suite of independent REST + <a href="https://modelcontextprotocol.io/">MCP</a> servers, one per Google service, that lets an AI agent search, read, write, organize, and send across Gmail, Drive, Sheets, Docs, and Calendar; on as many accounts as you run.
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

Point an AI agent at your Google Workspace and let it do the work: triage and send mail, manage files, edit spreadsheets and documents, schedule events; across all of your accounts at once. The end goal is an agent that can simply operate your Workspace and hand you results.

- **REST + MCP in one surface.** Each server exposes the curated MCP toolset *and* the full REST method set of its Google API, so an agent gets the maximum capability of the service, not a thin slice. Every server's live surface is generated into a `CAPABILITIES.md`.
- **Several accounts, in parallel.** Identity is bound to a running instance, not passed per call, so an agent can act across your accounts at once and cannot act on the wrong one.
- **Siloed by design.** Each service runs as its own independent server in its own lane; the orchestrating agent is the single thing that coordinates them.
- **Built to be trusted.** One folder per operation, input and output schemas validated on every call, vocabulary sourced from Google's own docs, and 100% test coverage.
- **Set up without yak-shaving.** A `google-mcp-doctor` CLI checks your OAuth client, authorizes each account, and wires the servers into your MCP client.

The suite ships as `google-mcp-suite`; each service is also installable on its own as `google-mcp-<service>` (for example `google-mcp-gmail`).

## Quickstart

<!-- QUICKSTART: owned by the doctor/auth onboarding work; fill this in there. -->

> **Quickstart goes here.** Setup is driven by the `google-mcp-doctor` CLI (OAuth client, per-account authorization, and MCP-client wiring); this section lands with the doctor.

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
