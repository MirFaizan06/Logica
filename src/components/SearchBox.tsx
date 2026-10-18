import React from 'react';
import { TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FONT, alpha, useTheme } from '@/theme/ThemeProvider';

export function SearchBox({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder: string }) {
  const t = useTheme();
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        paddingHorizontal: 14,
        borderRadius: t.radius - 8,
        borderWidth: 1.5,
        borderColor: t.border,
        backgroundColor: t.card,
      }}
    >
      <Ionicons name="search" size={18} color={t.textMuted} />
      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor={alpha(t.textMuted, 0.8)}
        autoCapitalize="none"
        autoCorrect={false}
        style={{ flex: 1, paddingVertical: 12, fontSize: 15.5, color: t.text, fontFamily: FONT.medium }}
      />
      {value ? <Ionicons name="close-circle" size={20} color={t.textMuted} onPress={() => onChange('')} /> : null}
    </View>
  );
}
