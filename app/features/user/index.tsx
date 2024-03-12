import { Stack, useLocalSearchParams } from 'expo-router';
import * as React from 'react';
import { View } from 'react-native';
import useTheme from '../../services/theme/useTheme';
import UserView from './UserView';

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
      <UserView userId={userid as string} />
    </View>
  );
}
