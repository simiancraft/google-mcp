import { docsOperation } from '../../operation.js';
import { handler } from './handler.js';
import { schema } from './schema.js';

/**
 * One InsertSectionBreakRequest applied via `documents.batchUpdate` (the
 * curated subset; issue #35). Additive but not idempotent: repeating the
 * insert adds another section break (and its preceding newline) each time.
 */
export const insert_section_break = docsOperation({
  description:
    'Insert a section break (new-page or continuous) into the document body, splitting the document into sections that update_section_style can style independently; a newline character is inserted before the break.',
  annotations: {
    readOnlyHint: false,
    destructiveHint: false,
    idempotentHint: false,
    openWorldHint: false,
  },
  source:
    'https://developers.google.com/workspace/docs/api/reference/rest/v1/documents/request#InsertSectionBreakRequest',
  schema,
  handler,
});
