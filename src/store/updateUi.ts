import { create } from 'zustand';
import { AppState as RNAppState, Platform } from 'react-native';
import { useStore } from '@/store';
import {
  SNOOZE_MS,
  backupBeforeUpdate,
  canInstallInApp,
  checkForUpdate,
  downloadApk,
  installApk,
  openReleasePage,
  type CheckResult,
  type DownloadHandle,
  type ReleaseInfo,
} from '@/services/updates';

export type UpdatePhase = 'idle' | 'checking' | 'available' | 'downloading' | 'ready' | 'installing' | 'error';

interface UpdateUiState {
  phase: UpdatePhase;
  release: ReleaseInfo | null;
  progress: number;
  error: string | null;
  /** the sheet is waiting for a safe screen (not mid-lesson) */
  pending: boolean;
  /** the user asked (Settings): show the sheet right away */
  manual: boolean;
  fileUri: string | null;
  lastManual: CheckResult | null;
  dismiss: () => void;
}

export const useUpdateUi = create<UpdateUiState>((set) => ({
  phase: 'idle',
  release: null,
  progress: 0,
  error: null,
  pending: false,
  manual: false,
  fileUri: null,
  lastManual: null,
  dismiss: () => set({ pending: false, manual: false, phase: 'idle', error: null, progress: 0 }),
}));

const ui = useUpdateUi;
let handle: DownloadHandle | null = null;

export async function runUpdateCheck(manual: boolean): Promise<CheckResult> {
  if (Platform.OS === 'web') return { status: 'uptodate' };
  const busy = ui.getState().phase;
  if (busy === 'downloading' || busy === 'installing' || busy === 'checking') return { status: 'throttled' };
  if (manual) ui.setState({ phase: 'checking', lastManual: null });
  const res = await checkForUpdate(manual);
  if (res.status === 'available') {
    ui.setState({ phase: 'available', release: res.release, pending: true, manual, error: null, progress: 0, lastManual: manual ? res : null });
  } else {
    ui.setState({ phase: 'idle', lastManual: manual ? res : null });
  }
  return res;
}

export async function startUpdate(): Promise<void> {
  const { release } = ui.getState();
  if (!release) return;
  if (!canInstallInApp || !release.apkUrl) {
    await openReleasePage(release);
    return;
  }
  ui.setState({ phase: 'downloading', progress: 0, error: null });
  await backupBeforeUpdate();
  try {
    handle = downloadApk(release, (p) => ui.setState({ progress: p }));
    const uri = await handle.promise;
    handle = null;
    ui.setState({ phase: 'ready', fileUri: uri, progress: 1 });
    await launchInstaller();
  } catch (e) {
    handle = null;
    const msg = e instanceof Error ? e.message : 'Something went wrong.';
    if (msg === 'cancelled') {
      ui.setState({ phase: 'available', progress: 0 });
      return;
    }
    ui.setState({ phase: 'error', error: /network|fetch|timed out/i.test(msg) ? 'The connection dropped during the download.' : msg });
  }
}

export async function launchInstaller(): Promise<void> {
  const { fileUri } = ui.getState();
  if (!fileUri) return;
  try {
    ui.setState({ phase: 'installing' });
    await installApk(fileUri);
    // If the user backs out of the system installer, return to the "ready" state.
    const sub = RNAppState.addEventListener('change', (s) => {
      if (s === 'active') {
        sub.remove();
        setTimeout(() => {
          if (ui.getState().phase === 'installing') ui.setState({ phase: 'ready' });
        }, 600);
      }
    });
  } catch {
    ui.setState({
      phase: 'error',
      error: 'Android could not open the installer. You may need to allow installs from this app in Settings.',
    });
  }
}

export async function cancelDownload(): Promise<void> {
  await handle?.cancel();
  handle = null;
}

export function skipThisVersion() {
  const { release } = ui.getState();
  if (release) useStore.getState().setUpdates({ skipped: release.version });
  ui.getState().dismiss();
}

export function remindLater() {
  useStore.getState().setUpdates({ snoozeUntil: Date.now() + SNOOZE_MS });
  ui.getState().dismiss();
}
