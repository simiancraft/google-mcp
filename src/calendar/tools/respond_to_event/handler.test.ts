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
  options: { current: calendar_v3.Schema$Event; patched?: calendar_v3.Schema$Event },
): calendar_v3.Calendar {
  return {
    events: {
      get: async (params: calendar_v3.Params$Resource$Events$Get) => {
        captured.getParams = params;
        return { data: options.current };
      },
      patch: async (params: calendar_v3.Params$Resource$Events$Patch) => {
        captured.patchParams = params;
        return { data: options.patched ?? { id: 'E1' } };
      },
    },
  } as unknown as calendar_v3.Calendar;
}

describe('respond_to_event', () => {
  it('accepts the invitation by rewriting the self attendee on the primary calendar', async () => {
    const captured: Captured = {};
    const result = await handler(
      fakeCalendar(captured, {
        current: {
          attendees: [
            { email: 'organizer@example.com', organizer: true, responseStatus: 'accepted' },
            { email: 'me@example.com', self: true, responseStatus: 'needsAction' },
          ],
        },
        patched: { id: 'E1', summary: 'Standup' },
      }),
      { eventId: 'E1', responseStatus: 'accepted' },
    );
    expect(captured.getParams).toEqual({ calendarId: 'primary', eventId: 'E1' });
    expect(captured.patchParams).toEqual({
      calendarId: 'primary',
      eventId: 'E1',
      sendUpdates: 'none',
      requestBody: {
        attendees: [
          { email: 'organizer@example.com', organizer: true, responseStatus: 'accepted' },
          { email: 'me@example.com', self: true, responseStatus: 'accepted' },
        ],
      },
    });
    expect(result).toMatchObject({ id: 'E1', summary: 'Standup' });
    expect(() => schema.output.parse(result)).not.toThrow();
  });

  it('declines with a comment on an explicit calendar, mapping the notification level', async () => {
    const captured: Captured = {};
    const result = await handler(
      fakeCalendar(captured, {
        current: { attendees: [{ email: 'me@example.com', self: true }] },
      }),
      {
        eventId: 'E2',
        responseStatus: 'declined',
        responseComment: 'Conflicting appointment.',
        calendarId: 'team@example.com',
        notificationLevel: 'EXTERNAL_ONLY',
      },
    );
    expect(captured.getParams).toEqual({ calendarId: 'team@example.com', eventId: 'E2' });
    expect(captured.patchParams).toEqual({
      calendarId: 'team@example.com',
      eventId: 'E2',
      sendUpdates: 'externalOnly',
      requestBody: {
        attendees: [
          {
            email: 'me@example.com',
            self: true,
            responseStatus: 'declined',
            comment: 'Conflicting appointment.',
          },
        ],
      },
    });
    expect(() => schema.output.parse(result)).not.toThrow();
  });

  it('rejects when the user is not on the guest list', async () => {
    const captured: Captured = {};
    await expect(
      handler(
        fakeCalendar(captured, { current: { attendees: [{ email: 'other@example.com' }] } }),
        { eventId: 'E3', responseStatus: 'tentative' },
      ),
    ).rejects.toThrow('no self attendee');
    expect(captured.patchParams).toBeUndefined();
  });

  it('rejects when the event has no guest list at all', async () => {
    const captured: Captured = {};
    await expect(
      handler(fakeCalendar(captured, { current: {} }), {
        eventId: 'E4',
        responseStatus: 'accepted',
      }),
    ).rejects.toThrow('no self attendee');
    expect(captured.patchParams).toBeUndefined();
  });
});
