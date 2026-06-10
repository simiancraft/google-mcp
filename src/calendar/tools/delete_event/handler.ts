import type { calendar_v3 } from '@googleapis/calendar';
import type { z } from 'zod';
import { projectEvent } from '../../lib/event.js';
import { toSendUpdates } from '../../lib/notifications.js';
import type { schema } from './schema.js';

export async function handler(
  calendar: calendar_v3.Calendar,
  args: z.infer<typeof schema.input>,
): Promise<z.infer<typeof schema.output>> {
  const calendarId = args.calendarId ?? 'primary';
  // REST delete returns no body, so fetch the event first; the tool returns
  // the deleted event's projection.
  const { data } = await calendar.events.get({ calendarId, eventId: args.eventId });
  await calendar.events.delete({
    calendarId,
    eventId: args.eventId,
    sendUpdates: toSendUpdates(args.notificationLevel),
  });
  return projectEvent(data);
}
