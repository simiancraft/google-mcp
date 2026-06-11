import { docsOperation } from '../../operation.js';
import { handler } from './handler.js';
import { schema } from './schema.js';

/**
 * One CreateParagraphBulletsRequest applied via `documents.batchUpdate` (the
 * curated subset; issue #35). Nesting levels come from each paragraph's
 * leading tabs, which the API consumes on first application, so indices can
 * shift; a repeat then finds no tabs left and changes nothing, which is why
 * the idempotent hint holds despite the first-run shift.
 */
export const create_paragraph_bullets = docsOperation({
  description:
    'Turn the paragraphs a range overlaps into a bulleted or numbered list, using a glyph preset; leading tabs determine nesting.',
  annotations: {
    readOnlyHint: false,
    destructiveHint: false,
    idempotentHint: true,
    openWorldHint: false,
  },
  source:
    'https://developers.google.com/workspace/docs/api/reference/rest/v1/documents/request#CreateParagraphBulletsRequest',
  schema,
  handler,
});
