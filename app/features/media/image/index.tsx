import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import { Stack, useLocalSearchParams } from 'expo-router';
import { decode } from 'html-entities';
import * as React from 'react';
import { View } from 'react-native';
import { useSharedValue } from 'react-native-reanimated';
import { PaletteDark } from '../../colors';
import Icons from '../../components/Icons';
import ProgressBarView from '../../components/ProgressBarView';
import ToastView from '../../components/ToastView';
import ImageView from './ImageView';

export default function Page() {
  const { title, uri } = useLocalSearchParams();
  const progress = useSharedValue(0);
  const [displayToast, setDisplayToast] = React.useState(false);

  const filename = (uri as string).split('/').pop();

  console.log('showing', uri);

  return (
    <View style={{ flex: 1, backgroundColor: PaletteDark.scrim }}>
      <Stack.Screen
        options={{
          title: decode(title as string),
          headerStyle: {
            backgroundColor: PaletteDark.scrim,
          },
          navigationBarColor: PaletteDark.scrim,
          headerRight: () => {
            return (
              <Icons
                onPressIn={async () => {
                  const result = await FileSystem.downloadAsync(
                    uri as string,
                    `${FileSystem.documentDirectory ?? ''}${filename}`
                  );

                  // Log the download result
                  console.log(result);

                  const { status } = await MediaLibrary.requestPermissionsAsync(true);
                  if (status === 'granted') {
                    try {
                      const asset = await MediaLibrary.createAssetAsync(result.uri);
                      const album = await MediaLibrary.getAlbumAsync('Dreddit');
                      if (album == null) {
                        await MediaLibrary.createAlbumAsync('Dreddit', asset, false);
                      } else {
                        await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
                      }
                      setDisplayToast(true);
                    } catch (err) {
                      console.log('Save err: ', err);
                    }
                  } else if (status === 'denied') {
                    alert('please allow permissions to download');
                  }
                }}
                name="download"
                size={24}
                color={PaletteDark.onSurface}></Icons>
            );
          },
        }}
      />
      <ProgressBarView progress={progress} />
      <ImageView uri={uri as string} progress={progress} />
      <ToastView
        show={displayToast}
        label={'Image downloaded'}
        onClose={() => {
          setDisplayToast(false);
        }}
      />
    </View>
  );
}
