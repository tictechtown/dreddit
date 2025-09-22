import * as React from 'react';
import { StyleSheet, View, ViewStyle, useWindowDimensions } from 'react-native';
import Animated, { SharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import useTheme from '../services/theme/useTheme';

function ProgressBarView({ progress }: { progress: SharedValue<number> }) {
  const theme = useTheme();
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

  const progressBarStyles: ViewStyle[] = [
    styles.progressBar,
    { backgroundColor: theme.secondary },
    progressBarWidthAnimated,
  ];

  if (progress.value === 1) {
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
    borderTopLeftRadius: borderRadius,
    borderTopRightRadius: borderRadius,
    borderBottomRightRadius: borderRadius,
  },
});

export default ProgressBarView;
