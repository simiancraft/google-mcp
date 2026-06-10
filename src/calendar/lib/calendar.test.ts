import { describe, expect, it } from 'bun:test';
import { Calendar } from '../entities/Calendar.js';
import { CalendarListEntry } from '../entities/CalendarListEntry.js';
import { projectCalendar, projectCalendarListEntry } from './calendar.js';

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

describe('projectCalendarListEntry', () => {
  it('projects every documented field', () => {
    const projected = projectCalendarListEntry({
      id: 'team@example.com',
      summary: 'Team',
      summaryOverride: 'The Team',
      description: 'Shared calendar',
      location: 'Norman, OK',
      timeZone: 'America/Chicago',
      accessRole: 'writer',
      colorId: '7',
      backgroundColor: '#0088aa',
      foregroundColor: '#ffffff',
      hidden: true,
      selected: true,
      primary: false,
      defaultReminders: [{ method: 'email', minutes: 30 }],
    });
    expect(projected).toEqual({
      id: 'team@example.com',
      summary: 'Team',
      summaryOverride: 'The Team',
      description: 'Shared calendar',
      location: 'Norman, OK',
      timeZone: 'America/Chicago',
      accessRole: 'writer',
      colorId: '7',
      backgroundColor: '#0088aa',
      foregroundColor: '#ffffff',
      hidden: true,
      selected: true,
      primary: false,
      defaultReminders: [{ method: 'email', minutes: 30 }],
    });
    expect(() => CalendarListEntry.parse(projected)).not.toThrow();
  });

  it('cleans nulls and absences to undefined', () => {
    const projected = projectCalendarListEntry({ id: null, accessRole: null });
    expect(projected).toEqual({ id: '' });
    expect(() => CalendarListEntry.parse(projected)).not.toThrow();
  });
});
