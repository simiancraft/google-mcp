import type { calendar_v3 } from '@googleapis/calendar';
import type { z } from 'zod';
import type { ColorDefinition } from '../../entities/Colors.js';
import type { schema } from './schema.js';

/** Project one palette map, cleaning nulls to empty strings. */
function projectPalette(
  palette: Record<string, calendar_v3.Schema$ColorDefinition> | null | undefined,
): Record<string, ColorDefinition> {
  return Object.fromEntries(
    Object.entries(palette ?? {}).map(([id, definition]) => [
      id,
      {
        background: definition.background ?? '',
        foreground: definition.foreground ?? '',
      },
    ]),
  );
}

export async function handler(
  calendar: calendar_v3.Calendar,
  _args: z.infer<typeof schema.input>,
): Promise<z.infer<typeof schema.output>> {
  const { data } = await calendar.colors.get();
  return {
    updated: data.updated ?? undefined,
    calendar: projectPalette(data.calendar),
    event: projectPalette(data.event),
  };
}
