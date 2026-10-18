import React from 'react';
import { View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

export interface AvatarDef {
  id: string;
  icon: keyof typeof Ionicons.glyphMap;
  colors: [string, string];
}

export const AVATARS: AvatarDef[] = [
  { id: 'bulb', icon: 'bulb', colors: ['#FFB020', '#FF7A45'] },
  { id: 'planet', icon: 'planet', colors: ['#7C83FF', '#A855F7'] },
  { id: 'rocket', icon: 'rocket', colors: ['#FF5C8A', '#FF9F5C'] },
  { id: 'leaf', icon: 'leaf', colors: ['#34D399', '#22A06B'] },
  { id: 'flame', icon: 'flame', colors: ['#FF6B6B', '#FF9F43'] },
  { id: 'star', icon: 'star', colors: ['#FACC15', '#F59E0B'] },
  { id: 'paw', icon: 'paw', colors: ['#60A5FA', '#3B82F6'] },
  { id: 'diamond', icon: 'diamond', colors: ['#22D3EE', '#6366F1'] },
  { id: 'flash', icon: 'flash', colors: ['#A3E635', '#22C55E'] },
  { id: 'heart', icon: 'heart', colors: ['#F472B6', '#E11D48'] },
  { id: 'moon', icon: 'moon', colors: ['#818CF8', '#4338CA'] },
  { id: 'sparkles', icon: 'sparkles', colors: ['#C084FC', '#EC4899'] },
  { id: 'school', icon: 'school', colors: ['#38BDF8', '#0EA5E9'] },
  { id: 'cafe', icon: 'cafe', colors: ['#D97706', '#92400E'] },
  { id: 'game', icon: 'game-controller', colors: ['#14B8A6', '#0F766E'] },
  { id: 'ribbon', icon: 'ribbon', colors: ['#FB7185', '#F43F5E'] },
];

export function avatarById(id: string): AvatarDef {
  return AVATARS.find((a) => a.id === id) ?? AVATARS[0];
}

export function Avatar({ id, size = 56 }: { id: string; size?: number }) {
  const a = avatarById(id);
  return (
    <View style={{ width: size, height: size, borderRadius: size / 2, overflow: 'hidden' }}>
      <LinearGradient
        colors={a.colors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
      >
        <Ionicons name={a.icon} size={size * 0.5} color="#FFFFFF" />
      </LinearGradient>
    </View>
  );
}
