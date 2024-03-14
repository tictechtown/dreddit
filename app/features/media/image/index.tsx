import { MaterialIcons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams } from 'expo-router';
import { decode } from 'html-entities';
import * as React from 'react';
import { View } from 'react-native';
import { useSharedValue } from 'react-native-reanimated';
import { PaletteDark } from '../../colors';
import ProgressBarView from '../../components/ProgressBarView';
import ImageView from './ImageView';

export default function Page() {
  const { title, uri } = useLocalSearchParams();
  const progress = useSharedValue(0);

  console.log('showing', uri);

  return (
    <View style={{ flex: 1, backgroundColor: PaletteDark.scrim }}>
      <Stack.Screen
        options={{
          title: decode(title as string),
          headerStyle: {
            backgroundColor: PaletteDark.scrim,
          },
          headerRight: () => {
            return (
              <MaterialIcons
                onPress={() => {
                  // TODO - Download, using expo-file-system
                  // const downloadResumable = FileSystem.createDownloadResumable(
                  //   'http://techslides.com/demos/sample-videos/small.mp4',
                  //   FileSystem.documentDirectory + 'small.mp4',
                  //   {},
                  //   () => {}
                  // );
                  // try {
                  //   const { uri } = await downloadResumable.downloadAsync();
                  //   console.log('Finished downloading to ', uri);
                  // } catch (e) {
                  //   console.error(e);
                  // }
                }}
                name="download"
                size={24}
                color={PaletteDark.onSurface}></MaterialIcons>
            );
          },
        }}
      />
      <ProgressBarView progress={progress} />
      <ImageView uri={uri as string} progress={progress} />
    </View>
  );
}
