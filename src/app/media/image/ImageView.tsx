import Constants from 'expo-constants';
import React from 'react';
import { Text, View } from 'react-native';
import { WebView } from 'react-native-webview';
import { PaletteDark } from '../../../features/colors';
import Icons from '../../../features/components/Icons';
import { Spacing } from '../../../features/tokens';

export default function ImageView({ uri, progress }: { uri: string; progress: any }) {
  const _uri = (uri as string).replaceAll('&amp;', '&');
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const onLoadStart = React.useCallback(() => {
    if (progress) {
      progress.value = 0.2;
    }
  }, [progress]);

  const onLoadEnd = React.useCallback(() => {
    if (progress) {
      progress.value = 1;
    }
  }, [progress]);

  const onProgress = React.useCallback(
    ({ nativeEvent: { progress: nativeProgress } }: { nativeEvent: { progress: number } }) => {
      if (progress) {
        progress.value = 0.2 + nativeProgress * 0.8;
        console.log('value', progress.value);
      }
    },
    [progress]
  );

  const onError = React.useCallback(() => {
    setErrorMessage(`Error loading url: ${_uri}`);
    progress.value = 0;
  }, [_uri]);

  return (
    <View style={{ flex: 1, backgroundColor: PaletteDark.scrim }}>
      {Constants.appOwnership === 'expo' && !!errorMessage && (
        <View
          style={{
            backgroundColor: PaletteDark.scrim,
            width: '100%',
            height: '100%',
          }}>
          <View
            style={{
              flex: 0,
              position: 'absolute',
              bottom: 20,
              left: 0,
              right: 0,
              paddingHorizontal: 20,
              paddingVertical: 10,
              backgroundColor: PaletteDark.errorContainer,
              borderRadius: 10,
              flexDirection: 'row',
              flexWrap: 'wrap',
            }}>
            <Icons name="error" size={36} color={PaletteDark.onErrorContainer} />
            <Text
              numberOfLines={2}
              style={{ flex: 0, color: PaletteDark.onErrorContainer, marginLeft: Spacing.s16 }}>
              {errorMessage}
            </Text>
          </View>
        </View>
      )}

      <WebView
        onLoadStart={onLoadStart}
        onLoadProgress={onProgress}
        onLoadEnd={onLoadEnd}
        onError={onError}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        style={{
          flex: 1,
          backgroundColor: PaletteDark.scrim,
        }}
        source={{ html: `<img width="100%" src="${_uri}"/>` }}
        javaScriptEnabled={false}
        androidLayerType="hardware"
      />
    </View>
  );
}
