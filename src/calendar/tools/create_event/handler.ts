import type { calendar_v3 } from '@googleapis/calendar';
import type { z } from 'zod';
import { forGoogle } from '../../../lib/optionality.js';
import { buildEventDateTime } from '../../lib/datetime.js';
import { projectEvent } from '../../lib/event.js';
import { meetConferenceData } from '../../lib/meet.js';
import { toSendUpdates } from '../../lib/notifications.js';
import type { schema } from './schema.js';

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
          ? {
              useDefault: false,
              overrides: args.overrideReminders.map((reminder) => forGoogle(reminder)),
            }
          : undefined,
        conferenceData,
        visibility: args.visibility,
        colorId: args.colorId,
      }),
    }),
  );
  return projectEvent(data);
}
