import type { calendar_v3 } from '@googleapis/calendar';
import type { Calendar } from '../entities/Calendar.js';

/** Project a REST calendar resource onto the Calendar shape, cleaning nulls to undefined. */
export function projectCalendar(data: calendar_v3.Schema$Calendar): Calendar {
  return {
    id: data.id ?? '',
    summary: data.summary ?? undefined,
    description: data.description ?? undefined,
    location: data.location ?? undefined,
    timeZone: data.timeZone ?? undefined,
  };
}
