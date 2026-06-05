# Gmail tool coverage

Tracks what this server exposes against Google's surface, so gaps are visible.
Two reference surfaces: the **MCP toolset** (Google's curated tool list) and the
**discovery document** (every REST method).

- MCP reference: `https://developers.google.com/workspace/gmail/api/reference/mcp`
- Discovery: `https://gmail.googleapis.com/$discovery/rest?version=v1`

## Tools — MCP toolset (10 / 10)

Every tool on the MCP reference is implemented (`tools/`). Each `schema.ts` cites
its page.

`search_threads`, `get_thread`, `list_drafts`, `create_draft`, `list_labels`,
`create_label`, `label_message`, `label_thread`, `unlabel_message`,
`unlabel_thread`.

## Methods — REST reference (`methods/`)

Operations beyond the MCP toolset, sourced from the REST reference.

| Resource | Implemented |
|----------|-------------|
| messages | `get_message`, `list_messages`, `send_message`, `trash_message`, `untrash_message`, `delete_message` ⚠, `download_attachment`, `batch_modify_messages`, `batch_delete_messages` ⚠ |
| drafts | `get_draft`, `update_draft`, `delete_draft`, `send_draft` ⚠ |
| labels | `get_label`, `update_label`, `delete_label` |
| threads | `trash_thread`, `untrash_thread`, `delete_thread` ⚠ |
| filters | `create_filter`, `get_filter`, `list_filters`, `delete_filter` |

⚠ = irreversible (`destructiveHint`); requires the `https://mail.google.com/` scope.

### Extension beyond the documented projection

The `Message` and `Draft` shapes carry **both** `plaintextBody` and `htmlBody`
(Google's MCP projection documents only `plaintextBody`). Both are extracted from
the MIME tree; this is a deliberate, documented deviation.

## Deferred

Tracked as issues, not missing by accident:

- **Account settings** (vacation, auto-forwarding, IMAP/POP, language, forwarding
  addresses, send-as aliases, delegates): issue #4.
- **Niche / specialized** (history, S/MIME, CSE, message insert/import): issue #5.
