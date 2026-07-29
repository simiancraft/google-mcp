# Calendar tool coverage

Tracks what this server exposes against Google's surface, so gaps are visible.
Two reference surfaces: the **MCP toolset** (Google's curated tool list,
Developer Preview) and the **discovery document** (every REST method).

- MCP reference: `https://developers.google.com/workspace/calendar/api/v3/reference/mcp`
- Discovery: `https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest`

## Tools: the MCP toolset (`tools/`, 8 of 8)

Every tool on the MCP reference is implemented (`tools/`). Each `schema.ts` cites
its page.

`list_events`, `get_event`, `list_calendars`, `suggest_time`, `create_event`,
`update_event`, `delete_event` ⚠️, `respond_to_event`.

Two of these are compositions, not transcriptions: `suggest_time` has no REST
equivalent (it is `freebusy.query` plus pure slot computation in
`lib/suggest.ts`), and `respond_to_event` is an `events.patch` of the
self-attendee's response status.

## Methods: REST reference (`methods/`, 17)

Operations beyond the MCP toolset, sourced from the REST reference.

| Resource | Implemented |
|----------|-------------|
| events | `list_event_instances`, `move_event`, `quick_add_event`, `patch_event` |
| calendars | `get_calendar`, `create_calendar`, `update_calendar`, `delete_calendar` ⚠️, `clear_calendar` ⚠️ |
| calendarList | `get_calendar_entry`, `add_calendar_entry`, `update_calendar_entry`, `remove_calendar_entry` ⚠️ |
| freebusy | `query_free_busy` |
| colors | `get_colors` |
| settings | `list_settings`, `get_setting` |

⚠️ = destructive (`destructiveHint`): a removal, per the annotation rubric in
EXTENDING.md. `remove_calendar_entry` ⚠️ only unsubscribes (the calendar and
its events are untouched, and re-adding the entry reverses it), but a removal
is annotated destructive, matching Google's own `unlabel_message` precedent.
The tools additionally transcribe the Tool Annotations published on their MCP
pages (notably: `update_event` and `respond_to_event` are non-destructive per
Google).

Methods speak the REST vocabulary (`timeMin`, `maxResults`, `sendUpdates`)
while tools keep the MCP pages' vocabulary (`startTime`, `pageSize`,
`notificationLevel`); each folder mirrors its own source of truth.

**Method naming for REST `patch`:** methods take `update_*` (`update_calendar`,
`update_calendar_entry`) unless an MCP tool already holds that name, in which
case `patch_*` disambiguates; `events.patch` is `patch_event` because the
toolset owns `update_event`.

**Intentionally not exposed:** the PUT methods (`events.update`,
`calendars.update`, `calendarList.update`) are skipped; the patch operations
supersede them (full-resource PUT over a lossy projection would clobber
unprojected fields). `calendarList.list` with the full per-user view is a real
gap (the `list_calendars` tool returns the 4-field MCP projection); tracked as
issue #24.

## The MCP Event projection and its gap-filler

The MCP toolset defines a lossy Event projection, which the tools return
verbatim: `conferenceData` collapses to a `conferenceUrl` string, attendee
`optional` is renamed `optionalAttendee`, `reminders.overrides` surfaces as
`overrideReminders`, and etag, sequence, iCalUID, extendedProperties,
attachments, and the guest-permission flags are omitted. Because `etag` is
omitted, the read-modify-write paths (`update_event` attendee deltas,
`respond_to_event`) carry no `If-Match` concurrency guard; a lost update is
possible under concurrent edits, an accepted simplification for a single-agent
surface.

`patch_event` (methods/) is the fidelity gap-filler on the write side: it
exposes the REST fields the `update_event` tool cannot touch (recurrence,
status, transparency, the full attendee shape, `extendedProperties`, and the
`guestsCan*` permissions).

The `acl.*` methods (`list_acl_rules` through `delete_acl_rule`) cover
sharing. `acl.watch` is excluded; it belongs to the watch-channels issue
below. They are the only operations on this surface that carry
`openWorldHint`, because `sendNotifications` defaults to true at Google and
emails the grantee.

## Deferred

Tracked as issues, not missing by accident:

- **Watch channels** (events.watch, calendarList.watch, settings.watch,
  channels.stop): issue #20.
- **Niche / specialized** (events.import, incremental sync via
  syncToken/nextSyncToken): issue #21.
