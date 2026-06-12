import type { calendar_v3 } from '@googleapis/calendar';
import type { Optional } from '../../lib/optionality.js';
import { forGoogle } from '../../lib/optionality.js';
import type { EventDateTime } from '../entities/EventDateTime.js';

/**
 * Build the REST `EventDateTime` for a tool's time input. Timed events carry
 * the ISO timestamp as `dateTime` (plus the optional IANA `timeZone`); all-day
 * events carry only the calendar date, so the tool's midnight-UTC timestamp
 * collapses to its `yyyy-mm-dd` prefix.
 */
export function buildEventDateTime(args: {
  /** An ISO 8601 timestamp, for example 2026-06-10T09:00:00-05:00. */
  dateTime: string;
  /** An IANA Time Zone Database name, for example America/Chicago. */
  timeZone?: Optional<string>;
  /** When true, build the all-day `date` form instead of `dateTime`. */
  allDay?: Optional<boolean>;
}): calendar_v3.Schema$EventDateTime {
  if (args.allDay) {
    return forGoogle({ date: args.dateTime.slice(0, 10), timeZone: args.timeZone });
  }
  return forGoogle({ dateTime: args.dateTime, timeZone: args.timeZone });
}

/** Project a REST EventDateTime onto the entity shape, dropping nulls. */
export function projectEventDateTime(dateTime: calendar_v3.Schema$EventDateTime): EventDateTime {
  return {
    date: dateTime.date ?? undefined,
    dateTime: dateTime.dateTime ?? undefined,
    timeZone: dateTime.timeZone ?? undefined,
  };
}
