import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  Easing,
  FadeIn,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { StatusBar } from 'expo-status-bar';
import { T } from '@/components/AppText';
import { useStore } from '@/store';
import { FONT } from '@/theme/ThemeProvider';

const BRAND = ['#0E0B1F', '#1B1244', '#2A1B63'] as const;
const DOT = 22;

function Dot({ x, y, delay, color }: { x: number; y: number; delay: number; color: string }) {
  const s = useSharedValue(0);
  useEffect(() => {
    s.value = withDelay(delay, withSpring(1, { damping: 9, stiffness: 140 }));
  }, [delay, s]);
  const style = useAnimatedStyle(() => ({
    opacity: s.value,
    transform: [{ translateY: (1 - s.value) * -40 }, { scale: s.value }],
  }));
  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          left: x - DOT / 2,
          top: y - DOT / 2,
          width: DOT,
          height: DOT,
          borderRadius: DOT / 2,
          backgroundColor: color,
          boxShadow: `0px 0px 22px ${color}`,
        },
        style,
      ]}
    />
  );
}

export default function Splash() {
  const ring = useSharedValue(0);
  const pulse = useSharedValue(0);

  useEffect(() => {
    ring.value = withDelay(900, withTiming(1, { duration: 900, easing: Easing.out(Easing.cubic) }));
    pulse.value = withDelay(
      1100,
      withRepeat(withSequence(withTiming(1, { duration: 700 }), withTiming(0, { duration: 700 })), -1)
    );
    const go = setTimeout(() => {
      const { profile } = useStore.getState();
      router.replace(profile.onboarded ? '/learn' : '/onboarding');
    }, 3100);
    return () => clearTimeout(go);
  }, [ring, pulse]);

  const ringStyle = useAnimatedStyle(() => ({
    opacity: ring.value * 0.9,
    transform: [{ scale: 0.6 + ring.value * 0.4 + pulse.value * 0.04 }],
  }));

  return (
    <View style={styles.root}>
      <StatusBar style="light" />
      <LinearGradient colors={BRAND} style={StyleSheet.absoluteFill} start={{ x: 0.2, y: 0 }} end={{ x: 0.8, y: 1 }} />
      <View style={styles.center}>
        <View style={styles.mark}>
          <Animated.View style={[styles.ring, ringStyle]} />
          <Dot x={80} y={44} delay={150} color="#FFC857" />
          <Dot x={44} y={106} delay={450} color="#7C83FF" />
          <Dot x={116} y={106} delay={750} color="#7C83FF" />
        </View>

        <Animated.View entering={FadeInUp.delay(1500).duration(600)}>
          <T v="display" style={{ color: '#FFFFFF', fontSize: 44, lineHeight: 52, letterSpacing: 1 }}>
            Logica
          </T>
        </Animated.View>
        <Animated.View entering={FadeInUp.delay(1850).duration(600)}>
          <T v="body" style={{ color: 'rgba(255,255,255,0.7)', marginTop: 6 }} center>
            Learn to think in proofs
          </T>
        </Animated.View>
      </View>

      <Animated.View entering={FadeIn.delay(2300).duration(700)} style={styles.footer}>
        <T v="caption" style={{ color: 'rgba(255,255,255,0.45)' }} center>
          Developed by
        </T>
        <T v="bodyB" style={{ color: 'rgba(255,255,255,0.85)', fontFamily: FONT.heavy }} center>
          Tech Bytes Design
        </T>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: BRAND[0] },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  mark: { width: 160, height: 150, marginBottom: 18, alignItems: 'center', justifyContent: 'center' },
  ring: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 2,
    borderColor: 'rgba(124,131,255,0.55)',
  },
  footer: { alignItems: 'center', paddingBottom: 46, gap: 2 },
});
