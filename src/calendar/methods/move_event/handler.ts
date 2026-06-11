import type { calendar_v3 } from '@googleapis/calendar';
import type { z } from 'zod';
import { forGoogle } from '../../../lib/utils/google.js';
import { projectEvent } from '../../lib/event.js';
import type { schema } from './schema.js';

export async function handler(
  calendar: calendar_v3.Calendar,
  args: z.infer<typeof schema.input>,
): Promise<z.infer<typeof schema.output>> {
  const { data } = await calendar.events.move(
    forGoogle({
      calendarId: args.calendarId ?? 'primary',
      eventId: args.eventId,
      destination: args.destination,
      sendUpdates: args.sendUpdates,
    }),
  );
  return projectEvent(data);
}
