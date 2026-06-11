import type { docs_v1 } from '@googleapis/docs';
import type { AnyOperation } from '../../lib/operation.js';

/**
 * REST-sourced operations, from
 * `developers.google.com/workspace/docs/api/reference/rest`. Google publishes
 * no MCP toolset for Docs, so there is no `tools/` folder and this registry is
 * the service's whole wire surface. The three text-editing operations each
 * wrap `documents.batchUpdate` with exactly one request type; the rest of the
 * 40-variant union is issue #35.
 */
export const methods = {} satisfies Record<string, AnyOperation<docs_v1.Docs>>;
