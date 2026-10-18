import React from 'react';
import { ScrollView, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useTheme } from '@/theme/ThemeProvider';

interface Props {
  children?: React.ReactNode;
  scroll?: boolean;
  /** extra bottom padding (e.g. for the tab bar) */
  bottom?: number;
  top?: boolean;
  padH?: number;
  contentStyle?: StyleProp<ViewStyle>;
  style?: StyleProp<ViewStyle>;
  footer?: React.ReactNode;
}

export function Screen({ children, scroll, bottom = 0, top = true, padH = 18, contentStyle, style, footer }: Props) {
  const t = useTheme();
  const insets = useSafeAreaInsets();
  const padTop = top ? insets.top + 6 : 0;
  const inner: ViewStyle = {
    paddingTop: padTop,
    paddingHorizontal: padH,
    paddingBottom: bottom + (footer ? 0 : insets.bottom + 16),
  };
  return (
    <View style={[styles.fill, { backgroundColor: t.bg }, style]}>
      <StatusBar style={t.dark ? 'light' : 'dark'} />
      <LinearGradient colors={t.bgGradient} style={StyleSheet.absoluteFill} />
      {scroll ? (
        <ScrollView
          style={styles.fill}
          contentContainerStyle={[inner, contentStyle]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {children}
        </ScrollView>
      ) : (
        <View style={[styles.fill, inner, contentStyle]}>{children}</View>
      )}
      {footer ? <View style={{ paddingHorizontal: padH, paddingBottom: insets.bottom + 12, paddingTop: 8 }}>{footer}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({ fill: { flex: 1 } });
