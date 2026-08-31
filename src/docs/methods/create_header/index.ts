import { docsOperation } from '../../operation.js';
import { handler } from './handler.js';
import { schema } from './schema.js';

/**
 * One CreateHeaderRequest applied via `documents.batchUpdate` (the curated
 * subset; issue #35). A create, and not idempotent even though a repeat
 * cannot duplicate: if a header of the type already exists the API returns a
 * 400, so a silent replay (which `idempotentHint: true` would permit after a
 * credential refresh) would surface an error for a write that succeeded.
 */
export const create_header = docsOperation({
  description:
    'Create a header, returning its headerId: pass that as segmentId to insert_text and the styling ranges to put content in it (header content starts at index 0). Applies to the whole document, or to one section when sectionBreakIndex names a later section break; creating a header where one already exists fails with a 400.',
  annotations: {
    readOnlyHint: false,
    destructiveHint: false,
    idempotentHint: false,
    openWorldHint: false,
  },
  source:
    'https://developers.google.com/workspace/docs/api/reference/rest/v1/documents/request#CreateHeaderRequest',
  schema,
  handler,
});
