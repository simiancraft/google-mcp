import { docsOperation } from '../../operation.js';
import { handler } from './handler.js';
import { schema } from './schema.js';

/**
 * Text-with-indices by design: the projection carries the body's blocks as
 * text plus UTF-16 index ranges, which is what edit targeting needs; the
 * recursive tree (tabs, table cells, styles, suggestions) is issue #36. The
 * legacy single-tab body view is served (`includeTabsContent` not exposed).
 */
export const get_document = docsOperation({
  description:
    'Get a document by id: its title, revision, and body as text blocks with UTF-16 index ranges (the ranges that edits target).',
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    idempotentHint: true,
    openWorldHint: false,
  },
  source: 'https://developers.google.com/workspace/docs/api/reference/rest/v1/documents/get',
  schema,
  handler,
});
