<h1 align="center">google-mcp-suite</h1>

<p align="center">
  <a href="https://www.npmjs.com/package/google-mcp-suite"><img src="https://img.shields.io/npm/v/google-mcp-suite.svg" alt="npm" /></a>
  &nbsp;
  <a href="https://github.com/simiancraft/google-mcp-suite/actions/workflows/ci.yml"><img src="https://github.com/simiancraft/google-mcp-suite/actions/workflows/ci.yml/badge.svg" alt="CI" /></a>
  &nbsp;
  <a href="https://codecov.io/gh/simiancraft/google-mcp-suite"><img src="https://codecov.io/gh/simiancraft/google-mcp-suite/branch/main/graph/badge.svg" alt="codecov" /></a>
  &nbsp;
  <a href="https://securityscorecards.dev/viewer/?uri=github.com/simiancraft/google-mcp-suite"><img src="https://api.securityscorecards.dev/projects/github.com/simiancraft/google-mcp-suite/badge" alt="OpenSSF Scorecard" /></a>
  &nbsp;
  <a href="./LICENSE"><img src="https://img.shields.io/badge/license-MIT-yellow.svg" alt="License: MIT" /></a>
</p>

<p align="center">
  <strong>Google Workspace MCP servers you can read in an afternoon, one per service.</strong><br />
  The curated <a href="https://modelcontextprotocol.io/">MCP</a> toolset plus the broader REST surface for Gmail, Google Calendar, Google Drive, Google Docs, and Google Sheets, one server per service per account: <strong>132 self-describing operations</strong> across five Google services, so an AI agent (Claude, Cursor, or any MCP client) can do (nearly) anything your accounts can, on several accounts at once, and never on the wrong one. Every operation cites its Google reference page and validates input and output; test coverage is pinned at 100%.
</p>

<p align="center">
  <img src=".github/assets/gmail.svg" height="44" alt="Gmail" title="Gmail" />
  &nbsp;&nbsp;&nbsp;
  <img src=".github/assets/calendar.svg" height="44" alt="Calendar" title="Calendar" />
  &nbsp;&nbsp;&nbsp;
  <img src=".github/assets/sheets.svg" height="44" alt="Sheets" title="Sheets" />
  &nbsp;&nbsp;&nbsp;
  <img src=".github/assets/docs.svg" height="44" alt="Docs" title="Docs" />
  &nbsp;&nbsp;&nbsp;
  <img src=".github/assets/drive.svg" height="44" alt="Drive" title="Drive" />
</p>

<p align="center">
  <sub><strong>132 operations</strong> ship today: <strong>Gmail</strong> (<a href="./src/gmail/CAPABILITIES.md">33</a>), <strong>Calendar</strong> (<a href="./src/calendar/CAPABILITIES.md">25</a>), <strong>Sheets</strong> (<a href="./src/sheets/CAPABILITIES.md">30</a>), <strong>Docs</strong> (<a href="./src/docs/CAPABILITIES.md">9</a>), and <strong>Drive</strong> (<a href="./src/drive/CAPABILITIES.md">35</a>).</sub>
</p>

<p align="center"><sub><strong>Replacing a built-in connector?</strong> Hand your agent <a href="./ADOPTING.md">ADOPTING.md</a>: the playbook to adopt, supersede, verify, and decommission.</sub></p>

## What it does

Point an AI agent at your Google accounts and let it do the work: triage and send mail, run your calendars, read and write your spreadsheets, draft and edit documents, and manage your files and shared drives. The end goal is an agent that operates your accounts and hands you results.

The design has two internal concepts and nothing else:

1. An **operation** is a folder of `schema.ts` + `handler.ts` + `index.ts` + `handler.test.ts`, conforming to one `operation()` shape.
2. A **server function**, `server(...)`, wires those operations into a running MCP server.

That is the whole surface. Read one operation folder and you understand all of them.

- **REST plus MCP in one surface.** Each server exposes the curated MCP toolset *and* the broader REST method set of its Google API, so an agent gets far more than a thin slice. Gmail ships with [33 operations](./src/gmail/CAPABILITIES.md) (10 curated MCP tools plus 23 REST methods), Calendar with [25](./src/calendar/CAPABILITIES.md) (8 plus 17), Drive with [35](./src/drive/CAPABILITIES.md) (8 plus 27), Sheets with [30](./src/sheets/CAPABILITIES.md), and Docs with [9](./src/docs/CAPABILITIES.md) (Google publishes no MCP toolset for Sheets or Docs, so those are REST-sourced throughout); the split is explained in [MCP, and then some](#mcp-and-then-some).
- **The folder tree mirrors Google's docs.** A Google tools-list reference page becomes a `tools/` folder; a Google REST method reference page becomes a `methods/` folder. If you can find the operation in Google's docs, you can find it in this repo.

| Google's reference page | This repo's folder |
|---|---|
| A tools-list page (curated MCP toolset) | `tools/<operation>/` |
| A REST method reference page | `methods/<operation>/` |

- **Multiple accounts, in parallel.** Identity is bound to a running instance, not passed per call, so an agent can act across your accounts at once and cannot act on the wrong one.
- **Siloed by design.** Each service runs as its own independent server in its own lane; the orchestrating agent is the single thing that coordinates them.
- **Strict by construction.** Input and output schemas are validated on every call, vocabulary is sourced from Google's own docs, types are strict (NodeNext ESM, `verbatimModuleSyntax`, `noUncheckedIndexedAccess`), and coverage is pinned at 100% in `bunfig.toml`.

One package, one version: everything compiles into `google-mcp-suite`, which ships a bin per service (`google-mcp-gmail`, `google-mcp-calendar`, `google-mcp-sheets`, `google-mcp-docs`, and `google-mcp-drive` today) plus the `google-mcp-doctor` setup CLI. A `google-mcp-suite` front-door bin dispatches to any of them (`npx google-mcp-suite gmail`), which is also what lets MCP registries launch the suite from its package name alone.

## MCP, and then some

This is an MCP server, and deliberately more than one. Google publishes an MCP toolset for some services, but that toolset is a small slice of what each API can do; you cannot fully instrument an account with it alone. Calendar makes the gap concrete: Google's curated Calendar toolset is 8 tools; the API has 25 worth having, and this server ships all of them. The goal here is to **fully empower an agent across several Google accounts and services**, so each server exposes two surfaces under one wire protocol:

- **`tools/`** mirrors Google's **MCP toolset** reference, verbatim.
- **`methods/`** covers the broader **REST** reference, the operations the MCP toolset omits.

The split is Google's own (its MCP reference and its REST reference are separate trees); we keep it on disk on purpose and unify it operationally (one `Operation` type, one merged wire surface where everything is an MCP tool). The breadth of [the operation list](./src/gmail/CAPABILITIES.md) is the evidence that MCP alone is not enough for real work. Sheets and Docs are the limit case: Google publishes no MCP toolset for either, so those servers are methods-only ([30](./src/sheets/CAPABILITIES.md) and [9](./src/docs/CAPABILITIES.md) operations sourced entirely from the REST reference). Keeping the two sourced surfaces separate also makes each new operation a bounded, documentation-driven unit of work; the recipe is in [EXTENDING.md](./EXTENDING.md).

## Quickstart

One thing first: a Google Cloud OAuth client (roughly ten minutes of console clicks, once; the friction is Google's, not ours). [PROVISIONING.md](./PROVISIONING.md) walks every click, and `doctor` tells you which step you are on.

**Driving this with an agent?** Hand it [ADOPTING.md](./ADOPTING.md): the literal adopt, supersede-the-built-ins, verify, and decommission playbook, with a hand-off prompt to paste.

```sh
npm install -g google-mcp-suite

google-mcp-doctor scopes                      # the exact APIs + scopes to enable in Google Cloud
google-mcp-doctor auth personal@example.com   # browser consent; writes the account token
google-mcp-doctor auth work@example.com       # once per account
google-mcp-doctor                             # provisioned, authorized, reachable?
```

Then point your MCP client at the servers, one instance per service per account:

```json
{
  "mcpServers": {
    "gmail-personal": {
      "command": "google-mcp-gmail",
      "env": { "GOOGLE_MCP_ACCOUNT": "personal@example.com" }
    },
    "gmail-work": {
      "command": "google-mcp-gmail",
      "env": { "GOOGLE_MCP_ACCOUNT": "work@example.com" }
    },
    "calendar-personal": {
      "command": "google-mcp-calendar",
      "env": { "GOOGLE_MCP_ACCOUNT": "personal@example.com" }
    },
    "calendar-work": {
      "command": "google-mcp-calendar",
      "env": { "GOOGLE_MCP_ACCOUNT": "work@example.com" }
    },
    "sheets-work": {
      "command": "google-mcp-sheets",
      "env": { "GOOGLE_MCP_ACCOUNT": "work@example.com" }
    },
    "docs-work": {
      "command": "google-mcp-docs",
      "env": { "GOOGLE_MCP_ACCOUNT": "work@example.com" }
    },
    "drive-work": {
      "command": "google-mcp-drive",
      "env": { "GOOGLE_MCP_ACCOUNT": "work@example.com" }
    }
  }
}
```

The `GOOGLE_MCP_ACCOUNT` value must be the same string `doctor auth` was given;
a bare email is its own account label. For short aliases (`personal`, `work`)
write the optional roster first, as [ADOPTING.md](./ADOPTING.md) step 3 does.

Then ask your agent for something no single-account tool can do:

> Find a free 30-minute window next week that works across my work and personal calendars, book it on the work calendar with a Meet link, email the invite summary to my personal address, and log the booking in my scheduling spreadsheet.

## Layout

```
src/
  auth/      # shared OAuth: one client secret, per-account tokens
  lib/       # the two MCP primitives: operation() + server()
  suite/     # google-mcp-suite: the front-door bin; dispatches to a service or doctor
  doctor/    # google-mcp-doctor: provisioning + auth-health CLI
  gmail/     # the Gmail server (reference/canary); new services mirror its shape
  calendar/  # the Calendar server; same shape
  sheets/    # the Sheets server; same shape, methods-only (no Google MCP toolset)
  docs/      # the Docs server; same shape, methods-only
  drive/     # the Drive server; same shape (MCP toolset + REST methods)
```

One package, one version. `auth`, `lib`, `doctor`, and each service are folders in one `src/` and compile to a single published package.

- **`src/auth`** owns authentication. A service imports it and calls `authorizedClient(account)` to get an authenticated Google client.
- **`src/lib`** owns the protocol with two primitives: `operation()` (a typed definition every operation conforms to) and `server()` (turns a service's operations into a running stdio MCP server). A service never reimplements the MCP server.
- **`src/doctor`** is the setup and health CLI; it knows the services, never the other way around. See [its README](./src/doctor/README.md).
- **`src/<service>`** is a server: `index.ts` (bootstrap) plus a folder per operation under `tools/` (MCP-sourced verbs) and `methods/` (REST-sourced verbs), each holding `schema.ts` + `handler.ts` + `index.ts` + `handler.test.ts`; shared zod nouns live in `entities/` and projections in `lib/`.

## The multi-account model

- **One OAuth app.** A single Google Cloud OAuth client (`client_secret`) is shared across every service.
- **One token per account.** Each account is authorized once, granted the full scope union for all services. Tokens are stored per account, outside the repo. The account name is a label you choose at `doctor auth` time; an email address or a short alias (`work`, `personal`) both work, and the alias form keeps your MCP config readable.
- **Identity by instance.** A running server is bound to one account via the `GOOGLE_MCP_ACCOUNT` environment variable. To command three accounts, you run three instances of a service, each with a different `GOOGLE_MCP_ACCOUNT`. There is no per-call account argument, so a server cannot act on the wrong account.

## Auth setup

Authorization is a one-time, per-account browser consent flow.

1. Create a Google Cloud project, enable the APIs you need (Gmail, Calendar, Sheets, ...), and create an **OAuth client** (Desktop app). Download the client secret JSON.
2. Place the client secret JSON at `~/.google-mcp/client_secret.json` (override knobs in [src/auth's README](./src/auth/README.md)).
3. Authorize each account once; this opens a browser consent flow and stores that account's token.
4. Run a service with `GOOGLE_MCP_ACCOUNT=<account>` to act as that account.

The [`google-mcp-doctor`](./src/doctor/README.md) CLI drives all of it except the console clicks: `doctor scopes` prints the APIs and scopes to enable, `doctor auth <email>` runs the consent flow and writes the token, and `doctor` / `doctor status` confirm every account is authorized and reachable.

Credentials never live in the repo. Tokens and the client secret live in the ignored `~/.google-mcp/` config directory, and `.gitignore` also blocks common credential filenames.

For the full, step-by-step Google Cloud walkthrough (enabling APIs, declaring scopes, consent-screen and test-user setup, and what an agent can automate), see [PROVISIONING.md](./PROVISIONING.md).

## Development

```sh
bun install
bun run check     # lint-fix, build, typecheck, test, knip
```

See [CONTRIBUTING.md](./CONTRIBUTING.md) for the full task list, [AGENTS.md](./AGENTS.md) for the per-service pattern, [EXTENDING.md](./EXTENDING.md) for the add-a-service recipe, [ADDING-A-SERVICE.md](./ADDING-A-SERVICE.md) for the end-to-end service playbook, and [CHANGELOG.md](./CHANGELOG.md) for release history.

## Services

| Service | Status | Operations |
|---|---|---|
| **Gmail** | ✅ Implemented | [33 operations](./src/gmail/CAPABILITIES.md): threads, messages, drafts, labels, filters, attachments |
| **Calendar** | ✅ Implemented | [25 operations](./src/calendar/CAPABILITIES.md): events, calendars, free/busy, meeting-time suggestions |
| **Sheets** | ✅ Implemented | [30 operations](./src/sheets/CAPABILITIES.md): spreadsheets, values, batch and data-filter reads/writes, developer metadata, sheet management, dimensions, named ranges, formatting and borders, charts |
| **Docs** | ✅ Implemented | [9 operations](./src/docs/CAPABILITIES.md): document reads and creation, curated text editing and styling |
| **Drive** | ✅ Implemented | [35 operations](./src/drive/CAPABILITIES.md): files, search, content, comments, revisions, shared drives |

Gmail is the reference (canary) implementation; Calendar is its first replication; Sheets and Docs are methods-only (Google publishes no MCP toolset for them); Drive carries both wings; each new service mirrors the same shape.

---

<p align="center">
  <a href="https://github.com/simiancraft/google-mcp-suite" title="google-mcp-suite on GitHub"><img src=".github/assets/github.svg" height="18" alt="GitHub" /></a>
  &nbsp;&nbsp;&nbsp;
  <a href="https://x.com/5imian" title="Jesse Harlin on X"><img src=".github/assets/x.svg" height="16" alt="X" /></a>
  &nbsp;&nbsp;&nbsp;
  <a href="https://ko-fi.com/the_simian0604" title="Tip on Ko-fi"><img src=".github/assets/coffee.svg" height="18" alt="Ko-fi" /></a>
</p>

<p align="center"><sub><a href="./LICENSE">MIT</a>. Google product names are used nominatively; see <a href="./NOTICE.md">NOTICE.md</a>; not affiliated with Google LLC. Crafted with care by <a href="https://simiancraft.com"><img src=".github/assets/simiancraft.svg" height="12" alt="" />&nbsp;Simiancraft</a>.</sub></p>
