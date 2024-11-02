import { Image } from 'expo-image';
import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import { PaletteDark } from '../colors';
import { Spacing } from '../tokens';
import Typography from './Typography';

const panGestureHandlerProps = { activeOffsetX: [-10, 10] };

const CarouselView = ({
  resolutions,
  captions,
  width,
}: {
  resolutions: {
    y: number;
    x: number;
    u: string;
  }[];
  captions: null | (string | null)[];
  width: number;
}) => {
  const [pageIndex, setPageIndex] = React.useState(0);

  const tallestResolution = useMemo(() => {
    if (resolutions.length == 0) return null;

    let index = 0;
    let maxIndex = 0;
    let max = resolutions[0].y;
    for (const res of resolutions) {
      if (res.y > max) {
        max = res.y;
        maxIndex = index;
      }
      index += 1;
    }
    return resolutions[maxIndex];
  }, [resolutions]);

  const renderItem = React.useCallback(({ index }: { index: number }) => {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: PaletteDark.scrim,
        }}>
        <Image
          style={{
            width: width,
            height: (width * tallestResolution!.y) / tallestResolution!.x,
          }}
          source={resolutions[index].u.replaceAll('&amp;', '&')}
          contentFit="cover"
          priority={index > 0 ? 'low' : 'normal'}
        />
        {!!captions && !!captions[index] && (
          <View
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: PaletteDark.surfaceContainer,
              paddingHorizontal: Spacing.s8,
              paddingVertical: Spacing.s4,
            }}>
            <Typography variant="labelMedium">{captions[index]}</Typography>
          </View>
        )}
      </View>
    );
  }, []);

  if (resolutions.length === 0) {
    return null;
  }

  return (
    <View>
      <Carousel
        style={{ borderRadius: 12 }}
        width={width}
        height={(width * tallestResolution!.y) / tallestResolution!.x}
        autoPlay={false}
        data={resolutions}
        onSnapToItem={setPageIndex}
        panGestureHandlerProps={panGestureHandlerProps}
        renderItem={renderItem}
        windowSize={2}
        autoFillData={false}
      />
      <View style={styles.pageIndexContainer}>
        <View style={styles.pageIndexBackground} />
        <Typography variant="labelMedium" style={styles.pageIndexTextColor}>
          {pageIndex + 1}
        </Typography>
        <Typography variant="labelMedium" style={styles.pageIndexTextColor}>
          /{resolutions.length}
        </Typography>
      </View>
    </View>
  );
};

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

export default CarouselView;
