import { MaterialIcons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import React from 'react';
import { Text, View } from 'react-native';
import PhotoZoom from 'react-native-photo-zoom';
import { Palette } from '../../colors';
import ImageZoom from '../../components/react-native-image-zoom';
import { Spacing } from '../../typography';

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
    ({ nativeEvent: { loaded, total } }: { nativeEvent: { loaded: number; total: number } }) => {
      if (progress) {
        progress.value = 0.2 + (loaded / total) * 0.8;
      }
    },
    [progress]
  );

  const onError = React.useCallback(() => {
    setErrorMessage(`Error loading url: ${_uri}`);
    progress.value = 0;
  }, [_uri]);

  return (
    <View style={{ flex: 1, backgroundColor: Palette.backgroundLowest }}>
      {Constants.appOwnership === 'expo' && !!errorMessage && (
        <View
          style={{
            backgroundColor: Palette.backgroundLowest,
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
              backgroundColor: Palette.errorContainer,
              borderRadius: 10,
              flexDirection: 'row',
              flexWrap: 'wrap',
            }}>
            <MaterialIcons name="error" size={36} color={Palette.onErrorContainer} />
            <Text
              numberOfLines={2}
              style={{ flex: 0, color: Palette.onErrorContainer, marginLeft: Spacing.regular }}>
              {errorMessage}
            </Text>
          </View>
        </View>
      )}
      {Constants.appOwnership === 'expo' ? (
        <ImageZoom
          uri={_uri}
          maxScale={10}
          resizeMethod="resize"
          onLoadStart={onLoadStart}
          onProgress={onProgress}
          onError={onError}
        />
      ) : (
        <PhotoZoom
          source={{ uri: _uri }}
          style={{ width: '100%', height: '100%' }}
          maximumZoomScale={10}
          androidScaleType="fitCenter"
          // onError={onError}
          // onLoadStart={onLoadStart}
          // onLoadEnd={onLoadEnd}
          // onProgress={onProgress}
        />
      )}
    </View>
  );
}
