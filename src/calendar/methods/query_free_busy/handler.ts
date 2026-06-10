import type { calendar_v3 } from '@googleapis/calendar';
import type { z } from 'zod';
import { forGoogle } from '../../../lib/google.js';
import type { FreeBusyCalendar } from '../../entities/FreeBusy.js';
import type { schema } from './schema.js';

/** Project one calendar's expansion, dropping busy periods missing either bound. */
function projectFreeBusyCalendar(entry: calendar_v3.Schema$FreeBusyCalendar): FreeBusyCalendar {
  return {
    busy: (entry.busy ?? []).flatMap((period) =>
      period.start && period.end ? [{ start: period.start, end: period.end }] : [],
    ),
    errors: entry.errors
      ? entry.errors.map((error) => ({
          domain: error.domain ?? undefined,
          reason: error.reason ?? undefined,
        }))
      : undefined,
  };
}

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
