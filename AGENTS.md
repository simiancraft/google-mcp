# google-mcp — Agent Instructions

A Bun-workspace monorepo of **Google MCP servers**: one thin [Model Context Protocol](https://modelcontextprotocol.io/) server per Google service, each authorized per account, all sharing one auth implementation. The organizing entity is a Google **account**; its children are **services** (Gmail, Drive, ...); each service exposes **operations**.

## Quick orientation

```
google-mcp/
├── packages/
│   ├── google-auth/    # shared OAuth: authorizedClient(account), runAuthFlow(account)
│   └── mcp-harness/    # makeDefineTool<Client>() + createServer(...)
└── services/
    └── gmail/          # the canary: reference server; new services mirror it
        └── src/
            ├── index.ts        # createServer({ name, tools, methods, client })
            ├── defineTool.ts   # makeDefineTool<gmail_v1.Gmail>()  (MCP-sourced ops)
            ├── defineMethod.ts # makeDefineTool<gmail_v1.Gmail>()  (REST-sourced ops)
            ├── entities/       # PascalCase zod nouns (Label, Thread, Draft, ...)
            ├── lib/            # projection helpers (REST entity -> documented shape)
            ├── tools/          # MCP-toolset operations, one folder each:
            │   └── <tool>/     #   schema.ts + handler.ts + handler.test.ts
            └── methods/        # REST operations, same construction
                └── <method>/   #   schema.ts + handler.ts + handler.test.ts
```

## Conventions (follow these)

- **Auth lives once.** Services never implement OAuth. They import `@google-mcp/auth` and call `authorizedClient(account)` to get an authenticated client. If you find auth code in a service, it is a bug; lift it to `packages/google-auth`.
- **Identity by instance, not by argument.** A running server is bound to one account via the `GOOGLE_MCP_ACCOUNT` env var. Operations do not take an account parameter; multi-account is achieved by running one instance per account.
- **B1 token model.** One shared OAuth client (`client_secret`). One token per account, granted the front-loaded scope union, authorized once. A service reads only the token for its configured account.
- **Thin servers, folder-per-operation.** Each operation is a folder with `schema.ts` (input/output zod, composing `entities/`), `handler.ts` (the work + `defineTool`/`defineMethod`, exporting the op), and `handler.test.ts`. The shared `@google-mcp/harness` provides the factory and `createServer`; never reimplement the protocol. The canary `services/gmail` is the shape to copy.
- **Tools vs methods.** `tools/` mirrors Google's MCP toolset reference; `methods/` covers the broader REST reference (operations the toolset omits). Same construction; methods import `defineMethod`. Mark irreversible operations (`send`, permanent `delete`) `destructive: true` → MCP `destructiveHint`; `trash`/`untrash` are reversible. All vocabulary is sourced from the docs; entity TSDoc from the guides Concepts page. See `EXTENDING.md`.
- **Canary first.** Patterns are proven in `services/gmail`, then abstracted into shared code or replicated into new services. Do not invent a new shape per service.
- **Tests** mirror `src/`; colocated `*.test.ts`.
- **Commits**: Conventional Commits (`feat(drive): ...`, `fix(auth): ...`). **Do NOT** attribute AI co-authorship.

## Build toolchain

This repo uses plain **`tsc`** (not `tsgo`) for typecheck and build. These are runtime server executables and value build stability; `tsgo` is still a preview compiler. This is a deliberate deviation from the chromonym / unitforge libraries, which use `tsgo`.

## Common commands

```sh
bun install                 # install all workspaces
bun test                    # run every workspace's tests
bun test services/gmail     # one workspace
bun run typecheck           # tsc --noEmit across workspaces
bun run lint                # biome check
bun run lint:fix            # biome check --write
bun run build               # tsc across workspaces
bun run check               # full pre-PR gate (lint-fix, build, typecheck, test, knip)
```

## Adding a tool, method, entity, or service

See **`EXTENDING.md`** for the full recipe. In short: source the operation from
its Google reference page, make a `tools/<name>/` or `methods/<name>/` folder
(`schema.ts` + `handler.ts` + `handler.test.ts`), register it in that folder's
`index.ts`, and add any new `entities/`. A new service binds
`makeDefineTool<Client>()` once (as `defineTool`/`defineMethod`), adds its scopes
to the shared `SCOPES` union in `packages/google-auth` (services do not declare
scopes locally), and calls `createServer`.

## Things that will trip you up

- **Scope union is front-loaded.** Adding a service's scopes later forces re-consent of every account (Google re-issues the refresh token only on a fresh grant). Add scopes to `config.ts` deliberately.
- **Credentials never go in the repo.** The shared client secret and per-account tokens live outside the tree; `.gitignore` blocks the obvious filenames. Never write a token into a tool response or log.
