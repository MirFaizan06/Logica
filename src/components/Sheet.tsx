import React from 'react';
import { Modal, Pressable, StyleSheet, View } from 'react-native';
import Animated, { FadeIn, FadeOut, SlideInDown, SlideOutDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/theme/ThemeProvider';

interface Props {
  visible: boolean;
  onClose?: () => void;
  /** when false the sheet can only be closed by buttons inside it */
  dismissable?: boolean;
  children: React.ReactNode;
  center?: boolean;
}

/** Animated bottom sheet (or centered dialog) on top of everything. */
export function Sheet({ visible, onClose, dismissable = true, children, center }: Props) {
  const t = useTheme();
  const insets = useSafeAreaInsets();
  return (
    <Modal visible={visible} transparent animationType="none" statusBarTranslucent onRequestClose={dismissable ? onClose : undefined}>
      <View style={styles.root}>
        <Animated.View entering={FadeIn.duration(200)} exiting={FadeOut.duration(180)} style={[StyleSheet.absoluteFill, { backgroundColor: t.overlay }]}>
          <Pressable style={StyleSheet.absoluteFill} onPress={dismissable ? onClose : undefined} />
        </Animated.View>
        <View style={[styles.holder, center ? styles.center : styles.bottom]} pointerEvents="box-none">
          <Animated.View
            entering={center ? FadeIn.duration(220) : SlideInDown.springify().damping(20).stiffness(190)}
            exiting={center ? FadeOut.duration(150) : SlideOutDown.duration(220)}
            style={[
              {
                backgroundColor: t.card,
                borderColor: t.border,
                borderWidth: 1,
                padding: 20,
                paddingBottom: 20 + (center ? 0 : insets.bottom),
                maxHeight: '88%',
                width: '100%',
                maxWidth: 560,
              },
              center
                ? { borderRadius: t.radius + 6, marginHorizontal: 20, width: undefined, alignSelf: 'stretch' }
                : { borderTopLeftRadius: t.radius + 8, borderTopRightRadius: t.radius + 8 },
            ]}
          >
            {!center && <View style={[styles.grabber, { backgroundColor: t.border }]} />}
            {children}
          </Animated.View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  holder: { flex: 1 },
  bottom: { justifyContent: 'flex-end', alignItems: 'center' },
  center: { justifyContent: 'center', alignItems: 'center' },
  grabber: { alignSelf: 'center', width: 44, height: 5, borderRadius: 3, marginBottom: 14 },
});
