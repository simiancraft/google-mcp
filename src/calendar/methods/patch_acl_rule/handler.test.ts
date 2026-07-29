import { describe, expect, it } from 'bun:test';
import type { calendar_v3 } from '@googleapis/calendar';
import { handler } from './handler.js';
import { schema } from './schema.js';

type Captured = { params?: calendar_v3.Params$Resource$Acl$Patch };

function fakeCalendar(captured: Captured, data: calendar_v3.Schema$AclRule): calendar_v3.Calendar {
  return {
    acl: {
      patch: async (params: calendar_v3.Params$Resource$Acl$Patch) => {
        captured.params = params;
        return { data };
      },
    },
  } as unknown as calendar_v3.Calendar;
}

describe('patch_acl_rule', () => {
  it('changes only the role, leaving the scope unstated', async () => {
    const captured: Captured = {};
    const result = await handler(
      fakeCalendar(captured, {
        id: 'user:someone@example.com',
        role: 'writer',
        scope: { type: 'user', value: 'someone@example.com' },
      }),
      { ruleId: 'user:someone@example.com', role: 'writer' },
    );
    expect(captured.params).toEqual({
      calendarId: 'primary',
      ruleId: 'user:someone@example.com',
      requestBody: { role: 'writer' },
    });
    expect(result).toMatchObject({ role: 'writer' });
    expect(() => schema.output.parse(result)).not.toThrow();
  });

  it('passes the calendar, scope, and notification suppression through', async () => {
    const captured: Captured = {};
    await handler(fakeCalendar(captured, { id: 'group:eng@example.com' }), {
      ruleId: 'group:eng@example.com',
      calendarId: 'team@example.com',
      role: 'reader',
      scope: { type: 'group', value: 'eng@example.com' },
      sendNotifications: false,
    });
    expect(captured.params).toEqual({
      calendarId: 'team@example.com',
      ruleId: 'group:eng@example.com',
      sendNotifications: false,
      requestBody: { role: 'reader', scope: { type: 'group', value: 'eng@example.com' } },
    });
  });

  it('sends an empty body when nothing is being changed', async () => {
    const captured: Captured = {};
    await handler(fakeCalendar(captured, { id: 'default' }), { ruleId: 'default' });
    expect(captured.params).toEqual({
      calendarId: 'primary',
      ruleId: 'default',
      requestBody: {},
    });
  });
});
