import type { calendar_v3 } from '@googleapis/calendar';
import type { z } from 'zod';
import { forGoogle } from '../../../lib/google.js';
import { projectCalendarListEntry } from '../../lib/calendar.js';
import type { schema } from './schema.js';

export async function handler(
  calendar: calendar_v3.Calendar,
  args: z.infer<typeof schema.input>,
): Promise<z.infer<typeof schema.output>> {
  // Writing the hex color fields requires colorRgbFormat=true on the query;
  // Google then back-fills colorId with the closest palette entry.
  const writesHexColors = args.backgroundColor !== undefined || args.foregroundColor !== undefined;
  const { data } = await calendar.calendarList.patch(
    forGoogle({
      calendarId: args.calendarId ?? 'primary',
      colorRgbFormat: writesHexColors ? true : undefined,
      requestBody: forGoogle({
        summaryOverride: args.summaryOverride,
        colorId: args.colorId,
        backgroundColor: args.backgroundColor,
        foregroundColor: args.foregroundColor,
        hidden: args.hidden,
        selected: args.selected,
        defaultReminders: args.defaultReminders,
      }),
    }),
  );
  return projectCalendarListEntry(data);
}
