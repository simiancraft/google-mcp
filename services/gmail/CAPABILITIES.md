# Gmail capabilities

33 operations. ⚠️ marks irreversible operations (MCP `destructiveHint`).

| Operation | Description |
| --- | --- |
| `search_threads` | Search threads. Returns thread ids and snippets; use get_thread for messages. |
| `get_thread` | Get a thread and its messages by id. |
| `list_drafts` | List draft messages, with optional Gmail query filtering. |
| `create_draft` | Create a draft email. |
| `list_labels` | List the labels in the mailbox. |
| `create_label` | Create a new label. |
| `label_message` | Add labels to a message. |
| `label_thread` | Add labels to a thread. |
| `unlabel_message` | Remove labels from a message. |
| `unlabel_thread` | Remove labels from a thread. |
| `get_message` | Get a single message by id. |
| `list_messages` | List messages using Gmail query syntax. |
| `send_message` ⚠️ | Send an email immediately. |
| `trash_message` | Move a message to the trash. |
| `untrash_message` | Remove a message from the trash. |
| `delete_message` ⚠️ | Permanently delete a message (bypasses the trash). |
| `download_attachment` | Download a message attachment (base64url-encoded bytes). |
| `batch_modify_messages` | Add and/or remove labels across many messages at once. |
| `batch_delete_messages` ⚠️ | Permanently delete many messages at once (bypasses the trash). |
| `get_draft` | Get a draft by id. |
| `update_draft` | Replace the content of an existing draft. |
| `delete_draft` | Delete a draft. |
| `send_draft` ⚠️ | Send an existing draft. |
| `get_label` | Get a label by id (includes color and thread counts). |
| `update_label` | Update a label name and/or color. |
| `delete_label` | Delete a user label. |
| `trash_thread` | Move a thread to the trash. |
| `untrash_thread` | Remove a thread from the trash. |
| `delete_thread` ⚠️ | Permanently delete a thread and all its messages (bypasses the trash). |
| `create_filter` | Create a filter (criteria plus actions). |
| `get_filter` | Get a filter by id. |
| `list_filters` | List all filters for the account. |
| `delete_filter` | Delete a filter. |
