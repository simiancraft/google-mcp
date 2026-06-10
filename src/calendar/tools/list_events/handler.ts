import type { calendar_v3 } from '@googleapis/calendar';
import type { z } from 'zod';
import { forGoogle } from '../../../lib/google.js';
import { projectEvent, projectReminder } from '../../lib/event.js';
import type { schema } from './schema.js';

/** The MCP orderBy vocabulary mapped onto REST `orderBy` ('default' omits the param). */
const orderings = {
  default: undefined,
  startTime: 'startTime',
  startTimeDesc: 'startTime',
  lastModified: 'updated',
} as const;

export async function handler(
  calendar: calendar_v3.Calendar,
  args: z.infer<typeof schema.input>,
): Promise<z.infer<typeof schema.output>> {
  const orderBy = args.orderBy ?? 'default';
  // REST orders by start time only over single instances, so both startTime
  // orderings expand recurring events.
  const byStartTime = orderBy === 'startTime' || orderBy === 'startTimeDesc';
  const { data } = await calendar.events.list(
    forGoogle({
      calendarId: args.calendarId ?? 'primary',
      eventTypes: args.eventTypeFilter,
      maxResults: args.pageSize ?? 250,
      pageToken: args.pageToken,
      timeMin: args.startTime,
      timeMax: args.endTime,
      timeZone: args.timeZone,
      q: args.fullText,
      orderBy: orderings[orderBy],
      singleEvents: byStartTime ? true : undefined,
    }),
  );

  const events = (data.items ?? []).map(projectEvent);
  if (orderBy === 'startTimeDesc') {
    // The REST API has no descending order; reverse the ascending page.
    events.reverse();
  }

  return {
    summary: data.summary ?? undefined,
    description: data.description ?? undefined,
    updated: data.updated ?? undefined,
    timeZone: data.timeZone ?? undefined,
    accessRole: data.accessRole ?? undefined,
    defaultReminders: data.defaultReminders
      ? data.defaultReminders.map(projectReminder)
      : undefined,
    events,
    nextPageToken: data.nextPageToken ?? undefined,
  };
}
