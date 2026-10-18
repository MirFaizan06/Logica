import { Linking, Platform } from 'react-native';
import Constants from 'expo-constants';
import * as Application from 'expo-application';
import * as FileSystem from 'expo-file-system/legacy';
import * as IntentLauncher from 'expo-intent-launcher';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useStore } from '@/store';
import { compareVersions, parseVersion } from '@/utils/version';
import { toReleaseInfo, type GhRelease, type ReleaseInfo } from '@/utils/release';

/* ------------------------------------------------------------------ */
/* Config                                                              */
/* ------------------------------------------------------------------ */

interface GithubExtra {
  owner: string;
  repo: string;
}

const extra = (Constants.expoConfig?.extra ?? {}) as { github?: GithubExtra };
export const GITHUB = {
  owner: extra.github?.owner ?? 'techbytesdesign',
  repo: extra.github?.repo ?? 'logica',
};

export const RELEASES_PAGE = `https://github.com/${GITHUB.owner}/${GITHUB.repo}/releases`;
const API_LATEST = `https://api.github.com/repos/${GITHUB.owner}/${GITHUB.repo}/releases/latest`;

/** Automatic checks run at most this often. Manual checks always run. */
export const AUTO_CHECK_INTERVAL_MS = 6 * 60 * 60 * 1000;
/** "Later" hides the prompt for this long. */
export const SNOOZE_MS = 24 * 60 * 60 * 1000;
const REQUEST_TIMEOUT_MS = 10000;
export const BACKUP_KEY = 'logica-backup-before-update';

export function currentVersion(): string {
  return Application.nativeApplicationVersion || Constants.expoConfig?.version || '0.0.0';
}

/* ------------------------------------------------------------------ */
/* Versions                                                            */
/* ------------------------------------------------------------------ */

export { parseVersion, compareVersions };
export type { ReleaseInfo };

/* ------------------------------------------------------------------ */
/* Release info                                                        */
/* ------------------------------------------------------------------ */

export type CheckResult =
  | { status: 'available'; release: ReleaseInfo }
  | { status: 'uptodate'; release?: ReleaseInfo }
  | { status: 'skipped' | 'throttled' }
  | { status: 'error'; message: string };

async function fetchWithTimeout(url: string, init: RequestInit = {}): Promise<Response> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), REQUEST_TIMEOUT_MS);
  try {
    return await fetch(url, { ...init, signal: ctrl.signal });
  } finally {
    clearTimeout(timer);
  }
}

export async function fetchLatestRelease(): Promise<ReleaseInfo | null> {
  const res = await fetchWithTimeout(API_LATEST, {
    headers: { Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28' },
  });
  if (res.status === 404) return null; // repository has no published release yet
  if (res.status === 403 || res.status === 429) throw new Error('GitHub is limiting requests right now. Try again later.');
  if (!res.ok) throw new Error(`Update server answered ${res.status}.`);
  const json = (await res.json()) as GhRelease;
  return toReleaseInfo(json);
}

/**
 * Looks for a newer release. Never throws: every failure becomes a result so the
 * app keeps working offline or when GitHub is unreachable.
 */
export async function checkForUpdate(manual: boolean): Promise<CheckResult> {
  const { updates, settings } = useStore.getState();
  const now = Date.now();
  if (!manual) {
    if (!settings.autoUpdateCheck) return { status: 'throttled' };
    if (now - updates.lastCheck < AUTO_CHECK_INTERVAL_MS) return { status: 'throttled' };
  }
  try {
    const release = await fetchLatestRelease();
    useStore.getState().setUpdates({ lastCheck: now });
    if (!release) return { status: 'uptodate' };
    if (compareVersions(release.version, currentVersion()) <= 0) return { status: 'uptodate', release };
    if (!manual) {
      if (!release.force && updates.skipped === release.version) return { status: 'skipped' };
      if (!release.force && updates.snoozeUntil > now) return { status: 'skipped' };
    }
    return { status: 'available', release };
  } catch (e) {
    const aborted = e instanceof Error && e.name === 'AbortError';
    return {
      status: 'error',
      message: aborted ? 'The update server took too long to answer.' : e instanceof Error && e.message && !/network request failed|failed to fetch/i.test(e.message) ? e.message : 'No internet connection.',
    };
  }
}

/* ------------------------------------------------------------------ */
/* Download and install (Android)                                      */
/* ------------------------------------------------------------------ */

export const canInstallInApp = Platform.OS === 'android';
const UPDATE_DIR = `${FileSystem.cacheDirectory ?? ''}updates/`;

export async function cleanOldApks(): Promise<void> {
  if (!canInstallInApp) return;
  try {
    const info = await FileSystem.getInfoAsync(UPDATE_DIR);
    if (!info.exists) return;
    const files = await FileSystem.readDirectoryAsync(UPDATE_DIR);
    const cur = currentVersion();
    for (const f of files) {
      const m = /logica-(\d+\.\d+\.\d+)\.apk/.exec(f);
      // keep a download that is still newer than what is installed (it may be resumed)
      if (!m || compareVersions(m[1], cur) <= 0 || f.endsWith('.part')) {
        await FileSystem.deleteAsync(UPDATE_DIR + f, { idempotent: true });
      }
    }
  } catch {
    /* cleanup is best effort */
  }
}

export interface DownloadHandle {
  cancel: () => Promise<void>;
  promise: Promise<string>;
}

/** Downloads the APK with progress. Resolves with the local file uri after verification. */
export function downloadApk(release: ReleaseInfo, onProgress: (fraction: number) => void): DownloadHandle {
  if (!release.apkUrl) {
    return { cancel: async () => {}, promise: Promise.reject(new Error('This release has no Android package attached.')) };
  }
  const target = `${UPDATE_DIR}logica-${release.version}.apk`;
  const partial = `${target}.part`;
  let cancelled = false;
  let resumable: FileSystem.DownloadResumable | null = null;

  const promise = (async () => {
    await FileSystem.makeDirectoryAsync(UPDATE_DIR, { intermediates: true }).catch(() => {});
    await FileSystem.deleteAsync(partial, { idempotent: true });

    resumable = FileSystem.createDownloadResumable(release.apkUrl!, partial, {}, (p) => {
      const total = p.totalBytesExpectedToWrite > 0 ? p.totalBytesExpectedToWrite : release.apkSize ?? 0;
      if (total > 0) onProgress(Math.min(1, p.totalBytesWritten / total));
    });
    const result = await resumable.downloadAsync();
    if (cancelled) throw new Error('cancelled');
    if (!result || result.status < 200 || result.status >= 300) {
      throw new Error('The download did not complete. Please try again.');
    }

    // verify before touching the installer
    const info = await FileSystem.getInfoAsync(partial, { md5: !!release.md5Url });
    if (!info.exists) throw new Error('The downloaded file went missing.');
    if (release.apkSize && info.size !== release.apkSize) {
      await FileSystem.deleteAsync(partial, { idempotent: true });
      throw new Error('The downloaded file is incomplete. Please try again.');
    }
    if (release.md5Url && 'md5' in info && info.md5) {
      try {
        const expected = (await (await fetchWithTimeout(release.md5Url)).text()).trim().split(/\s+/)[0].toLowerCase();
        if (/^[0-9a-f]{32}$/.test(expected) && expected !== info.md5.toLowerCase()) {
          await FileSystem.deleteAsync(partial, { idempotent: true });
          throw new Error('The downloaded file failed its integrity check.');
        }
      } catch (e) {
        if (e instanceof Error && /integrity/.test(e.message)) throw e;
        /* checksum file unreachable: size check already passed */
      }
    }
    await FileSystem.deleteAsync(target, { idempotent: true });
    await FileSystem.moveAsync({ from: partial, to: target });
    onProgress(1);
    return target;
  })();

  return {
    promise,
    cancel: async () => {
      cancelled = true;
      try {
        await resumable?.pauseAsync();
      } catch {
        /* ignore */
      }
      await FileSystem.deleteAsync(partial, { idempotent: true }).catch(() => {});
    },
  };
}

/** Saves a snapshot of the learner's progress so an update can never lose it. */
export async function backupBeforeUpdate(): Promise<void> {
  try {
    await AsyncStorage.setItem(BACKUP_KEY, useStore.getState().exportData());
  } catch {
    /* a failed backup should not block the update; progress is still in the main store */
  }
}

export async function installApk(fileUri: string): Promise<void> {
  const contentUri = await FileSystem.getContentUriAsync(fileUri);
  await IntentLauncher.startActivityAsync('android.intent.action.VIEW', {
    data: contentUri,
    flags: 1, // FLAG_GRANT_READ_URI_PERMISSION
    type: 'application/vnd.android.package-archive',
  });
}

export function openReleasePage(release?: ReleaseInfo | null): Promise<unknown> {
  return Linking.openURL(release?.htmlUrl || RELEASES_PAGE).catch(() => {});
}

/**
 * If the main store is empty (for example after a bad update) but a pre-update backup exists,
 * bring the progress back. Returns true when something was restored.
 */
export async function restoreBackupIfNeeded(): Promise<boolean> {
  try {
    const s = useStore.getState();
    if (s.profile.onboarded || s.progress.xp > 0) return false;
    const backup = await AsyncStorage.getItem(BACKUP_KEY);
    if (!backup) return false;
    const res = s.importData(backup);
    return res.ok;
  } catch {
    return false;
  }
}
