import { describe, expect, it } from 'bun:test';
import type { calendar_v3 } from '@googleapis/calendar';
import { handler } from './handler.js';
import { schema } from './schema.js';

type Captured = { params?: calendar_v3.Params$Resource$Events$Move };

function fakeCalendar(captured: Captured, moved: calendar_v3.Schema$Event): calendar_v3.Calendar {
  return {
    events: {
      move: async (params: calendar_v3.Params$Resource$Events$Move) => {
        captured.params = params;
        return { data: moved };
      },
    },
  } as unknown as calendar_v3.Calendar;
}

describe('move_event', () => {
  it('moves the event from the primary calendar by default', async () => {
    const captured: Captured = {};
    const result = await handler(fakeCalendar(captured, { id: 'E1', summary: 'Standup' }), {
      eventId: 'E1',
      destination: 'team@example.com',
    });
    expect(captured.params).toEqual({
      calendarId: 'primary',
      eventId: 'E1',
      destination: 'team@example.com',
    });
    expect(result).toMatchObject({ id: 'E1', summary: 'Standup' });
    expect(() => schema.output.parse(result)).not.toThrow();
  });

  it('moves from an explicit source calendar with the given notification audience', async () => {
    const captured: Captured = {};
    await handler(fakeCalendar(captured, { id: 'E1' }), {
      eventId: 'E1',
      calendarId: 'team@example.com',
      destination: 'archive@example.com',
      sendUpdates: 'all',
    });
    expect(captured.params).toEqual({
      calendarId: 'team@example.com',
      eventId: 'E1',
      destination: 'archive@example.com',
      sendUpdates: 'all',
    });
  });
});
