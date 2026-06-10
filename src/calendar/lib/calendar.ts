import type { calendar_v3 } from '@googleapis/calendar';
import type { Calendar } from '../entities/Calendar.js';
import type { CalendarListEntry } from '../entities/CalendarListEntry.js';
import { projectReminder } from './event.js';

/** Project a REST calendar resource onto the Calendar shape, cleaning nulls to undefined. */
export function projectCalendar(data: calendar_v3.Schema$Calendar): Calendar {
  return {
    id: data.id ?? '',
    summary: data.summary ?? undefined,
    description: data.description ?? undefined,
    location: data.location ?? undefined,
    timeZone: data.timeZone ?? undefined,
  };
}

/** Project a REST calendar list entry onto the CalendarListEntry shape, cleaning nulls to undefined. */
export function projectCalendarListEntry(
  data: calendar_v3.Schema$CalendarListEntry,
): CalendarListEntry {
  return {
    id: data.id ?? '',
    summary: data.summary ?? undefined,
    summaryOverride: data.summaryOverride ?? undefined,
    description: data.description ?? undefined,
    location: data.location ?? undefined,
    timeZone: data.timeZone ?? undefined,
    accessRole: data.accessRole ?? undefined,
    colorId: data.colorId ?? undefined,
    backgroundColor: data.backgroundColor ?? undefined,
    foregroundColor: data.foregroundColor ?? undefined,
    hidden: data.hidden ?? undefined,
    selected: data.selected ?? undefined,
    primary: data.primary ?? undefined,
    defaultReminders: data.defaultReminders
      ? data.defaultReminders.map(projectReminder)
      : undefined,
  };
}
