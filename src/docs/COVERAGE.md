# Docs tool coverage

Tracks what this server exposes against Google's surface, so gaps are visible.

**Docs has no MCP toolset.** Google publishes MCP references for Gmail, Drive,
Calendar, Chat, and People; Docs is not among them, so this is a
**methods-only** service (the second, after Sheets): no `tools/` folder, and
the REST-sourced `methods/` registry is the whole wire surface.

- REST reference: `https://developers.google.com/workspace/docs/api/reference/rest`
- Discovery: `https://docs.googleapis.com/$discovery/rest?version=v1`

## Methods: REST reference (`methods/`, 12)

The API has 3 methods; the third, `documents.batchUpdate`, is a union of 40
request types and **is the entire editing surface**, so unlike Sheets it cannot
be deferred whole. The shipped posture: curated request types as first-class
operations, each wrapping `batchUpdate` with exactly one request
(`lib/batch.ts` is the shared wrapper): the text-editing trio, the styling
four, and the document-and-section-layout three.

| Resource | Implemented |
|----------|-------------|
| documents | `get_document`, `create_document` |
| documents.batchUpdate (text editing) | `insert_text`, `replace_all_text` ⚠️, `delete_content_range` ⚠️ |
| documents.batchUpdate (styling) | `update_text_style`, `update_paragraph_style`, `create_paragraph_bullets`, `delete_paragraph_bullets` ⚠️ |
| documents.batchUpdate (document and section layout) | `update_document_style`, `insert_section_break`, `update_section_style` |

⚠️ = destructive (`destructiveHint`): replaced and deleted text is gone (the
API has no undo), and `delete_paragraph_bullets` is a removal (the unlabel
precedent; the text itself is preserved). The text-editing writes are not
idempotent: a repeated `replace_all_text` grows the document whenever the
replacement reintroduces the match (replace `a` with `aa`), a repeated
`delete_content_range` deletes different content (indices shift), and
repeated inserts and creates duplicate (`insert_section_break` adds another
break, and its preceding newline, each time). The styling and layout updates
(`update_text_style`, `update_paragraph_style`, `update_document_style`,
`update_section_style`) are idempotent: re-applying the same style, preset,
or removal is a no-op, and the update masks are derived from the provided
keys so only those fields change. Point-valued style fields take plain
numbers of points (PT is the API's only unit); the PT Dimension nesting is
built at the request boundary.

## The Document projection

`get_document` and `create_document` return **text with indices**: the
projection carries `documentId`, `title`, `revisionId`, and the body's
structural elements as `{ startIndex, endIndex, type, text }`, where indices
are zero-based UTF-16 code units (end-exclusive), paragraphs flatten to their
concatenated run text (non-text elements appear as one U+FFFC placeholder per
UTF-16 unit they occupy, so text length always equals the index span), tables
carry row and column counts only, and an
element of an unknown structural kind keeps its indices and drops the rest.
Those index ranges are exactly what the editing operations target; they shift
on every edit, so agents re-read before computing new ranges.

The Docs API also has **no delete and no list**: both are Drive's
(`files.delete`, `files.list`), outside this server's surface, and
`documents.create` accepts only a title (the API ignores any provided
content).

## Intentionally not exposed

- **Clearing a style to inherited.** The update masks are derived from the
  provided keys, so a field can be set but never reset to inherit (and a
  link, once set, cannot be removed); clearing requires a mask entry with no
  value, which rides with the `writeControl` work in issue #35.
- **The read-only style fields.** DocumentStyle's and SectionStyle's header
  and footer ids and `useCustomHeaderFooterMargins` are read-only (writing
  `marginHeader` or `marginFooter` flips the latter implicitly), and
  SectionStyle's `sectionType` is set at insertion, so none appear in the
  curated write entities. SectionStyle's `pageNumberStart`,
  `flipPageOrientation`, and `useFirstPageHeaderFooter`, whose updatability
  the reference leaves ambiguous, stay with issue #35.
- **The other 30 `batchUpdate` request types** (tables, named ranges,
  headers and footers, tabs, objects): issue #35 tracks the curated
  expansion. `writeControl` (optimistic concurrency), `searchByRegex` on the
  replace criteria, and text tab stops ride with it.
- **Tabs and the recursive document tree**: `includeTabsContent` and
  `suggestionsViewMode` on `documents.get` are not exposed; the legacy
  single-tab body view is served, writes omit `tabId`/`segmentId` (Google
  applies them to the first tab's body), and table cells, styles,
  inline and positioned objects, footnotes, headers, and footers are not
  projected. Issue #36.

## Deferred

Tracked as issues, not missing by accident:

- **Curated `batchUpdate` expansion** (tables, named ranges,
  headers/footers, regex replace, write control, the ambiguous section
  fields): issue #35.
- **Rich document structure in reads** (tabs, table cells, styles,
  suggestions): issue #36.
