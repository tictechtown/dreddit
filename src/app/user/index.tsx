import { Stack, useLocalSearchParams } from 'expo-router';
import * as React from 'react';
import { View } from 'react-native';
import useTheme from '../../services/theme/useTheme';
import UserPage from './UserPage';

export default function Page() {
  const theme = useTheme();
  const { userid, username } = useLocalSearchParams();
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.surface,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Stack.Screen options={{ title: username as string }} />
      <UserPage userId={userid as string} />
    </View>
  );
}
