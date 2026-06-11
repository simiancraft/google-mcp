import type { calendar_v3 } from '@googleapis/calendar';
import type { z } from 'zod';
import { forGoogle } from '../../../lib/google.js';
import { busyPeriods } from '../../lib/freebusy.js';
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
  const calendars = data.calendars ?? {};
  // A calendar that reports errors (unknown id, not shared) or is missing from
  // the response entirely contributes no busy intervals, so suggesting from
  // the rest would confidently propose slots that conflict with it. Refuse
  // instead of answering from partial data.
  const returned = new Set(Object.keys(calendars).map((id) => id.toLowerCase()));
  const unreadable = Object.entries(calendars)
    .filter(([, entry]) => (entry.errors ?? []).length > 0)
    .map(([id]) => id)
    .concat(args.attendeeEmails.filter((id) => !returned.has(id.toLowerCase())));
  if (unreadable.length > 0) {
    throw new Error(
      `Free/busy is unavailable for ${unreadable.join(', ')}; suggestions would ignore those calendars' events. Check the calendar ids and their sharing, then retry.`,
    );
  }
  const busy = Object.values(calendars).flatMap(busyPeriods);
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
