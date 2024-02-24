import { Stack, useLocalSearchParams } from 'expo-router';
import { decode } from 'html-entities';
import * as React from 'react';
import { View } from 'react-native';
import { useSharedValue } from 'react-native-reanimated';
import { Palette } from '../../colors';
import ProgressBarView from '../../components/ProgressBarView';
import ImageView from './ImageView';

export default function Page() {
  const { title, uri } = useLocalSearchParams();
  const progress = useSharedValue(0);

  console.log('showing', uri);

  return (
    <View style={{ flex: 1, backgroundColor: Palette.backgroundLowest }}>
      <Stack.Screen
        options={{
          title: decode(title as string),
        }}
      />
      <ProgressBarView progress={progress} />
      <ImageView uri={uri as string} progress={progress} />
    </View>
  );
}
