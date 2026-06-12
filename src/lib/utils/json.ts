import { readFileSync } from 'node:fs';
import type { z } from 'zod';

/**
 * Read a JSON file and validate it in one step: the suite's one boundary for
 * trusting on-disk JSON (the client secret, token files, the roster). Filesystem errors (ENOENT
 * included) and zod issues both throw; callers own the fallback policy.
 */
export function readJsonFile<S extends z.ZodType>(path: string, schema: S): z.infer<S> {
  return schema.parse(JSON.parse(readFileSync(path, 'utf8')));
}
