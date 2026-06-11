# Contributing to google-mcp-suite

Thanks for considering a contribution. This is a single Bun package of Google MCP servers (one server per Google service, sharing one auth implementation); it is small and opinionated, the bar for merging is high, and the review is friendly.

## Prerequisites

- [Bun](https://bun.sh) 1.3+ (package manager, runner, and test runner)
- A Google Cloud OAuth application and credentials for any service you run end-to-end (see the [README auth setup](./README.md#auth-setup) and [PROVISIONING.md](./PROVISIONING.md))

## Setup

```sh
git clone https://github.com/simiancraft/google-mcp-suite.git
cd google-mcp-suite
bun install
```

## Layout

One package: `auth`, `lib`, and each service are folders under `src/`, compiled to one `dist/`.

- `src/auth`: shared OAuth; every service imports it.
- `src/lib`: the two MCP primitives (`operation` + `server`).
- `src/<service>`: one thin MCP server per Google service. `src/gmail` is the reference (canary) implementation; new services mirror its shape.

## Common tasks

| Task | Command |
|---|---|
| Install everything | `bun install` |
| Run all tests | `bun test` |
| Run one area's tests | `bun test src/gmail` |
| Typecheck everything | `bun run typecheck` |
| Lint (Biome) | `bun run lint` |
| Auto-fix lint | `bun run lint:fix` |
| Format | `bun run format` |
| Build everything | `bun run build` |
| Find unused exports | `bun run check:knip` |
| Run every gate end-to-end | `bun run check` |

`bun run check` is the full pre-PR gate: lint-fix, build, typecheck, test with coverage (100%, pinned in `bunfig.toml`), and knip. CI runs the same gate (plain `lint` instead of `lint:fix`, plus coverage reporters for the upload); if `check` is green locally, CI is too.

## Commit style

Commits follow [Conventional Commits](https://www.conventionalcommits.org/): `type(scope): imperative subject`. Types: `feat`, `fix`, `chore`, `docs`, `test`, `refactor`, `ci`, `perf`, `build`, `style`. Scope is the area (e.g. `feat(drive):`, `fix(auth):`). This keeps history clean and drives semantic-release: the merged commit types determine the published version.

Commits are authored by humans. **Do not** attribute AI co-authorship.

## Pull requests

- Open a PR against `main`. CI must be green before review.
- Keep the diff focused. One logical change per PR.
- Add or update tests for any behavior change.
- Update the README, the service README, or [AGENTS.md](./AGENTS.md) if you change a public surface or a convention. Adding an operation or a service? The recipe is [EXTENDING.md](./EXTENDING.md).

## Reporting issues

- Bugs: [open an issue](https://github.com/simiancraft/google-mcp-suite/issues/new/choose).
- Security: see [SECURITY.md](./SECURITY.md). **Do not** file public issues for vulnerabilities; use GitHub Security Advisories or email info@simiancraft.com.

## Code of conduct

This project follows the [Contributor Covenant 2.1](./CODE_OF_CONDUCT.md). By participating, you agree to uphold it.
