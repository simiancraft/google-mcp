# Drive tool coverage

Tracks what this server exposes against Google's surface, so gaps are visible.

Drive is MCP-supported: Google publishes a toolset reference (8 tools), and
this server transcribes all 8, plus 27 REST methods the toolset omits; 35
operations total.

- MCP toolset reference: `https://developers.google.com/workspace/drive/api/reference/mcp`
- REST reference: `https://developers.google.com/workspace/drive/api/reference/rest`
- Discovery: `https://www.googleapis.com/discovery/v1/apis/drive/v3/rest`

## Tools: the MCP toolset (`tools/`, 8 of 8)

| Tool | REST under it |
|------|---------------|
| `search_files` | `files.list` (query translated, see below) |
| `list_recent_files` | `files.list` (`recency`/`lastModified`/`lastModifiedByMe` orderings) |
| `get_file_metadata` | `files.get` |
| `get_file_permissions` | `permissions.list` (every page walked; the contract has no page token) |
| `read_file_content` | `files.export` / `files.get alt=media` |
| `download_file_content` | `files.export` / `files.get alt=media`, base64 |
| `create_file` | `files.create` (multipart media) |
| `copy_file` | `files.copy` |

Tool annotations are transcribed verbatim from the MCP pages, which makes
`create_file` and `copy_file` the first **open-world** pair published on
Google's own MCP pages (`openWorldHint: true`, verified against the raw HTML
on 2026-06-10); Gmail's sends carry the hint by rubric, and everything else
here is closed-world.

### Divergences from the hosted toolset, by necessity

The hosted toolset runs on Google's internal backends; this server reproduces
its contracts through REST v3, which cannot do everything those backends do:

- **The query language is translated.** `search_files` documents `title`,
  `parentId = 'x'`, and `owner = 'me'` terms that v3 spells `name`,
  `'x' in parents`, and `'me' in owners`. `lib/query.ts` tokenizes quoted
  values first and maps the terms; everything else passes through verbatim.
- **`contentSnippet` is never populated.** REST v3 serves no content
  snippets, so the field stays in the `File` entity (schema-faithful to the
  MCP pages) but is always absent, and `excludeContentSnippets` is accepted
  with nothing to exclude; both `.describe()` texts say so.
- **`read_file_content` is narrower.** Docs, Sheets, and Slides export to
  text (`text/plain`, `text/csv`); text-like blobs (text, JSON, XML, SVG)
  download as UTF-8. The hosted toolset's PDF/Office/image text extraction
  has no REST equivalent, so those types are refused with guidance toward
  `download_file_content`.
- **Both content tools are capped.** Blob transfers over 25 MiB decoded
  (the suite's base64-in-JSON ceiling, Gmail's attachment maximum) are
  refused with an error citing #38 rather than degraded; `read_file_content`
  and `download_file_content` enforce the same ceiling.
- **`create_file`'s deprecated parameters** (`mimeType`, `content`,
  superseded on the page itself by `contentMimeType` and
  `textContent`/`base64Content`) are not transcribed.

## Methods: REST reference (`methods/`, 27)

| Resource | Implemented |
|----------|-------------|
| files | `update_file`, `trash_file` ⚠️, `untrash_file`, `delete_file` ⚠️, `empty_trash` ⚠️ |
| comments | `list_comments`, `get_comment`, `create_comment`, `update_comment`, `delete_comment` ⚠️ |
| replies | `list_replies`, `get_reply`, `create_reply`, `update_reply`, `delete_reply` ⚠️ |
| revisions | `list_revisions`, `get_revision`, `update_revision`, `delete_revision` ⚠️ |
| drives | `list_shared_drives`, `get_shared_drive`, `create_shared_drive`, `update_shared_drive`, `delete_shared_drive` ⚠️, `hide_shared_drive`, `unhide_shared_drive` |
| about | `get_about` |

⚠️ = destructive (`destructiveHint`), per the annotation rubric in
EXTENDING.md: `trash_file` is a reversible removal (reversible removals still
count, Gmail's `trash_message` precedent), while `delete_file`,
`empty_trash`, `delete_revision`, and `delete_shared_drive` are permanent.
`hide_shared_drive`/`unhide_shared_drive` toggle a view flag and are
classified as updates (Calendar's `hidden` precedent).

Naming notes, both anti-misreading measures:

- v3 has no trash method (trashing is `files.update {trashed}`), so the
  `files.update` page is transcribed three times: `update_file`
  (metadata-only, no `trashed` field), and the `trash_file`/`untrash_file`
  pair, which reuses Gmail's trash vocabulary and carries its own
  annotations.
- The REST resource `drives` reads as "the drive" in a wire name
  (`delete_drive` invites misreading as something account-wide), so the
  methods say `*_shared_drive`, Google's own prose noun. Outputs keep REST's
  `drives` key.

Handlers always declare shared-drive support (`supportsAllDrives`,
`includeItemsFromAllDrives` on list); the legacy opt-in flags are not
exposed. `create_shared_drive` defaults REST's required `requestId` to a
random UUID so the operation stays an honest create.

## The File projection

One `File` noun serves both wings: the MCP toolset's lossy projection
(`title`, `parentId`, `owner`, `viewUrl`, `fileSize`, `canAddChildren`) plus
five REST-vocabulary flags the methods write (`starred`, `trashed`,
`folderColorRgb`, `copyRequiresWriterPermission`, `writersCanShare`). Tools
request only the toolset fields, so their outputs stay verbatim to the MCP
pages; methods request the superset so a write's effect is visible in its
own output.

## Deferred (issues)

- **#38 media beyond the toolset's base64 boundary**: content updates
  (`files.update` media), `files.download` + `operations.get` (long-running
  downloads for video and large blobs), resumable uploads, direct
  `files.export`.
- **#39 sharing writes**: `permissions.create/update/delete/get/list`; the
  toolset's `get_file_permissions` ships the read path. Sharing writes reach
  external parties (notification emails, anyone-with-link) and carry
  ownership transfer, so the cluster gets its own treatment.
- **#40 changes feed and watch channels**: `changes.*`, `files.watch`,
  `channels.stop`; a stdio server has no natural place to receive push
  notifications.

## Intentionally not exposed

- `teamdrives.*`: deprecated; `drives.*` is the replacement and is shipped.
- `files.generateIds`: useful only for the resumable-upload flows deferred in
  #38.
- `files.export` as a standalone method: `download_file_content`'s
  `exportMimeType` covers the format-choice path within the base64 boundary;
  the rest rides with #38.
- `files.listLabels` / `files.modifyLabels`: Workspace Labels administration,
  a taxonomy system of its own.
- `files.generateCseToken`: client-side encryption (Workspace CSE deployments
  only).
- `apps.*`: the user's installed Drive apps, an app-integration surface, not
  file work.
- `approvals.*` / `accessproposals.*`: Workspace approval workflows.
- `operations.get` / `channels.stop`: ride with #38 and #40 respectively.
