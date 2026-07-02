import { afterEach, describe, expect, it, spyOn } from 'bun:test';

const ARGV = [...process.argv];

// index.ts dispatches at module top level, so each case re-imports it under a
// unique query string to defeat the module cache.
async function runDoctor(cmd: string): Promise<void> {
  process.argv = [...ARGV.slice(0, 2), cmd];
  const specifier = `./index.js?cmd=${cmd}`;
  await import(specifier);
}

afterEach(() => {
  process.argv = [...ARGV];
});

describe('doctor CLI dispatch', () => {
  it('prints usage to stdout and exits 0 on help', async () => {
    const log = spyOn(console, 'log').mockImplementation(() => {});
    const error = spyOn(console, 'error').mockImplementation(() => {});
    const exit = spyOn(process, 'exit').mockImplementation(() => undefined as never);
    await runDoctor('help');
    expect(log).toHaveBeenCalledWith(expect.stringContaining('Usage:'));
    expect(error).not.toHaveBeenCalled();
    expect(exit).not.toHaveBeenCalled();
    log.mockRestore();
    error.mockRestore();
    exit.mockRestore();
  });

  it('prints usage to stderr, not stdout, and exits 1 on an unknown command', async () => {
    const log = spyOn(console, 'log').mockImplementation(() => {});
    const error = spyOn(console, 'error').mockImplementation(() => {});
    const exit = spyOn(process, 'exit').mockImplementation(() => undefined as never);
    await runDoctor('bogus');
    expect(error).toHaveBeenCalledWith(expect.stringContaining('Unknown command: bogus'));
    expect(error).toHaveBeenCalledWith(expect.stringContaining('Usage:'));
    expect(log).not.toHaveBeenCalled();
    expect(exit).toHaveBeenCalledWith(1);
    log.mockRestore();
    error.mockRestore();
    exit.mockRestore();
  });
});
