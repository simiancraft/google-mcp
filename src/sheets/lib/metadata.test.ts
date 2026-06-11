import { describe, expect, it } from 'bun:test';
import { projectDeveloperMetadata } from './metadata.js';

describe('projectDeveloperMetadata', () => {
  it('projects a full metadata entry', () => {
    expect(
      projectDeveloperMetadata({
        metadataId: 42,
        metadataKey: 'region',
        metadataValue: 'us-east',
        location: { locationType: 'SHEET', sheetId: 3 },
        visibility: 'DOCUMENT',
      }),
    ).toEqual({
      metadataId: 42,
      metadataKey: 'region',
      metadataValue: 'us-east',
      location: { locationType: 'SHEET', sheetId: 3 },
      visibility: 'DOCUMENT',
    });
  });

  it('cleans nulls, drops unknown visibilities, and defaults a missing id', () => {
    expect(projectDeveloperMetadata({ metadataKey: null, visibility: 'NEW_VISIBILITY' })).toEqual({
      metadataId: 0,
    });
  });
});
