import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AppState, Platform, ScrollView, View } from 'react-native';
import { usePathname } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Button } from './Button';
import { ProgressBar } from './Progress';
import { Sheet } from './Sheet';
import { T } from './AppText';
import { alpha, useTheme } from '@/theme/ThemeProvider';
import { useStore } from '@/store';
import { CHANGELOG } from '@/content/changelog';
import { cleanOldApks, currentVersion, openReleasePage, restoreBackupIfNeeded } from '@/services/updates';
import {
  cancelDownload,
  launchInstaller,
  remindLater,
  runUpdateCheck,
  skipThisVersion,
  startUpdate,
  useUpdateUi,
} from '@/store/updateUi';

/** Screens where interrupting the learner with a prompt is fine. */
const SAFE = /^\/(learn|practice|lab|progress|me)?$|^\/(learn|practice|lab|progress|me)(\/|$)/;

function formatSize(bytes: number | null): string {
  if (!bytes) return '';
  const mb = bytes / (1024 * 1024);
  return `${mb.toFixed(mb < 10 ? 1 : 0)} MB`;
}

function Notes({ text }: { text: string }) {
  const lines = useMemo(
    () =>
      text
        .replace(/<!--[\s\S]*?-->/g, '')
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
        .split('\n')
        .map((l) => l.trimEnd())
        .filter((l) => l.trim().length > 0)
        .slice(0, 24),
    [text]
  );
  return (
    <View style={{ gap: 6 }}>
      {lines.map((l, i) => {
        const bullet = /^\s*[-*]\s+/.test(l);
        const heading = /^#{1,4}\s+/.test(l);
        const body = l.replace(/^\s*[-*]\s+/, '').replace(/^#{1,4}\s+/, '').replace(/\*\*/g, '');
        return (
          <View key={i} style={{ flexDirection: 'row', gap: 8 }}>
            {bullet ? <T c="primary">•</T> : null}
            <T v={heading ? 'bodyB' : 'small'} style={{ flex: 1 }}>
              {body}
            </T>
          </View>
        );
      })}
    </View>
  );
}

function UpdateSheet() {
  const t = useTheme();
  const { phase, release, progress, error, pending, manual } = useUpdateUi();
  const pathname = usePathname();
  const safe = SAFE.test(pathname);
  const visible = !!release && (phase === 'downloading' || phase === 'ready' || phase === 'installing' || phase === 'error' || (phase === 'available' && pending && (safe || manual)));
  const force = !!release?.force;
  const current = currentVersion();
  const busy = phase === 'downloading' || phase === 'installing';

  if (!release) return null;
  return (
    <Sheet visible={visible} dismissable={!busy && !force} onClose={remindLater}>
      <View style={{ alignItems: 'center', gap: 6, marginBottom: 12 }}>
        <View style={{ width: 60, height: 60, borderRadius: 30, backgroundColor: alpha(t.primary, 0.16), alignItems: 'center', justifyContent: 'center' }}>
          <Ionicons name={phase === 'error' ? 'alert-circle-outline' : 'cloud-download-outline'} size={30} color={phase === 'error' ? t.danger : t.primary} />
        </View>
        <T v="title" center>
          {phase === 'error' ? 'Update problem' : phase === 'installing' ? 'Almost there' : phase === 'downloading' ? 'Downloading update' : 'Update available'}
        </T>
        <T v="small" c="muted" center>
          Version {current} → {release.version}
          {release.apkSize ? `  ·  ${formatSize(release.apkSize)}` : ''}
        </T>
      </View>

      {phase === 'available' && (
        <>
          <ScrollView style={{ maxHeight: 220, marginBottom: 14 }} showsVerticalScrollIndicator={false}>
            <T v="bodyB" style={{ marginBottom: 8 }}>
              {release.name}
            </T>
            {release.notes ? <Notes text={release.notes} /> : <T v="small" c="muted">Improvements and fixes.</T>}
          </ScrollView>
          <T v="small" c="muted" center style={{ marginBottom: 12 }}>
            Your progress is saved on this device and is kept during the update.
          </T>
          <View style={{ gap: 4 }}>
            <Button title={Platform.OS === 'android' ? 'Update now' : 'View on GitHub'} icon="download-outline" onPress={startUpdate} />
            {!force && (
              <View style={{ flexDirection: 'row', gap: 8, marginTop: 6 }}>
                <View style={{ flex: 1 }}>
                  <Button title="Later" variant="secondary" small onPress={remindLater} />
                </View>
                <View style={{ flex: 1 }}>
                  <Button title="Skip version" variant="ghost" small onPress={skipThisVersion} />
                </View>
              </View>
            )}
          </View>
        </>
      )}

      {phase === 'downloading' && (
        <View style={{ gap: 12 }}>
          <ProgressBar value={progress} height={14} />
          <T v="small" c="muted" center>
            {Math.round(progress * 100)}%  ·  Keep the app open
          </T>
          <Button title="Cancel" variant="secondary" small onPress={cancelDownload} />
        </View>
      )}

      {(phase === 'ready' || phase === 'installing') && (
        <View style={{ gap: 12 }}>
          <T v="body" c="muted" center>
            {phase === 'installing'
              ? 'Follow Android’s prompt to finish installing. Logica will reopen with your progress intact.'
              : 'The update is downloaded and checked.'}
          </T>
          <Button title={phase === 'installing' ? 'Opening installer…' : 'Install now'} loading={phase === 'installing'} onPress={launchInstaller} />
        </View>
      )}

      {phase === 'error' && (
        <View style={{ gap: 10 }}>
          <T v="body" c="muted" center>
            {error}
          </T>
          <Button title="Try again" onPress={startUpdate} />
          <Button title="Open the release page" variant="secondary" small onPress={() => openReleasePage(release)} />
          {!force && <Button title="Not now" variant="ghost" small onPress={remindLater} />}
        </View>
      )}
    </Sheet>
  );
}

function WhatsNew() {
  const lastSeen = useStore((s) => s.updates.lastSeenVersion);
  const onboarded = useStore((s) => s.profile.onboarded);
  const setUpdates = useStore((s) => s.setUpdates);
  const pathname = usePathname();
  const current = currentVersion();
  const entry = CHANGELOG.find((c) => c.version === current);
  const [dismissed, setDismissed] = useState(false);

  // first launch after onboarding: remember the version, nothing to announce
  useEffect(() => {
    if (onboarded && lastSeen === null) setUpdates({ lastSeenVersion: current });
  }, [onboarded, lastSeen, current, setUpdates]);

  const open = !dismissed && onboarded && lastSeen !== null && lastSeen !== current && !!entry && SAFE.test(pathname);

  const close = () => {
    setDismissed(true);
    setUpdates({ lastSeenVersion: current });
  };
  if (!entry) return null;
  return (
    <Sheet visible={open} onClose={close}>
      <View style={{ gap: 6, marginBottom: 12 }}>
        <T v="caption" c="primary">
          Updated to {entry.version}
        </T>
        <T v="title">What’s new</T>
      </View>
      <ScrollView style={{ maxHeight: 300 }} showsVerticalScrollIndicator={false}>
        <View style={{ gap: 10 }}>
          {entry.notes.map((n, i) => (
            <View key={i} style={{ flexDirection: 'row', gap: 10 }}>
              <Ionicons name="checkmark-circle" size={18} color="#3DD68C" style={{ marginTop: 2 }} />
              <T v="body" style={{ flex: 1 }}>
                {n}
              </T>
            </View>
          ))}
        </View>
      </ScrollView>
      <View style={{ marginTop: 16 }}>
        <Button title="Got it" onPress={close} />
      </View>
    </Sheet>
  );
}

/** Mounted once at the root: runs update checks and owns the update prompts. */
export function UpdateHost() {
  const hydratedOnce = useRef(false);
  const onboarded = useStore((s) => s.profile.onboarded);

  useEffect(() => {
    if (hydratedOnce.current) return;
    hydratedOnce.current = true;
    (async () => {
      await restoreBackupIfNeeded();
      await cleanOldApks();
    })();
  }, []);

  useEffect(() => {
    if (Platform.OS === 'web' || !onboarded) return;
    // let the first screen settle before talking to the network
    const first = setTimeout(() => runUpdateCheck(false), 3500);
    const sub = AppState.addEventListener('change', (s) => {
      if (s === 'active') runUpdateCheck(false);
    });
    return () => {
      clearTimeout(first);
      sub.remove();
    };
  }, [onboarded]);

  return (
    <>
      <UpdateSheet />
      <WhatsNew />
    </>
  );
}
