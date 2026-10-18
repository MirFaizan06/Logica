import React from 'react';
import { View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Circle, Defs, Ellipse, LinearGradient as SvgGradient, Path, Stop } from 'react-native-svg';
import { useTheme } from '@/theme/ThemeProvider';
import { useStore } from '@/store';

export type Mood = 'happy' | 'cheer' | 'think' | 'sad' | 'wow';

const AEllipse = Animated.createAnimatedComponent(Ellipse);

/** "Syl" — the friendly ∴ mascot. */
export function Mascot({ size = 120, mood = 'happy', float = true }: { size?: number; mood?: Mood; float?: boolean }) {
  const t = useTheme();
  const reduce = useStore((s) => s.settings.reduceMotion);
  const blink = useSharedValue(1);
  const bob = useSharedValue(0);

  React.useEffect(() => {
    if (reduce) return;
    blink.value = withRepeat(
      withSequence(withDelay(2600, withTiming(0.1, { duration: 90 })), withTiming(1, { duration: 130 })),
      -1
    );
    if (float) {
      bob.value = withRepeat(
        withSequence(
          withTiming(-7, { duration: 1500, easing: Easing.inOut(Easing.quad) }),
          withTiming(0, { duration: 1500, easing: Easing.inOut(Easing.quad) })
        ),
        -1
      );
    }
  }, [reduce, float, blink, bob]);

  const eyeProps = useAnimatedProps(() => ({ ry: 8 * blink.value }));
  const wrap = useAnimatedStyle(() => ({ transform: [{ translateY: bob.value }] }));

  const dark = t.dark ? '#120D2A' : '#241B4B';
  const lookUp = mood === 'think';
  const eyeY = lookUp ? 63 : 66;
  const arms = mood === 'cheer' || mood === 'wow' ? 52 : 80;

  let mouth: React.ReactNode;
  switch (mood) {
    case 'cheer':
      mouth = (
        <>
          <Path d="M47 79 Q60 103 73 79 Z" fill={dark} />
          <Ellipse cx={60} cy={90} rx={6} ry={3.2} fill={t.accent} opacity={0.9} />
        </>
      );
      break;
    case 'think':
      mouth = <Path d="M52 87 Q60 83 68 86" stroke={dark} strokeWidth={3.5} strokeLinecap="round" fill="none" />;
      break;
    case 'sad':
      mouth = <Path d="M51 91 Q60 81 69 91" stroke={dark} strokeWidth={3.5} strokeLinecap="round" fill="none" />;
      break;
    case 'wow':
      mouth = <Ellipse cx={60} cy={87} rx={5} ry={6} fill={dark} />;
      break;
    default:
      mouth = <Path d="M49 82 Q60 96 71 82" stroke={dark} strokeWidth={3.5} strokeLinecap="round" fill="none" />;
  }

  return (
    <Animated.View style={[{ width: size, height: size * 1.02 }, wrap]}>
      <Svg width={size} height={size * 1.02} viewBox="0 0 120 122">
        <Defs>
          <SvgGradient id="mb" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor={t.primary} />
            <Stop offset="1" stopColor={t.primary2} />
          </SvgGradient>
        </Defs>
        <Ellipse cx={60} cy={116} rx={30} ry={4.5} fill={t.shadow} opacity={t.dark ? 0.35 : 0.15} />
        {/* arms */}
        <Circle cx={13} cy={arms} r={10} fill="url(#mb)" />
        <Circle cx={107} cy={arms} r={10} fill="url(#mb)" />
        {/* ∴ antenna */}
        <Circle cx={60} cy={8} r={5} fill={t.accent} />
        <Circle cx={51} cy={21} r={5} fill={t.accent2} />
        <Circle cx={69} cy={21} r={5} fill={t.accent2} />
        {/* body */}
        <Ellipse cx={60} cy={70} rx={46} ry={43} fill="url(#mb)" />
        <Ellipse cx={40} cy={44} rx={14} ry={8} fill="#fff" opacity={0.22} transform="rotate(-25 40 44)" />
        {/* face plate */}
        <Ellipse cx={60} cy={73} rx={35} ry={29} fill="#fff" opacity={t.dark ? 0.94 : 0.96} />
        {/* eyes */}
        <AEllipse cx={45} cy={eyeY} rx={6.2} fill={dark} animatedProps={eyeProps} />
        <AEllipse cx={75} cy={eyeY} rx={6.2} fill={dark} animatedProps={eyeProps} />
        <Circle cx={47} cy={eyeY - 3} r={2} fill="#fff" />
        <Circle cx={77} cy={eyeY - 3} r={2} fill="#fff" />
        {/* cheeks */}
        <Circle cx={34} cy={80} r={5.5} fill={t.accent} opacity={0.35} />
        <Circle cx={86} cy={80} r={5.5} fill={t.accent} opacity={0.35} />
        {mouth}
      </Svg>
    </Animated.View>
  );
}

/** App mark: the ∴ ("therefore") symbol in a rounded gradient tile. */
export function LogoMark({ size = 96, radius }: { size?: number; radius?: number }) {
  const t = useTheme();
  const r = radius ?? size * 0.28;
  return (
    <View style={{ width: size, height: size, borderRadius: r, overflow: 'hidden', boxShadow: `0px 8px 30px ${t.primary}66` }}>
      <Svg width={size} height={size} viewBox="0 0 100 100">
        <Defs>
          <SvgGradient id="lg" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor={t.primary} />
            <Stop offset="1" stopColor={t.primary2} />
          </SvgGradient>
        </Defs>
        <Path d="M0 0H100V100H0Z" fill="url(#lg)" />
        <Circle cx={50} cy={28} r={11} fill="#fff" />
        <Circle cx={27} cy={67} r={11} fill="#fff" opacity={0.92} />
        <Circle cx={73} cy={67} r={11} fill="#fff" opacity={0.92} />
      </Svg>
    </View>
  );
}
