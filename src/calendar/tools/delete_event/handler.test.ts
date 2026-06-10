import { describe, expect, it } from 'bun:test';
import type { calendar_v3 } from '@googleapis/calendar';
import { handler } from './handler.js';
import { schema } from './schema.js';

type Captured = {
  getParams?: calendar_v3.Params$Resource$Events$Get;
  deleteParams?: calendar_v3.Params$Resource$Events$Delete;
  order: string[];
};

function fakeCalendar(captured: Captured, data: calendar_v3.Schema$Event): calendar_v3.Calendar {
  return {
    events: {
      get: async (params: calendar_v3.Params$Resource$Events$Get) => {
        captured.getParams = params;
        captured.order.push('get');
        return { data };
      },
      delete: async (params: calendar_v3.Params$Resource$Events$Delete) => {
        captured.deleteParams = params;
        captured.order.push('delete');
        return { data: undefined };
      },
    },
  } as unknown as calendar_v3.Calendar;
}

describe('delete_event', () => {
  it('fetches the event before deleting and returns its projection', async () => {
    const captured: Captured = { order: [] };
    const result = await handler(
      fakeCalendar(captured, { id: 'E1', summary: 'Old standup', status: 'confirmed' }),
      { eventId: 'E1' },
    );
    expect(captured.order).toEqual(['get', 'delete']);
    expect(captured.getParams).toEqual({ calendarId: 'primary', eventId: 'E1' });
    expect(captured.deleteParams).toEqual({
      calendarId: 'primary',
      eventId: 'E1',
      sendUpdates: 'none',
    });
    expect(result).toMatchObject({ id: 'E1', summary: 'Old standup', status: 'confirmed' });
    expect(() => schema.output.parse(result)).not.toThrow();
  });

  it('deletes from an explicit calendar with the mapped notification level', async () => {
    const captured: Captured = { order: [] };
    const result = await handler(fakeCalendar(captured, { id: 'E2' }), {
      eventId: 'E2',
      calendarId: 'team@example.com',
      notificationLevel: 'ALL',
    });
    expect(captured.getParams).toEqual({ calendarId: 'team@example.com', eventId: 'E2' });
    expect(captured.deleteParams).toEqual({
      calendarId: 'team@example.com',
      eventId: 'E2',
      sendUpdates: 'all',
    });
    expect(() => schema.output.parse(result)).not.toThrow();
  });
});
