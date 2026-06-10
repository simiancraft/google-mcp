# Add the Calendar Service

**Status:** In progress
**Scope:** cross-stack
**Date:** 2026-06-10
**Last reviewed:** 2026-06-10
**Context:** Gmail shipped as v1.0.0 and is the proven canary shape; Calendar v3 is the chosen second service (published Google MCP toolset to mirror, no media or request-union hostility, scope already in every token).

## Goal

The suite's thesis is one thin MCP server per Google service, and with only Gmail shipped the thesis is unproven; Calendar is the test that the canary shape replicates. This plan adds `src/calendar` mirroring `src/gmail` exactly: `tools/` transcribing Google's 8-tool Calendar MCP reference verbatim, `methods/` covering the practical REST surface the toolset omits (17 operations), one entity per zod noun, a `google-mcp-calendar` bin, and doctor registration with a live probe.

Done looks like: `bun run check` green with 25 calendar operations on the wire; `npm install -g google-mcp-suite && GOOGLE_MCP_ACCOUNT=x google-mcp-calendar` serves a working calendar server; `doctor` probes calendar per account; CAPABILITIES.md and COVERAGE.md exist for calendar; the README service table shows Calendar implemented; deferred surfaces live in issues #19, #20, and #21.

## Domain context

1. **Tools vs methods, both operations.** `tools/` mirrors Google's MCP toolset reference page-for-page; `methods/` mirrors the REST reference for what the toolset omits. Identical construction (`schema.ts` + `handler.ts` + `index.ts` + `handler.test.ts`, all via `calendarOperation`). `mergeOperations` throws on wire-name collisions, and there are none in the list below.
2. **The MCP Event is a lossy projection with renames.** Google's MCP tool pages define an Event output that collapses `conferenceData` to a `conferenceUrl` string, renames attendee `optional` to `optionalAttendee`, replaces `reminders` with `overrideReminders[]`, and omits etag/sequence/iCalUID/extendedProperties/attachments/guest permissions. `lib/event.ts` owns this projection; tools return it verbatim. Write tools take a `notificationLevel` enum (`NONE` | `EXTERNAL_ONLY` | `ALL`) that maps to REST `sendUpdates` (`none` | `externalOnly` | `all`); `lib/notifications.ts` owns that mapping.
3. **`calendarId` defaults to `'primary'`.** The exact analog of Gmail's hardcoded `userId: 'me'`, except multi-calendar is real, so it is an optional input parameter everywhere instead of a constant.
4. **Start/end is a tri-state.** `EventDateTime` is `date` (all-day) XOR `dateTime`, plus optional `timeZone` (required on recurring events). One zod refinement in `entities/EventDateTime.ts`; conversion helpers in `lib/datetime.ts`. The MCP create tool's all-day form is `allDay: true` with midnight-UTC timestamps, translated to REST `start.date`.
5. **`patch_event` is the fidelity gap-filler.** The MCP `update_event` cannot edit recurrence, set attendee optionality or resource flags, or touch transparency and extendedProperties. `methods/patch_event` exposes REST `events.patch` with the full field surface so the suite's "broader REST surface" claim holds for Calendar.
6. **Two tools are compositions, not transcriptions.** `suggest_time` has no REST equivalent: it is `freebusy.query` plus pure slot computation (`lib/suggest.ts`, fully unit-testable). `respond_to_event` is `events.patch` of the self-attendee's `responseStatus` (read the event, rewrite the attendee array, patch).

All Google-side facts were extracted from the live docs on 2026-06-10: the MCP reference index at `https://developers.google.com/workspace/calendar/api/v3/reference/mcp` (note the `/api/v3/reference/mcp` path; `/api/reference/mcp` 404s; surface is Developer Preview), per-tool pages under `.../mcp/tools_list/<tool>`, and the discovery document at `https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest`. Each `schema.ts` cites its source page, Gmail-style; the executor re-reads the cited page when transcribing a schema.

## The operation list (25)

### tools/ (8) — MCP reference, verbatim names

| Operation | Maps to | Notes |
|---|---|---|
| `list_events` | events.list | pageSize ≤2500 default 250; `fullText` ≈ REST `q`; eventTypeFilter; orderBy `default\|startTime\|startTimeDesc\|lastModified` |
| `get_event` | events.get | eventId required |
| `list_calendars` | calendarList.list | output: 4-field Calendar projection (id, summary, description, timeZone); pageSize ≤250 |
| `suggest_time` | freebusy.query + `lib/suggest.ts` | attendeeEmails (use `'primary'` for self), start/end window, durationMinutes, preferences {startHour, endHour, excludeWeekends, pageSize} |
| `create_event` | events.insert | `addGoogleMeetUrl` → conferenceData.createRequest + conferenceDataVersion=1; `recurrenceData[]`; bare attendee emails |
| `update_event` | events.patch | patch semantics; attendee deltas (`addedAttendeeEmails`/`removedAttendeeEmails`); `overrideReminders` replaces all when set; NO recurrence (see `patch_event`) |
| `delete_event` ⚠ | events.delete | destructive; returns the deleted event's projection (fetch before delete); notificationLevel exposed |
| `respond_to_event` | events.patch (self-attendee) | responseStatus `declined\|tentative\|accepted` + optional responseComment |

### methods/ (17) — REST reference, what the toolset omits

| Operation | REST method | Notes |
|---|---|---|
| `list_event_instances` | events.instances | expands one recurring series; timeMin INCLUSIVE on end (differs from list) |
| `move_event` | events.move | requires `destination` calendar; only `default`-type events; sendUpdates |
| `quick_add_event` | events.quickAdd | natural-language `text` required; sendUpdates |
| `patch_event` | events.patch | full REST field surface: recurrence, transparency, full attendee shape, extendedProperties, guestsCan*, sendUpdates, conferenceDataVersion |
| `get_calendar` | calendars.get | |
| `create_calendar` | calendars.insert | secondary calendar; body {summary, description?, location?, timeZone?} |
| `update_calendar` | calendars.patch | patch semantics, Gmail `update_label` pattern |
| `delete_calendar` ⚠ | calendars.delete | destructive; secondary calendars only |
| `clear_calendar` ⚠ | calendars.clear | destructive; primary only; wipes ALL events |
| `get_calendar_entry` | calendarList.get | the user's list entry: accessRole, colors, hidden, selected, defaultReminders |
| `add_calendar_entry` | calendarList.insert | subscribe an existing calendar id to the user's list |
| `update_calendar_entry` | calendarList.patch | writing colors requires `colorRgbFormat=true` |
| `remove_calendar_entry` | calendarList.delete | unsubscribe; reversible, not destructive |
| `query_free_busy` | freebusy.query | body {timeMin, timeMax, timeZone?, items[{id}]}; returns busy TimePeriods per calendar |
| `get_colors` | colors.get | calendar + event palette maps |
| `list_settings` | settings.list | ignore nextSyncToken (sync deferred, #21) |
| `get_setting` | settings.get | by setting id |

**Deferred, encoded as issues:** acl.* (sharing; #19), all watch channels + channels.stop (#20), events.import + incremental sync params (#21). COVERAGE.md's Deferred section cites all three.

## Current surface area

| File | Why it changes |
|---|---|
| `package.json` | add `@googleapis/calendar` dep, `google-mcp-calendar` bin, extend `capabilities` script, description/keywords mention Calendar |
| `src/doctor/services.ts` | flip calendar to `implemented: true`, add `calendarProbe` (scopes already attributed; drift test stays green) |
| `README.md` | Services table row → implemented with operations link; hero caption; description sentence |
| `.github/assets/calendar.svg` | remove the baked `opacity="0.4"` dimming (it is shipped now) |
| `AGENTS.md` | layout tree gains `calendar/` |
| `src/gmail/**` | untouched; read-only exemplar |
| `src/lib/**`, `src/auth/**` | untouched; consumed as-is (`operation()`, `server()`, `authorizedClient`, `forGoogle`) |

## File structure: after (src/calendar, all new)

**Legend:** 🆕 new · 🤖 regenerated

```
src/calendar/
├── 🆕 index.ts            // server({ name: 'calendar', operations: mergeOperations(tools, methods), client, runAuth })
├── 🆕 operation.ts        // calendarOperation: operation() bound to calendar_v3.Calendar (mirrors src/gmail/operation.ts)
├── 🆕 capabilities.ts     // writes CAPABILITIES.md via renderCapabilities (mirrors src/gmail/capabilities.ts)
├── 🤖 CAPABILITIES.md     // regen via `bun run capabilities`
├── 🆕 COVERAGE.md         // implemented vs Google's surface; Deferred cites #19 #20 #21
├── 🆕 README.md           // service intro mirroring src/gmail/README.md
├── 🆕 entities/
│   ├── 🆕 Event.ts               // the MCP projection (conferenceUrl, optionalAttendee, overrideReminders)
│   ├── 🆕 EventDateTime.ts       // date XOR dateTime + timeZone refinement
│   ├── 🆕 Attendee.ts            // optionalAttendee naming on the wire
│   ├── 🆕 Reminder.ts            // {method: email|popup, minutes}
│   ├── 🆕 Principal.ts           // {email, displayName, self} for creator/organizer
│   ├── 🆕 NotificationLevel.ts   // NONE | EXTERNAL_ONLY | ALL
│   ├── 🆕 Calendar.ts            // {id, summary, description?, location?, timeZone}
│   ├── 🆕 CalendarListEntry.ts   // accessRole, colors, hidden, selected, defaultReminders, primary
│   ├── 🆕 FreeBusy.ts            // TimePeriod + per-calendar busy map projection
│   ├── 🆕 Setting.ts             // {id, value}
│   └── 🆕 Colors.ts              // calendar/event palette maps
├── 🆕 lib/
│   ├── 🆕 event.ts        // projectEvent: REST Event → entities/Event (+ event.test.ts)
│   ├── 🆕 datetime.ts     // tri-state conversions, allDay → start.date (+ datetime.test.ts)
│   ├── 🆕 notifications.ts // NotificationLevel → sendUpdates (+ notifications.test.ts)
│   ├── 🆕 attendees.ts    // delta add/remove; self-attendee response rewrite (+ attendees.test.ts)
│   └── 🆕 suggest.ts      // pure slot computation for suggest_time (+ suggest.test.ts)
├── 🆕 tools/
│   ├── 🆕 registry.ts     // { list_events, get_event, list_calendars, suggest_time, create_event, update_event, delete_event, respond_to_event }
│   └── 🆕 <operation>/    // ×8, each: schema.ts + handler.ts + index.ts + handler.test.ts; schema cites its mcp/tools_list page
└── 🆕 methods/
    ├── 🆕 registry.ts     // the 17 methods above
    └── 🆕 <operation>/    // ×17, same four-file shape; schema cites its REST reference page
```

## File structure: after (repo-side edits)

**Legend:** ✏️ rewritten

```
./
├── ✏️ package.json              // + @googleapis/calendar, + bin google-mcp-calendar, capabilities script runs both services
├── ✏️ README.md                 // Calendar row implemented; caption "Gmail and Calendar ship today"
├── ✏️ AGENTS.md                 // layout tree gains calendar/
├── .github/assets/
│   └── ✏️ calendar.svg          // remove opacity 0.4 (shipped, undimmed)
└── src/doctor/
    └── ✏️ services.ts           // calendar: implemented true + calendarProbe (calendars.get 'primary' → summary/timeZone)
```

## Commits

### Commit 1: Scaffold the calendar service skeleton

**Goal:** a zero-operation calendar server exists, builds, and is wired as a bin.

**Files created:**
- `src/calendar/operation.ts`: `calendarOperation` bound to `calendar_v3.Calendar` (transcribe `src/gmail/operation.ts`, swap types)
- `src/calendar/tools/registry.ts`, `src/calendar/methods/registry.ts`: empty `{}` registries with the Gmail registries' doc comments
- `src/calendar/index.ts`: bootstrap mirroring `src/gmail/index.ts` (`calendar({ version: 'v3', auth })`)
- `src/calendar/capabilities.ts`: mirrors `src/gmail/capabilities.ts` with title `Calendar capabilities`

**Files rewritten:**
- `package.json`: add `@googleapis/calendar` dependency (`bun add @googleapis/calendar`); add bin `"google-mcp-calendar": "./dist/calendar/index.js"`; `capabilities` script becomes `bun run src/gmail/capabilities.ts && bun run src/calendar/capabilities.ts`

**Gate:** `bun run check` passes. `node dist/calendar/index.js` starts and `tools/list` returns 0 tools (smoke via the MCP SDK client or by eye).

### Commit 2: Event read tools (list_events, get_event)

**Goal:** the read path and its entity/projection foundation.

**Files created:**
- `src/calendar/entities/{Event,EventDateTime,Attendee,Reminder,Principal}.ts`: zod nouns per the MCP tool pages' output shapes, `.describe()` on every field
- `src/calendar/lib/event.ts` + `event.test.ts`: `projectEvent` (REST Event → entities/Event; conferenceUrl from conferenceData entryPoints/hangoutLink; `optional` → `optionalAttendee`; reminders.overrides → overrideReminders)
- `src/calendar/lib/datetime.ts` + `datetime.test.ts`: tri-state parse/serialize helpers
- `src/calendar/tools/list_events/` and `src/calendar/tools/get_event/`: four files each; schema cites its `mcp/tools_list/<tool>` page

**Files rewritten:**
- `src/calendar/tools/registry.ts`: register both

**Gate:** `bun run check` passes.

### Commit 3: Event write tools (create_event, update_event, delete_event, respond_to_event)

**Goal:** the write path, with notification mapping and attendee deltas.

**Files created:**
- `src/calendar/entities/NotificationLevel.ts`
- `src/calendar/lib/notifications.ts` + test: enum → `sendUpdates`
- `src/calendar/lib/attendees.ts` + test: apply added/removed email deltas; rewrite self-attendee responseStatus/comment
- `src/calendar/tools/{create_event,update_event,delete_event,respond_to_event}/`: four files each; `delete_event` sets `destructive: true` and fetches the event before deleting so it can return the projection

**Files rewritten:**
- `src/calendar/tools/registry.ts`: register all four

**Gate:** `bun run check` passes.

### Commit 4: Calendar list tool and suggest_time

**Goal:** the remaining two tools; the 8-tool MCP mirror is complete.

**Files created:**
- `src/calendar/entities/Calendar.ts`
- `src/calendar/lib/suggest.ts` + `suggest.test.ts`: pure function (busy periods + window + duration + preferences → slots); exhaustive unit tests including weekend exclusion, working-hours clamping, and slot count capping
- `src/calendar/tools/{list_calendars,suggest_time}/`: four files each; suggest_time's handler calls freebusy.query then `lib/suggest.ts`

**Files rewritten:**
- `src/calendar/tools/registry.ts`: register both; regenerate CAPABILITIES.md (`bun run capabilities`)

**Gate:** `bun run check` passes; CAPABILITIES.md shows 8 operations.

### Commit 5: Event methods (instances, move, quickAdd, patch)

**Goal:** the REST event surface the toolset omits, including the recurrence-editing gap-filler.

**Files created:**
- `src/calendar/methods/{list_event_instances,move_event,quick_add_event,patch_event}/`: four files each; schemas cite their REST reference pages; `patch_event` exposes recurrence, transparency, full attendee objects, extendedProperties, guestsCan*, sendUpdates, conferenceDataVersion

**Files rewritten:**
- `src/calendar/methods/registry.ts`: register all four; regenerate CAPABILITIES.md

**Gate:** `bun run check` passes.

### Commit 6: Calendar resource methods (get, create, update, delete ⚠, clear ⚠)

**Files created:**
- `src/calendar/methods/{get_calendar,create_calendar,update_calendar,delete_calendar,clear_calendar}/`: four files each; `delete_calendar` and `clear_calendar` set `destructive: true`

**Files rewritten:**
- `src/calendar/methods/registry.ts`; regenerate CAPABILITIES.md

**Gate:** `bun run check` passes.

### Commit 7: Calendar entry methods (get, add, update, remove)

**Files created:**
- `src/calendar/entities/CalendarListEntry.ts`
- `src/calendar/methods/{get_calendar_entry,add_calendar_entry,update_calendar_entry,remove_calendar_entry}/`: four files each; `update_calendar_entry` sends `colorRgbFormat=true` when writing hex colors

**Files rewritten:**
- `src/calendar/methods/registry.ts`; regenerate CAPABILITIES.md

**Gate:** `bun run check` passes.

### Commit 8: Availability and account methods (query_free_busy, get_colors, list_settings, get_setting)

**Files created:**
- `src/calendar/entities/{FreeBusy,Colors,Setting}.ts`
- `src/calendar/methods/{query_free_busy,get_colors,list_settings,get_setting}/`: four files each

**Files rewritten:**
- `src/calendar/methods/registry.ts`; regenerate CAPABILITIES.md

**Gate:** `bun run check` passes; CAPABILITIES.md shows 25 operations.

### Commit 9: Doctor knows calendar is live

**Files rewritten:**
- `src/doctor/services.ts`: calendar entry gains `implemented: true` and `calendarProbe` (built from `@googleapis/calendar` + `authorizedClient`, like `gmailProbe`; `calendars.get({ calendarId: 'primary' })` returning the calendar summary or timeZone)

**Gate:** `bun run check` passes (the scope-drift test still passes untouched; scopes were already attributed). `bun run doctor` shows `✓ calendar` per authorized account.

### Commit 10: Documentation for the shipped service

**Files created:**
- `src/calendar/COVERAGE.md`: implemented-vs-surface tables (tools 8/8; methods by resource); Deferred section citing #19 (ACL), #20 (watch channels), #21 (import + incremental sync); note the MCP projection's known omissions and that `patch_event` covers the update-fidelity gap
- `src/calendar/README.md`: service intro mirroring `src/gmail/README.md` (capabilities summary, links to CAPABILITIES/COVERAGE, run block)

**Files rewritten:**
- `README.md`: Services table Calendar row → `✅ Implemented` with `[25 operations](./src/calendar/CAPABILITIES.md)`; hero caption → Gmail and Calendar ship today; "What it does" sentence mentions calendars
- `package.json`: description mentions Gmail and Calendar; keywords gain `calendar`
- `AGENTS.md`: layout tree gains `calendar/`
- `.github/assets/calendar.svg`: remove the dimming opacity

**Gate:** `bun run check` passes; `bun run capabilities` produces no diff; every relative link in changed docs resolves.

### Commit 11: Delete this plan

- Delete `add-calendar-service.md`.

**Gate:** `bun run check` passes. Repo contains no references to the plan file.

## Verification checklist

- [ ] `bun run check` green (lint, build, typecheck, 100% coverage tests, knip).
- [ ] CAPABILITIES.md regenerates with no diff; lists 25 operations (8 MCP Tool, 17 REST Method); destructive marks on delete_event, delete_calendar, clear_calendar only.
- [ ] `tools/list` over stdio returns 25 operations (MCP SDK client smoke against `dist/calendar/index.js`).
- [ ] Live smoke against the `simiancraft` account: list_calendars, create_event → get_event → update_event → respond/patch → delete_event on a disposable event; doctor probe green for all three accounts.
- [ ] Operational matrix issue opened (issue #7 pattern: live + unit checkbox per operation) and live boxes ticked as verified.
- [ ] Issues #19, #20, #21 referenced from `src/calendar/COVERAGE.md`'s Deferred section.
- [ ] README, AGENTS.md, package.json description/keywords updated; calendar icon undimmed.
- [ ] Plan file deleted (Inspector Gadget Rule: no orphan plans).

## References

- Google Calendar MCP reference (Developer Preview, fetched 2026-06-10): https://developers.google.com/workspace/calendar/api/v3/reference/mcp and `.../mcp/tools_list/<tool>` per tool
- Calendar v3 REST reference: https://developers.google.com/workspace/calendar/api/v3/reference
- Discovery document: https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest
- Deferral issues: #19 (ACL/sharing), #20 (watch channels), #21 (import + incremental sync)
- Exemplar: `src/gmail/` (shape), `EXTENDING.md` (recipe), `AGENTS.md` (conventions)
