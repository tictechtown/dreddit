import { Stack, useLocalSearchParams } from 'expo-router';
import { decode } from 'html-entities';
import * as React from 'react';
import { Image, StyleSheet, useWindowDimensions, View } from 'react-native';
import base64 from 'react-native-base64';
import { Gallery, GalleryType, getAspectRatioSize } from 'react-native-zoom-toolkit';
import { Post } from '../../../services/api';
import { PaletteDark } from '../../colors';
import Typography from '../../components/Typography';
import { Spacing } from '../../tokens';

interface GalleryImageProps {
  uri: string;
  index: number;
}

const GalleryImage: React.FC<GalleryImageProps> = ({ uri }) => {
  const { width, height } = useWindowDimensions();
  const [resolution, setResolution] = React.useState<{
    width: number;
    height: number;
  }>({
    width: 1,
    height: 1,
  });

  const size = getAspectRatioSize({
    aspectRatio: resolution.width / resolution.height,
    width: height > width ? width : undefined,
    height: height > width ? undefined : height,
  });

  return (
    <Image
      source={{ uri }}
      style={size}
      resizeMethod={'scale'}
      resizeMode={'cover'}
      onLoad={(e) => {
        setResolution({
          width: e.nativeEvent.source.width,
          height: e.nativeEvent.source.height,
        });
      }}
    />
  );
};

const CarouselTab = ({
  pages,
  captions,
}: {
  captions: (string | null)[] | null;
  pages:
    | {
        y: number;
        x: number;
        u: string;
        gif?: string;
      }[]
    | null;
}) => {
  const ref = React.useRef<GalleryType>(null);

  const [pageIndex, setPageIndex] = React.useState(0);

  const keyExtractor = React.useCallback((item: string, index: number) => {
    return `${item}-${index}`;
  }, []);
  const renderItem = React.useCallback((item: string, index: number) => {
    return <GalleryImage uri={item} index={index} />;
  }, []);

  const data = pages?.map((p) => p.gif ?? p.u.replaceAll('&amp;', '&')) ?? [];
  const onTap = React.useCallback((_, index: number) => {
    console.log(`Tapped on index ${index}`);
  }, []);

  return (
    <>
      <Gallery
        ref={ref}
        data={data}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        onTap={onTap}
        onIndexChange={(index) => setPageIndex(index)}
      />

      <View style={styles.pageIndexContainer}>
        <View style={styles.pageIndexBackground} />
        <Typography variant="labelMedium" style={styles.pageIndexTextColor}>
          {pageIndex + 1}
        </Typography>
        <Typography variant="labelMedium" style={styles.pageIndexTextColor}>
          /{(pages ?? []).length}
        </Typography>
      </View>
    </>
  );
};

export default function Page() {
  const { title, gallery_data, media_metadata } = useLocalSearchParams();
  const { resolutions, captions } = React.useMemo(() => {
    if (!gallery_data || !media_metadata) return { resolutions: null, captions: null };
    const metadata: Post['data']['media_metadata'] = JSON.parse(
      base64.decode(media_metadata as string)
    );
    const galleryData: Post['data']['gallery_data'] = JSON.parse(
      base64.decode(gallery_data as string)
    );
    const mediaIds = galleryData?.items.map((it) => it.media_id);
    // @ts-ignore
    const galeryWithAllResolutions = (mediaIds ?? []).map((mediaId) => metadata[mediaId].s);
    return {
      resolutions: galeryWithAllResolutions,
      captions: (galleryData?.items ?? []).map((dt) => dt.caption ?? null),
    };
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
      <CarouselTab pages={resolutions} captions={captions} />
    </View>
  );
}

const styles = StyleSheet.create({
  pageIndexContainer: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    borderRadius: Spacing.s8,
    paddingHorizontal: Spacing.s8,
    paddingVertical: 2,
    flexDirection: 'row',
  },
  pageIndexBackground: {
    backgroundColor: PaletteDark.surfaceContainerHigh,
    opacity: 0.6,
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    borderRadius: Spacing.s8,
  },
  pageIndexTextColor: {
    color: PaletteDark.onSurfaceVariant,
  },
});
