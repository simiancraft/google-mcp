import type { calendar_v3 } from '@googleapis/calendar';
import type { z } from 'zod';
import { forGoogle } from '../../../lib/google.js';
import { suggestSlots } from '../../lib/suggest.js';
import type { schema } from './schema.js';

export async function handler(
  calendar: calendar_v3.Calendar,
  args: z.infer<typeof schema.input>,
): Promise<z.infer<typeof schema.output>> {
  const { data } = await calendar.freebusy.query({
    requestBody: forGoogle({
      timeMin: args.startTime,
      timeMax: args.endTime,
      timeZone: args.timeZone,
      // The literal 'primary' entry passes straight through; Google resolves
      // it to the authenticated user's primary calendar.
      items: args.attendeeEmails.map((id) => ({ id })),
    }),
  });
  const busy = Object.values(data.calendars ?? {}).flatMap((entry) =>
    (entry.busy ?? []).flatMap((period) =>
      period.start && period.end ? [{ start: period.start, end: period.end }] : [],
    ),
  );
  return {
    timeSlots: suggestSlots({
      busy,
      windowStart: args.startTime,
      windowEnd: args.endTime,
      durationMinutes: args.durationMinutes ?? 30,
      timeZone: args.timeZone,
      preferences: args.preferences,
    }),
  };
}
