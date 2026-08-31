import { docsOperation } from '../../operation.js';
import { handler } from './handler.js';
import { schema } from './schema.js';

/**
 * One UpdateSectionStyleRequest applied via `documents.batchUpdate` (the
 * curated subset; issue #35). Applies to every section the range overlaps;
 * only the provided fields change, and re-applying the same arguments yields
 * the same styling.
 */
export const update_section_style = docsOperation({
  description:
    'Set section styling (column layout and separators, content direction, section margins) on every section a range overlaps; only the provided fields change. Sections are created with insert_section_break; a document with no breaks is one section.',
  annotations: {
    readOnlyHint: false,
    destructiveHint: false,
    idempotentHint: true,
    openWorldHint: false,
  },
  source:
    'https://developers.google.com/workspace/docs/api/reference/rest/v1/documents/request#UpdateSectionStyleRequest',
  schema,
  handler,
});
