import { gmailOperation } from '../../operation.js';
import { handler } from './handler.js';
import { schema } from './schema.js';

/**
 * Source: https://developers.google.com/workspace/gmail/api/reference/rest/v1/users.labels/patch
 * Patches name and/or color of a user label.
 */
export const update_label = gmailOperation({
  description: 'Update a label name and/or color.',
  schema,
  handler,
});
