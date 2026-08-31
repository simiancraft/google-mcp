import { docsOperation } from '../../operation.js';
import { handler } from './handler.js';
import { schema } from './schema.js';

/**
 * One CreateFooterRequest applied via `documents.batchUpdate` (the curated
 * subset; issue #35). A create, and not idempotent even though a repeat
 * cannot duplicate: if a footer of the type already exists the API returns a
 * 400, so a silent replay (which `idempotentHint: true` would permit after a
 * credential refresh) would surface an error for a write that succeeded.
 */
export const create_footer = docsOperation({
  description:
    'Create a footer, returning its footerId: pass that as segmentId to insert_text and the styling ranges to put content in it (footer content starts at index 0). Applies to the whole document, or to one section when sectionBreakIndex names a later section break; creating a footer where one already exists fails with a 400.',
  annotations: {
    readOnlyHint: false,
    destructiveHint: false,
    idempotentHint: false,
    openWorldHint: false,
  },
  source:
    'https://developers.google.com/workspace/docs/api/reference/rest/v1/documents/request#CreateFooterRequest',
  schema,
  handler,
});
