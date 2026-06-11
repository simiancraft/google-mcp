import { z } from 'zod';
import { Calendar } from '../../entities/Calendar.js';

export const schema = {
  input: z.strictObject({
    summary: z.string().describe('Title of the calendar.'),
    description: z.string().optional().describe('Description of the calendar.'),
    location: z
      .string()
      .optional()
      .describe('Geographic location of the calendar as free-form text.'),
    timeZone: z
      .string()
      .optional()
      .describe('The time zone of the calendar, as an IANA Time Zone Database name.'),
  }),
  output: Calendar,
};
