import { describe, expect, it } from 'bun:test';
import type { calendar_v3 } from '@googleapis/calendar';
import { handler } from './handler.js';
import { schema } from './schema.js';

type Captured = { params?: calendar_v3.Params$Resource$Events$Insert };

function fakeCalendar(captured: Captured, data: calendar_v3.Schema$Event): calendar_v3.Calendar {
  return {
    events: {
      insert: async (params: calendar_v3.Params$Resource$Events$Insert) => {
        captured.params = params;
        return { data };
      },
    },
  } as unknown as calendar_v3.Calendar;
}

describe('create_event', () => {
  it('creates a timed event on the primary calendar with no notifications by default', async () => {
    const captured: Captured = {};
    const result = await handler(
      fakeCalendar(captured, { id: 'E1', summary: 'Standup', status: 'confirmed' }),
      {
        summary: 'Standup',
        startTime: '2026-06-15T09:00:00-05:00',
        endTime: '2026-06-15T09:15:00-05:00',
      },
    );
    expect(captured.params).toEqual({
      calendarId: 'primary',
      sendUpdates: 'none',
      requestBody: {
        summary: 'Standup',
        start: { dateTime: '2026-06-15T09:00:00-05:00' },
        end: { dateTime: '2026-06-15T09:15:00-05:00' },
      },
    });
    expect(result).toMatchObject({ id: 'E1', summary: 'Standup', status: 'confirmed' });
    expect(() => schema.output.parse(result)).not.toThrow();
  });

  it('builds the all-day date forms when allDay is set, keeping the time zone', async () => {
    const captured: Captured = {};
    await handler(fakeCalendar(captured, { id: 'E2' }), {
      summary: 'Conference',
      startTime: '2026-06-15T00:00:00Z',
      endTime: '2026-06-17T00:00:00Z',
      allDay: true,
      timeZone: 'America/Chicago',
    });
    expect(captured.params?.requestBody).toEqual({
      summary: 'Conference',
      start: { date: '2026-06-15', timeZone: 'America/Chicago' },
      end: { date: '2026-06-17', timeZone: 'America/Chicago' },
    });
  });

  it('passes the documented optional fields through to the REST body', async () => {
    const captured: Captured = {};
    const result = await handler(fakeCalendar(captured, { id: 'E3' }), {
      summary: 'Planning',
      startTime: '2026-06-15T13:00:00Z',
      endTime: '2026-06-15T14:00:00Z',
      attendeeEmails: ['a@example.com', 'b@example.com'],
      recurrenceData: ['RRULE:FREQ=WEEKLY;BYDAY=MO'],
      calendarId: 'team@example.com',
      description: 'Quarterly planning. <b>Bring numbers.</b>',
      location: 'Norman, OK',
      notificationLevel: 'ALL',
      visibility: 'private',
      colorId: '7',
    });
    expect(captured.params).toEqual({
      calendarId: 'team@example.com',
      sendUpdates: 'all',
      requestBody: {
        summary: 'Planning',
        description: 'Quarterly planning. <b>Bring numbers.</b>',
        location: 'Norman, OK',
        start: { dateTime: '2026-06-15T13:00:00Z' },
        end: { dateTime: '2026-06-15T14:00:00Z' },
        attendees: [{ email: 'a@example.com' }, { email: 'b@example.com' }],
        recurrence: ['RRULE:FREQ=WEEKLY;BYDAY=MO'],
        visibility: 'private',
        colorId: '7',
      },
    });
    expect(() => schema.output.parse(result)).not.toThrow();
  });

  it('replaces the default reminders when overrideReminders is set', async () => {
    const captured: Captured = {};
    await handler(fakeCalendar(captured, { id: 'E4' }), {
      summary: 'Dentist',
      startTime: '2026-06-15T15:00:00Z',
      endTime: '2026-06-15T16:00:00Z',
      overrideReminders: [
        { method: 'popup', minutes: 10 },
        { method: 'email', minutes: 60 },
      ],
    });
    expect(captured.params?.requestBody?.reminders).toEqual({
      useDefault: false,
      overrides: [
        { method: 'popup', minutes: 10 },
        { method: 'email', minutes: 60 },
      ],
    });
  });

  it('mints a Google Meet link via a conference create request', async () => {
    const captured: Captured = {};
    await handler(fakeCalendar(captured, { id: 'E5' }), {
      summary: 'Sync',
      startTime: '2026-06-15T17:00:00Z',
      endTime: '2026-06-15T17:30:00Z',
      addGoogleMeetUrl: true,
    });
    expect(captured.params?.conferenceDataVersion).toBe(1);
    expect(captured.params?.requestBody?.conferenceData).toEqual({
      createRequest: {
        requestId: expect.any(String),
        conferenceSolutionKey: { type: 'hangoutsMeet' },
      },
    });
  });

  it('attaches an existing Meet URL, which wins over addGoogleMeetUrl', async () => {
    const captured: Captured = {};
    await handler(fakeCalendar(captured, { id: 'E6' }), {
      summary: 'Sync',
      startTime: '2026-06-15T17:00:00Z',
      endTime: '2026-06-15T17:30:00Z',
      addGoogleMeetUrl: true,
      googleMeetUrl: 'https://meet.google.com/abc-defg-hij',
    });
    expect(captured.params?.conferenceDataVersion).toBe(1);
    expect(captured.params?.requestBody?.conferenceData).toEqual({
      entryPoints: [{ entryPointType: 'video', uri: 'https://meet.google.com/abc-defg-hij' }],
    });
  });
});
