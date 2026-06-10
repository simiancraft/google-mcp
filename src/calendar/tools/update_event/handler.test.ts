import { describe, expect, it } from 'bun:test';
import type { calendar_v3 } from '@googleapis/calendar';
import { handler } from './handler.js';
import { schema } from './schema.js';

type Captured = {
  getParams?: calendar_v3.Params$Resource$Events$Get;
  patchParams?: calendar_v3.Params$Resource$Events$Patch;
};

function fakeCalendar(
  captured: Captured,
  options: { current?: calendar_v3.Schema$Event; patched?: calendar_v3.Schema$Event },
): calendar_v3.Calendar {
  return {
    events: {
      get: async (params: calendar_v3.Params$Resource$Events$Get) => {
        captured.getParams = params;
        return { data: options.current ?? {} };
      },
      patch: async (params: calendar_v3.Params$Resource$Events$Patch) => {
        captured.patchParams = params;
        return { data: options.patched ?? { id: 'E1' } };
      },
    },
  } as unknown as calendar_v3.Calendar;
}

describe('update_event', () => {
  it('patches only the given fields, without reading the event', async () => {
    const captured: Captured = {};
    const result = await handler(
      fakeCalendar(captured, { patched: { id: 'E1', summary: 'New title' } }),
      { eventId: 'E1', summary: 'New title' },
    );
    expect(captured.getParams).toBeUndefined();
    expect(captured.patchParams).toEqual({
      calendarId: 'primary',
      eventId: 'E1',
      sendUpdates: 'none',
      requestBody: { summary: 'New title' },
    });
    expect(result).toMatchObject({ id: 'E1', summary: 'New title' });
    expect(() => schema.output.parse(result)).not.toThrow();
  });

  it('builds timed start and end forms from the new times', async () => {
    const captured: Captured = {};
    await handler(fakeCalendar(captured, {}), {
      eventId: 'E1',
      startTime: '2026-06-15T09:00:00-05:00',
      endTime: '2026-06-15T10:00:00-05:00',
    });
    expect(captured.patchParams?.requestBody).toEqual({
      start: { dateTime: '2026-06-15T09:00:00-05:00' },
      end: { dateTime: '2026-06-15T10:00:00-05:00' },
    });
  });

  it('adds attendees to the current guest list', async () => {
    const captured: Captured = {};
    await handler(
      fakeCalendar(captured, { current: { attendees: [{ email: 'a@example.com' }] } }),
      { eventId: 'E1', addedAttendeeEmails: ['b@example.com'] },
    );
    expect(captured.getParams).toEqual({ calendarId: 'primary', eventId: 'E1' });
    expect(captured.patchParams?.requestBody).toEqual({
      attendees: [{ email: 'a@example.com' }, { email: 'b@example.com' }],
    });
  });

  it('removes attendees from the current guest list', async () => {
    const captured: Captured = {};
    await handler(
      fakeCalendar(captured, {
        current: { attendees: [{ email: 'a@example.com' }, { email: 'b@example.com' }] },
      }),
      { eventId: 'E1', removedAttendeeEmails: ['b@example.com'] },
    );
    expect(captured.patchParams?.requestBody).toEqual({
      attendees: [{ email: 'a@example.com' }],
    });
  });

  it('applies adds and removes together against an explicit calendar', async () => {
    const captured: Captured = {};
    await handler(
      fakeCalendar(captured, {
        current: { attendees: [{ email: 'a@example.com' }, { email: 'b@example.com' }] },
      }),
      {
        eventId: 'E1',
        calendarId: 'team@example.com',
        addedAttendeeEmails: ['c@example.com'],
        removedAttendeeEmails: ['a@example.com'],
      },
    );
    expect(captured.getParams).toEqual({ calendarId: 'team@example.com', eventId: 'E1' });
    expect(captured.patchParams).toMatchObject({
      calendarId: 'team@example.com',
      eventId: 'E1',
      requestBody: { attendees: [{ email: 'b@example.com' }, { email: 'c@example.com' }] },
    });
  });

  it('treats a missing guest list as empty when applying deltas', async () => {
    const captured: Captured = {};
    await handler(fakeCalendar(captured, { current: {} }), {
      eventId: 'E1',
      addedAttendeeEmails: ['b@example.com'],
    });
    expect(captured.patchParams?.requestBody).toEqual({
      attendees: [{ email: 'b@example.com' }],
    });
  });

  it('replaces all reminders when overrideReminders is set', async () => {
    const captured: Captured = {};
    await handler(fakeCalendar(captured, {}), {
      eventId: 'E1',
      overrideReminders: [{ method: 'email', minutes: 30 }],
    });
    expect(captured.patchParams?.requestBody).toEqual({
      reminders: { useDefault: false, overrides: [{ method: 'email', minutes: 30 }] },
    });
  });

  it('mints a Google Meet link via a conference create request', async () => {
    const captured: Captured = {};
    await handler(fakeCalendar(captured, {}), { eventId: 'E1', addGoogleMeetUrl: true });
    expect(captured.patchParams?.conferenceDataVersion).toBe(1);
    expect(captured.patchParams?.requestBody?.conferenceData).toEqual({
      createRequest: {
        requestId: expect.any(String),
        conferenceSolutionKey: { type: 'hangoutsMeet' },
      },
    });
  });

  it('attaches an existing Meet URL, which wins over addGoogleMeetUrl', async () => {
    const captured: Captured = {};
    await handler(fakeCalendar(captured, {}), {
      eventId: 'E1',
      addGoogleMeetUrl: true,
      googleMeetUrl: 'https://meet.google.com/abc-defg-hij',
    });
    expect(captured.patchParams?.conferenceDataVersion).toBe(1);
    expect(captured.patchParams?.requestBody?.conferenceData).toEqual({
      entryPoints: [{ entryPointType: 'video', uri: 'https://meet.google.com/abc-defg-hij' }],
    });
  });

  it('passes the remaining documented fields through with the mapped notification level', async () => {
    const captured: Captured = {};
    const result = await handler(fakeCalendar(captured, { patched: { id: 'E2' } }), {
      eventId: 'E2',
      description: 'Updated agenda.',
      location: 'Norman, OK',
      notificationLevel: 'EXTERNAL_ONLY',
      visibility: 'public',
      colorId: '3',
    });
    expect(captured.patchParams).toEqual({
      calendarId: 'primary',
      eventId: 'E2',
      sendUpdates: 'externalOnly',
      requestBody: {
        description: 'Updated agenda.',
        location: 'Norman, OK',
        visibility: 'public',
        colorId: '3',
      },
    });
    expect(() => schema.output.parse(result)).not.toThrow();
  });
});
