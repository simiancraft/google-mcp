import type { Optional } from '../../lib/optionality.js';

/** A busy interval on some attendee's calendar, as ISO 8601 instants. */
type BusyPeriod = { start: string; end: string };

/** A suggested free slot, as ISO 8601 instants plus its length in minutes. */
type TimeSlot = { startTime: string; endTime: string; durationMinutes: number };

/** Scheduling preferences narrowing where suggested slots may fall. */
type Preferences = {
  startHour?: Optional<string>;
  endHour?: Optional<string>;
  excludeWeekends?: Optional<boolean>;
  pageSize?: Optional<number>;
};

/** A busy interval in epoch milliseconds. */
type Interval = { start: number; end: number };

const MAX_SCAN_ITERATIONS = 10_000;

const MINUTE_MS = 60_000;
const DAY_MINUTES = 24 * 60;

/** The HH:MM clock format the working-hour bounds require; also enforced by the suggest_time input schema. */
export const HOUR_OF_DAY = /^([01]\d|2[0-3]):[0-5]\d$/;

/**
 * Parse an HH:MM working-hour bound into minutes since local midnight. Throws on
 * any other shape: a malformed bound would otherwise parse to NaN, and every
 * NaN comparison is false, so the working-hours constraint would be silently
 * ignored rather than rejected.
 */
function toMinutesOfDay(hourMinute: string): number {
  if (!HOUR_OF_DAY.test(hourMinute)) {
    throw new Error(`Invalid working-hour bound "${hourMinute}": expected HH:MM, e.g. 09:00.`);
  }
  return Number(hourMinute.slice(0, 2)) * 60 + Number(hourMinute.slice(3, 5));
}

/** Sort busy periods chronologically and merge every overlapping or adjacent pair. */
function mergeBusy(busy: BusyPeriod[]): Interval[] {
  const sorted = busy
    .map((period) => ({ start: Date.parse(period.start), end: Date.parse(period.end) }))
    .sort((a, b) => a.start - b.start);
  const merged: Interval[] = [];
  for (const period of sorted) {
    const last = merged.at(-1);
    if (last !== undefined && period.start <= last.end) {
      last.end = Math.max(last.end, period.end);
    } else {
      merged.push(period);
    }
  }
  return merged;
}

/** The local weekday and minutes since local midnight of a UTC instant. */
function localClock(
  formatter: Intl.DateTimeFormat,
  at: number,
): { weekday: string; minutesOfDay: number } {
  let weekday = '';
  let minutesOfDay = 0;
  for (const part of formatter.formatToParts(new Date(at))) {
    if (part.type === 'weekday') {
      weekday = part.value;
    }
    if (part.type === 'hour') {
      minutesOfDay += Number(part.value) * 60;
    }
    if (part.type === 'minute') {
      minutesOfDay += Number(part.value);
    }
  }
  return { weekday, minutesOfDay };
}

/**
 * Compute free time slots within a window, given the busy periods of every
 * attendee calendar.
 *
 * The window is scanned chronologically: slots of exactly `durationMinutes`
 * are emitted back to back inside every gap that overlaps no busy period, and
 * the scan stops at `preferences.pageSize` slots (default 5). A slot belongs
 * to the local day of its start instant in `timeZone` (default UTC): when
 * `excludeWeekends` is set, a slot starting on a local Saturday or Sunday is
 * skipped, and the working-hour bounds (`startHour` and `endHour`, as HH:MM)
 * require the slot to start at or after `startHour` and, measured on the
 * start's local clock, to end at or before `endHour`. Date arithmetic is plain
 * UTC; the time zone matters only for those local determinations, so the scan
 * self-corrects across DST transitions by re-reading the local clock after
 * every jump.
 */
export function suggestSlots(input: {
  busy: BusyPeriod[];
  windowStart: string;
  windowEnd: string;
  durationMinutes: number;
  timeZone?: Optional<string>;
  preferences?: Optional<Preferences>;
}): TimeSlot[] {
  const durationMs = input.durationMinutes * MINUTE_MS;
  const cap = input.preferences?.pageSize ?? 5;
  const startHour = input.preferences?.startHour;
  const endHour = input.preferences?.endHour;
  const openingMinutes = startHour === undefined ? 0 : toMinutesOfDay(startHour);
  const closingMinutes = endHour === undefined ? undefined : toMinutesOfDay(endHour);
  const excludeWeekends = input.preferences?.excludeWeekends ?? false;
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: input.timeZone ?? 'UTC',
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  });
  const busy = mergeBusy(input.busy);
  const windowEnd = Date.parse(input.windowEnd);
  const slots: TimeSlot[] = [];
  let cursor = Date.parse(input.windowStart);

  // Cap the scan: every branch advances the cursor, so 10,000 iterations
  // covers roughly 27 years of day-by-day skipping; preferences that never
  // admit a slot would otherwise walk an arbitrarily wide window on the
  // single server thread. Throwing (rather than returning partial slots)
  // keeps the refusal posture: a partial answer here looks complete.
  let iterations = 0;

  while (slots.length < cap && cursor + durationMs <= windowEnd) {
    iterations += 1;
    if (iterations > MAX_SCAN_ITERATIONS) {
      throw new Error(
        `suggest_time scanned ${MAX_SCAN_ITERATIONS} candidate start times without filling the request; ` +
          'narrow the window or relax the preferences.',
      );
    }
    const blocked = busy.find(
      (period) => period.start < cursor + durationMs && period.end > cursor,
    );
    if (blocked !== undefined) {
      cursor = blocked.end;
      continue;
    }
    const { weekday, minutesOfDay } = localClock(formatter, cursor);
    if (excludeWeekends && (weekday === 'Sat' || weekday === 'Sun')) {
      // Jump to (approximately) the next local midnight; the re-read above
      // corrects any DST drift.
      cursor += (DAY_MINUTES - minutesOfDay) * MINUTE_MS;
      continue;
    }
    if (minutesOfDay < openingMinutes) {
      cursor += (openingMinutes - minutesOfDay) * MINUTE_MS;
      continue;
    }
    if (closingMinutes !== undefined && minutesOfDay + input.durationMinutes > closingMinutes) {
      // Past closing for today; jump to the next local midnight, and the next
      // iteration advances to opening time.
      cursor += (DAY_MINUTES - minutesOfDay) * MINUTE_MS;
      continue;
    }
    slots.push({
      startTime: new Date(cursor).toISOString(),
      endTime: new Date(cursor + durationMs).toISOString(),
      durationMinutes: input.durationMinutes,
    });
    cursor += durationMs;
  }
  return slots;
}
