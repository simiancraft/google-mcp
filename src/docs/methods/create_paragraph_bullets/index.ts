import { docsOperation } from '../../operation.js';
import { handler } from './handler.js';
import { schema } from './schema.js';

/**
 * One CreateParagraphBulletsRequest applied via `documents.batchUpdate` (the
 * curated subset; issue #35). An additive modification, like labeling:
 * re-applying the same preset to the same range is a no-op. Nesting levels
 * are determined by each paragraph's leading tabs, which the API consumes.
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
