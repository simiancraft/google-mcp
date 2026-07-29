# Calendar tool coverage

Tracks what this server exposes against Google's surface, so gaps are visible.
Two reference surfaces: the **MCP toolset** (Google's curated tool list,
Developer Preview) and the **discovery document** (every REST method).

- MCP reference: `https://developers.google.com/workspace/calendar/api/v3/reference/mcp`
- Discovery: `https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest`

## Tools: the MCP toolset (`tools/`, 8 of 8)

Every tool on the MCP reference is implemented (`tools/`). Each operation's
`index.ts` cites its page.

`list_events`, `get_event`, `list_calendars`, `suggest_time`, `create_event`,
`update_event`, `delete_event` ⚠️, `respond_to_event`.

Two of these are compositions, not transcriptions: `suggest_time` has no REST
equivalent (it is `freebusy.query` plus pure slot computation in
`lib/suggest.ts`), and `respond_to_event` is an `events.patch` of the
self-attendee's response status.

## Methods: REST reference (`methods/`, 23)

Operations beyond the MCP toolset, sourced from the REST reference.

| Resource | Implemented |
|----------|-------------|
| events | `list_event_instances`, `move_event`, `quick_add_event`, `patch_event` |
| calendars | `get_calendar`, `create_calendar`, `update_calendar`, `delete_calendar` ⚠️, `clear_calendar` ⚠️ |
| calendarList | `get_calendar_entry`, `add_calendar_entry`, `update_calendar_entry`, `remove_calendar_entry` ⚠️ |
| acl | `list_acl_rules`, `get_acl_rule`, `add_acl_rule` ⚠️🌐, `update_acl_rule` ⚠️🌐, `patch_acl_rule` ⚠️🌐, `delete_acl_rule` ⚠️ |
| freebusy | `query_free_busy` |
| colors | `get_colors` |
| settings | `list_settings`, `get_setting` |

⚠️ = destructive (`destructiveHint`), which on this surface covers two of the
rubric's clusters in EXTENDING.md. Most are removals: `remove_calendar_entry`
⚠️ only unsubscribes (the calendar and its events are untouched, and re-adding
the entry reverses it), but a removal is annotated destructive, matching
Google's own `unlabel_message` precedent. The three ACL writes that are not
removals are destructive as standing side effects instead, the `create_filter`
and `sheets/add_protected_range` cluster: a grant keeps conferring access until
something revokes it, and `owner` additionally confers control over the
calendar's own sharing.

🌐 = open-world (`openWorldHint`), and, on this surface, non-idempotent for the
same reason. These three take `sendNotifications`, which Google defaults to
true, so the write mails the grantee, who may be outside the organization, and
a replay mails them again. That puts them in the rubric's sends cluster rather
than its updates cluster. `delete_acl_rule` takes no such parameter, because
Google never notifies on access removal.

The tools additionally transcribe the Tool Annotations published on their MCP
pages (notably: `update_event` and `respond_to_event` are non-destructive per
Google).

Methods speak the REST vocabulary (`timeMin`, `maxResults`, `sendUpdates`)
while tools keep the MCP pages' vocabulary (`startTime`, `pageSize`,
`notificationLevel`); each folder mirrors its own source of truth.

**Method naming for REST `patch`:** methods take `update_*` (`update_calendar`,
`update_calendar_entry`) unless an MCP tool already holds that name, in which
case `patch_*` disambiguates; `events.patch` is `patch_event` because the
toolset owns `update_event`. The `acl` resource is the one place both names
appear side by side, because it is the one resource where both REST methods
ship (see below): `update_acl_rule` is `acl.update` and `patch_acl_rule` is
`acl.patch`.

**Intentionally not exposed:** the PUT methods (`events.update`,
`calendars.update`, `calendarList.update`) are skipped; the patch operations
supersede them (full-resource PUT over a lossy projection would clobber
unprojected fields).

**`acl.update` is the deliberate exception to that PUT policy.** The reason the
other PUTs are skipped does not hold for an ACL rule: `role` and `scope` are its
entire writable surface and both are projected, so a full replacement cannot
clobber a field the projection dropped (`etag` and `kind` are the only omissions,
neither writable). Both are therefore exposed, and they differ as Google
documents: `update_acl_rule` replaces and requires `scope`, while
`patch_acl_rule` leaves unset fields alone. The discovery document marks `role`
required for `acl.insert` alone, so `add_acl_rule` requires it and the two
edit methods do not. `calendarList.list` with the full per-user view is a real
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

## ACL sharing

The `acl` resource is covered in full except `acl.watch`, which belongs to the
watch-channels issue below: `list_acl_rules`, `get_acl_rule`, `add_acl_rule`,
`update_acl_rule`, `patch_acl_rule`, and `delete_acl_rule`. A calendar's rules
are what its sharing consists of, each pairing an `AclRole` with an `AclScope`.

Three details are worth knowing before calling them:

- **Reading the rules needs writer access.** A `freeBusyReader` or `reader`
  grant on a calendar is not enough to list its ACL, so `list_acl_rules`
  against someone else's calendar commonly 403s even when its events are
  readable.
- **A rule's id derives from its scope** (`user:someone@example.com`,
  `domain:example.com`, or the bare `default`), so it can be constructed
  rather than looked up.
- **`AclScope` enforces the type/value pairing** that Google documents but does
  not reject: `default` is the public scope and carries no value, and the named
  types require one. Google ignores a value sent with `default`, so without the
  check a mistyped scope type would silently publish a calendar to everyone
  while looking targeted.

`AclRole` is sourced from the discovery document rather than the bundled
`@googleapis/calendar` types, which omit `writerWithoutPrivateAccess`.

## Deferred

Tracked as issues, not missing by accident:

- **Watch channels** (events.watch, calendarList.watch, settings.watch,
  channels.stop): issue #20.
- **Niche / specialized** (events.import, incremental sync via
  syncToken/nextSyncToken): issue #21.
