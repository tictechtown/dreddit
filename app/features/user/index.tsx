import { Stack, useLocalSearchParams } from 'expo-router';
import * as React from 'react';
import { View } from 'react-native';
import { Palette } from '../colors';
import UserView from './UserView';

export default function Page() {
  const { userid, username } = useLocalSearchParams();
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: Palette.surface,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Stack.Screen options={{ title: username as string }} />
      <UserView userId={userid as string} />
    </View>
  );
}
