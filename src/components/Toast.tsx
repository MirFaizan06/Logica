import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeInDown, FadeOutDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { create } from 'zustand';
import { Ionicons } from '@expo/vector-icons';
import { T } from './AppText';
import { alpha, useTheme } from '@/theme/ThemeProvider';

interface ToastState {
  msg: string | null;
  icon: string;
  id: number;
  show: (msg: string, icon?: string) => void;
  hide: () => void;
}

export const useToast = create<ToastState>((set) => ({
  msg: null,
  icon: 'information-circle-outline',
  id: 0,
  show: (msg, icon = 'information-circle-outline') => set((s) => ({ msg, icon, id: s.id + 1 })),
  hide: () => set({ msg: null }),
}));

export const toast = (msg: string, icon?: string) => useToast.getState().show(msg, icon);

export function ToastHost() {
  const t = useTheme();
  const insets = useSafeAreaInsets();
  const { msg, icon, id, hide } = useToast();

  useEffect(() => {
    if (!msg) return;
    const timer = setTimeout(hide, 2600);
    return () => clearTimeout(timer);
  }, [msg, id, hide]);

  if (!msg) return null;
  return (
    <View style={[styles.wrap, { bottom: insets.bottom + 100 }]} pointerEvents="none">
      <Animated.View
        key={id}
        entering={FadeInDown.springify().damping(16)}
        exiting={FadeOutDown.duration(180)}
        style={[styles.toast, { backgroundColor: t.dark ? t.card2 : t.text, borderColor: alpha(t.primary, 0.4) }]}
      >
        <Ionicons name={icon as keyof typeof Ionicons.glyphMap} size={18} color={t.dark ? t.primary : t.bg} />
        <T v="small" style={{ color: t.dark ? t.text : t.bg, fontFamily: 'PlusJakartaSans_600SemiBold', flexShrink: 1 }}>
          {msg}
        </T>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { position: 'absolute', left: 0, right: 0, alignItems: 'center', paddingHorizontal: 24 },
  toast: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 16, paddingVertical: 12, borderRadius: 16, borderWidth: 1, maxWidth: 420 },
});
