import { describe, expect, it } from 'bun:test';
import type { calendar_v3 } from '@googleapis/calendar';
import { handler } from './handler.js';
import { schema } from './schema.js';

type Captured = { params?: calendar_v3.Params$Resource$Acl$Update };

function fakeCalendar(captured: Captured, data: calendar_v3.Schema$AclRule): calendar_v3.Calendar {
  return {
    acl: {
      update: async (params: calendar_v3.Params$Resource$Acl$Update) => {
        captured.params = params;
        return { data };
      },
    },
  } as unknown as calendar_v3.Calendar;
}

describe('update_acl_rule', () => {
  it('replaces the rule on the primary calendar by default', async () => {
    const captured: Captured = {};
    const result = await handler(
      fakeCalendar(captured, {
        id: 'user:someone@example.com',
        role: 'reader',
        scope: { type: 'user', value: 'someone@example.com' },
      }),
      {
        ruleId: 'user:someone@example.com',
        role: 'reader',
        scope: { type: 'user', value: 'someone@example.com' },
      },
    );
    expect(captured.params).toEqual({
      calendarId: 'primary',
      ruleId: 'user:someone@example.com',
      requestBody: { role: 'reader', scope: { type: 'user', value: 'someone@example.com' } },
    });
    expect(result).toMatchObject({ id: 'user:someone@example.com', role: 'reader' });
    expect(() => schema.output.parse(result)).not.toThrow();
  });

  it('downgrades a grant silently when sendNotifications is false', async () => {
    const captured: Captured = {};
    await handler(fakeCalendar(captured, { id: 'domain:example.com' }), {
      ruleId: 'domain:example.com',
      calendarId: 'team@example.com',
      role: 'freeBusyReader',
      scope: { type: 'domain', value: 'example.com' },
      sendNotifications: false,
    });
    expect(captured.params).toEqual({
      calendarId: 'team@example.com',
      ruleId: 'domain:example.com',
      sendNotifications: false,
      requestBody: { role: 'freeBusyReader', scope: { type: 'domain', value: 'example.com' } },
    });
  });
});
