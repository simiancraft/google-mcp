import { docsOperation } from '../../operation.js';
import { handler } from './handler.js';
import { schema } from './schema.js';

/**
 * The new document lands in the account's Drive root. The Docs API has no
 * delete or list: removing a document is Drive's `files.delete`, outside this
 * server's surface.
 */
export const create_document = docsOperation({
  description:
    'Create a blank document with a title; returns the new document and its id. Body content is added with the editing operations.',
  annotations: {
    readOnlyHint: false,
    destructiveHint: false,
    idempotentHint: false,
    openWorldHint: false,
  },
  source: 'https://developers.google.com/workspace/docs/api/reference/rest/v1/documents/create',
  schema,
  handler,
});
