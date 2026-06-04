# Scaffold google-mcp Monorepo

**Status:** Draft
**Scope:** project-meta
**Date:** 2026-06-04
**Last reviewed:** 2026-06-04
**Context:** Per-service Google MCP servers each re-implement OAuth; a shared-auth monorepo lets every new service be a thin operation-set instead of a fresh auth implementation.

## Goal

Today each Google MCP server (so far only the standalone Gmail server) carries its own OAuth code, so commanding several accounts across several services means duplicated auth in every repo. This plan stands up a Bun-workspace monorepo at `google-mcp` whose shared `packages/google-auth` owns authentication once: a shared OAuth client plus per-account, all-scopes tokens selected by env var. No service is built here; this plan delivers only the workspace skeleton and the auth package. Done looks like: the repo has a root workspace config, Biome, and a base tsconfig; `packages/google-auth` builds, lints clean, and exposes an API a future service can import to obtain an authorized Google client for a named account. Drive and the rest land in their own downstream plans that depend on this one.

## Domain context

- **Monorepo shape.** One repo, `packages/` for shared code and `services/` (later) for one thin MCP server per Google service. Bun workspaces; Biome and tsc mirror the existing Gmail server's tooling.
- **Account's authorized command surface.** The repo's organizing entity is a Google *account*; its children are *services*, each exposing *operations*. `google-auth` is about an account's *authorization*; its children are *scoped credentials*.
- **B1 token model.** One OAuth client (`client_secret`) shared across all services. One token per account, granted the full front-loaded scope union, so each account is authorized exactly once for all current and planned services. A service reads `GOOGLE_MCP_ACCOUNT` to pick which token to load.
- **Identity by instance.** Multi-account is achieved by running one server instance per account, each with `GOOGLE_MCP_ACCOUNT` set; the running binary, not a per-call argument, fixes the identity.

## Current surface area

Empty repository. Remote `origin` = `git@github.com:simiancraft/google-mcp.git`; no commits, no branches, no files but `.git/`.

## File structure: after

**Legend:** `+` created

```
google-mcp/
├── + package.json            // workspace root: { workspaces: ["packages/*", "services/*"] }
├── + tsconfig.base.json      // shared compiler options; packages extend this
├── + biome.json              // lifted from Gmail server
├── + .gitignore              // node_modules, dist, credential dirs
├── + README.md               // repo purpose, layout, auth setup
└── + packages/
    └── + google-auth/
        ├── + package.json     // name @google-mcp/auth, build/lint scripts
        ├── + tsconfig.json    // extends ../../tsconfig.base.json
        └── + src/
            ├── + index.ts      // public API: authorized-client + auth-flow entry
            ├── + config.ts     // canonical paths, GOOGLE_MCP_ACCOUNT resolution, scope union
            └── + oauth.ts      // load client secret, run consent flow, persist/restore token
```

## Commits

### Commit 1: Initialize workspace root

**Files created:**
- `package.json`: private root, `"workspaces": ["packages/*", "services/*"]`, type module.
- `tsconfig.base.json`: shared strict compiler options targeting Node 18+, ESM.
- `biome.json`: copied from the Gmail server.
- `.gitignore`: `node_modules`, `dist`, local credential dirs.
- `README.md`: one-paragraph repo purpose and layout.

**Gate:** `bun install` succeeds at root; `biome check .` is clean.

### Commit 2: Scaffold the google-auth package shell

**Files created:**
- `packages/google-auth/package.json`: `@google-mcp/auth`, build (`tsc`), lint scripts.
- `packages/google-auth/tsconfig.json`: extends the base.
- `packages/google-auth/src/index.ts`: exported API surface (signatures only at first).
- `packages/google-auth/src/config.ts`: canonical credential paths, `GOOGLE_MCP_ACCOUNT` resolution, the front-loaded scope union.

**Gate:** `bun run build` in the package emits `dist/`; `biome check` clean.

### Commit 3: Implement the OAuth flow

**Files created:**
- `packages/google-auth/src/oauth.ts`: lift the Gmail server's `loadCredentials`/`authenticate`, generalized to per-account token paths and the shared client secret.

**Gate:** package builds and lints; a smoke import resolves an `OAuth2Client` for a named account.

### Commit N+1: Delete this plan

- Delete `scaffold-google-mcp-monorepo.md`.
- Extract any durable auth/setup convention into `README.md` first.

**Gate:** project validation passes; repo contains no references to the plan file.

## Verification checklist

- [ ] Root `bun install` and `biome check .` clean.
- [ ] `packages/google-auth` builds to `dist/` and lints clean.
- [ ] Auth API resolves an authorized client for a named account from a saved token.
- [ ] A throwaway consumer can `import` the package and obtain a client.
- [ ] Plan file deleted (Inspector Gadget Rule: no orphan plans).

## References

- `../Gmail-MCP-Server/src/auth.ts` — source of the OAuth flow being lifted.
- `../Gmail-MCP-Server/src/index.ts` — server-bootstrap shape each future service mirrors.
