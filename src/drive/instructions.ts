/**
 * Served in the MCP initialize result; see `ServerOptions.instructions` in
 * src/lib/server.ts. A standalone module so tests can pin the content without
 * booting the server (index.ts's import side effect is `await server()`).
 */
import { identityInstructions, vocabularyInstructions } from '../lib/server.js';

export const instructions =
  identityInstructions('Google account') +
  vocabularyInstructions({
    tools: 'title, parentId, pageSize',
    methods: 'fileId, addParents, driveId',
  }) +
  'Heed the hints: delete_file and empty_trash bypass the trash and are ' +
  'unrecoverable; trash_file and untrash_file are the reversible pair, and ' +
  'Drive purges trashed files after about 30 days. search_files speaks its ' +
  'own documented query terms (title, parentId, owner), which this server ' +
  'translates to REST v3 syntax. read_file_content serves text ' +
  'representations (Docs, Sheets, and Slides exports, and text-like blobs); ' +
  'download_file_content returns base64; both content tools refuse blobs ' +
  'over 25 MiB. create_file converts text/plain to Google Docs and text/csv ' +
  'to Google Sheets unless disableConversionToGoogleType is set. Shared ' +
  'drives have their own methods (list_shared_drives through ' +
  'delete_shared_drive), distinct from file operations.';
