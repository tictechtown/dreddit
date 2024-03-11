import { Stack } from 'expo-router';
import * as React from 'react';
import { View } from 'react-native';
import { Palette } from '../colors';
import SettingsView from './SettingsView';

export default function Page() {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: Palette.surface,
      }}>
      <Stack.Screen options={{ title: '' }} />
      <SettingsView />
    </View>
  );
}
