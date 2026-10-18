import React from 'react';
import { View } from 'react-native';
import Svg, { Circle, ClipPath, Defs, G, Line, Path, Rect, Text as SvgText } from 'react-native-svg';
import { T } from './AppText';
import { alpha, FONT, useTheme } from '@/theme/ThemeProvider';
import type { Form } from '@/logic/syllogism';

/* ------------------------------------------------------------------ */
/* Two-circle mini diagrams for A, E, I, O                             */
/* ------------------------------------------------------------------ */

const R = 34;
const CY = 42;
const C1 = 38;
const C2 = 72;
const XM = (C1 + C2) / 2;
const H = Math.sqrt(R * R - ((C2 - C1) / 2) ** 2);

const LENS = `M ${XM} ${CY - H} A ${R} ${R} 0 0 1 ${XM} ${CY + H} A ${R} ${R} 0 0 1 ${XM} ${CY - H} Z`;
const S_ONLY = `M ${XM} ${CY - H} A ${R} ${R} 0 1 0 ${XM} ${CY + H} A ${R} ${R} 0 0 1 ${XM} ${CY - H} Z`;

const FORM_LABEL: Record<Form, string> = { A: 'All S are P', E: 'No S are P', I: 'Some S are P', O: 'Some S are not P' };

export function VennMini({ form }: { form: Form }) {
  const t = useTheme();
  const shade = alpha(t.textMuted, 0.55);
  return (
    <View style={{ alignItems: 'center', width: 112 }}>
      <Svg width={112} height={86} viewBox="0 0 110 86">
        {form === 'A' && <Path d={S_ONLY} fill={shade} />}
        {form === 'E' && <Path d={LENS} fill={shade} />}
        <Circle cx={C1} cy={CY} r={R} stroke={t.primary} strokeWidth={2} fill="none" />
        <Circle cx={C2} cy={CY} r={R} stroke={t.accent} strokeWidth={2} fill="none" />
        {form === 'I' && (
          <SvgText x={XM} y={CY + 6} fontSize={20} fontFamily={FONT.heavy} fill={t.text} textAnchor="middle">
            ×
          </SvgText>
        )}
        {form === 'O' && (
          <SvgText x={C1 - 12} y={CY + 6} fontSize={20} fontFamily={FONT.heavy} fill={t.text} textAnchor="middle">
            ×
          </SvgText>
        )}
        <SvgText x={C1 - 14} y={14} fontSize={11} fontFamily={FONT.bold} fill={t.primary} textAnchor="middle">
          S
        </SvgText>
        <SvgText x={C2 + 14} y={14} fontSize={11} fontFamily={FONT.bold} fill={t.accent} textAnchor="middle">
          P
        </SvgText>
      </Svg>
      <T v="small" center style={{ fontFamily: FONT.bold }}>
        {form}
      </T>
      <T v="caption" c="muted" center style={{ textTransform: 'none', letterSpacing: 0, fontSize: 11 }}>
        {FORM_LABEL[form]}
      </T>
    </View>
  );
}

/* ------------------------------------------------------------------ */
/* Three-circle diagram used by the Syllogism Lab                      */
/* ------------------------------------------------------------------ */

const W = 300;
const HT = 260;
const CIRCLES = {
  S: { x: 112, y: 98, r: 72 },
  P: { x: 188, y: 98, r: 72 },
  M: { x: 150, y: 164, r: 72 },
} as const;

/** bit order used by the syllogism engine: S=4, P=2, M=1 */
const REGION_CENTERS: Record<number, { x: number; y: number }> = {
  4: { x: 82, y: 70 }, // S only
  2: { x: 218, y: 70 }, // P only
  1: { x: 150, y: 214 }, // M only
  6: { x: 150, y: 66 }, // S & P
  5: { x: 104, y: 150 }, // S & M
  3: { x: 196, y: 150 }, // P & M
  7: { x: 150, y: 118 }, // all three
  0: { x: 30, y: 230 },
};

const ids = { S: 'cS', P: 'cP', M: 'cM', nS: 'nS', nP: 'nP', nM: 'nM' };

function circlePath(c: { x: number; y: number; r: number }) {
  return `M ${c.x - c.r} ${c.y} a ${c.r} ${c.r} 0 1 0 ${c.r * 2} 0 a ${c.r} ${c.r} 0 1 0 ${-c.r * 2} 0 Z`;
}

function RegionFill({ region, fill }: { region: number; fill: string }) {
  // nest clip paths: inside or outside each circle according to the region bits
  const needS = !!(region & 4);
  const needP = !!(region & 2);
  const needM = !!(region & 1);
  const clips = [
    needS ? ids.S : ids.nS,
    needP ? ids.P : ids.nP,
    needM ? ids.M : ids.nM,
  ];
  return (
    <G clipPath={`url(#${clips[0]})`}>
      <G clipPath={`url(#${clips[1]})`}>
        <G clipPath={`url(#${clips[2]})`}>
          <Rect x={0} y={0} width={W} height={HT} fill={fill} />
        </G>
      </G>
    </G>
  );
}

export interface Venn3Props {
  empty: Set<number>;
  /** each entry lists candidate regions; a single candidate is a firm ×, two or more straddle */
  marks: number[][];
  names: { S: string; P: string; M: string };
}

export function Venn3({ empty, marks, names }: Venn3Props) {
  const t = useTheme();
  const shade = alpha(t.textMuted, 0.6);
  const outside = (c: { x: number; y: number; r: number }) => `M 0 0 H ${W} V ${HT} H 0 Z ${circlePath(c)}`;
  return (
    <View style={{ alignItems: 'center' }}>
      <Svg width="100%" height={250} viewBox={`0 0 ${W} ${HT}`}>
        <Defs>
          <ClipPath id={ids.S}><Path d={circlePath(CIRCLES.S)} /></ClipPath>
          <ClipPath id={ids.P}><Path d={circlePath(CIRCLES.P)} /></ClipPath>
          <ClipPath id={ids.M}><Path d={circlePath(CIRCLES.M)} /></ClipPath>
          <ClipPath id={ids.nS}><Path d={outside(CIRCLES.S)} clipRule="evenodd" /></ClipPath>
          <ClipPath id={ids.nP}><Path d={outside(CIRCLES.P)} clipRule="evenodd" /></ClipPath>
          <ClipPath id={ids.nM}><Path d={outside(CIRCLES.M)} clipRule="evenodd" /></ClipPath>
        </Defs>
        {Array.from(empty).map((r) => (
          <RegionFill key={r} region={r} fill={shade} />
        ))}
        <Circle cx={CIRCLES.S.x} cy={CIRCLES.S.y} r={CIRCLES.S.r} stroke={t.primary} strokeWidth={2.5} fill={alpha(t.primary, 0.06)} />
        <Circle cx={CIRCLES.P.x} cy={CIRCLES.P.y} r={CIRCLES.P.r} stroke={t.accent} strokeWidth={2.5} fill={alpha(t.accent, 0.06)} />
        <Circle cx={CIRCLES.M.x} cy={CIRCLES.M.y} r={CIRCLES.M.r} stroke={t.success} strokeWidth={2.5} fill={alpha(t.success, 0.06)} />
        {marks.map((cands, i) => {
          const pts = cands.map((c) => REGION_CENTERS[c]);
          if (pts.length === 1) {
            return (
              <SvgText key={i} x={pts[0].x} y={pts[0].y + 7} fontSize={24} fontFamily={FONT.heavy} fill={t.text} textAnchor="middle">
                ×
              </SvgText>
            );
          }
          const a = pts[0];
          const b = pts[1];
          const mx = (a.x + b.x) / 2;
          const my = (a.y + b.y) / 2;
          return (
            <G key={i}>
              <Line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={t.text} strokeWidth={1.5} strokeDasharray="3 3" />
              <SvgText x={mx} y={my + 7} fontSize={24} fontFamily={FONT.heavy} fill={t.text} textAnchor="middle">
                ×
              </SvgText>
            </G>
          );
        })}
        <SvgText x={42} y={30} fontSize={13} fontFamily={FONT.bold} fill={t.primary} textAnchor="middle">
          {names.S}
        </SvgText>
        <SvgText x={258} y={30} fontSize={13} fontFamily={FONT.bold} fill={t.accent} textAnchor="middle">
          {names.P}
        </SvgText>
        <SvgText x={150} y={250} fontSize={13} fontFamily={FONT.bold} fill={t.success} textAnchor="middle">
          {names.M}
        </SvgText>
      </Svg>
    </View>
  );
}
