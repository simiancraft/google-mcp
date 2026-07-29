import { describe, expect, it } from 'bun:test';
import type { calendar_v3 } from '@googleapis/calendar';
import { handler } from './handler.js';
import { schema } from './schema.js';

type Captured = { params?: calendar_v3.Params$Resource$Acl$Get };

function fakeCalendar(captured: Captured, data: calendar_v3.Schema$AclRule): calendar_v3.Calendar {
  return {
    acl: {
      get: async (params: calendar_v3.Params$Resource$Acl$Get) => {
        captured.params = params;
        return { data };
      },
    },
  } as unknown as calendar_v3.Calendar;
}

describe('get_acl_rule', () => {
  it('gets the rule from the primary calendar by default', async () => {
    const captured: Captured = {};
    const result = await handler(
      fakeCalendar(captured, {
        id: 'user:someone@example.com',
        role: 'freeBusyReader',
        scope: { type: 'user', value: 'someone@example.com' },
      }),
      { ruleId: 'user:someone@example.com' },
    );
    expect(captured.params).toEqual({
      calendarId: 'primary',
      ruleId: 'user:someone@example.com',
    });
    expect(result).toEqual({
      id: 'user:someone@example.com',
      role: 'freeBusyReader',
      scope: { type: 'user', value: 'someone@example.com' },
    });
    expect(() => schema.output.parse(result)).not.toThrow();
  });

  it('gets the rule from a named calendar', async () => {
    const captured: Captured = {};
    await handler(fakeCalendar(captured, { id: 'default', role: 'reader' }), {
      ruleId: 'default',
      calendarId: 'team@example.com',
    });
    expect(captured.params).toEqual({ calendarId: 'team@example.com', ruleId: 'default' });
  });
});
