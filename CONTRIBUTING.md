# Contributing to google-mcp

Thanks for considering a contribution. This is a Bun-workspace monorepo of Google MCP servers; it is small and opinionated, the bar for merging is high, and the review is friendly.

## Prerequisites

- [Bun](https://bun.sh) 1.3+ (package manager, runner, and test runner)
- A Google Cloud OAuth application and credentials for any service you run end-to-end (see the README auth setup)

## Setup

```sh
git clone https://github.com/simiancraft/google-mcp.git
cd google-mcp
bun install
```

## Layout

- `packages/*` — shared code. `packages/google-auth` owns OAuth; services depend on it.
- `services/*` — one thin MCP server per Google service. `services/gmail` is the reference (canary) implementation; new services mirror its shape.

## Common tasks

| Task | Command |
|---|---|
| Install everything | `bun install` |
| Run all tests | `bun test` |
| Run one workspace's tests | `bun test services/gmail` |
| Typecheck everything | `bun run typecheck` |
| Lint (Biome) | `bun run lint` |
| Auto-fix lint | `bun run lint:fix` |
| Format | `bun run format` |
| Build everything | `bun run build` |
| Find unused exports | `bun run check:knip` |
| Run every gate end-to-end | `bun run check` |

`bun run check` is the full pre-PR gate: lint-fix, typecheck, build, test, and knip across every workspace. CI runs the same steps; if `check` is green locally, CI usually is too.

## Commit style

Commits follow [Conventional Commits](https://www.conventionalcommits.org/): `type(scope): imperative subject`. Types: `feat`, `fix`, `chore`, `docs`, `test`, `refactor`, `ci`, `perf`, `build`, `style`. Scope is the workspace or area (e.g. `feat(drive):`, `fix(auth):`). This keeps history clean and ready for release automation later.

Commits are authored by humans. **Do not** attribute AI co-authorship.

## Pull requests

- Open a PR against `main`. CI must be green before review.
- Keep the diff focused. One logical change per PR.
- Add or update tests for any behavior change.
- Update the README, the service README, or `AGENTS.md` if you change a public surface or a convention.

## Reporting issues

- Bugs: [open an issue](https://github.com/simiancraft/google-mcp/issues/new/choose).
- Security: see [SECURITY.md](./SECURITY.md). **Do not** file public issues for vulnerabilities — use GitHub Security Advisories or email info@simiancraft.com.

## Code of conduct

This project follows the [Contributor Covenant 2.1](./CODE_OF_CONDUCT.md). By participating, you agree to uphold it.
