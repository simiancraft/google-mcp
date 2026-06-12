import type { calendar_v3 } from '@googleapis/calendar';
import type { z } from 'zod';
import { forGoogle } from '../../../lib/optionality.js';
import type { schema } from './schema.js';

export async function handler(
  calendar: calendar_v3.Calendar,
  args: z.infer<typeof schema.input>,
): Promise<z.infer<typeof schema.output>> {
  const { data } = await calendar.calendarList.list(
    forGoogle({
      maxResults: args.pageSize ?? 100,
      pageToken: args.pageToken,
    }),
  );
  return {
    calendars: (data.items ?? []).map((entry) => ({
      id: entry.id ?? '',
      summary: entry.summary ?? undefined,
      description: entry.description ?? undefined,
      timeZone: entry.timeZone ?? undefined,
    })),
    nextPageToken: data.nextPageToken ?? undefined,
  };
}
