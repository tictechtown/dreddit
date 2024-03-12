import { Image } from 'expo-image';
import { Stack, useLocalSearchParams } from 'expo-router';
import { decode } from 'html-entities';
import * as React from 'react';
import { FlatList, TouchableOpacity, View } from 'react-native';
import base64 from 'react-native-base64';
import { Post } from '../../../services/api';
import { PaletteDark } from '../../colors';
import { Spacing } from '../../typography';
import ImageView from '../image/ImageView';

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
            backgroundColor: PaletteDark.surfaceVariant,
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
    <View style={{ flex: 1, backgroundColor: PaletteDark.scrim }}>
      <Stack.Screen
        options={{
          title: decode(title as string),
          headerStyle: {
            backgroundColor: PaletteDark.scrim,
          },
        }}
      />
      <CarouselView pages={resolutions} />
    </View>
  );
}
