import { z } from 'zod';
import { FilterAction } from './FilterAction.js';
import { FilterCriteria } from './FilterCriteria.js';

/**
 * Advanced rules configured for an account that evaluate incoming messages
 * against specific matching criteria (like sender, subject, or size). When a
 * message matches, filters automatically trigger actions such as adding or
 * removing labels, or forwarding the email to a specified address.
 *
 * @see https://developers.google.com/workspace/gmail/api/guides
 */
export const Filter = z.object({
  /** The unique identifier of the filter. */
  id: z.string(),
  criteria: FilterCriteria,
  action: FilterAction,
});

export type Filter = z.infer<typeof Filter>;
