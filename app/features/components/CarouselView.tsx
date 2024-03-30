import { Image } from 'expo-image';
import React from 'react';
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
  const renderItem = React.useCallback(({ index }: { index: number }) => {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: PaletteDark.scrim,
          borderRadius: 12,
        }}>
        <Image
          style={{
            borderRadius: 12,
            width: width,
            height: (width * resolutions[0].y) / resolutions[0].x,
          }}
          source={resolutions[index].u.replaceAll('&amp;', '&')}
          contentFit="contain"
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
        width={width}
        height={(width * resolutions[0].y) / resolutions[0].x}
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
        <Typography variant="labelMedium">{pageIndex + 1}</Typography>
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
