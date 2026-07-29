import { describe, expect, it } from 'bun:test';
import type { calendar_v3 } from '@googleapis/calendar';
import { handler } from './handler.js';
import { schema } from './schema.js';

type Captured = { params?: calendar_v3.Params$Resource$Acl$Delete };

function fakeCalendar(captured: Captured): calendar_v3.Calendar {
  return {
    acl: {
      delete: async (params: calendar_v3.Params$Resource$Acl$Delete) => {
        captured.params = params;
        return { data: {} };
      },
    },
  } as unknown as calendar_v3.Calendar;
}

describe('delete_acl_rule', () => {
  it('revokes the rule on the primary calendar by default and confirms it', async () => {
    const captured: Captured = {};
    const result = await handler(fakeCalendar(captured), {
      ruleId: 'user:someone@example.com',
    });
    expect(captured.params).toEqual({
      calendarId: 'primary',
      ruleId: 'user:someone@example.com',
    });
    expect(result).toEqual({ ruleId: 'user:someone@example.com', calendarId: 'primary' });
    expect(() => schema.output.parse(result)).not.toThrow();
  });

  it('confirms the named calendar it revoked from', async () => {
    const captured: Captured = {};
    const result = await handler(fakeCalendar(captured), {
      ruleId: 'domain:example.com',
      calendarId: 'team@example.com',
    });
    expect(captured.params).toEqual({
      calendarId: 'team@example.com',
      ruleId: 'domain:example.com',
    });
    expect(result).toEqual({ ruleId: 'domain:example.com', calendarId: 'team@example.com' });
  });
});
