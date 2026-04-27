import { execSync } from 'node:child_process';

/**
 * ISO 8601 commit date for the last change to a file, or `undefined` if git is unavailable or the file has no history.
 */
export function gitLastCommitIsoForPath(relativePathFromRepoRoot: string): string | undefined {
  const p = relativePathFromRepoRoot.replace(/\\/g, '/');
  try {
    const out = execSync(`git log -1 --format=%cI -- "${p}"`, {
      encoding: 'utf-8',
      cwd: process.cwd(),
      stdio: ['ignore', 'pipe', 'pipe'],
    }).trim();
    return out || undefined;
  } catch {
    return undefined;
  }
}
