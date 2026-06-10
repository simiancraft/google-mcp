import { describe, expect, it } from 'bun:test';
import type { calendar_v3 } from '@googleapis/calendar';
import { handler } from './handler.js';
import { schema } from './schema.js';

type Captured = { params?: calendar_v3.Params$Resource$Settings$List };

function fakeCalendar(captured: Captured, data: calendar_v3.Schema$Settings): calendar_v3.Calendar {
  return {
    settings: {
      list: async (params: calendar_v3.Params$Resource$Settings$List) => {
        captured.params = params;
        return { data };
      },
    },
  } as unknown as calendar_v3.Calendar;
}

describe('list_settings', () => {
  it('lists the settings with no parameters by default', async () => {
    const captured: Captured = {};
    const result = await handler(
      fakeCalendar(captured, {
        items: [
          { id: 'timezone', value: 'America/Chicago' },
          { id: 'weekStart', value: '0' },
        ],
        nextPageToken: 'next',
      }),
      {},
    );
    expect(captured.params).toEqual({});
    expect(result).toEqual({
      settings: [
        { id: 'timezone', value: 'America/Chicago' },
        { id: 'weekStart', value: '0' },
      ],
      nextPageToken: 'next',
    });
    expect(() => schema.output.parse(result)).not.toThrow();
  });

  it('passes paging through and tolerates an empty response', async () => {
    const captured: Captured = {};
    const result = await handler(fakeCalendar(captured, {}), {
      maxResults: 50,
      pageToken: 'page-2',
    });
    expect(captured.params).toEqual({ maxResults: 50, pageToken: 'page-2' });
    expect(result).toEqual({ settings: [] });
    expect(() => schema.output.parse(result)).not.toThrow();
  });
});
