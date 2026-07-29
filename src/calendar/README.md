# Calendar server

The Calendar MCP server, and the first replication of the canary shape proven
by [Gmail](../gmail/README.md) for the [google-mcp-suite](../../README.md)
pattern: `tools/` and `methods/` (verbs) over `entities/` (nouns), all zod,
each an `operation()` from the shared [`lib`](../lib) and served by `server()`
over an [`auth`](../auth) client.

## Capabilities

31 operations across events, calendars, the user's calendar list, sharing,
availability, and settings: read (`list_events`, `get_event`,
`list_event_instances`), write (`create_event`, `update_event`, `patch_event`,
`quick_add_event`, `move_event`, `respond_to_event`), scheduling
(`suggest_time`, `query_free_busy`), calendar management (`list_calendars`, the
calendars and calendar-list-entry methods), sharing (`list_acl_rules`,
`get_acl_rule`, `add_acl_rule`, `update_acl_rule`, `patch_acl_rule`,
`delete_acl_rule`), and account lookups (`get_colors`, `list_settings`,
`get_setting`).

Every operation carries the four MCP annotation hints. Marked destructive
(`destructiveHint`) are the removals (`delete_event`, `delete_calendar`,
`clear_calendar`, `remove_calendar_entry`, `delete_acl_rule`) and the three
remaining sharing writes (`add_acl_rule`, `update_acl_rule`,
`patch_acl_rule`), which are not removals but standing grants of access.

Those same three sharing writes are the surface's only open-world operations
(`openWorldHint`), and are also non-idempotent, alongside the creates
(`create_event`, `create_calendar`, `quick_add_event`). The reason is
`sendNotifications`: Google enables sharing notifications by default, so a
write notifies and a replay notifies again. Access removal never notifies.

The full, always-current list is [`CAPABILITIES.md`](./CAPABILITIES.md),
regenerated from the registries with `bun run capabilities`; what is implemented
versus Google's full surface is mapped in [`COVERAGE.md`](./COVERAGE.md). An MCP
client discovers the live surface, with input and output JSON Schema, from the
server's `tools/list`.

## Layout (`src/calendar/`)

```
index.ts        # server({ name, title, description, instructions, operations, client }); the bin entry
tools/          # MCP-sourced ops; registry.ts + one folder per tool
                #   <tool>/ index.ts + handler.ts + schema.ts + handler.test.ts
methods/        # REST-sourced ops; same construction
entities/       # PascalCase zod domain objects (Event, Calendar, ...)
lib/            # projections + pure helpers (event, datetime, suggest, ...)
```

Scopes are not declared here; every account is authorized once for the
front-loaded union in [`auth`](../auth) (`config.ts` `SCOPES`).

Tool vocabulary is lifted from Google's MCP reference pages
(`https://developers.google.com/workspace/calendar/api/v3/reference/mcp`,
Developer Preview), used for discovery only; the handlers reimplement over the
Calendar REST API.

## Run

Point your MCP client at one instance per account:

```json
{
  "mcpServers": {
    "calendar-personal": {
      "command": "google-mcp-calendar",
      "env": { "GOOGLE_MCP_ACCOUNT": "personal@example.com" }
    },
    "calendar-work": {
      "command": "google-mcp-calendar",
      "env": { "GOOGLE_MCP_ACCOUNT": "work@example.com" }
    }
  }
}
```

Or run it bare (debugging, smoke tests), bound by the same env var:

```sh
GOOGLE_MCP_ACCOUNT=personal@example.com google-mcp-calendar        # serve
GOOGLE_MCP_ACCOUNT=personal@example.com google-mcp-calendar auth   # authorize the account
```
