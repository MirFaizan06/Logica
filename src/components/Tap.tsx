import React from 'react';
import { Pressable, type PressableProps, type StyleProp, type ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { haptic } from '@/services/haptics';

const APressable = Animated.createAnimatedComponent(Pressable);

interface Props extends Omit<PressableProps, 'style'> {
  style?: StyleProp<ViewStyle>;
  scale?: number;
  feedback?: 'tap' | 'press' | 'select' | 'none';
  /** fade the control while disabled (default true) */
  dim?: boolean;
  children?: React.ReactNode;
}

/** Pressable with a springy scale-down and optional haptic. */
export function Tap({ style, scale = 0.96, feedback = 'tap', dim = true, onPress, disabled, children, ...rest }: Props) {
  const s = useSharedValue(1);
  const anim = useAnimatedStyle(() => ({ transform: [{ scale: s.value }] }));
  return (
    <APressable
      {...rest}
      disabled={disabled}
      onPressIn={(e) => {
        s.value = withSpring(scale, { damping: 18, stiffness: 420 });
        rest.onPressIn?.(e);
      }}
      onPressOut={(e) => {
        s.value = withSpring(1, { damping: 12, stiffness: 320 });
        rest.onPressOut?.(e);
      }}
      onPress={(e) => {
        if (feedback !== 'none') haptic[feedback]();
        onPress?.(e);
      }}
      style={[style, anim, disabled && dim && { opacity: 0.5 }]}
    >
      {children}
    </APressable>
  );
}
