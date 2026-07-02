import { describe, expect, test } from 'bun:test';

const ENTRY = new URL('./index.ts', import.meta.url).pathname;

async function runDoctor(...args: string[]) {
  const proc = Bun.spawn(['bun', 'run', ENTRY, ...args], {
    stdout: 'pipe',
    stderr: 'pipe',
  });
  const [stdout, stderr, exitCode] = await Promise.all([
    new Response(proc.stdout).text(),
    new Response(proc.stderr).text(),
    proc.exited,
  ]);
  return { stdout, stderr, exitCode };
}

describe('doctor CLI streams', () => {
  test('unknown command keeps stdout clean and reports on stderr', async () => {
    const { stdout, stderr, exitCode } = await runDoctor('bogus');
    // The failure path must not pollute stdout: anything capturing doctor's
    // stdout (a pipe, an agent reading tool output) should get nothing here.
    expect(stdout).toBe('');
    expect(exitCode).toBe(1);
    expect(stderr).toContain('Unknown command: bogus');
    expect(stderr).toContain('Usage:');
  });

  test('help writes usage to stdout and exits 0', async () => {
    const { stdout, stderr, exitCode } = await runDoctor('help');
    expect(exitCode).toBe(0);
    expect(stdout).toContain('Usage:');
    expect(stderr).toBe('');
  });
});
