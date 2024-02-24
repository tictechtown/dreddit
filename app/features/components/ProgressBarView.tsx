import * as React from 'react';
import { StyleSheet, View, ViewStyle, useWindowDimensions } from 'react-native';
import Animated, { useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { Palette } from '../colors';

function ProgressBarView({
  progress = 0,
  height = 7,
  borderRadius = height * 0.5,
  // Default iOS blue
  color = '#007aff',
  trackColor = 'transparent',
  style,
}: any) {
  const dimensions = useWindowDimensions();
  const progressBarContainerStyles: ViewStyle[] = [styles.progressBarContainer];

  const progressBarWidthAnimated = useAnimatedStyle(() => {
    if (progress.value == 1) {
      return {
        width: 0,
      };
    }

    // We clamp at 0 and the last number so that the bar doesn't extend outside of
    // the card. If we jump from 8 to 0 (reseting a game) the bar glitches and
    // empties, refills, and empties again. Clamping fixes that.
    const useClamping = progress.value < 0 || progress.value > 1;
    return {
      width: withSpring(progress.value * dimensions.width, {
        overshootClamping: useClamping,
        stiffness: 75,
      }),
    };
  }, [progress, dimensions.width]);

  const progressBarStyles: ViewStyle[] = [styles.progressBar, progressBarWidthAnimated];

  if (progress === 1) {
    progressBarStyles.push({ borderBottomRightRadius: 0 });
  }

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

export default ProgressBarView;
