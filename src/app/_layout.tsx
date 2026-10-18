import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';
import {
  PlusJakartaSans_400Regular,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
  PlusJakartaSans_800ExtraBold,
} from '@expo-google-fonts/plus-jakarta-sans';
import { ThemeProvider, useTheme } from '@/theme/ThemeProvider';
import { useHydrated, useStore } from '@/store';
import { UpdateHost } from '@/components/UpdateHost';
import { ToastHost } from '@/components/Toast';
import { applyReminder } from '@/services/notifications';

SplashScreen.preventAutoHideAsync().catch(() => {});

function Shell() {
  const t = useTheme();

  // Scheduled reminders can be lost when the app is replaced by an update, so set it again on launch.
  useEffect(() => {
    const r = useStore.getState().settings.reminder;
    if (r.enabled) applyReminder(true, r.hour, r.minute).catch(() => {});
  }, []);

  return (
    <>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: t.bg },
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="index" options={{ animation: 'fade' }} />
        <Stack.Screen name="onboarding" options={{ animation: 'fade', gestureEnabled: false }} />
        <Stack.Screen name="(tabs)" options={{ animation: 'fade', gestureEnabled: false }} />
        <Stack.Screen name="session" options={{ animation: 'slide_from_bottom', gestureEnabled: false }} />
        <Stack.Screen name="results" options={{ animation: 'fade', gestureEnabled: false }} />
        <Stack.Screen name="certificate" options={{ animation: 'slide_from_bottom' }} />
      </Stack>
      <UpdateHost />
      <ToastHost />
    </>
  );
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    PlusJakartaSans_400Regular,
    PlusJakartaSans_500Medium,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold,
    PlusJakartaSans_800ExtraBold,
  });
  const hydrated = useHydrated();
  const ready = fontsLoaded && hydrated;

  useEffect(() => {
    if (ready) SplashScreen.hideAsync().catch(() => {});
  }, [ready]);

  if (!ready) return null;

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <Shell />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
