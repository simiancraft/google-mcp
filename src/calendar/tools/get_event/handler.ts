import type { calendar_v3 } from '@googleapis/calendar';
import type { z } from 'zod';
import { projectEvent } from '../../lib/event.js';
import type { schema } from './schema.js';

export async function handler(
  calendar: calendar_v3.Calendar,
  args: z.infer<typeof schema.input>,
): Promise<z.infer<typeof schema.output>> {
  const { data } = await calendar.events.get({
    calendarId: args.calendarId ?? 'primary',
    eventId: args.eventId,
  });
  return projectEvent(data);
}
