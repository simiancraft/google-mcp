import { describe, expect, it } from 'bun:test';
import type { calendar_v3 } from '@googleapis/calendar';
import { Event } from '../entities/Event.js';
import { projectEvent, projectReminder } from './event.js';

describe('projectEvent', () => {
  it('projects the full documented surface, applying the MCP renames', () => {
    const data: calendar_v3.Schema$Event = {
      id: 'E1',
      status: 'confirmed',
      htmlLink: 'https://calendar.google.com/event?eid=abc',
      created: '2026-06-01T12:00:00Z',
      updated: '2026-06-02T12:00:00Z',
      summary: 'Standup',
      description: 'Daily <b>sync</b>',
      location: 'Norman, OK',
      creator: { email: 'a@example.com', displayName: 'A', self: true },
      organizer: { email: 'b@example.com' },
      start: { dateTime: '2026-06-10T09:00:00-05:00', timeZone: 'America/Chicago' },
      end: { dateTime: '2026-06-10T09:15:00-05:00', timeZone: 'America/Chicago' },
      recurrence: ['RRULE:FREQ=DAILY'],
      recurringEventId: 'E0',
      originalStartTime: { dateTime: '2026-06-10T09:00:00-05:00' },
      transparency: 'opaque',
      visibility: 'private',
      attendees: [
        {
          id: 'P1',
          email: 'c@example.com',
          displayName: 'C',
          organizer: false,
          self: false,
          resource: false,
          optional: true,
          responseStatus: 'accepted',
          comment: 'will join late',
          additionalGuests: 1,
        },
      ],
      eventType: 'default',
      conferenceData: {
        entryPoints: [
          { entryPointType: 'phone', uri: 'tel:+15551234567' },
          { entryPointType: 'video', uri: 'https://meet.google.com/abc-defg-hij' },
        ],
      },
      hangoutLink: 'https://meet.google.com/legacy-link',
      colorId: '5',
      reminders: { useDefault: false, overrides: [{ method: 'email', minutes: 30 }] },
    };

    const result = projectEvent(data);

    expect(result).toEqual({
      id: 'E1',
      status: 'confirmed',
      htmlLink: 'https://calendar.google.com/event?eid=abc',
      created: '2026-06-01T12:00:00Z',
      updated: '2026-06-02T12:00:00Z',
      summary: 'Standup',
      description: 'Daily <b>sync</b>',
      location: 'Norman, OK',
      creator: { email: 'a@example.com', displayName: 'A', self: true },
      organizer: { email: 'b@example.com' },
      start: { dateTime: '2026-06-10T09:00:00-05:00', timeZone: 'America/Chicago' },
      end: { dateTime: '2026-06-10T09:15:00-05:00', timeZone: 'America/Chicago' },
      recurrence: ['RRULE:FREQ=DAILY'],
      recurringEventId: 'E0',
      originalStartTime: { dateTime: '2026-06-10T09:00:00-05:00' },
      transparency: 'opaque',
      visibility: 'private',
      attendees: [
        {
          id: 'P1',
          email: 'c@example.com',
          displayName: 'C',
          organizer: false,
          self: false,
          resource: false,
          optionalAttendee: true,
          responseStatus: 'accepted',
          comment: 'will join late',
          additionalGuests: 1,
        },
      ],
      eventType: 'default',
      conferenceUrl: 'https://meet.google.com/abc-defg-hij',
      colorId: '5',
      overrideReminders: [{ method: 'email', minutes: 30 }],
    });
    expect(result.attendees?.[0]).not.toHaveProperty('optional');
    expect(() => Event.parse(result)).not.toThrow();
  });

  it('defaults a bare event: empty id, everything else absent', () => {
    const result = projectEvent({});
    expect(result).toEqual({ id: '' } as Event);
    expect(result.conferenceUrl).toBeUndefined();
    expect(() => Event.parse(result)).not.toThrow();
  });

  it('falls back to hangoutLink when conference data has no video entry point', () => {
    const result = projectEvent({
      id: 'E1',
      conferenceData: { entryPoints: [{ entryPointType: 'phone', uri: 'tel:+15551234567' }] },
      hangoutLink: 'https://meet.google.com/legacy-link',
    });
    expect(result.conferenceUrl).toBe('https://meet.google.com/legacy-link');
  });

  it('falls back to hangoutLink when conference data carries no entry points at all', () => {
    const result = projectEvent({
      id: 'E1',
      conferenceData: {},
      hangoutLink: 'https://meet.google.com/legacy-link',
    });
    expect(result.conferenceUrl).toBe('https://meet.google.com/legacy-link');
  });

  it('cleans nulls to undefined across the projection', () => {
    const result = projectEvent({
      id: null,
      status: null,
      summary: null,
      start: { date: '2026-06-10', dateTime: null, timeZone: null },
      attendees: [{ email: null, optional: null, responseStatus: null, additionalGuests: null }],
      reminders: { overrides: [{ method: null, minutes: null }] },
      hangoutLink: null,
    });
    expect(result).toEqual({
      id: '',
      start: { date: '2026-06-10' },
      attendees: [{ email: '' }],
      overrideReminders: [{ minutes: 0 }],
    } as Event);
    expect(() => Event.parse(result)).not.toThrow();
  });

  it('leaves overrideReminders unset when reminders carry no overrides', () => {
    const result = projectEvent({ id: 'E1', reminders: { useDefault: true } });
    expect(result.overrideReminders).toBeUndefined();
  });
});

describe('projectReminder', () => {
  it('keeps the email method', () => {
    expect(projectReminder({ method: 'email', minutes: 15 })).toEqual({
      method: 'email',
      minutes: 15,
    });
  });

  it('keeps the popup method and defaults absent minutes to zero', () => {
    expect(projectReminder({ method: 'popup' })).toEqual({ method: 'popup', minutes: 0 });
  });

  it('drops absent or unknown methods instead of coercing them to popup', () => {
    expect(projectReminder({})).toEqual({ minutes: 0 });
    expect(projectReminder({ method: 'sms', minutes: 5 })).toEqual({ minutes: 5 });
  });
});
