import childProcess from 'child_process';

import { readVersion, writeVersion } from '../src/android';
import * as stub from './stub';

jest.mock('child_process');
const mockedChildProcesss = childProcess as jest.Mocked<typeof childProcess>;

describe('readVersion', () => {
  it('returns android version code from manifest', () => {
    expect(readVersion(stub.manifestRaw)).toBe('123');
  });

  it('returns empty string by default', () => {
    const manifest = stub.manifest();
    delete manifest.expo.android;

    expect(readVersion(JSON.stringify(manifest))).toBe('');
  });
});

describe('writeVersion', () => {
  it('returns manifest with modified android version code', () => {
    mockedChildProcesss.execSync.mockReturnValue(Buffer.from('123', 'utf8'));

    const modified = writeVersion(stub.manifestRaw, '3.2.1');

    expect(readVersion(modified)).toBe('123');
  });

  it('returns manifest with added android version code', () => {
    mockedChildProcesss.execSync.mockReturnValue(Buffer.from('123', 'utf8'));

    const manifest = stub.manifest();
    delete manifest.expo.android;
    const modified = writeVersion(JSON.stringify(manifest), '1.2.3');

    expect(readVersion(modified)).toBe('123');
  });
});
