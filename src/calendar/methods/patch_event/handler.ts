import type { calendar_v3 } from '@googleapis/calendar';
import type { z } from 'zod';
import { forGoogle } from '../../../lib/optionality.js';
import { projectEvent } from '../../lib/event.js';
import type { schema } from './schema.js';

export async function handler(
  calendar: calendar_v3.Calendar,
  args: z.infer<typeof schema.input>,
): Promise<z.infer<typeof schema.output>> {
  const { data } = await calendar.events.patch(
    forGoogle({
      calendarId: args.calendarId ?? 'primary',
      eventId: args.eventId,
      sendUpdates: args.sendUpdates,
      conferenceDataVersion: args.conferenceDataVersion,
      requestBody: forGoogle({
        summary: args.summary,
        description: args.description,
        location: args.location,
        start: args.start === undefined ? undefined : forGoogle(args.start),
        end: args.end === undefined ? undefined : forGoogle(args.end),
        recurrence: args.recurrence,
        status: args.status,
        transparency: args.transparency,
        visibility: args.visibility,
        attendees: args.attendees?.map((attendee) => forGoogle(attendee)),
        extendedProperties:
          args.extendedProperties === undefined ? undefined : forGoogle(args.extendedProperties),
        guestsCanInviteOthers: args.guestsCanInviteOthers,
        guestsCanModify: args.guestsCanModify,
        guestsCanSeeOtherGuests: args.guestsCanSeeOtherGuests,
        colorId: args.colorId,
      }),
    }),
  );
  return projectEvent(data);
}
