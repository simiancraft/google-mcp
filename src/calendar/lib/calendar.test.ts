import { describe, expect, it } from 'bun:test';
import { Calendar } from '../entities/Calendar.js';
import { projectCalendar } from './calendar.js';

describe('projectCalendar', () => {
  it('projects every documented field', () => {
    const projected = projectCalendar({
      id: 'work@example.com',
      summary: 'Work',
      description: 'Team calendar',
      location: 'Norman, OK',
      timeZone: 'America/Chicago',
    });
    expect(projected).toEqual({
      id: 'work@example.com',
      summary: 'Work',
      description: 'Team calendar',
      location: 'Norman, OK',
      timeZone: 'America/Chicago',
    });
    expect(() => Calendar.parse(projected)).not.toThrow();
  });

  it('cleans nulls and absences to undefined', () => {
    const projected = projectCalendar({ id: null, summary: null });
    expect(projected).toEqual({
      id: '',
      summary: undefined,
      description: undefined,
      location: undefined,
      timeZone: undefined,
    });
    expect(() => Calendar.parse(projected)).not.toThrow();
  });
});
