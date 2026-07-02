#!/usr/bin/env node
import { resolve, usage } from './dispatch.js';

const [name] = process.argv.slice(2);

if (name === 'help' || name === '--help' || name === '-h') {
  console.log(usage);
  process.exit(0);
}
if (name === undefined) {
  console.error(usage);
  process.exit(1);
}

const entry = resolve(name);
if (entry === undefined) {
  console.error(`Unknown service: ${name}\n\n${usage}`);
  process.exit(1);
}

// Drop the dispatch token so a dispatched CLI (doctor) reads its own arguments.
process.argv.splice(2, 1);
await import(entry);
