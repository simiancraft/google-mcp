import type { calendar_v3 } from '@googleapis/calendar';
import type { Attendee } from '../entities/Attendee.js';
import type { Event } from '../entities/Event.js';
import type { Principal } from '../entities/Principal.js';
import type { Reminder } from '../entities/Reminder.js';
import { projectEventDateTime } from './datetime.js';

/** The REST shape of an event's creator and organizer (structurally identical). */
type RestPrincipal = NonNullable<calendar_v3.Schema$Event['creator']>;

/** Project a REST event principal (creator or organizer) onto the Principal shape. */
function projectPrincipal(principal: RestPrincipal): Principal {
  return {
    email: principal.email,
    displayName: principal.displayName,
    self: principal.self,
  };
}

/** Project a REST attendee onto the Attendee shape (`optional` -> `optionalAttendee`). */
function projectAttendee(attendee: calendar_v3.Schema$EventAttendee): Attendee {
  return {
    id: attendee.id ?? undefined,
    email: attendee.email ?? '',
    displayName: attendee.displayName ?? undefined,
    organizer: attendee.organizer ?? undefined,
    self: attendee.self ?? undefined,
    resource: attendee.resource ?? undefined,
    optionalAttendee: attendee.optional ?? undefined,
    responseStatus: attendee.responseStatus ?? undefined,
    comment: attendee.comment ?? undefined,
    additionalGuests: attendee.additionalGuests ?? undefined,
  };
}

/** Project a REST reminder onto the Reminder shape (an absent method defaults to popup). */
export function projectReminder(reminder: calendar_v3.Schema$EventReminder): Reminder {
  return {
    method: reminder.method === 'email' ? 'email' : 'popup',
    minutes: reminder.minutes ?? 0,
  };
}

/**
 * The Google Meet link: the `conferenceData` video entry point's URI, falling
 * back to the legacy `hangoutLink` when the conference data carries none.
 */
function conferenceUrl(event: calendar_v3.Schema$Event): Event['conferenceUrl'] {
  const video = event.conferenceData?.entryPoints?.find(
    (entryPoint) => entryPoint.entryPointType === 'video',
  );
  return video?.uri ?? event.hangoutLink ?? undefined;
}

/**
 * Project a raw REST event onto the documented Event shape: collapse
 * `conferenceData` to `conferenceUrl`, rename attendee `optional` to
 * `optionalAttendee`, surface `reminders.overrides` as `overrideReminders`,
 * and clean nulls to undefined.
 */
export function projectEvent(data: calendar_v3.Schema$Event): Event {
  return {
    id: data.id ?? '',
    status: data.status ?? undefined,
    htmlLink: data.htmlLink ?? undefined,
    created: data.created ?? undefined,
    updated: data.updated ?? undefined,
    summary: data.summary ?? undefined,
    description: data.description ?? undefined,
    location: data.location ?? undefined,
    creator: data.creator ? projectPrincipal(data.creator) : undefined,
    organizer: data.organizer ? projectPrincipal(data.organizer) : undefined,
    start: data.start ? projectEventDateTime(data.start) : undefined,
    end: data.end ? projectEventDateTime(data.end) : undefined,
    recurrence: data.recurrence ?? undefined,
    recurringEventId: data.recurringEventId ?? undefined,
    originalStartTime: data.originalStartTime
      ? projectEventDateTime(data.originalStartTime)
      : undefined,
    transparency: data.transparency ?? undefined,
    visibility: data.visibility ?? undefined,
    attendees: data.attendees ? data.attendees.map(projectAttendee) : undefined,
    eventType: data.eventType ?? undefined,
    conferenceUrl: conferenceUrl(data),
    colorId: data.colorId ?? undefined,
    overrideReminders: data.reminders?.overrides
      ? data.reminders.overrides.map(projectReminder)
      : undefined,
  };
}
