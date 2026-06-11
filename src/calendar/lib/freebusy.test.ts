import { describe, expect, it } from 'bun:test';
import { busyPeriods, projectFreeBusyCalendar } from './freebusy.js';

describe('busyPeriods', () => {
  it('keeps well-formed periods and drops those missing either bound', () => {
    expect(
      busyPeriods({
        busy: [
          { start: '2026-06-10T09:00:00Z', end: '2026-06-10T10:00:00Z' },
          { start: '2026-06-10T11:00:00Z' },
          { end: '2026-06-10T12:00:00Z' },
        ],
      }),
    ).toEqual([{ start: '2026-06-10T09:00:00Z', end: '2026-06-10T10:00:00Z' }]);
    expect(busyPeriods({})).toEqual([]);
  });
});

describe('projectFreeBusyCalendar', () => {
  it('projects busy periods and errors, cleaning nulls', () => {
    expect(
      projectFreeBusyCalendar({
        busy: [{ start: '2026-06-10T09:00:00Z', end: '2026-06-10T10:00:00Z' }],
        errors: [{ domain: 'global', reason: null }],
      }),
    ).toEqual({
      busy: [{ start: '2026-06-10T09:00:00Z', end: '2026-06-10T10:00:00Z' }],
      errors: [{ domain: 'global' }],
    });
  });

  it('leaves errors unset when the expansion carries none', () => {
    expect(projectFreeBusyCalendar({ busy: [] })).toEqual({ busy: [] });
  });
});
