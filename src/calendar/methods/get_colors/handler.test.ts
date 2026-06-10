import { describe, expect, it } from 'bun:test';
import type { calendar_v3 } from '@googleapis/calendar';
import { handler } from './handler.js';
import { schema } from './schema.js';

function fakeCalendar(data: calendar_v3.Schema$Colors): calendar_v3.Calendar {
  return {
    colors: {
      get: async () => ({ data }),
    },
  } as unknown as calendar_v3.Calendar;
}

describe('get_colors', () => {
  it('projects both palettes keyed by color ID', async () => {
    const result = await handler(
      fakeCalendar({
        updated: '2026-01-01T00:00:00Z',
        calendar: { '1': { background: '#ac725e', foreground: '#1d1d1d' } },
        event: { '11': { background: '#dc2127', foreground: '#1d1d1d' } },
      }),
      {},
    );
    expect(result).toEqual({
      updated: '2026-01-01T00:00:00Z',
      calendar: { '1': { background: '#ac725e', foreground: '#1d1d1d' } },
      event: { '11': { background: '#dc2127', foreground: '#1d1d1d' } },
    });
    expect(() => schema.output.parse(result)).not.toThrow();
  });

  it('tolerates an empty response and missing definition fields', async () => {
    const result = await handler(fakeCalendar({ event: { '1': {} } }), {});
    expect(result).toEqual({
      calendar: {},
      event: { '1': { background: '', foreground: '' } },
    });
    expect(() => schema.output.parse(result)).not.toThrow();
  });
});
