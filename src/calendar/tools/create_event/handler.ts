import { randomUUID } from 'node:crypto';
import type { calendar_v3 } from '@googleapis/calendar';
import type { z } from 'zod';
import { forGoogle } from '../../../lib/google.js';
import type { Optional } from '../../../lib/types.js';
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

export async function handler(
  calendar: calendar_v3.Calendar,
  args: z.infer<typeof schema.input>,
): Promise<z.infer<typeof schema.output>> {
  const conferenceData = meetConferenceData(args);
  const { data } = await calendar.events.insert(
    forGoogle({
      calendarId: args.calendarId ?? 'primary',
      sendUpdates: toSendUpdates(args.notificationLevel),
      conferenceDataVersion: conferenceData === undefined ? undefined : 1,
      requestBody: forGoogle({
        summary: args.summary,
        description: args.description,
        location: args.location,
        start: buildEventDateTime({
          dateTime: args.startTime,
          timeZone: args.timeZone,
          allDay: args.allDay,
        }),
        end: buildEventDateTime({
          dateTime: args.endTime,
          timeZone: args.timeZone,
          allDay: args.allDay,
        }),
        attendees: args.attendeeEmails?.map((email) => ({ email })),
        recurrence: args.recurrenceData,
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
