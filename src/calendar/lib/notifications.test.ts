import { describe, expect, it } from 'bun:test';
import { toSendUpdates } from './notifications.js';

describe('toSendUpdates', () => {
  it('maps NONE to none', () => {
    expect(toSendUpdates('NONE')).toBe('none');
  });

  it('maps EXTERNAL_ONLY to externalOnly', () => {
    expect(toSendUpdates('EXTERNAL_ONLY')).toBe('externalOnly');
  });

  it('maps ALL to all', () => {
    expect(toSendUpdates('ALL')).toBe('all');
  });

  it('defaults an unset level to none', () => {
    expect(toSendUpdates(undefined)).toBe('none');
  });
});
