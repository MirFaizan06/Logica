import React, { useState } from 'react';
import { Platform, Share, StyleSheet, TextInput, View } from 'react-native';
import { router } from 'expo-router';
import * as Clipboard from 'expo-clipboard';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '@/components/Screen';
import { T } from '@/components/AppText';
import { Avatar, AVATARS } from '@/components/Avatar';
import { Button } from '@/components/Button';
import { Chip } from '@/components/Chip';
import { Group, ListRow, ToggleRow } from '@/components/ListRow';
import { Sheet } from '@/components/Sheet';
import { Tap } from '@/components/Tap';
import { Header, SectionTitle } from '@/components/ui';
import { toast } from '@/components/Toast';
import { useStore } from '@/store';
import { alpha, FONT, useTheme } from '@/theme/ThemeProvider';
import { applyReminder } from '@/services/notifications';
import { currentVersion } from '@/services/updates';
import { runUpdateCheck, useUpdateUi } from '@/store/updateUi';
import { haptic } from '@/services/haptics';

const GOALS = [20, 50, 100, 150];
const MINUTES = [0, 15, 30, 45];

function timeLabel(h: number, m: number) {
  const hh = ((h + 11) % 12) + 1;
  return `${hh}:${String(m).padStart(2, '0')} ${h < 12 ? 'AM' : 'PM'}`;
}

function ago(ts: number): string {
  if (!ts) return 'never';
  const mins = Math.round((Date.now() - ts) / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins} min ago`;
  const h = Math.round(mins / 60);
  if (h < 24) return `${h} h ago`;
  return `${Math.round(h / 24)} d ago`;
}

export default function Settings() {
  const t = useTheme();
  const profile = useStore((s) => s.profile);
  const settings = useStore((s) => s.settings);
  const updates = useStore((s) => s.updates);
  const setProfile = useStore((s) => s.setProfile);
  const setSettings = useStore((s) => s.setSettings);
  const exportData = useStore((s) => s.exportData);
  const importData = useStore((s) => s.importData);
  const resetAll = useStore((s) => s.resetAll);
  const phase = useUpdateUi((s) => s.phase);
  const lastManual = useUpdateUi((s) => s.lastManual);

  const [avatarOpen, setAvatarOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const [resetOpen, setResetOpen] = useState(false);
  const [importText, setImportText] = useState('');
  const [importErr, setImportErr] = useState('');

  const setReminder = async (enabled: boolean, hour = settings.reminder.hour, minute = settings.reminder.minute) => {
    const res = await applyReminder(enabled, hour, minute);
    if (res === 'denied') {
      toast('Notifications are blocked. Allow them in system settings.', 'notifications-off-outline');
      setSettings({ reminder: { enabled: false, hour, minute } });
      return;
    }
    if (res === 'unsupported' && enabled) {
      toast('Reminders are not available on this device.', 'alert-circle-outline');
      setSettings({ reminder: { enabled: false, hour, minute } });
      return;
    }
    setSettings({ reminder: { enabled, hour, minute } });
  };

  const doExport = async () => {
    const data = exportData();
    try {
      if (Platform.OS === 'web') {
        await Clipboard.setStringAsync(data);
        toast('Backup copied to the clipboard', 'copy-outline');
      } else {
        await Share.share({ message: data, title: 'Logica backup' });
      }
    } catch {
      await Clipboard.setStringAsync(data).catch(() => {});
      toast('Backup copied to the clipboard', 'copy-outline');
    }
  };

  const doImport = () => {
    const res = importData(importText);
    if (!res.ok) {
      setImportErr(res.error ?? 'Could not import.');
      haptic.error();
      return;
    }
    haptic.success();
    setImportOpen(false);
    setImportText('');
    setImportErr('');
    toast('Progress restored from backup', 'checkmark-circle-outline');
  };

  const checkStatus =
    phase === 'checking'
      ? 'Checking…'
      : lastManual?.status === 'uptodate'
      ? 'You are on the latest version.'
      : lastManual?.status === 'error'
      ? lastManual.message
      : `Last checked ${ago(updates.lastCheck)}`;

  return (
    <Screen scroll bottom={30}>
      <Header title="Settings" />

      <SectionTitle>Profile</SectionTitle>
      <Group>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14 }}>
          <Tap onPress={() => setAvatarOpen(true)} feedback="tap" scale={0.94}>
            <Avatar id={profile.avatar} size={54} />
            <View style={[styles.edit, { backgroundColor: t.primary, borderColor: t.card }]}>
              <Ionicons name="pencil" size={11} color={t.onPrimary} />
            </View>
          </Tap>
          <TextInput
            value={profile.name}
            onChangeText={(v) => setProfile({ name: v.slice(0, 24) })}
            placeholder="Your name"
            placeholderTextColor={alpha(t.textMuted, 0.8)}
            style={[styles.name, { color: t.text, borderColor: t.border, backgroundColor: t.card2, fontFamily: FONT.semi }]}
          />
        </View>
        <View style={{ padding: 14, paddingTop: 0, gap: 8 }}>
          <T v="caption" c="muted">
            Daily goal
          </T>
          <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
            {GOALS.map((g) => (
              <Chip key={g} label={`${g} XP`} active={profile.dailyGoalXp === g} onPress={() => setProfile({ dailyGoalXp: g })} />
            ))}
          </View>
        </View>
      </Group>

      <SectionTitle>Experience</SectionTitle>
      <Group>
        <ListRow icon="color-palette" color={t.accent} title="Themes" sub="Pick or unlock a look" onPress={() => router.push('/shop')} />
        <ToggleRow icon="phone-portrait" color={t.info} title="Haptic feedback" sub="Gentle vibration on taps and answers" value={settings.haptics} onChange={(v) => setSettings({ haptics: v })} />
        <ToggleRow icon="film" color={t.primary2} title="Reduce motion" sub="Turns off confetti and mascot animation" value={settings.reduceMotion} onChange={(v) => setSettings({ reduceMotion: v })} last />
      </Group>

      <SectionTitle>Daily reminder</SectionTitle>
      <Group>
        <ToggleRow icon="notifications" color={t.warn} title="Remind me to study" sub={settings.reminder.enabled ? `Every day at ${timeLabel(settings.reminder.hour, settings.reminder.minute)}` : 'Off'} value={settings.reminder.enabled} onChange={(v) => setReminder(v)} last={!settings.reminder.enabled} />
        {settings.reminder.enabled && (
          <View style={{ padding: 14, gap: 10 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
              <Tap feedback="tap" onPress={() => setReminder(true, (settings.reminder.hour + 23) % 24)} style={[styles.step, { borderColor: t.border }]}>
                <Ionicons name="remove" size={20} color={t.text} />
              </Tap>
              <T v="title" style={{ minWidth: 110 }} center>
                {timeLabel(settings.reminder.hour, settings.reminder.minute)}
              </T>
              <Tap feedback="tap" onPress={() => setReminder(true, (settings.reminder.hour + 1) % 24)} style={[styles.step, { borderColor: t.border }]}>
                <Ionicons name="add" size={20} color={t.text} />
              </Tap>
            </View>
            <View style={{ flexDirection: 'row', gap: 8, justifyContent: 'center' }}>
              {MINUTES.map((m) => (
                <Chip key={m} label={`:${String(m).padStart(2, '0')}`} active={settings.reminder.minute === m} onPress={() => setReminder(true, settings.reminder.hour, m)} />
              ))}
            </View>
          </View>
        )}
      </Group>

      <SectionTitle>Updates</SectionTitle>
      <Group>
        <ListRow icon="cloud-download" color={t.success} title={`Version ${currentVersion()}`} sub={checkStatus} chevron={false} right={<View style={{ width: 120 }}><Button title="Check now" small variant="secondary" loading={phase === 'checking'} onPress={() => (Platform.OS === 'web' ? toast('Updates apply to the Android app.', 'information-circle-outline') : runUpdateCheck(true))} /></View>} />
        <ToggleRow icon="refresh-circle" color={t.info} title="Check automatically" sub="Looks for new versions when you open the app" value={settings.autoUpdateCheck} onChange={(v) => setSettings({ autoUpdateCheck: v })} last />
      </Group>
      <T v="small" c="muted" style={{ marginTop: 8 }}>
        Logica works fully offline. It only uses the internet to look for updates on GitHub.
      </T>

      <SectionTitle>Your data</SectionTitle>
      <Group>
        <ListRow icon="share" color={t.primary} title="Export a backup" sub="Copy or share your progress as text" onPress={doExport} />
        <ListRow icon="download" color={t.info} title="Restore from backup" sub="Paste a backup you exported earlier" onPress={() => setImportOpen(true)} />
        <ListRow icon="trash" color={t.danger} title="Reset all progress" sub="Cannot be undone" onPress={() => setResetOpen(true)} last />
      </Group>
      <T v="small" c="muted" style={{ marginTop: 8 }}>
        There are no accounts. Everything stays on this device, so a backup is the way to move to a new phone.
      </T>

      <Sheet visible={avatarOpen} onClose={() => setAvatarOpen(false)}>
        <T v="h2" center style={{ marginBottom: 14 }}>
          Choose an avatar
        </T>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10, justifyContent: 'center', marginBottom: 6 }}>
          {AVATARS.map((a) => (
            <Tap
              key={a.id}
              feedback="select"
              scale={0.9}
              onPress={() => {
                setProfile({ avatar: a.id });
                setAvatarOpen(false);
              }}
              style={{ padding: 3, borderRadius: 40, borderWidth: 3, borderColor: profile.avatar === a.id ? t.primary : 'transparent' }}
            >
              <Avatar id={a.id} size={54} />
            </Tap>
          ))}
        </View>
      </Sheet>

      <Sheet visible={importOpen} onClose={() => setImportOpen(false)}>
        <T v="h2" center>
          Restore from backup
        </T>
        <T v="small" c="muted" center style={{ marginVertical: 10 }}>
          Paste the text you copied when you exported. This replaces the progress on this device.
        </T>
        <TextInput
          value={importText}
          onChangeText={(v) => {
            setImportText(v);
            setImportErr('');
          }}
          multiline
          placeholder='{"app":"logica", ...}'
          placeholderTextColor={alpha(t.textMuted, 0.7)}
          autoCapitalize="none"
          autoCorrect={false}
          style={[styles.import, { color: t.text, borderColor: importErr ? t.danger : t.border, backgroundColor: t.card2, fontFamily: FONT.medium }]}
        />
        {importErr ? (
          <T v="small" c="danger" style={{ marginTop: 6 }}>
            {importErr}
          </T>
        ) : null}
        <View style={{ gap: 8, marginTop: 12 }}>
          <Button title="Restore" icon="download" disabled={!importText.trim()} onPress={doImport} />
          <Button title="Cancel" variant="ghost" small onPress={() => setImportOpen(false)} />
        </View>
      </Sheet>

      <Sheet visible={resetOpen} onClose={() => setResetOpen(false)} center>
        <T v="h2" center>
          Reset everything?
        </T>
        <T v="body" c="muted" center style={{ marginVertical: 12 }}>
          Your XP, streak, achievements and lesson progress will be erased. Consider exporting a backup first.
        </T>
        <View style={{ gap: 8 }}>
          <Button
            title="Erase everything"
            variant="danger"
            onPress={() => {
              resetAll();
              setResetOpen(false);
              router.replace('/onboarding');
            }}
          />
          <Button title="Keep my progress" variant="secondary" onPress={() => setResetOpen(false)} />
        </View>
      </Sheet>
    </Screen>
  );
}

const styles = StyleSheet.create({
  name: { flex: 1, borderWidth: 1.5, borderRadius: 14, paddingHorizontal: 14, paddingVertical: 12, fontSize: 16 },
  edit: { position: 'absolute', right: -2, bottom: -2, width: 22, height: 22, borderRadius: 11, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  step: { width: 44, height: 44, borderRadius: 22, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center' },
  import: { minHeight: 120, maxHeight: 200, borderWidth: 1.5, borderRadius: 14, padding: 12, fontSize: 13, textAlignVertical: 'top' },
});
