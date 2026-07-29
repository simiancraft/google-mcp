import { calendarOperation } from '../../operation.js';
import { handler } from './handler.js';
import { schema } from './schema.js';

/**
 * One rule by id. The id is derived from the scope
 * (`user:someone@example.com`, `domain:example.com`, or the bare `default`
 * for the public rule), so it can be constructed rather than looked up when
 * the scope is already known.
 */
export const get_acl_rule = calendarOperation({
  description:
    "Get a single rule from a calendar's access control list by its rule ID: the role it grants and the scope it grants to.",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    idempotentHint: true,
    openWorldHint: false,
  },
  source: 'https://developers.google.com/workspace/calendar/api/v3/reference/acl/get',
  schema,
  handler,
});
