import { Stack } from 'expo-router';
import * as React from 'react';
import { View } from 'react-native';
import useTheme from '../../../services/theme/useTheme';
import AppThemeView from './AppThemeView';

export default function Page() {
  const theme = useTheme();
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.surface,
      }}>
      <Stack.Screen options={{ title: '' }} />
      <AppThemeView />
    </View>
  );
}
