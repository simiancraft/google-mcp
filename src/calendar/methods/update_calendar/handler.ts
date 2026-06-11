import type { calendar_v3 } from '@googleapis/calendar';
import type { z } from 'zod';
import { forGoogle } from '../../../lib/optionality.js';
import { projectCalendar } from '../../lib/calendar.js';
import type { schema } from './schema.js';

export async function handler(
  calendar: calendar_v3.Calendar,
  args: z.infer<typeof schema.input>,
): Promise<z.infer<typeof schema.output>> {
  const { data } = await calendar.calendars.patch({
    calendarId: args.calendarId ?? 'primary',
    requestBody: forGoogle({
      summary: args.summary,
      description: args.description,
      location: args.location,
      timeZone: args.timeZone,
    }),
  });
  return projectCalendar(data);
}
