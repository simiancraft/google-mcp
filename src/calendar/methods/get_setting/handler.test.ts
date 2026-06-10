import { describe, expect, it } from 'bun:test';
import type { calendar_v3 } from '@googleapis/calendar';
import { handler } from './handler.js';
import { schema } from './schema.js';

type Captured = { params?: calendar_v3.Params$Resource$Settings$Get };

function fakeCalendar(captured: Captured, data: calendar_v3.Schema$Setting): calendar_v3.Calendar {
  return {
    settings: {
      get: async (params: calendar_v3.Params$Resource$Settings$Get) => {
        captured.params = params;
        return { data };
      },
    },
  } as unknown as calendar_v3.Calendar;
}

describe('get_setting', () => {
  it('gets the named setting', async () => {
    const captured: Captured = {};
    const result = await handler(
      fakeCalendar(captured, { id: 'timezone', value: 'America/Chicago' }),
      { settingId: 'timezone' },
    );
    expect(captured.params).toEqual({ setting: 'timezone' });
    expect(result).toEqual({ id: 'timezone', value: 'America/Chicago' });
    expect(() => schema.output.parse(result)).not.toThrow();
  });

  it('cleans absent fields to empty strings', async () => {
    const captured: Captured = {};
    const result = await handler(fakeCalendar(captured, {}), { settingId: 'weekStart' });
    expect(result).toEqual({ id: '', value: '' });
    expect(() => schema.output.parse(result)).not.toThrow();
  });
});
