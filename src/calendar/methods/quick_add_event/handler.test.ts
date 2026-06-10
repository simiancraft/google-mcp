import { describe, expect, it } from 'bun:test';
import type { calendar_v3 } from '@googleapis/calendar';
import { handler } from './handler.js';
import { schema } from './schema.js';

type Captured = { params?: calendar_v3.Params$Resource$Events$Quickadd };

function fakeCalendar(captured: Captured, created: calendar_v3.Schema$Event): calendar_v3.Calendar {
  return {
    events: {
      quickAdd: async (params: calendar_v3.Params$Resource$Events$Quickadd) => {
        captured.params = params;
        return { data: created };
      },
    },
  } as unknown as calendar_v3.Calendar;
}

describe('quick_add_event', () => {
  it('creates the event on the primary calendar by default', async () => {
    const captured: Captured = {};
    const result = await handler(fakeCalendar(captured, { id: 'E1', summary: 'Lunch with Anna' }), {
      text: 'Lunch with Anna 11:30am Friday at Ludivine',
    });
    expect(captured.params).toEqual({
      calendarId: 'primary',
      text: 'Lunch with Anna 11:30am Friday at Ludivine',
    });
    expect(result).toMatchObject({ id: 'E1', summary: 'Lunch with Anna' });
    expect(() => schema.output.parse(result)).not.toThrow();
  });

  it('creates on an explicit calendar with the given notification audience', async () => {
    const captured: Captured = {};
    await handler(fakeCalendar(captured, { id: 'E2' }), {
      text: 'Sprint review 3pm Thursday',
      calendarId: 'team@example.com',
      sendUpdates: 'externalOnly',
    });
    expect(captured.params).toEqual({
      calendarId: 'team@example.com',
      text: 'Sprint review 3pm Thursday',
      sendUpdates: 'externalOnly',
    });
  });
});
