import { describe, expect, it } from 'bun:test';
import { suggestSlots } from './suggest.js';

// June 2026 weekdays, for the weekend tests: the 12th is a Friday, the 13th a
// Saturday, the 14th a Sunday, and the 15th a Monday.

describe('suggestSlots', () => {
  it('fills an empty window with consecutive slots of exactly the duration', () => {
    expect(
      suggestSlots({
        busy: [],
        windowStart: '2026-06-10T09:00:00Z',
        windowEnd: '2026-06-10T12:00:00Z',
        durationMinutes: 60,
      }),
    ).toEqual([
      {
        startTime: '2026-06-10T09:00:00.000Z',
        endTime: '2026-06-10T10:00:00.000Z',
        durationMinutes: 60,
      },
      {
        startTime: '2026-06-10T10:00:00.000Z',
        endTime: '2026-06-10T11:00:00.000Z',
        durationMinutes: 60,
      },
      {
        startTime: '2026-06-10T11:00:00.000Z',
        endTime: '2026-06-10T12:00:00.000Z',
        durationMinutes: 60,
      },
    ]);
  });

  it('rejects a malformed working-hour bound instead of silently ignoring it', () => {
    const base = {
      busy: [],
      windowStart: '2026-06-10T09:00:00Z',
      windowEnd: '2026-06-10T12:00:00Z',
      durationMinutes: 60,
    };
    expect(() => suggestSlots({ ...base, preferences: { startHour: '9:00' } })).toThrow(
      'Invalid working-hour bound',
    );
    expect(() => suggestSlots({ ...base, preferences: { endHour: 'noon' } })).toThrow(
      'Invalid working-hour bound',
    );
  });

  it('returns no slots when the whole window is busy', () => {
    expect(
      suggestSlots({
        busy: [{ start: '2026-06-10T08:00:00Z', end: '2026-06-10T13:00:00Z' }],
        windowStart: '2026-06-10T09:00:00Z',
        windowEnd: '2026-06-10T12:00:00Z',
        durationMinutes: 30,
      }),
    ).toEqual([]);
  });

  it('skips a gap shorter than the duration', () => {
    const slots = suggestSlots({
      busy: [{ start: '2026-06-10T09:30:00Z', end: '2026-06-10T10:00:00Z' }],
      windowStart: '2026-06-10T09:00:00Z',
      windowEnd: '2026-06-10T12:00:00Z',
      durationMinutes: 45,
    });
    expect(slots.map((slot) => slot.startTime)).toEqual([
      '2026-06-10T10:00:00.000Z',
      '2026-06-10T10:45:00.000Z',
    ]);
  });

  it('emits only slots that end within the window', () => {
    expect(
      suggestSlots({
        busy: [],
        windowStart: '2026-06-10T09:00:00Z',
        windowEnd: '2026-06-10T10:30:00Z',
        durationMinutes: 60,
      }),
    ).toEqual([
      {
        startTime: '2026-06-10T09:00:00.000Z',
        endTime: '2026-06-10T10:00:00.000Z',
        durationMinutes: 60,
      },
    ]);
  });

  it('resumes after a busy period overlapping the window start', () => {
    const slots = suggestSlots({
      busy: [{ start: '2026-06-10T08:00:00Z', end: '2026-06-10T09:30:00Z' }],
      windowStart: '2026-06-10T09:00:00Z',
      windowEnd: '2026-06-10T12:00:00Z',
      durationMinutes: 60,
    });
    expect(slots.map((slot) => slot.startTime)).toEqual([
      '2026-06-10T09:30:00.000Z',
      '2026-06-10T10:30:00.000Z',
    ]);
  });

  it('handles busy periods given out of order', () => {
    const slots = suggestSlots({
      busy: [
        { start: '2026-06-10T11:00:00Z', end: '2026-06-10T11:30:00Z' },
        { start: '2026-06-10T09:30:00Z', end: '2026-06-10T10:00:00Z' },
      ],
      windowStart: '2026-06-10T09:00:00Z',
      windowEnd: '2026-06-10T12:00:00Z',
      durationMinutes: 30,
    });
    expect(slots.map((slot) => slot.startTime)).toEqual([
      '2026-06-10T09:00:00.000Z',
      '2026-06-10T10:00:00.000Z',
      '2026-06-10T10:30:00.000Z',
      '2026-06-10T11:30:00.000Z',
    ]);
  });

  it('merges adjacent busy periods into one block', () => {
    const slots = suggestSlots({
      busy: [
        { start: '2026-06-10T10:00:00Z', end: '2026-06-10T10:30:00Z' },
        { start: '2026-06-10T10:30:00Z', end: '2026-06-10T11:00:00Z' },
      ],
      windowStart: '2026-06-10T09:00:00Z',
      windowEnd: '2026-06-10T12:00:00Z',
      durationMinutes: 60,
    });
    expect(slots.map((slot) => slot.startTime)).toEqual([
      '2026-06-10T09:00:00.000Z',
      '2026-06-10T11:00:00.000Z',
    ]);
  });

  it('merges overlapping busy periods, extending the block', () => {
    const slots = suggestSlots({
      busy: [
        { start: '2026-06-10T10:00:00Z', end: '2026-06-10T10:45:00Z' },
        { start: '2026-06-10T10:30:00Z', end: '2026-06-10T11:00:00Z' },
      ],
      windowStart: '2026-06-10T09:00:00Z',
      windowEnd: '2026-06-10T12:00:00Z',
      durationMinutes: 60,
    });
    expect(slots.map((slot) => slot.startTime)).toEqual([
      '2026-06-10T09:00:00.000Z',
      '2026-06-10T11:00:00.000Z',
    ]);
  });

  it('absorbs a busy period contained in another', () => {
    const slots = suggestSlots({
      busy: [
        { start: '2026-06-10T10:00:00Z', end: '2026-06-10T11:00:00Z' },
        { start: '2026-06-10T10:15:00Z', end: '2026-06-10T10:45:00Z' },
      ],
      windowStart: '2026-06-10T09:00:00Z',
      windowEnd: '2026-06-10T12:00:00Z',
      durationMinutes: 60,
    });
    expect(slots.map((slot) => slot.startTime)).toEqual([
      '2026-06-10T09:00:00.000Z',
      '2026-06-10T11:00:00.000Z',
    ]);
  });

  it('clamps slots to the working hours', () => {
    const slots = suggestSlots({
      busy: [],
      windowStart: '2026-06-10T06:00:00Z',
      windowEnd: '2026-06-10T18:00:00Z',
      durationMinutes: 60,
      preferences: { startHour: '09:00', endHour: '11:00' },
    });
    expect(slots.map((slot) => slot.startTime)).toEqual([
      '2026-06-10T09:00:00.000Z',
      '2026-06-10T10:00:00.000Z',
    ]);
  });

  it("rolls past closing time to the next day's opening", () => {
    const slots = suggestSlots({
      busy: [],
      windowStart: '2026-06-10T10:30:00Z',
      windowEnd: '2026-06-11T12:00:00Z',
      durationMinutes: 60,
      preferences: { startHour: '09:00', endHour: '11:00' },
    });
    expect(slots.map((slot) => slot.startTime)).toEqual([
      '2026-06-11T09:00:00.000Z',
      '2026-06-11T10:00:00.000Z',
    ]);
  });

  it('interprets working hours in the given time zone', () => {
    // 09:00 in Chicago (CDT, UTC-5 in June) is 14:00 UTC.
    const slots = suggestSlots({
      busy: [],
      windowStart: '2026-06-10T00:00:00Z',
      windowEnd: '2026-06-11T00:00:00Z',
      durationMinutes: 60,
      timeZone: 'America/Chicago',
      preferences: { startHour: '09:00', endHour: '17:00' },
    });
    expect(slots).toHaveLength(5);
    expect(slots[0]?.startTime).toBe('2026-06-10T14:00:00.000Z');
  });

  it('skips Saturdays and Sundays when weekends are excluded', () => {
    const slots = suggestSlots({
      busy: [],
      windowStart: '2026-06-12T22:00:00Z',
      windowEnd: '2026-06-15T02:00:00Z',
      durationMinutes: 60,
      preferences: { excludeWeekends: true },
    });
    expect(slots.map((slot) => slot.startTime)).toEqual([
      '2026-06-12T22:00:00.000Z',
      '2026-06-12T23:00:00.000Z',
      '2026-06-15T00:00:00.000Z',
      '2026-06-15T01:00:00.000Z',
    ]);
  });

  it("judges the weekend by the slot's start: a Friday slot may end on Saturday", () => {
    const slots = suggestSlots({
      busy: [],
      windowStart: '2026-06-12T23:30:00Z',
      windowEnd: '2026-06-13T01:00:00Z',
      durationMinutes: 60,
      preferences: { excludeWeekends: true },
    });
    expect(slots.map((slot) => slot.startTime)).toEqual(['2026-06-12T23:30:00.000Z']);
  });

  it('judges the weekend in the given time zone', () => {
    // 03:00 UTC on Saturday the 13th is still 22:00 Friday in Chicago.
    const slots = suggestSlots({
      busy: [],
      windowStart: '2026-06-13T03:00:00Z',
      windowEnd: '2026-06-13T05:00:00Z',
      durationMinutes: 60,
      timeZone: 'America/Chicago',
      preferences: { excludeWeekends: true },
    });
    expect(slots.map((slot) => slot.startTime)).toEqual([
      '2026-06-13T03:00:00.000Z',
      '2026-06-13T04:00:00.000Z',
    ]);
  });

  it('caps the slot count at five by default', () => {
    const slots = suggestSlots({
      busy: [],
      windowStart: '2026-06-10T00:00:00Z',
      windowEnd: '2026-06-10T10:00:00Z',
      durationMinutes: 60,
    });
    expect(slots).toHaveLength(5);
  });

  it('caps the slot count at the requested page size', () => {
    const slots = suggestSlots({
      busy: [],
      windowStart: '2026-06-10T00:00:00Z',
      windowEnd: '2026-06-10T10:00:00Z',
      durationMinutes: 60,
      preferences: { pageSize: 2 },
    });
    expect(slots).toHaveLength(2);
  });

  it('returns no slots for an inverted window', () => {
    expect(
      suggestSlots({
        busy: [],
        windowStart: '2026-06-10T12:00:00Z',
        windowEnd: '2026-06-10T09:00:00Z',
        durationMinutes: 30,
      }),
    ).toEqual([]);
  });

  it('returns no slots when the window is shorter than the duration', () => {
    expect(
      suggestSlots({
        busy: [],
        windowStart: '2026-06-10T09:00:00Z',
        windowEnd: '2026-06-10T09:20:00Z',
        durationMinutes: 30,
      }),
    ).toEqual([]);
  });
});

describe('suggestSlots scan cap', () => {
  it('throws rather than walking an arbitrarily wide window day by day', () => {
    expect(() =>
      suggestSlots({
        windowStart: '2026-01-01T00:00:00.000Z',
        windowEnd: '2126-01-01T00:00:00.000Z',
        durationMinutes: 30,
        busy: [],
        timeZone: 'UTC',
        // opening equals closing, so no day ever admits a 30-minute slot
        preferences: { startHour: '09:00', endHour: '09:00' },
      }),
    ).toThrow(/narrow the window or relax the preferences/);
  });
});
