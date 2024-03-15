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
  width,
}: {
  resolutions: {
    y: number;
    x: number;
    u: string;
  }[];
  width: number;
}) => {
  const [pageIndex, setPageIndex] = React.useState(0);
  const renderItem = React.useCallback(({ index }: { index: number }) => {
    return (
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
    );
  }, []);

  if (resolutions.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
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
        <Typography variant="labelMedium">{pageIndex + 1}</Typography>
        <Typography variant="labelMedium" style={styles.pageIndexTextColor}>
          /{resolutions.length}
        </Typography>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 8,
  },
  pageIndexContainer: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: PaletteDark.surfaceContainerHigh,
    borderRadius: 10,
    paddingHorizontal: Spacing.s8,
    flexDirection: 'row',
  },
  pageIndexTextColor: {
    color: PaletteDark.onSurfaceVariant,
  },
});

export default CarouselView;
