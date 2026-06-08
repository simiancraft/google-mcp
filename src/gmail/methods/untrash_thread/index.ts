import { operation } from '../../../lib/operation.js';
import { handler } from './handler.js';
import { schema } from './schema.js';

/**
 * Source: https://developers.google.com/workspace/gmail/api/reference/rest/v1/users.threads/untrash
 * Reversible: removes every message in a thread from the trash.
 */
export const untrash_thread = operation({
  description: 'Remove a thread from the trash.',
  schema,
  handler,
});
