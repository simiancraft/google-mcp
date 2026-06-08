import type { gmail_v1 } from '@googleapis/gmail';
import type { z } from 'zod';
import { type Operation, operation } from '../lib/operation.js';

/**
 * `operation()` bound to the Gmail client. Every gmail op's `index.ts` uses this
 * instead of the raw `operation()` so the handler's client is always
 * `gmail_v1.Gmail`: a handler that drops or mistypes its client annotation fails
 * here (the client can no longer silently infer `unknown` and slip into the
 * registry) rather than surfacing as a confusing `unknown` deep in the body.
 */
export const gmailOperation = <In extends z.ZodType, Out extends z.ZodType>(
  def: Operation<gmail_v1.Gmail, In, Out>,
): Operation<gmail_v1.Gmail, In, Out> => operation(def);
