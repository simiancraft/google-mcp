import type { gmail_v1 } from '@googleapis/gmail';
import { makeDefineTool } from '../harness/index.js';

/**
 * The Gmail method factory: for operations sourced from the REST reference
 * (`developers.google.com/workspace/gmail/api/reference/rest`). Same factory as
 * `defineTool`; the separate name keeps method files reading in REST vocabulary.
 * Set `destructive: true` for irreversible methods (send, permanent delete).
 */
export const defineMethod = makeDefineTool<gmail_v1.Gmail>();
