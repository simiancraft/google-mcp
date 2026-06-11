import { describe } from 'bun:test';
import { pinOperationSurface } from '../lib/surface-pins.js';
import { instructions } from './instructions.js';
import { methods } from './methods/registry.js';
import { tools } from './tools/registry.js';

describe('calendar operations', () => {
  pinOperationSurface({
    moduleUrl: import.meta.url,
    capabilitiesTitle: 'Calendar capabilities',
    instructions,
    groups: [
      { kind: 'MCP Tool', operations: tools },
      { kind: 'REST Method', operations: methods },
    ],
    toolSourcePrefix:
      'https://developers.google.com/workspace/calendar/api/v3/reference/mcp/tools_list/',
    methodSourcePrefix: 'https://developers.google.com/workspace/calendar/api/v3/reference/',
    counts: { tools: 8, methods: 17 },
    readOnly: [
      'get_calendar',
      'get_calendar_entry',
      'get_colors',
      'get_event',
      'get_setting',
      'list_calendars',
      'list_event_instances',
      'list_events',
      'list_settings',
      'query_free_busy',
      'suggest_time',
    ],
    destructive: ['clear_calendar', 'delete_calendar', 'delete_event', 'remove_calendar_entry'],
    openWorld: [],
  });
});
