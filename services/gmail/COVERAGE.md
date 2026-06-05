# Gmail tool coverage

Tracks what this server exposes against Google's surface, so gaps are visible.
Two reference surfaces: the **MCP toolset** (Google's curated tool list) and the
**discovery document** (every REST method).

- MCP reference: `https://developers.google.com/workspace/gmail/api/reference/mcp`
- Discovery: `https://gmail.googleapis.com/$discovery/rest?version=v1`

## Tier 1 — official MCP toolset (10 / 10)

Every tool on the MCP reference is implemented. Each `schema.ts` cites its page.

| Tool | REST method(s) |
|------|----------------|
| `search_threads` | `threads.list` + `threads.get` (metadata) |
| `get_thread` | `threads.get` |
| `list_drafts` | `drafts.list` + `drafts.get` |
| `create_draft` | `drafts.create` |
| `list_labels` | `labels.list` |
| `create_label` | `labels.create` |
| `label_message` | `messages.modify` (addLabelIds) |
| `unlabel_message` | `messages.modify` (removeLabelIds) |
| `label_thread` | `threads.modify` (addLabelIds) |
| `unlabel_thread` | `threads.modify` (removeLabelIds) |

## Tier 2 — beyond the MCP toolset (deferred)

Useful REST methods the official toolset omits. Not yet implemented; when added,
each is sourced from the REST reference (not an MCP page) and lives in the same
`tools/<name>/` shape. Deferred deliberately, not missing by accident:

- **Send:** `messages.send`, `drafts.send`
- **Drafts:** `drafts.get`, `drafts.update`, `drafts.delete`
- **Messages:** `messages.get`, `messages.list`, `messages.trash`, `messages.untrash`,
  `messages.delete`, `messages.batchModify`, `messages.batchDelete`, `messages.insert`,
  `messages.import`
- **Attachments:** `messages.attachments.get`
- **Threads:** `threads.trash`, `threads.untrash`, `threads.delete`
- **Labels:** `labels.get`, `labels.update`, `labels.patch`, `labels.delete`
- **History:** `history.list`
- **Settings:** filters, `sendAs`, vacation, imap/pop, `smimeInfo`
