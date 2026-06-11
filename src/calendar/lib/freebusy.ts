import type { calendar_v3 } from '@googleapis/calendar';
import type { FreeBusyCalendar } from '../entities/FreeBusy.js';

/**
 * Both consumers of `freebusy.query` (the `query_free_busy` method and the
 * `suggest_time` tool) project the same REST expansion; this is the one copy.
 */

/** The well-formed busy periods of one calendar's expansion; periods missing either bound drop. */
export function busyPeriods(entry: calendar_v3.Schema$FreeBusyCalendar): FreeBusyCalendar['busy'] {
  return (entry.busy ?? []).flatMap((period) =>
    period.start && period.end ? [{ start: period.start, end: period.end }] : [],
  );
}

/** Project one calendar's free/busy expansion onto the FreeBusyCalendar shape. */
export function projectFreeBusyCalendar(
  entry: calendar_v3.Schema$FreeBusyCalendar,
): FreeBusyCalendar {
  return {
    busy: busyPeriods(entry),
    errors: entry.errors
      ? entry.errors.map((error) => ({
          domain: error.domain ?? undefined,
          reason: error.reason ?? undefined,
        }))
      : undefined,
  };
}
