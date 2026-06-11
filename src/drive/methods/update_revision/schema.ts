import { z } from 'zod';
import { Revision } from '../../entities/Revision.js';

export const schema = {
  input: z.object({
    fileId: z.string().describe('The ID of the file.'),
    revisionId: z.string().describe('The ID of the revision.'),
    keepForever: z
      .boolean()
      .optional()
      .describe(
        'Whether to keep this revision forever, even if it is no longer the head revision. ' +
          'Only applicable to files with binary content; only 200 revisions can be kept forever.',
      ),
    published: z
      .boolean()
      .optional()
      .describe('Whether this revision is published. Only applicable to Docs Editors files.'),
    publishAuto: z
      .boolean()
      .optional()
      .describe(
        'Whether subsequent revisions will be automatically republished. Only applicable to ' +
          'Docs Editors files.',
      ),
    publishedOutsideDomain: z
      .boolean()
      .optional()
      .describe(
        'Whether this revision is published outside the domain. Only applicable to Docs ' +
          'Editors files.',
      ),
  }),
  output: Revision,
};
