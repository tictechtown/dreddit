import { Image } from 'expo-image';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import { Palette } from '../colors';
import { Spacing } from '../typography';

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
        <Text style={styles.pageIndexTextColor}>
          {pageIndex + 1}/{resolutions.length}
        </Text>
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
    backgroundColor: Palette.surfaceVariant,
    borderRadius: 10,
    paddingHorizontal: Spacing.small,
    opacity: 0.6,
  },
  pageIndexTextColor: {
    color: Palette.onBackgroundLowest,
  },
});

export default CarouselView;
