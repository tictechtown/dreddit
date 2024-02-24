import Constants from 'expo-constants';
import { Image } from 'expo-image';
import { Stack, useLocalSearchParams } from 'expo-router';
import { decode } from 'html-entities';
import * as React from 'react';
import { FlatList, TouchableOpacity, View, useWindowDimensions } from 'react-native';
import base64 from 'react-native-base64';
import PhotoZoom from 'react-native-photo-zoom';
import { useSharedValue } from 'react-native-reanimated';
import { Post } from '../../../services/api';
import { Palette } from '../../colors';
import ImageZoom from '../../components/react-native-image-zoom';
import { Spacing } from '../../typography';
import ImageView from '../image/ImageView';

// TODO - Pinch to Zoom

const ZoomableImage = ({ uri, width, height }: { uri: string; width: number; height: number }) => {
  console.log('uri', uri);
  return Constants.appOwnership === 'expo' ? (
    <ImageZoom uri={uri} maxScale={10} resizeMethod="resize" fadeDuration={0} />
  ) : (
    <PhotoZoom
      source={{ uri }}
      style={{
        width: width,
        height: height,
      }}
      fadeDuration={0}
      maximumZoomScale={10}
      androidScaleType="fitCenter"
      // onLoadStart={onLoadStart}
      // onProgress={onProgress}
    />
  );
};

const CarouselView = ({
  pages,
}: {
  pages:
    | {
        y: number;
        x: number;
        u: string;
        gif?: string;
      }[]
    | null;
}) => {
  const [pageIndex, setPageIndex] = React.useState(0);
  const { width } = useWindowDimensions();
  const animatedValue = useSharedValue(0);

  if (!pages) {
    return <></>;
  }
  const uri = (pages[pageIndex].gif ?? pages[pageIndex].u).replaceAll('&amp;', '&');

  const renderThumbItem = React.useCallback(
    ({
      index,
      item,
    }: {
      index: number;
      item: { y: number; x: number; u: string; gif?: string };
    }) => {
      return (
        <TouchableOpacity
          onPress={() => {
            setPageIndex(index);
          }}>
          <Image
            style={{
              height: 60,
              width: 60,
              marginTop: 5,
              marginHorizontal: 5,
              aspectRatio: 1,
              borderRadius: 10,
              borderWidth: 2,
              borderColor: index === pageIndex ? 'yellow' : 'transparent',
            }}
            source={item.gif ?? item.u.replaceAll('&amp;', '&')}
            contentFit="cover"
            priority={index > 0 ? 'low' : 'normal'}
          />
        </TouchableOpacity>
      );
    },
    [pageIndex, setPageIndex]
  );

  return (
    <>
      <View
        style={[
          {
            height: 70,
            backgroundColor: Palette.surfaceVariant,
            paddingHorizontal: Spacing.small,
          },
        ]}>
        <FlatList horizontal renderItem={renderThumbItem} data={pages} />
      </View>
      <View style={{ flex: 1 }}>
        <ImageView uri={uri} progress={null} />
      </View>
    </>
  );
};

/**
 * TODO
 * We replace the CarouselView with just a static image and a small horizontal list at the bottom,
 * because CarouselView was intercepting gestures from the ImageView.
 * It should have worked as follow:
 *  - if user is zooming/double tapping -> don't intercept events
 *  - if user has zoomed -> don't intercept events
 *  - only intercept swipe events if the scale = 1
 * Waiting for a fix, so we change the layout instead
 */
export default function Page() {
  const { title, gallery_data, media_metadata } = useLocalSearchParams();
  const resolutions = React.useMemo(() => {
    if (!gallery_data || !media_metadata) return null;
    const metadata: Post['data']['media_metadata'] = JSON.parse(
      base64.decode(media_metadata as string)
    );
    const galleryData: Post['data']['gallery_data'] = JSON.parse(
      base64.decode(gallery_data as string)
    );
    const mediaIds = galleryData?.items.map((it) => it.media_id);
    // @ts-ignore
    const galeryWithAllResolutions = (mediaIds ?? []).map((mediaId) => metadata[mediaId].s);
    return galeryWithAllResolutions;
  }, [gallery_data]);

  return (
    <View style={{ flex: 1, backgroundColor: Palette.backgroundLowest }}>
      <Stack.Screen
        options={{
          title: decode(title as string),
        }}
      />
      <CarouselView pages={resolutions} />
    </View>
  );
}
