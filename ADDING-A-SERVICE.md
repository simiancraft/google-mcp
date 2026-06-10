# Adding a service: the playbook

The end-to-end process for shipping a new service (Sheets, Drive, Docs, ...),
written for an LLM agent executing it and retraced from how Calendar was
actually shipped (the `feat/calendar` branch, PR #23, June 2026). Where
[EXTENDING.md](./EXTENDING.md) is the per-file recipe (how to construct an
operation, an entity, a service folder), this is the project playbook: survey,
plan, commit cadence, deferrals, docs, verification, and the matrix.

The whole point of the pattern: a service is a **bounded sequence of
documentation-driven commits**, each leaving the tree green, with everything
not shipped tracked as an issue. Nothing is discovered mid-flight that the
plan did not name.

## Phase 0: survey before committing to anything

Read Google's documentation for the candidate service and write down:

1. **Is there an MCP toolset reference?** Calendar's lives at
   `developers.google.com/workspace/calendar/api/v3/reference/mcp` (note: the
   path shape varies per service and some 404 on the "obvious" URL; find the
   real one). If Google publishes no MCP page, the tools/ folder is sourced
   from the REST reference instead (EXTENDING.md covers this).
2. **The REST surface size**, from the discovery document
   (`googleapis.com/discovery/v1/apis/<svc>/<version>/rest`). The discovery
   doc is machine-readable and is the precise source for parameter names,
   types, required flags, and enum values; fetch it once and `jq` it instead
   of re-scraping HTML pages.
3. **The hostile features.** Every service has surfaces that do not fit the
   thin-transcription pattern: media upload/download (Drive), request unions
   (`batchUpdate` in Sheets and Docs), watch channels and incremental sync
   (everywhere), ACLs. Name them now; they become the deferral issues.
4. **Scopes.** Check `src/auth/config.ts` (`SCOPES`) and
   `src/doctor/services.ts`. If the service's scopes are already in the
   front-loaded union (Drive, Sheets, Docs, Calendar, and Meet all are),
   existing tokens already carry them and no re-auth is needed. If the scope
   is genuinely new, it must go into `SCOPES` **before any account
   authorizes**, the API must be enabled in the Cloud Console
   ([PROVISIONING.md](./PROVISIONING.md)), and every account must re-consent;
   Google only issues refresh tokens on a fresh grant.

Record the survey date and the exact URLs; every schema written later cites
its page, and the executor re-reads the cited page when transcribing.

## Phase 1: the plan

Write the plan as a single markdown file at the repo root (Calendar's was
`add-calendar-service.md`). If the how-to-plan skill is available, load it;
either way the plan must contain exactly these parts:

- **Goal**, under 150 words, stating what "done" looks like in observable
  terms (check green with N operations on the wire, the bin serves, doctor
  probes, docs exist, deferred surfaces live in issues #X #Y #Z).
- **Domain context**: the service-specific traps, numbered. For Calendar this
  was where the lossy MCP Event projection, the `optional` to
  `optionalAttendee` rename, the `date` XOR `dateTime` tri-state, and the
  patch-as-gap-filler design were all decided, before any code. Get these
  decisions into the plan, not into mid-implementation improvisation.
- **The operation list**, two tables. `tools/`: every operation on the MCP
  reference, names verbatim, one row per page, with mapping notes. `methods/`:
  the practical REST surface the toolset omits, chosen from the discovery
  document, minus the hostile clusters. Name the wire vocabulary rule in the
  plan: tools keep the MCP pages' parameter names (`startTime`, `pageSize`,
  `notificationLevel`); methods keep REST's (`timeMin`, `maxResults`,
  `sendUpdates`).
- **Deferrals as issues.** Every excluded cluster gets a GitHub issue opened
  at plan time (Calendar: #19 ACL, #20 watch channels, #21 import and
  incremental sync), and the plan cites them. "Deferred, tracked as issues,
  not missing by accident" is the posture COVERAGE.md will repeat.
- **File trees, before and after**, and a per-commit sequence where every
  commit has a stated gate (almost always: `bun run check` passes).
- **A verification checklist** ending with: operational matrix issue opened
  and live boxes ticked, docs updated, **plan file deleted**.

The plan lands as its own first commit: `docs(<svc>): add the <svc> service
plan`.

## Phase 2: the commit cadence

Calendar shipped in 11 planned commits; the shape generalizes:

| # | Commit | Content | Gate |
|---|--------|---------|------|
| 1 | `docs(<svc>): add the <svc> service plan` | the plan file | reviewed |
| 2 | `feat(<svc>): scaffold the <svc> service skeleton` | `operation.ts`, empty registries, `index.ts` bootstrap, `capabilities.ts`, dep + bin in package.json | check green; bin starts, `tools/list` returns 0 |
| 3..k | `feat(<svc>): add <cluster>` | operations in dependency order: read path first (it forces the entities and projections), then writes, then remaining tools, then methods grouped by REST resource | check green after every commit; CAPABILITIES.md regenerated whenever a registry changes |
| k+1 | `feat(doctor): register <svc> as implemented with a live probe` | flip `implemented: true`, add the probe, **cover the probe in `services.probe.test.ts` by mocking the client module** | check green; `bun run doctor` live-green per account |
| k+2 | `docs(<svc>): document the shipped service` | COVERAGE.md, service README, root README, AGENTS.md, package.json metadata, the icon | check green; `bun run capabilities` produces no diff; links resolve |
| k+3 | `docs(<svc>): delete the shipped plan` | remove the plan file | no references to it remain |

Rules that held up under execution:

- **Working state to working state.** Never commit with check red. The check
  script runs coverage (100%, pinned in `bunfig.toml`); a new function with no
  test fails the gate locally exactly as it would in CI.
- **A surface-count test pins the registries.** `src/<svc>/operations.test.ts`
  asserts the tool count, the method count, and the exact destructive set, and
  is updated in the same commit as each registry change.
- **Transcribe, do not remember.** Each `schema.ts` cites its source page and
  is written against the fetched page or discovery JSON, not from prior
  knowledge.
- **Projections live in `lib/`, once.** The second copy of any helper is the
  signal to lift it (Calendar learned this with `meetConferenceData`).
- **Compositions are pure functions.** An operation with no REST equivalent
  (Calendar's `suggest_time`) gets its computation in `lib/` as a pure,
  exhaustively unit-tested function, and refuses to answer from partial data
  rather than degrading silently.

## Phase 3: documentation (the full checklist)

The "document the shipped service" commit touches all of these; missing any
one of them is the kind of drift reviewers catch later:

- `src/<svc>/COVERAGE.md`: implemented vs Google's surface (tools N/N, methods
  by resource), the naming rules used, an "intentionally not exposed" section
  with reasons, and a Deferred section citing the issues from Phase 1.
- `src/<svc>/README.md`: capabilities summary, an `mcpServers` JSON config
  block (the thing users actually copy), then the bare CLI form, mirroring
  `src/calendar/README.md`.
- `src/<svc>/CAPABILITIES.md`: regenerated, never hand-edited.
- Root `README.md`: services table row flips to Implemented with the operation
  count linked; the hero caption; the icon row (see below); the quickstart
  `mcpServers` block gains the new service; any "as those services land"
  prose that just landed.
- **The icon.** `.github/assets/<svc>.svg` ships dimmed for planned services
  with a literal `opacity="0.4"` on its root `<g>`. Remove that attribute when
  the service ships, move the icon next to the other bright (shipped) icons in
  the README icon row, and update its `alt`/`title` from "(planned)" to
  "(shipping)".
- `AGENTS.md`: the layout tree gains `<svc>/`.
- `package.json`: the `bin` entry landed in the scaffold commit; now the
  `description` names the new service and `keywords` gain its terms.
- Sweep for stale parentheticals: `grep -rn "Gmail, Drive"` style example
  lists in PROVISIONING.md, EXTENDING.md, and the PR template have gone stale
  twice now; check them every time a service ships.

## Phase 4: verification and the operational matrix

Two layers, both mandatory, both documented in AGENTS.md (Tests convention)
and EXTENDING.md (Live verification):

1. **Unit**: every operation already has its colocated stub-client test from
   Phase 2; `bun run check` enforces 100% coverage.
2. **Live, pairwise**: drive the built server over real stdio (MCP SDK
   `StdioClientTransport` against `dist/<svc>/index.js`,
   `GOOGLE_MCP_ACCOUNT=<account>`) and verify every operation against a real
   account. Pair every destructive operation with its antecedent: create the
   thing, destroy that thing, confirm it gone; the account ends in the state
   it was found. Use disposable containers (Calendar used a disposable
   secondary calendar; Sheets would use a disposable spreadsheet) and public
   data for subscribe/unsubscribe pairs. When the API pins a destructive
   operation to a surface you did not create, verify the rejection path and
   document why the success path is deferred.

Then open the **operational matrix issue** (the rubric from #7, instantiated
for Calendar in #22): one entry per operation with a `live` and a `unit`
checkbox, and a **proof line** on every ticked live box stating what was
created and destroyed, the ids, and the date, for example *created disposable
calendar c_e7e3…, deleted, confirmed gone from the calendar list on
6/10/2026*. Findings the live pass surfaces (API quirks, undocumented
constraints, tombstone behaviors) are recorded in the same issue; they are the
most expensive knowledge the pass produces.

## Phase 5: ship

- Push the branch and open the PR per [CONTRIBUTING.md](./CONTRIBUTING.md)
  conventions; the description leads with what changed, file-by-file or
  cluster-by-cluster, with one line of testing facts.
- Run review passes over the new module before merge, each with a distinct
  lens: architecture (vocabulary coherence, projection boundaries, canary
  conformance), security (input bounds, destructive flag completeness,
  injection surface, publish hygiene), release polish (count drift, broken
  links, runnable examples, badge truth), and adoption (would a stranger copy
  the config block and succeed). Apply the findings as their own commits.
- Merge without squashing; semantic-release reads the atomic commits.

## Worked deltas for the likely next services

- **Sheets** (`@googleapis/sheets`, v4): scope `…/auth/spreadsheets` is
  already in the union. The practical surface is `spreadsheets.values.*`
  (get, update, append, clear, batchGet) plus `spreadsheets.get`/`create`;
  the hostile cluster is `spreadsheets.batchUpdate`, a union of dozens of
  request types; defer it as an issue with a curated subset later, do not
  transcribe the union. Expect an A1-notation helper in `lib/` (pure,
  unit-tested, the `suggest.ts` analog).
- **Drive** (`@googleapis/drive`, v3): scope already in the union. The
  hostile clusters are media upload/download (resumable uploads do not fit
  JSON-only output; plan the base64 boundary deliberately) and permissions
  (the ACL analog); both are deferral-issue candidates from day one.
- **Docs** (`@googleapis/docs`, v1): same `batchUpdate` union problem as
  Sheets; the read path (`documents.get`) is simple and ships first.
