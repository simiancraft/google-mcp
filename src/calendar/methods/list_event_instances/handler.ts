import type { calendar_v3 } from '@googleapis/calendar';
import type { z } from 'zod';
import { forGoogle } from '../../../lib/optionality.js';
import { projectEvent, projectReminder } from '../../lib/event.js';
import type { schema } from './schema.js';

export async function handler(
  calendar: calendar_v3.Calendar,
  args: z.infer<typeof schema.input>,
): Promise<z.infer<typeof schema.output>> {
  const { data } = await calendar.events.instances(
    forGoogle({
      calendarId: args.calendarId ?? 'primary',
      eventId: args.eventId,
      maxResults: args.maxResults,
      pageToken: args.pageToken,
      originalStart: args.originalStart,
      showDeleted: args.showDeleted,
      timeMin: args.timeMin,
      timeMax: args.timeMax,
      timeZone: args.timeZone,
    }),
  );
  return {
    summary: data.summary ?? undefined,
    description: data.description ?? undefined,
    updated: data.updated ?? undefined,
    timeZone: data.timeZone ?? undefined,
    accessRole: data.accessRole ?? undefined,
    defaultReminders: data.defaultReminders
      ? data.defaultReminders.map(projectReminder)
      : undefined,
    events: (data.items ?? []).map(projectEvent),
    nextPageToken: data.nextPageToken ?? undefined,
  };
}
