import { z } from 'zod';
import { Revision } from '../../entities/Revision.js';

export const schema = {
  input: z.strictObject({
    fileId: z.string().describe('The ID of the file.'),
    pageSize: z
      .number()
      .int()
      .optional()
      .describe('The maximum number of revisions to return per page.'),
    pageToken: z
      .string()
      .optional()
      .describe(
        'The token for continuing a previous list request on the next page. This should be ' +
          "set to the value of 'nextPageToken' from the previous response.",
      ),
  }),
  output: z.object({
    revisions: z
      .array(Revision)
      .describe(
        'The list of revisions. The list might be incomplete for files with a large revision ' +
          'history: older revisions can be omitted, so the first revision returned may not be ' +
          'the oldest existing one.',
      ),
    nextPageToken: z
      .string()
      .optional()
      .describe(
        'The page token for the next page of revisions. This will be absent if the end of ' +
          'the revisions list has been reached.',
      ),
  }),
};
