# Plan: the Docs service

Self-destructs on ship (the last commit of this sequence deletes it).

## Goal

`google-mcp-docs` serves a genuinely writable Google Docs v1 surface: 5
methods-only operations over real stdio (`get_document`, `create_document`,
and the curated batchUpdate trio `insert_text`, `replace_all_text`,
`delete_content_range`), with `bun run check` green (100% coverage), the
doctor probing Docs per account, docs shipped (COVERAGE.md, service README,
instructions.ts, root README row and icon, AGENTS.md, package metadata), and
the hostile surfaces deferred as issues #35 (the rest of the 40-variant
`batchUpdate` union) and #36 (tabs, tables, styles, suggestions in reads).
Live pairwise verification runs against all three accounts into a new
operational matrix issue. Built in the `feat-docs` worktree alongside the
Drive wing; shared files (package.json, doctor, root README, AGENTS.md) are
touched minimally and merge first.

## Survey (2026-06-10)

- MCP toolset: **none** (Google's MCP products are Gmail, Drive, Calendar,
  Chat, People). Methods-only, the second instance after Sheets.
- Discovery: `https://docs.googleapis.com/$discovery/rest?version=v1`
  (revision 20260609). **3 methods**: `documents.get`, `documents.create`,
  `documents.batchUpdate`; the union has 40 request types.
- REST reference root:
  `https://developers.google.com/workspace/docs/api/reference/rest`
- Scope: `https://www.googleapis.com/auth/documents` already in `SCOPES` and
  attributed in doctor; no console work, no re-consent.
- No watch channels, no media, no LROs.

## Domain context (the traps, decided now)

1. **The union IS the write surface.** Unlike Sheets, deferring
   `batchUpdate` entirely leaves a read-only service. The shipped posture:
   a curated trio of request types as first-class operations, each wrapping
   `documents.batchUpdate` with exactly one request; the other 37 are
   issue #35. The shared wrapper (`lib/batch.ts`) is planned up front; three
   known copies is past the second-copy threshold.
2. **The read projection is text plus indices.** `documents.get` returns a
   deeply recursive tree (paragraph elements, tables, styles, suggestions,
   tabs). The projection keeps what an agent needs to read and to target
   edits: `documentId`, `title`, `revisionId`, and `content[]` as
   `{ startIndex, endIndex, type, text }`, where `type` is
   paragraph | sectionBreak | table | tableOfContents, `text` is the
   paragraph's concatenated `TextRun.content`, and tables carry `rows` and
   `columns` counts only. Everything else is issue #36.
3. **Indices are UTF-16 code units**, zero-based, end-exclusive, and they
   shift on every edit; an agent must re-read before computing new ranges.
   Stated in `.describe()` on every index field and in the instructions.
4. **Tabs are unexposed.** `includeTabsContent` is not passed; the legacy
   single-tab `body` view is served, and writes omit `tabId` (Google
   applies them to the first tab). Issue #36; one COVERAGE sentence.
5. **Docs has no delete or list.** Both are Drive's. The live pass cleans
   up with a raw Drive `files.delete` (the Sheets precedent), and the
   doctor probe has **neither an id-free read nor a stable public sample
   document** (Sheets' probe trick does not transfer). The probe reads a
   sentinel document id and treats a clean 404 as proof of auth and API
   enablement (401/403 still fail loudly); the fallback hierarchy gets a
   line in the playbook.
6. **Naming and vocabulary.** Wire names follow the house verb+noun rule:
   `get_document`, `create_document`, `insert_text`, `replace_all_text`,
   `delete_content_range` (the request types' own names, snake_cased).
   Parameter vocabulary is REST's: `documentId`, `range{startIndex,
   endIndex}`, `containsText{text, matchCase}`, `replaceText`. `insert_text`
   exposes an optional `index`; omitted, it appends via
   `endOfSegmentLocation` (the REST page's own alternative).
7. **Annotations per the rubric**: `get_document` read-only;
   `create_document` and `insert_text` additive and not idempotent
   (repeats duplicate); `replace_all_text` destructive (the matched text is
   gone) and idempotent (a second run matches nothing);
   `delete_content_range` destructive and **not** idempotent (indices
   shift; a repeat deletes different content). All closed-world.
8. **create ignores content.** `documents.create` accepts only `title`
   (the API ignores any provided content); the input says so.

## The operation list (methods/, 5)

| Wire name | Source page | Returns |
|---|---|---|
| `get_document` | `…/v1/documents/get` | Document (projection, trap 2) |
| `create_document` | `…/v1/documents/create` | Document (projection; empty body) |
| `insert_text` | `…/v1/documents/request#InsertTextRequest` | { documentId, revisionId? } |
| `replace_all_text` ⚠ | `…/v1/documents/request#ReplaceAllTextRequest` | { documentId, occurrencesChanged, revisionId? } |
| `delete_content_range` ⚠ | `…/v1/documents/request#DeleteContentRangeRequest` | { documentId, revisionId? } |

⚠ = `destructiveHint`. **Not exposed**: the other 37 request types (#35);
`suggestionsViewMode`, `includeTabsContent`, `tabId`/`segmentId`,
`searchByRegex`, `writeControl` (#35/#36 with reasons in COVERAGE.md).

Entities: `Document`, `StructuralElement`, `Range`,
`SubstringMatchCriteria`. `lib/document.ts` (projections, paragraph-text
extraction), `lib/batch.ts` (`applyUpdate(client, documentId, request)`,
the single batchUpdate wrapper the three writes share).

## Commit sequence (gate: `bun run check` green; push after every commit)

1. `docs(docs): add the docs service plan` — this file; draft PR opens here.
2. `feat(docs): scaffold the docs service skeleton` — empty registry,
   `index.ts`, `capabilities.ts` (the globbed script picks it up),
   `operations.test.ts` (0), `@googleapis/docs` dep, `google-mcp-docs` bin.
   Extra gate: bin serves, `tools/list` returns 0.
3. `feat(docs): add the document read path` — `get_document`; entities
   `Document`, `StructuralElement`; `lib/document.ts`; the
   `docsOperation` binder.
4. `feat(docs): add document creation` — `create_document`.
5. `feat(docs): add the curated text-editing operations` — the trio;
   entities `Range`, `SubstringMatchCriteria`; `lib/batch.ts`.
6. `feat(doctor): register docs as implemented with a sentinel probe` —
   flip implemented, the 404-sentinel probe, covered in
   `services.probe.test.ts`.
7. `docs(docs): document the shipped service` — COVERAGE.md, service
   README, `instructions.ts` (+ wing test pins), root README (row, icon,
   quickstart), AGENTS.md tree, package.json description/keywords, the
   playbook's probe-fallback line, stale-parenthetical sweep.
8. `docs(docs): delete the shipped plan`.

## Verification checklist

- [ ] `bun run check` green at every commit; branch pushed at every commit
- [ ] `bun run doctor` shows docs reachable on all three accounts
- [ ] Live pairwise pass over stdio on all three accounts: create →
      insert (append and at-index) → get (text and indices verified) →
      replace_all (occurrencesChanged checked) → delete_content_range →
      get (shrunk) → Drive-delete cleanup, confirmed 404
- [ ] Operational matrix issue opened with proof lines and findings
- [ ] Review panel loops until satisfied; PR merges; plan deleted
