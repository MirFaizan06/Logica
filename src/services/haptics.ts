import { Platform } from 'react-native';
import * as Haptics from 'expo-haptics';
import { useStore } from '@/store';

const enabled = () => Platform.OS !== 'web' && useStore.getState().settings.haptics;

const safe = (fn: () => Promise<void>) => {
  if (!enabled()) return;
  fn().catch(() => {});
};

export const haptic = {
  tap: () => safe(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)),
  press: () => safe(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)),
  select: () => safe(() => Haptics.selectionAsync()),
  success: () => safe(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)),
  error: () => safe(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)),
  warn: () => safe(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning)),
};
