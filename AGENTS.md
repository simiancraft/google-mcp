# google-mcp — Agent Instructions

A Bun-workspace monorepo of **Google MCP servers**: one thin [Model Context Protocol](https://modelcontextprotocol.io/) server per Google service, each authorized per account, all sharing one auth implementation. The organizing entity is a Google **account**; its children are **services** (Gmail, Drive, ...); each service exposes **operations**.

## Quick orientation

```
google-mcp/
├── packages/
│   └── google-auth/        # shared OAuth: shared client secret + per-account tokens
│       └── src/
│           ├── index.ts    # authorizedClient(account) + auth-flow entry
│           ├── config.ts    # canonical paths, GOOGLE_MCP_ACCOUNT, scope union
│           └── oauth.ts     # load client secret, run consent, persist/restore token
└── services/
    └── gmail/              # the canary: reference server; new services mirror it
        └── src/
            ├── index.ts    # MCP server bootstrap + tool registration
            ├── schemas.ts  # zod schemas per operation
            └── handlers/   # one handler per operation, over an authorized client
```

## Conventions (follow these)

- **Auth lives once.** Services never implement OAuth. They import `@google-mcp/auth` and call `authorizedClient(account)` to get an authenticated client. If you find auth code in a service, it is a bug; lift it to `packages/google-auth`.
- **Identity by instance, not by argument.** A running server is bound to one account via the `GOOGLE_MCP_ACCOUNT` env var. Operations do not take an account parameter; multi-account is achieved by running one instance per account.
- **B1 token model.** One shared OAuth client (`client_secret`). One token per account, granted the front-loaded scope union, authorized once. A service reads only the token for its configured account.
- **Thin servers.** A service is `index` (bootstrap + tool list) + `schemas` (zod) + `handlers/` (one per operation). The MCP SDK is the protocol layer; do not reimplement it. The canary `services/gmail` is the shape to copy.
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
bun run check               # full pre-PR gate (lint-fix, typecheck, build, test, knip)
```

## Adding a new service

1. Copy the shape of `services/gmail` into `services/<service>`.
2. Depend on `@google-mcp/auth`; obtain the client via `authorizedClient(account)`.
3. Add the service's scopes to the shared scope union in `packages/google-auth/src/config.ts`.
4. Define operations as `schemas.ts` (zod) + `handlers/` (one per operation).
5. Register tools in `index.ts`; mirror the canary's `TOOL_DEFINITIONS` array.
6. Add tests mirroring `src/`.

## Things that will trip you up

- **Scope union is front-loaded.** Adding a service's scopes later forces re-consent of every account (Google re-issues the refresh token only on a fresh grant). Add scopes to `config.ts` deliberately.
- **Credentials never go in the repo.** The shared client secret and per-account tokens live outside the tree; `.gitignore` blocks the obvious filenames. Never write a token into a tool response or log.
