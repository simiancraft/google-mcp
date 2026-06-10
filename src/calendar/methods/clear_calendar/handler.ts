import type { calendar_v3 } from '@googleapis/calendar';
import type { z } from 'zod';
import type { schema } from './schema.js';

export async function handler(
  calendar: calendar_v3.Calendar,
  args: z.infer<typeof schema.input>,
): Promise<z.infer<typeof schema.output>> {
  const calendarId = args.calendarId ?? 'primary';
  await calendar.calendars.clear({ calendarId });
  return { calendarId };
}
