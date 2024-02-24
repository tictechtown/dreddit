import * as React from 'react';
import { StyleSheet, View, ViewStyle, useWindowDimensions } from 'react-native';
import Animated, {
  Easing,
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { Palette } from '../colors';

function IndeterminateProgressBarView() {
  const progress = useSharedValue(0);
  const dimensions = useWindowDimensions();
  const progressBarContainerStyles: ViewStyle[] = [styles.progressBarContainer];

  React.useEffect(() => {
    progress.value = withRepeat(
      withTiming(1, { duration: 1500, easing: Easing.inOut(Easing.exp) }),
      0
    );
    return () => {
      cancelAnimation(progress);
      progress.value = 0;
    };
  }, []);

  const progressBarWidthAnimated = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX:
            progress.value * (dimensions.width + dimensions.width / 4) - dimensions.width / 4,
        },
      ],
    };
  }, [dimensions.width]);

  const progressBarStyles: ViewStyle[] = [
    styles.progressBar,
    { width: dimensions.width / 4 },
    progressBarWidthAnimated,
  ];

  return (
    <View style={progressBarContainerStyles}>
      <Animated.View style={progressBarStyles} />
    </View>
  );
}

const borderRadius = 0;

const styles = StyleSheet.create({
  progressBarContainer: {
    backgroundColor: 'transparent',
    height: 4,
    borderTopLeftRadius: borderRadius,
    borderTopRightRadius: borderRadius,
    marginBottom: 2,
  },
  progressBar: {
    height: 4,
    width: 0,
    backgroundColor: Palette.secondary,
    borderTopLeftRadius: borderRadius,
    borderTopRightRadius: borderRadius,
    borderBottomRightRadius: borderRadius,
  },
});

export default IndeterminateProgressBarView;
