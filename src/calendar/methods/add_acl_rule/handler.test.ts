import { describe, expect, it } from 'bun:test';
import type { calendar_v3 } from '@googleapis/calendar';
import { handler } from './handler.js';
import { schema } from './schema.js';

type Captured = { params?: calendar_v3.Params$Resource$Acl$Insert };

function fakeCalendar(captured: Captured, data: calendar_v3.Schema$AclRule): calendar_v3.Calendar {
  return {
    acl: {
      insert: async (params: calendar_v3.Params$Resource$Acl$Insert) => {
        captured.params = params;
        return { data };
      },
    },
  } as unknown as calendar_v3.Calendar;
}

describe('add_acl_rule', () => {
  it('grants a role to a user on the primary calendar by default', async () => {
    const captured: Captured = {};
    const result = await handler(
      fakeCalendar(captured, {
        id: 'user:someone@example.com',
        role: 'freeBusyReader',
        scope: { type: 'user', value: 'someone@example.com' },
      }),
      { role: 'freeBusyReader', scope: { type: 'user', value: 'someone@example.com' } },
    );
    expect(captured.params).toEqual({
      calendarId: 'primary',
      requestBody: {
        role: 'freeBusyReader',
        scope: { type: 'user', value: 'someone@example.com' },
      },
    });
    expect(result).toEqual({
      id: 'user:someone@example.com',
      role: 'freeBusyReader',
      scope: { type: 'user', value: 'someone@example.com' },
    });
    expect(() => schema.output.parse(result)).not.toThrow();
  });

  it('suppresses the notification email when asked', async () => {
    const captured: Captured = {};
    await handler(fakeCalendar(captured, { id: 'user:a@example.com' }), {
      calendarId: 'team@example.com',
      role: 'writer',
      scope: { type: 'user', value: 'a@example.com' },
      sendNotifications: false,
    });
    expect(captured.params).toEqual({
      calendarId: 'team@example.com',
      sendNotifications: false,
      requestBody: { role: 'writer', scope: { type: 'user', value: 'a@example.com' } },
    });
  });

  it('omits the scope value for the public scope, which takes none', async () => {
    const captured: Captured = {};
    await handler(fakeCalendar(captured, { id: 'default' }), {
      role: 'reader',
      scope: { type: 'default' },
    });
    expect(captured.params).toEqual({
      calendarId: 'primary',
      requestBody: { role: 'reader', scope: { type: 'default' } },
    });
  });
});
