import { z } from 'zod';
import { FilterAction } from './FilterAction.js';
import { FilterCriteria } from './FilterCriteria.js';

/**
 * Advanced rules configured for an account that evaluate incoming messages
 * against specific matching criteria (like sender, subject, or size). When a
 * message matches, filters automatically trigger actions such as adding or
 * removing labels, or forwarding the email to a specified address.
 *
 * Field docs use `.describe()` so they reach the wire JSON Schema an MCP client
 * reads.
 *
 * @see https://developers.google.com/workspace/gmail/api/guides
 */
export const Filter = z.object({
  id: z.string().describe('The unique identifier of the filter.'),
  criteria: FilterCriteria.describe('Which incoming messages the filter matches.'),
  action: FilterAction.describe('What the filter does to a matching message.'),
});

export type Filter = z.infer<typeof Filter>;
