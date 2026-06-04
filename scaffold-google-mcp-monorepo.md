# Scaffold google-mcp Monorepo

**Status:** Draft
**Scope:** project-meta
**Date:** 2026-06-04
**Last reviewed:** 2026-06-04
**Context:** Stand up a private Bun-workspace monorepo for per-account, per-service Google MCP servers, matching the simiancraft OSS canon (chromonym / unitforge), with shared auth lifted out and the Gmail server brought in fresh as the reference service.

## Goal

Commanding several Google accounts across several services means one thin MCP server per service, each authorized per account, with auth implemented once instead of re-copied. This plan prepares the empty `google-mcp` repo: the simiancraft community-health and tooling canon at the root, a Bun workspace splitting `packages/` (shared code) from `services/` (one server each), a `packages/google-auth` that owns OAuth, and the existing Gmail server copied in fresh (no git history) as `services/gmail` — the canary whose patterns get abstracted into later services. Done looks like: the repo lints, typechecks, builds, and tests green from the root; `services/gmail` runs as an MCP server consuming `@google-mcp/auth` with no auth code of its own; the repo presents the full canon (README, CONTRIBUTING, SECURITY, CODE_OF_CONDUCT, NOTICE, AGENTS, CI, scorecard, dependabot). Publishing stays out of scope; the repo is private until prime time.

## Domain context

- **Account's authorized command surface.** Organizing entity is a Google *account*; its children are *services* (Gmail, Drive, ...), each exposing *operations*. `google-auth` is about an account's *authorization*; its children are *scoped credentials*.
- **Canary service.** `services/gmail` is the live reference implementation. Patterns proven there (server bootstrap, schema/handler split, auth consumption) are abstracted into each new service, not reinvented.
- **B1 token model.** One shared OAuth client (`client_secret`); one token per account granted the front-loaded scope union; a running instance picks its account via `GOOGLE_MCP_ACCOUNT`. Identity is fixed by which instance runs, not by a per-call argument.
- **Canon, adapted.** Community-health and tooling mirror chromonym / unitforge. Publish machinery (semantic-release, npm, publint/attw, demo, codecov) is deliberately omitted; these are executables in a private repo, not published libraries.
- **Two real rewrites.** `SECURITY.md` Scope describes auth/credential/filesystem surface (not "pure function"); `NOTICE.md` disclaims Google / Gmail / Drive / Workspace trademarks as nominative use.

## Current surface area

| Path | State |
|---|---|
| `google-mcp/` | Empty repo; one commit (`docs: add monorepo scaffolding plan`) on `main`; this plan file only. Private. Remote `git@github.com:simiancraft/google-mcp.git`. |
| `../Gmail-MCP-Server/` | Standalone published server (own git, semantic-release, biome). Source of the fresh `services/gmail` copy and the lifted auth. Not modified by this plan. |

Canon reference (read-only sources): `../../Simiancraft/chromonym`, `../../Simiancraft/unitforge`.

## File structure: before

```
google-mcp/
├── .git/
└── scaffold-google-mcp-monorepo.md
```

## File structure: after

**Legend:** `+` created

```
google-mcp/
├── + package.json              // private workspace root: workspaces ["packages/*","services/*"]
├── + tsconfig.base.json        // strict shared compiler options; packages/services extend
├── + biome.json                // root; includes packages/** services/** *.ts *.json
├── + bunfig.toml
├── + knip.json                 // workspace entries
├── + .gitignore                // node_modules, dist, credential dirs
├── + LICENSE                   // MIT
├── + NOTICE.md                 // Google/Gmail/Drive/Workspace trademark disclaimers
├── + README.md
├── + CONTRIBUTING.md
├── + CODE_OF_CONDUCT.md        // Contributor Covenant 2.1, verbatim
├── + SECURITY.md               // scope rewritten: OAuth/credentials/filesystem surface
├── + CODEOWNERS                // * @the-simian
├── + AGENTS.md                 // monorepo orientation + per-service pattern + auth convention
├── + .github/
│   ├── + FUNDING.yml           // ko_fi: the_simian0604
│   ├── + dependabot.yml        // github-actions, weekly, grouped
│   ├── + PULL_REQUEST_TEMPLATE.md
│   ├── + ISSUE_TEMPLATE/
│   │   ├── + bug_report.yml
│   │   ├── + feature_request.yml
│   │   └── + config.yml
│   └── + workflows/
│       ├── + ci.yml            // lint, typecheck, build, test, knip (no publish job)
│       └── + scorecard.yml
├── + packages/
│   └── + google-auth/
│       ├── + package.json      // @google-mcp/auth
│       ├── + tsconfig.json     // extends ../../tsconfig.base.json
│       └── + src/
│           ├── + index.ts      // public API: authorizedClient(account) + auth-flow entry
│           ├── + config.ts     // canonical paths, GOOGLE_MCP_ACCOUNT, scope union
│           └── + oauth.ts      // load client secret, run consent, persist/restore per-account token
└── + services/
    └── + gmail/
        ├── + package.json      // gmail server; depends @google-mcp/auth
        ├── + tsconfig.json
        ├── + README.md
        └── + src/              // from Gmail-MCP-Server/src, auth.ts removed, wired to @google-mcp/auth
            ├── + index.ts
            ├── + schemas.ts
            ├── + handlers/
            └── + ...
```

## Commits

### Commit 1: Initialize workspace root and tooling

**Files created:**
- `package.json`: private root, `"workspaces": ["packages/*", "services/*"]`, type module, root scripts (`lint`, `typecheck`, `test`, `check`) fanning across workspaces, devDeps (`@biomejs/biome`, `knip`, `@types/bun`, typescript/tsgo per canon).
- `tsconfig.base.json`: strict options from the canon (`target` ES2022, NodeNext, `noUncheckedIndexedAccess`, `verbatimModuleSyntax`, etc.).
- `biome.json`: from canon, `files.includes` widened to `packages/**`, `services/**`.
- `bunfig.toml`, `knip.json`, `.gitignore`, `LICENSE` (MIT, the-simian).

**Gate:** `bun install` at root succeeds; `biome check .` clean.

### Commit 2: Add community-health prose

**Files created:**
- `README.md`: repo purpose, layout, multi-account model, auth setup.
- `CONTRIBUTING.md`: adapted commands for the workspace; Conventional Commits; no-AI-coauthor.
- `CODE_OF_CONDUCT.md`: Contributor Covenant 2.1 verbatim, `info@simiancraft.com`.
- `SECURITY.md`: **rewritten** Scope (token storage, scope over-grant, credential leakage, path traversal in file ops, supply chain); private-advisory reporting.
- `NOTICE.md`: **rewritten** for Google / Gmail / Drive / Workspace nominative-use disclaimers; upstream deps note.
- `CODEOWNERS`: `* @the-simian`.
- `AGENTS.md`: monorepo orientation, per-service pattern, the shared-auth convention, no-AI-coauthor.

**Gate:** `biome check .` clean (markdown unaffected); links resolve.

### Commit 3: Add .github automation

**Files created:**
- `.github/FUNDING.yml`, `.github/dependabot.yml` (github-actions weekly grouped), `.github/PULL_REQUEST_TEMPLATE.md`, `.github/ISSUE_TEMPLATE/{bug_report.yml,feature_request.yml,config.yml}`.
- `.github/workflows/ci.yml`: Bun setup, frozen install, lint, typecheck, build, test, knip. **No release job** (private, unpublished).
- `.github/workflows/scorecard.yml`: from canon, SHA-pinned actions.

**Gate:** workflows parse (`actionlint` if available, else YAML lint); `biome check` clean.

### Commit 4: Scaffold the google-auth package shell

**Files created:**
- `packages/google-auth/package.json` (`@google-mcp/auth`, build/lint/typecheck scripts).
- `packages/google-auth/tsconfig.json` (extends base).
- `packages/google-auth/src/{index.ts,config.ts}`: API signatures and canonical config (paths, `GOOGLE_MCP_ACCOUNT` resolution, scope union) — implementation stubbed.

**Gate:** `bun run typecheck` and `bun run build` for the package succeed; `biome check` clean.

### Commit 5: Implement the OAuth flow in google-auth

**Files created:**
- `packages/google-auth/src/oauth.ts`: lift `loadCredentials` / `authenticate` from `../Gmail-MCP-Server/src/auth.ts`, generalized to the shared client secret and per-account token paths; `index.ts` exports `authorizedClient(account)`.

**Gate:** package builds, lints, typechecks; a smoke import resolves an `OAuth2Client` for a named account from a saved token.

### Commit 6: Bring Gmail in fresh as the canary service

**Files created:**
- `services/gmail/`: copy `../Gmail-MCP-Server/src` (excluding `auth.ts`, `.git`, `dist`, `node_modules`, lockfile, repo-local `biome.json`/`.releaserc`), plus a service `package.json` (depends `@google-mcp/auth`), `tsconfig.json`, `README.md`. No git history carried.

**Files rewritten:**
- `services/gmail/src/index.ts`: replace `./auth.js` import with `@google-mcp/auth`; obtain the client via `authorizedClient(account)`.

**Gate:** `bun run check` at root green (lint, typecheck, build, test, knip); `services/gmail` starts as an MCP server and lists tools.

### Commit 7: Delete this plan

- Delete `scaffold-google-mcp-monorepo.md`.
- Extract any durable convention (auth setup, per-service recipe) into `AGENTS.md` / `README.md` first.

**Gate:** `bun run check` green; repo contains no references to the plan file.

## Verification checklist

- [ ] Root `bun install`, `biome check .`, `bun run typecheck`, `bun test` all clean.
- [ ] Canon present: README, CONTRIBUTING, CODE_OF_CONDUCT, SECURITY (rewritten scope), NOTICE (Google marks), CODEOWNERS, AGENTS, LICENSE.
- [ ] `.github` CI runs lint/typecheck/build/test/knip; scorecard + dependabot present; no publish job.
- [ ] `packages/google-auth` resolves an authorized client for a named account.
- [ ] `services/gmail` runs as an MCP server, lists tools, has no auth code of its own.
- [ ] Gmail brought in without git history (fresh, evergreen).
- [ ] Plan file deleted (Inspector Gadget Rule: no orphan plans).

## References

- `../../Simiancraft/chromonym`, `../../Simiancraft/unitforge` — the simiancraft OSS canon.
- `../Gmail-MCP-Server/src/auth.ts` — source of the lifted OAuth flow.
- `../Gmail-MCP-Server/src/index.ts` — server-bootstrap shape each service mirrors.
