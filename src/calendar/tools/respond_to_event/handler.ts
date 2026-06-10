import type { calendar_v3 } from '@googleapis/calendar';
import type { z } from 'zod';
import { respondAsSelf } from '../../lib/attendees.js';
import { projectEvent } from '../../lib/event.js';
import { toSendUpdates } from '../../lib/notifications.js';
import type { schema } from './schema.js';

export async function handler(
  calendar: calendar_v3.Calendar,
  args: z.infer<typeof schema.input>,
): Promise<z.infer<typeof schema.output>> {
  const calendarId = args.calendarId ?? 'primary';
  const { data: current } = await calendar.events.get({ calendarId, eventId: args.eventId });
  const attendees = respondAsSelf(current.attendees ?? [], {
    responseStatus: args.responseStatus,
    comment: args.responseComment,
  });
  const { data } = await calendar.events.patch({
    calendarId,
    eventId: args.eventId,
    sendUpdates: toSendUpdates(args.notificationLevel),
    requestBody: { attendees },
  });
  return projectEvent(data);
}
