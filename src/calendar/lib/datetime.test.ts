import { describe, expect, it } from 'bun:test';
import { EventDateTime } from '../entities/EventDateTime.js';
import { buildEventDateTime, projectEventDateTime } from './datetime.js';

describe('buildEventDateTime', () => {
  it('builds the timed form from an ISO timestamp', () => {
    expect(buildEventDateTime({ dateTime: '2026-06-10T09:00:00-05:00' })).toEqual({
      dateTime: '2026-06-10T09:00:00-05:00',
    });
  });

  it('carries the IANA time zone when given', () => {
    expect(
      buildEventDateTime({ dateTime: '2026-06-10T09:00:00', timeZone: 'America/Chicago' }),
    ).toEqual({ dateTime: '2026-06-10T09:00:00', timeZone: 'America/Chicago' });
  });

  it('collapses an all-day midnight-UTC timestamp to its calendar date', () => {
    expect(buildEventDateTime({ dateTime: '2026-06-10T00:00:00Z', allDay: true })).toEqual({
      date: '2026-06-10',
    });
  });

  it('keeps the time zone on the all-day form, for recurring expansion', () => {
    expect(
      buildEventDateTime({
        dateTime: '2026-06-10T00:00:00Z',
        allDay: true,
        timeZone: 'Europe/Zurich',
      }),
    ).toEqual({ date: '2026-06-10', timeZone: 'Europe/Zurich' });
  });

  it('drops an explicitly undefined time zone key entirely', () => {
    const built = buildEventDateTime({ dateTime: '2026-06-10T09:00:00Z', timeZone: undefined });
    expect('timeZone' in built).toBe(false);
  });
});

describe('projectEventDateTime', () => {
  it('projects the timed form', () => {
    expect(
      projectEventDateTime({ dateTime: '2026-06-10T09:00:00-05:00', timeZone: 'America/Chicago' }),
    ).toEqual({ dateTime: '2026-06-10T09:00:00-05:00', timeZone: 'America/Chicago' });
  });

  it('projects the all-day form, dropping null members', () => {
    expect(projectEventDateTime({ date: '2026-06-10', dateTime: null, timeZone: null })).toEqual({
      date: '2026-06-10',
    });
  });
});

describe('EventDateTime tri-state', () => {
  it('accepts the all-day date form', () => {
    expect(EventDateTime.safeParse({ date: '2026-06-10' }).success).toBe(true);
  });

  it('accepts the timed form with a zone', () => {
    expect(
      EventDateTime.safeParse({
        dateTime: '2026-06-10T09:00:00-05:00',
        timeZone: 'America/Chicago',
      }).success,
    ).toBe(true);
  });

  it('rejects date and dateTime together', () => {
    expect(
      EventDateTime.safeParse({ date: '2026-06-10', dateTime: '2026-06-10T09:00:00Z' }).success,
    ).toBe(false);
  });

  it('rejects an empty object: one of date or dateTime is required', () => {
    expect(EventDateTime.safeParse({}).success).toBe(false);
  });
});
