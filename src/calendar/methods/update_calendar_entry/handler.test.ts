import { describe, expect, it } from 'bun:test';
import type { calendar_v3 } from '@googleapis/calendar';
import { handler } from './handler.js';
import { schema } from './schema.js';

type Captured = { params?: calendar_v3.Params$Resource$Calendarlist$Patch };

function fakeCalendar(
  captured: Captured,
  data: calendar_v3.Schema$CalendarListEntry,
): calendar_v3.Calendar {
  return {
    calendarList: {
      patch: async (params: calendar_v3.Params$Resource$Calendarlist$Patch) => {
        captured.params = params;
        return { data };
      },
    },
  } as unknown as calendar_v3.Calendar;
}

describe('update_calendar_entry', () => {
  it('patches only the given view fields on the primary entry by default', async () => {
    const captured: Captured = {};
    const result = await handler(fakeCalendar(captured, { id: 'primary-id', selected: true }), {
      summaryOverride: 'My calendar',
      selected: true,
      hidden: false,
      defaultReminders: [{ method: 'popup', minutes: 15 }],
    });
    expect(captured.params).toEqual({
      calendarId: 'primary',
      requestBody: {
        summaryOverride: 'My calendar',
        selected: true,
        hidden: false,
        defaultReminders: [{ method: 'popup', minutes: 15 }],
      },
    });
    expect(result).toMatchObject({ id: 'primary-id', selected: true });
    expect(() => schema.output.parse(result)).not.toThrow();
  });

  it('writes palette colors without the RGB flag', async () => {
    const captured: Captured = {};
    await handler(fakeCalendar(captured, { id: 'C1' }), {
      calendarId: 'team@example.com',
      colorId: '7',
    });
    expect(captured.params).toEqual({
      calendarId: 'team@example.com',
      requestBody: { colorId: '7' },
    });
  });

  it('sends colorRgbFormat when writing hex colors', async () => {
    const captured: Captured = {};
    await handler(fakeCalendar(captured, { id: 'C1' }), {
      calendarId: 'team@example.com',
      backgroundColor: '#0088aa',
      foregroundColor: '#ffffff',
    });
    expect(captured.params).toEqual({
      calendarId: 'team@example.com',
      colorRgbFormat: true,
      requestBody: { backgroundColor: '#0088aa', foregroundColor: '#ffffff' },
    });
  });
});
