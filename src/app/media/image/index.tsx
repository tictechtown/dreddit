import { Directory, File, Paths } from 'expo-file-system';
import { Stack, useLocalSearchParams } from 'expo-router';
import { decode } from 'html-entities';
import * as React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { useSharedValue } from 'react-native-reanimated';
import { PaletteDark } from '@theme/colors';
import Icons from '@components/Icons';
import ProgressBarView from '@components/ProgressBarView';
import ToastView from '@components/ToastView';
import ImageView from './ImageView';
import * as Haptics from 'expo-haptics';

export default function Page() {
  const { title, uri } = useLocalSearchParams();
  const progress = useSharedValue(0);
  const [displayToast, setDisplayToast] = React.useState(false);

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
              <TouchableOpacity
                onPressIn={async () => {
                  const destination = new Directory(Paths.document, 'downloads');
                  try {
                    destination.create({ idempotent: true });
                    const output = await File.downloadFileAsync(uri as string, destination);
                    console.log(output.exists); // true
                    console.log(output.uri); // path to the downloaded file, e.g., '${cacheDirectory}/pdfs/sample.pdf'
                    setDisplayToast(true);
                    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                  } catch (error) {
                    console.error(error);
                    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
                  }
                }}
                hitSlop={20}>
                <Icons name="download" size={24} color={PaletteDark.onSurface}></Icons>
              </TouchableOpacity>
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
