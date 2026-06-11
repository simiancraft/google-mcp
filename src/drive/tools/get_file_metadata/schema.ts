import { z } from 'zod';
import { File } from '../../entities/File.js';

export const schema = {
  input: z.strictObject({
    fileId: z.string().describe('The ID of the file to retrieve.'),
    excludeContentSnippets: z
      .boolean()
      .optional()
      .describe(
        'If true, the content snippet will be excluded from the response. Accepted for contract ' +
          'fidelity; this server never produces snippets (the REST API serves none), so there is ' +
          'nothing to exclude either way.',
      ),
  }),
  output: File,
};
