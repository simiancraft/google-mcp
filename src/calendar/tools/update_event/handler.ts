import { randomUUID } from 'node:crypto';
import type { calendar_v3 } from '@googleapis/calendar';
import type { z } from 'zod';
import { forGoogle } from '../../../lib/google.js';
import type { Optional } from '../../../lib/types.js';
import { applyAttendeeDeltas } from '../../lib/attendees.js';
import { buildEventDateTime } from '../../lib/datetime.js';
import { projectEvent } from '../../lib/event.js';
import { toSendUpdates } from '../../lib/notifications.js';
import type { schema } from './schema.js';

/**
 * The conference payload for the requested Meet handling: an explicit
 * googleMeetUrl attaches as a video entry point and wins over
 * addGoogleMeetUrl, which asks Google to mint a new Meet link via a create
 * request. Writing conference data requires conferenceDataVersion 1 on the
 * query; the handler sets it whenever this returns a payload.
 */
function meetConferenceData(args: {
  addGoogleMeetUrl?: Optional<boolean>;
  googleMeetUrl?: Optional<string>;
}): Optional<calendar_v3.Schema$ConferenceData> {
  if (args.googleMeetUrl !== undefined) {
    return { entryPoints: [{ entryPointType: 'video', uri: args.googleMeetUrl }] };
  }
  if (args.addGoogleMeetUrl) {
    return {
      createRequest: { requestId: randomUUID(), conferenceSolutionKey: { type: 'hangoutsMeet' } },
    };
  }
  return undefined;
}

/**
 * The patched guest list: when either attendee delta is given, read the
 * event's current attendees and apply the deltas; otherwise leave the guest
 * list out of the patch entirely.
 */
async function patchedAttendees(
  calendar: calendar_v3.Calendar,
  calendarId: string,
  args: z.infer<typeof schema.input>,
): Promise<Optional<calendar_v3.Schema$EventAttendee[]>> {
  if (args.addedAttendeeEmails === undefined && args.removedAttendeeEmails === undefined) {
    return undefined;
  }
  const { data } = await calendar.events.get({ calendarId, eventId: args.eventId });
  return applyAttendeeDeltas(data.attendees ?? [], {
    added: args.addedAttendeeEmails,
    removed: args.removedAttendeeEmails,
  });
}

export async function handler(
  calendar: calendar_v3.Calendar,
  args: z.infer<typeof schema.input>,
): Promise<z.infer<typeof schema.output>> {
  const calendarId = args.calendarId ?? 'primary';
  const attendees = await patchedAttendees(calendar, calendarId, args);
  const conferenceData = meetConferenceData(args);
  const { data } = await calendar.events.patch(
    forGoogle({
      calendarId,
      eventId: args.eventId,
      sendUpdates: toSendUpdates(args.notificationLevel),
      conferenceDataVersion: conferenceData === undefined ? undefined : 1,
      requestBody: forGoogle({
        summary: args.summary,
        description: args.description,
        location: args.location,
        start:
          args.startTime === undefined
            ? undefined
            : buildEventDateTime({ dateTime: args.startTime }),
        end:
          args.endTime === undefined ? undefined : buildEventDateTime({ dateTime: args.endTime }),
        attendees,
        reminders: args.overrideReminders
          ? { useDefault: false, overrides: args.overrideReminders }
          : undefined,
        conferenceData,
        visibility: args.visibility,
        colorId: args.colorId,
      }),
    }),
  );
  return projectEvent(data);
}
