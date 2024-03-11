import { Stack } from 'expo-router';
import * as React from 'react';
import { View } from 'react-native';
import { Palette } from '../../colors';
import AppThemeView from './AppThemeView';

export default function Page() {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: Palette.surface,
      }}>
      <Stack.Screen options={{ title: '' }} />
      <AppThemeView />
    </View>
  );
}
