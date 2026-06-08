# google-mcp-suite: Agent Instructions

A single package of **Google MCP servers**: one thin [Model Context Protocol](https://modelcontextprotocol.io/) server per Google service, each authorized per account, all sharing one auth implementation. The organizing entity is a Google **account**; its children are **services** (Gmail, Drive, ...); each service exposes **operations**. One package, one version; each service ships as its own `bin`.

## Quick orientation

```
google-mcp-suite/
└── src/
    ├── auth/        # shared OAuth: authorizedClient(account), runAuthFlow(account), SCOPES
    ├── harness/     # makeDefineTool<Client>() + createServer(...): the MCP factory
    └── gmail/       # the canary server; new services mirror it as src/<service>/
        ├── index.ts        # createServer({ name, tools, methods, client }); the bin entry
        ├── defineTool.ts   # makeDefineTool<gmail_v1.Gmail>()  (MCP-sourced ops)
        ├── defineMethod.ts # makeDefineTool<gmail_v1.Gmail>()  (REST-sourced ops)
        ├── entities/        # PascalCase zod nouns (Label, Thread, Draft, ...)
        ├── lib/             # projection helpers (REST entity -> documented shape)
        ├── tools/<tool>/    # schema.ts + handler.ts + handler.test.ts
        └── methods/<method>/ # same construction
```

`auth`, `harness`, and each service are folders that import each other by relative
path and compile to one `dist/`. There is no workspace and no bundler; plain `tsc`
emits a self-contained package.

## Conventions (follow these)

- **Auth lives once.** A service never implements OAuth. It imports from `src/auth` and calls `authorizedClient(account)` to get an authenticated client. If you find auth code in a service folder, it is a bug; lift it to `src/auth`.
- **Identity by instance, not by argument.** A running server is bound to one account via the `GOOGLE_MCP_ACCOUNT` env var. Operations do not take an account parameter; multi-account is achieved by running one instance per account.
- **B1 token model.** One shared OAuth client (`client_secret`). One token per account, granted the front-loaded scope union, authorized once. A service reads only the token for its configured account.
- **Thin servers, folder-per-operation.** Each operation is a folder with `schema.ts` (input/output zod, composing `entities/`), `handler.ts` (the work + `defineTool`/`defineMethod`, exporting the op), and `handler.test.ts`. The harness (`src/harness`) provides the factory and `createServer`; never reimplement the protocol. `src/gmail` is the shape to copy.
- **Tools vs methods.** `tools/` mirrors Google's MCP toolset reference; `methods/` covers the broader REST reference (operations the toolset omits). Same construction; methods import `defineMethod`. Mark `destructive: true` (→ MCP `destructiveHint`) any operation that is irreversible (`send`, permanent `delete`) or establishes a persistent dangerous side effect (`create_filter`); `trash`/`untrash` are reversible. All vocabulary is sourced from the docs; entity TSDoc from the guides Concepts page, field docs in `.describe()` so they reach the wire schema. See `EXTENDING.md`.
- **Canary first.** Patterns are proven in `src/gmail`, then lifted into `src/harness`/`src/auth` or replicated into a new service folder. Do not invent a new shape per service.
- **Tests** mirror the source; colocated `*.test.ts`.
- **Commits**: Conventional Commits (`feat(drive): ...`, `fix(auth): ...`). **Do NOT** attribute AI co-authorship.

## Build toolchain

Single package, plain `tsc` to `dist/` (no bundler: relative imports resolve in
the published package). This matches the single-package shape of the chromonym /
unitforge libraries, but uses `tsc` rather than their `tsgo`: these are runtime
server executables and value build stability over a preview compiler.

## Common commands

```sh
bun install
bun test                 # run every test
bun test src/gmail       # one area
bun run typecheck        # tsc --noEmit
bun run lint             # biome check
bun run lint:fix         # biome check --write
bun run build            # tsc -> dist
bun run capabilities     # regenerate CAPABILITIES.md from the registries
bun run check            # full pre-PR gate (lint-fix, build, typecheck, test, knip)
```

## Adding a tool, method, entity, or service

See **`EXTENDING.md`** for the full recipe. In short: source the operation from
its Google reference page, make a `tools/<name>/` or `methods/<name>/` folder
(`schema.ts` + `handler.ts` + `handler.test.ts`) inside the service, register it
in that folder's `index.ts`, and add any new `entities/`. A new **service** is a
new folder `src/<service>/`: bind `makeDefineTool<Client>()` once (as
`defineTool`/`defineMethod`), add its scopes to the shared `SCOPES` union in
`src/auth/config.ts` (services do not declare scopes locally), call `createServer`
in its `index.ts`, and add a `bin` entry in `package.json`.

## Things that will trip you up

- **Scope union is front-loaded.** Adding a service's scopes later forces re-consent of every account (Google re-issues the refresh token only on a fresh grant). Add scopes to `src/auth/config.ts` deliberately.
- **Credentials never go in the repo.** The shared client secret and per-account tokens live outside the tree; `.gitignore` blocks the obvious filenames. Never write a token into a tool response or log.
