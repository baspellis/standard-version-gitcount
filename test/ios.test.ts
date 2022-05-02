import childProcess from 'child_process';

import { readVersion, writeVersion } from '../src/ios';
import * as stub from './stub';

jest.mock('child_process');
const mockedChildProcesss = childProcess as jest.Mocked<typeof childProcess>;

describe('readVersion', () => {
  it('returns ios build number from manifest', () => {
    expect(readVersion(stub.manifestRaw)).toBe(stub.manifest().expo.ios!.buildNumber);
  });

  it('returns empty string by default', () => {
    const manifest = stub.manifest();
    delete manifest.expo.ios;

    expect(readVersion(JSON.stringify(manifest))).toBe('');
  });
});

describe('writeVersion', () => {
  it('returns manifest with modified ios build number', () => {
    mockedChildProcesss.execSync.mockReturnValue(Buffer.from('123', 'utf8'));
    const modified = writeVersion(stub.manifestRaw, '3.2.1');

    expect(readVersion(modified)).toBe('123');
  });

  it('returns manifest with added ios build number', () => {
    mockedChildProcesss.execSync.mockReturnValue(Buffer.from('123', 'utf8'));
    const manifest = stub.manifest();
    delete manifest.expo.ios;
    const modified = writeVersion(JSON.stringify(manifest), '1.2.3');

    expect(readVersion(modified)).toBe('123');
  });
});
