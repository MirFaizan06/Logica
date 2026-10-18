import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';

const CHANNEL_ID = 'daily-reminder';
const REMINDER_ID = 'logica-daily-reminder';

const MESSAGES = [
  'Five minutes of logic keeps the streak alive.',
  'One lesson today? Your streak will thank you.',
  'A quick truth table is waiting for you.',
  'Time to sharpen your reasoning.',
  'Today’s daily challenge is ready.',
];

let handlerSet = false;
function ensureHandler() {
  if (handlerSet) return;
  handlerSet = true;
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });
}

export type ReminderResult = 'scheduled' | 'cancelled' | 'denied' | 'unsupported';

/** Schedule (or cancel) the daily study reminder. Local only, so it works offline. */
export async function applyReminder(enabled: boolean, hour: number, minute: number): Promise<ReminderResult> {
  if (Platform.OS === 'web') return 'unsupported';
  try {
    ensureHandler();
    await Notifications.cancelScheduledNotificationAsync(REMINDER_ID).catch(() => {});
    if (!enabled) return 'cancelled';

    let perm = await Notifications.getPermissionsAsync();
    if (!perm.granted) perm = await Notifications.requestPermissionsAsync();
    if (!perm.granted) return 'denied';

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync(CHANNEL_ID, {
        name: 'Daily reminder',
        // eslint-disable-next-line import/namespace
        importance: Notifications.AndroidImportance.DEFAULT,
      });
    }

    await Notifications.scheduleNotificationAsync({
      identifier: REMINDER_ID,
      content: {
        title: 'Logica',
        body: MESSAGES[Math.floor(Math.random() * MESSAGES.length)],
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour,
        minute,
        channelId: Platform.OS === 'android' ? CHANNEL_ID : undefined,
      },
    });
    return 'scheduled';
  } catch {
    return 'unsupported';
  }
}
