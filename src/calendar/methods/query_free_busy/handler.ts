import type { calendar_v3 } from '@googleapis/calendar';
import type { z } from 'zod';
import { forGoogle } from '../../../lib/optionality.js';
import { projectFreeBusyCalendar } from '../../lib/freebusy.js';
import type { schema } from './schema.js';

export async function handler(
  calendar: calendar_v3.Calendar,
  args: z.infer<typeof schema.input>,
): Promise<z.infer<typeof schema.output>> {
  const { data } = await calendar.freebusy.query({
    requestBody: forGoogle({
      timeMin: args.timeMin,
      timeMax: args.timeMax,
      timeZone: args.timeZone,
      items: args.items,
    }),
  });
  return {
    timeMin: data.timeMin ?? undefined,
    timeMax: data.timeMax ?? undefined,
    calendars: Object.fromEntries(
      Object.entries(data.calendars ?? {}).map(([id, entry]) => [
        id,
        projectFreeBusyCalendar(entry),
      ]),
    ),
  };
}
