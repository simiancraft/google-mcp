import { describe, expect, it } from 'bun:test';
import type { calendar_v3 } from '@googleapis/calendar';
import { handler } from './handler.js';
import { schema } from './schema.js';

type Captured = { params?: calendar_v3.Params$Resource$Events$Patch };

function fakeCalendar(captured: Captured, patched: calendar_v3.Schema$Event): calendar_v3.Calendar {
  return {
    events: {
      patch: async (params: calendar_v3.Params$Resource$Events$Patch) => {
        captured.params = params;
        return { data: patched };
      },
    },
  } as unknown as calendar_v3.Calendar;
}

describe('patch_event', () => {
  it('patches only the given scalar fields on the primary calendar by default', async () => {
    const captured: Captured = {};
    const result = await handler(fakeCalendar(captured, { id: 'E1', summary: 'New title' }), {
      eventId: 'E1',
      summary: 'New title',
      description: 'Updated agenda.',
      location: 'Norman, OK',
      colorId: '3',
    });
    expect(captured.params).toEqual({
      calendarId: 'primary',
      eventId: 'E1',
      requestBody: {
        summary: 'New title',
        description: 'Updated agenda.',
        location: 'Norman, OK',
        colorId: '3',
      },
    });
    expect(result).toMatchObject({ id: 'E1', summary: 'New title' });
    expect(() => schema.output.parse(result)).not.toThrow();
  });

  it('patches the fields the update_event tool omits', async () => {
    const captured: Captured = {};
    await handler(fakeCalendar(captured, { id: 'E1' }), {
      eventId: 'E1',
      recurrence: ['RRULE:FREQ=WEEKLY;BYDAY=MO'],
      status: 'tentative',
      transparency: 'transparent',
      visibility: 'private',
      extendedProperties: { private: { reviewed: 'true' }, shared: { sprint: '42' } },
      guestsCanInviteOthers: false,
      guestsCanModify: true,
      guestsCanSeeOtherGuests: false,
    });
    expect(captured.params?.requestBody).toEqual({
      recurrence: ['RRULE:FREQ=WEEKLY;BYDAY=MO'],
      status: 'tentative',
      transparency: 'transparent',
      visibility: 'private',
      extendedProperties: { private: { reviewed: 'true' }, shared: { sprint: '42' } },
      guestsCanInviteOthers: false,
      guestsCanModify: true,
      guestsCanSeeOtherGuests: false,
    });
  });

  it('replaces the whole guest list with full REST attendee shapes', async () => {
    const captured: Captured = {};
    await handler(fakeCalendar(captured, { id: 'E1' }), {
      eventId: 'E1',
      calendarId: 'team@example.com',
      attendees: [
        { email: 'a@example.com', optional: true, responseStatus: 'tentative' },
        { email: 'room@example.com', displayName: 'War Room', resource: true },
        { email: 'b@example.com', comment: 'Joining late.', additionalGuests: 2 },
      ],
    });
    expect(captured.params).toEqual({
      calendarId: 'team@example.com',
      eventId: 'E1',
      requestBody: {
        attendees: [
          { email: 'a@example.com', optional: true, responseStatus: 'tentative' },
          { email: 'room@example.com', displayName: 'War Room', resource: true },
          { email: 'b@example.com', comment: 'Joining late.', additionalGuests: 2 },
        ],
      },
    });
  });

  it('patches the timed and all-day datetime forms as given', async () => {
    const captured: Captured = {};
    await handler(fakeCalendar(captured, { id: 'E1' }), {
      eventId: 'E1',
      start: { dateTime: '2026-06-15T09:00:00-05:00', timeZone: 'America/Chicago' },
      end: { date: '2026-06-16' },
    });
    expect(captured.params?.requestBody).toEqual({
      start: { dateTime: '2026-06-15T09:00:00-05:00', timeZone: 'America/Chicago' },
      end: { date: '2026-06-16' },
    });
  });

  it('passes the notification audience and conference data version through', async () => {
    const captured: Captured = {};
    await handler(fakeCalendar(captured, { id: 'E1' }), {
      eventId: 'E1',
      summary: 'Rescheduled',
      sendUpdates: 'all',
      conferenceDataVersion: 1,
    });
    expect(captured.params).toEqual({
      calendarId: 'primary',
      eventId: 'E1',
      sendUpdates: 'all',
      conferenceDataVersion: 1,
      requestBody: { summary: 'Rescheduled' },
    });
  });
});
