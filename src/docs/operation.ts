import type { docs_v1 } from '@googleapis/docs';
import type { z } from 'zod';
import { type Operation, operation } from '../lib/operation.js';

/**
 * `operation()` bound to the Docs client. Every docs op's `index.ts` uses
 * this instead of the raw `operation()` so the handler's client is always
 * `docs_v1.Docs`: a handler that drops or mistypes its client annotation
 * fails here (the client can no longer silently infer `unknown` and slip into
 * the registry) rather than surfacing as a confusing `unknown` deep in the body.
 */
export const docsOperation = <In extends z.ZodObject, Out extends z.ZodObject>(
  def: Operation<docs_v1.Docs, In, Out>,
): Operation<docs_v1.Docs, In, Out> => operation(def);
