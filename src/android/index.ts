import ChildProcess from 'child_process';

import { parse, serialize, androidVersionReader } from '../parsers/expo';
import { VersionWriter } from '../types';

/**
 * Read the manifest version from the `expo.android.versionCode` property.
 */
export const readVersion = androidVersionReader;

/**
 * Write the manifest version to the `expo.android.versionCode` property.
 * This uses the Android version code approach of Maxi Rosson.
 *
 * @see https://medium.com/@maxirosson/versioning-android-apps-d6ec171cfd82
 */
export const writeVersion: VersionWriter = (contents, version) => {
  const manifest = parse(contents);
  manifest.expo.android = manifest.expo.android || {};
  const gitcount = parseInt(
    ChildProcess.execSync('git rev-list --all --count').toString().trim(),
    10
  );
  manifest.expo.android.versionCode = gitcount;

  return serialize(manifest, contents);
};
