# Add the Drive service

**Status:** In progress
**Scope:** cross-stack
**Date:** 2026-06-10
**Last reviewed:** 2026-06-10
**Context:** Drive is the next service in the suite (ADDING-A-SERVICE.md names it as a worked delta); its scope is already in the token union, so it ships without re-consent.

## Goal

Ship `google-mcp-drive`: a per-account Drive MCP server with Google's 8-tool
MCP toolset transcribed verbatim plus 27 REST methods (files metadata CRUD,
comments, replies, revisions, shared drives, about), 35 operations total.
Done looks like: `bun run check` green with 100% coverage; the bin serves and
`tools/list` returns 35 entries each carrying the four hints and a `_meta`
source citation; doctor probes Drive live per account; COVERAGE.md, service
README, root README, AGENTS.md, and package.json all account for the service;
the hostile clusters live in issues #38 (media), #39 (sharing writes), and
#40 (changes/watch); the operational matrix issue is open with live boxes
ticked pairwise; this plan file is deleted.

## Domain context

Survey date 2026-06-10. MCP toolset reference:
`developers.google.com/workspace/drive/api/reference/mcp` (8 tools, pages at
`…/mcp/tools_list/<tool>`). REST reference:
`developers.google.com/workspace/drive/api/reference/rest/v3/<resource>/<method>`.
Discovery doc: `googleapis.com/discovery/v1/apis/drive/v3/rest`. Scope
`…/auth/drive` is already in `SCOPES`; no re-auth.

The traps, decided here:

1. **Two Files, one noun.** The toolset's `File` is a lossy projection with
   its own vocabulary (`title`, `parentId`, `owner`, `viewUrl`,
   `canAddChildren`, `fileSize`) over REST's File (`name`, `parents[]`,
   `owners[]`, `webViewLink`, `capabilities.canAddChildren`, `size`). One
   entity, `entities/File.ts`, carries the toolset projection plus five
   optional REST-sourced fields the methods write (`starred`, `trashed`,
   `folderColorRgb`, `copyRequiresWriterPermission`, `writersCanShare`).
   Tools request only the toolset fields, so their outputs stay verbatim;
   methods request the superset so a write's effect is visible in its output.
2. **The query translator.** `search_files` documents a query language whose
   terms are not v3's: `title` → `name`, `parentId = 'x'` → `'x' in parents`,
   `owner = 'me'` → `'me' in owners` (and the `!=` forms via `not … in …`);
   `fullText`, `mimeType`, the timestamp terms, and `sharedWithMe` pass
   through. `lib/query.ts` tokenizes quoted strings first so values are never
   rewritten, maps term tokens, and leaves unknown terms untouched (v3
   rejects what it rejects). Pure function, exhaustively unit-tested.
3. **The content boundary.** `create_file` and `download_file_content`
   already define Google's base64-in-JSON boundary; transcribe it and stop.
   `download_file_content`: Google-native files go through `files.export`
   (`exportMimeType`, default `text/plain`); blobs through `files.get`
   `alt=media`, refused over 25 MiB decoded (the suite's de facto base64
   ceiling, Gmail's attachment max) with an error citing #38.
   `read_file_content`: native files export to text (`document` →
   `text/plain`, `spreadsheet` → `text/csv`, `presentation` → `text/plain`);
   text-like blobs (`text/*`, JSON, XML, SVG) download as UTF-8; anything
   else is refused with guidance to use `download_file_content` (REST cannot
   reproduce the hosted toolset's PDF/Office/image text extraction;
   COVERAGE.md documents the divergence).
4. **`contentSnippet` has no REST source.** The toolset computes snippets
   server-side; v3 does not serve them. The field stays in the entity
   (schema-faithful) but is never populated, and `excludeContentSnippets` is
   accepted with nothing to exclude; both `.describe()` texts say so plainly.
5. **Verbatim annotations include an open-world pair.** Google's pages mark
   `create_file` and `copy_file` `openWorldHint: true` (verified against the
   raw pages 2026-06-10). The wing's surface pin asserts exactly
   `{copy_file, create_file}` open-world, unlike Calendar's all-closed pin.
6. **The trash split.** v3 has no trash method; trashing is
   `files.update {trashed}`. Shipping that flag inside `update_file` would
   leave one annotation quad covering both a rename and a removal, so the
   `files.update` page is transcribed three times: `update_file`
   (metadata-only, no `trashed`), `trash_file`, and `untrash_file`; the
   reversible-removal pair carries its own destructive flag and reuses
   Gmail's trash vocabulary. `delete_file` (`files.delete`) bypasses trash
   permanently.
7. **Shared-drive support is hardcoded.** Every handler that takes
   `supportsAllDrives` passes `true`; the legacy opt-in flag is not exposed.
   Deprecated parameters (`enforceSingleParent`, `supportsTeamDrives`,
   `create_file`'s deprecated `mimeType`/`content`) are not transcribed.
8. **Shared drives are named in prose, not resource-ese.** REST resource
   `drives` reads as "the drive" in a wire name (`delete_drive` invites
   misreading as something account-wide), so the methods say
   `*_shared_drive(s)`, matching Google's own prose noun. Entity is
   `SharedDrive`. `drives.create`'s required `requestId` is exposed optional
   and defaulted to `crypto.randomUUID()` so the operation stays an honest
   create (all-false quad); the describe text states the default.
9. **Hide is an update, not a removal.** `hide_shared_drive` /
   `unhide_shared_drive` toggle a view flag; Calendar's precedent
   (`update_calendar_entry`'s `hidden`) classes that destructive-false.
10. **Pagination is looped only where the contract has no token.**
    `get_file_permissions` outputs a bare permission list (no
    `nextPageToken`), so its handler walks `permissions.list` pages; every
    other list passes tokens through.
11. **`fields` is the handler's job.** `about.get`, `comments.*`, and
    `files.*` reads require or reward explicit `fields`; each handler
    requests exactly what its projection consumes, via per-noun constants in
    `lib/`.
12. **`list_recent_files` sort orders** map `recency` → `recency desc`,
    `lastModified` → `modifiedTime desc`, `lastModifiedByMe` →
    `modifiedByMeTime desc`; closed input enum, default `recency`, default
    `pageSize` 10 (both documented on the page).

## The operation list

### `tools/` (8, names and parameter vocabulary verbatim from the MCP pages)

| Tool | REST under it | Notes |
| --- | --- | --- |
| `search_files` | `files.list` | query translated per trap 2 |
| `list_recent_files` | `files.list` | orderBy mapped per trap 12 |
| `get_file_metadata` | `files.get` | File projection per trap 1 |
| `get_file_permissions` | `permissions.list` | pages looped per trap 10 |
| `read_file_content` | `files.export` / `files.get alt=media` | trap 3 |
| `download_file_content` | `files.export` / `files.get alt=media` | trap 3; base64 |
| `create_file` | `files.create` (+multipart media) | conversion per page; open-world |
| `copy_file` | `files.copy` | open-world |

### `methods/` (27, REST parameter vocabulary, rubric annotations)

| Method | REST | Quad |
| --- | --- | --- |
| `update_file` | `files.update` (metadata) | update |
| `trash_file` | `files.update {trashed:true}` | removal (destructive) |
| `untrash_file` | `files.update {trashed:false}` | update |
| `delete_file` | `files.delete` | removal (destructive) |
| `empty_trash` | `files.emptyTrash` | removal (destructive) |
| `list_comments` / `get_comment` | `comments.list/get` | read |
| `create_comment` | `comments.create` | create |
| `update_comment` | `comments.update` | update |
| `delete_comment` | `comments.delete` | removal (destructive) |
| `list_replies` / `get_reply` | `replies.list/get` | read |
| `create_reply` | `replies.create` | create |
| `update_reply` | `replies.update` | update |
| `delete_reply` | `replies.delete` | removal (destructive) |
| `list_revisions` / `get_revision` | `revisions.list/get` | read |
| `update_revision` | `revisions.update` | update |
| `delete_revision` | `revisions.delete` | removal (destructive) |
| `list_shared_drives` / `get_shared_drive` | `drives.list/get` | read |
| `create_shared_drive` | `drives.create` | create (trap 8) |
| `update_shared_drive` | `drives.update` | update |
| `delete_shared_drive` | `drives.delete` | removal (destructive) |
| `hide_shared_drive` / `unhide_shared_drive` | `drives.hide/unhide` | update (trap 9) |
| `get_about` | `about.get` | read |

Pins: 8 tools + 27 methods = 35; read-only set has 15 members (6 tools + 9
method reads); destructive set is exactly `{delete_comment, delete_file,
delete_reply, delete_revision, delete_shared_drive, empty_trash,
trash_file}`; open-world set is exactly `{copy_file, create_file}`.

## Deferrals (issues opened 2026-06-10)

- **#38** media beyond the toolset's boundary: content updates
  (`files.update` media), `files.download` + `operations.get`, resumable
  uploads, direct `files.export`.
- **#39** sharing writes: `permissions.create/update/delete/get/list`.
- **#40** changes feed and watch channels: `changes.*`, `files.watch`,
  `channels.stop`.

Intentionally not exposed (COVERAGE.md carries the reasons): `teamdrives.*`
(deprecated), `apps.*`, `files.generateIds` (useless without resumable
upload), `files.generateCseToken` (CSE), `files.listLabels`/`modifyLabels`
(Workspace Labels admin), `approvals.*`/`accessproposals.*` (Workspace
approval workflows), `channels.stop` (with #40), `operations.get` (with #38).

## File structure: after

**Legend:** ➕ created, ✏️ modified

```
src/drive/                              ➕ (whole folder)
  index.ts  operation.ts  instructions.ts  capabilities.ts
  operations.test.ts  CAPABILITIES.md  COVERAGE.md  README.md
  entities/ { File, Permission, User, Comment, Reply, Revision, SharedDrive, About }.ts
  lib/      { file, query, content, comment, revision, shared-drive }.ts (+ .test.ts each)
  tools/    registry.ts + 8 op folders { schema, handler, index, handler.test }.ts
  methods/  registry.ts + 27 op folders { schema, handler, index, handler.test }.ts
src/doctor/services.ts                  ✏️ drive implemented + probe
src/doctor/services.probe.test.ts       ✏️ probe coverage
package.json                            ✏️ @googleapis/drive dep, bin, description, keywords
README.md  AGENTS.md  .github/assets/drive.svg   ✏️ ship-time docs
```

## Commits

1. `docs(drive): add the drive service plan` — this file. Gate: reviewed.
2. `feat(drive): scaffold the drive service skeleton` — `index.ts`,
   `instructions.ts`, `capabilities.ts`, empty registries,
   `operations.test.ts` (0/0 pins), dep + bin. Gate: check green; bin starts,
   `tools/list` returns 0.
3. `feat(drive): add the file read tools` — `search_files`,
   `list_recent_files`, `get_file_metadata`, `get_file_permissions`;
   entities File/Permission/User; `lib/file.ts`, `lib/query.ts`;
   `operation.ts` binder. Gate: check green; CAPABILITIES.md regenerated.
4. `feat(drive): add the file content tools` — `read_file_content`,
   `download_file_content`; `lib/content.ts`. Gate: same.
5. `feat(drive): add the file write tools` — `create_file`, `copy_file`.
   Gate: same.
6. `feat(drive): add the file metadata methods` — `update_file`,
   `trash_file`, `untrash_file`, `delete_file`, `empty_trash`. Gate: same.
7. `feat(drive): add the comment and reply methods` — 10 ops; Comment/Reply
   entities; `lib/comment.ts`. Gate: same.
8. `feat(drive): add the revision methods` — 4 ops; Revision entity;
   `lib/revision.ts`. Gate: same.
9. `feat(drive): add the shared drive and about methods` — 8 ops;
   SharedDrive/About entities; `lib/shared-drive.ts`. Gate: same.
10. `feat(doctor): register drive as implemented with a live probe` —
    `about.get` with `fields=user(emailAddress)`; probe covered by mocking
    the client module. Gate: check green; `bun run doctor` live-green.
11. `docs(drive): document the shipped service` — COVERAGE.md, service
    README, root README (table, hero caption, icon brightened, quickstart),
    AGENTS.md tree, package.json metadata, stale-parenthetical sweep. Gate:
    check green; `bun run capabilities` produces no diff; links resolve.
12. `docs(drive): delete the shipped plan`. Gate: no references remain.

## Verification checklist

- [ ] `bun run check` green (coverage 100%).
- [ ] All 35 operations live-verified pairwise over stdio against real
      accounts; operational matrix issue opened with proof lines.
- [ ] Docs updated per commit 11; capabilities regenerated with no diff.
- [ ] Plan file deleted (Inspector Gadget Rule).

## References

ADDING-A-SERVICE.md, EXTENDING.md, issues #38 #39 #40, Calendar (#22) and
Sheets (#29) matrices for the rubric.
