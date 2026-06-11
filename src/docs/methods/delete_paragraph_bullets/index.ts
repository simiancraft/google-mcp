import { docsOperation } from '../../operation.js';
import { handler } from './handler.js';
import { schema } from './schema.js';

/**
 * One DeleteParagraphBulletsRequest applied via `documents.batchUpdate` (the
 * curated subset; issue #35). A removal, so destructive per the rubric
 * (Google's unlabel precedent: reversible removals still count), and
 * idempotent: bullets occupy no body indices, the text is preserved, and a
 * repeat on unbulleted paragraphs is a no-op.
 */
export const delete_paragraph_bullets = docsOperation({
  description:
    'Remove bullets from the paragraphs a range overlaps; the text is preserved and the paragraphs leave their list.',
  annotations: {
    readOnlyHint: false,
    destructiveHint: true,
    idempotentHint: true,
    openWorldHint: false,
  },
  source:
    'https://developers.google.com/workspace/docs/api/reference/rest/v1/documents/request#DeleteParagraphBulletsRequest',
  schema,
  handler,
});
