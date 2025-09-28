import Typography from '@components/Typography';
import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import SubredditIcon from '@components/SubredditIcon';
import useTheme from '@services/theme/useTheme';

const MATERIAL_EASING = {
  standard: Easing.bezier(0.4, 0, 0.2, 1),
  emphasizedDecelerate: Easing.bezier(0.05, 0.7, 0.1, 1),
  emphasizedAccelerate: Easing.bezier(0.3, 0, 0.8, 0.15),
} as const;

const TEXT_FADE_DURATION = 250;
const ICON_FADE_DURATION = 250;
const PULSE_DURATION = 1000;
const PULSE_SCALE = 1.2;
const ICON_SIZE = 200;

export default function FeedLoadingIndicator({
  subreddit,
  icon,
  onPress,
}: {
  subreddit: string;
  icon: string | null | undefined;
  onPress: () => void;
}) {
  const theme = useTheme();
  const textOpacity = useSharedValue(0);
  const iconOpacity = useSharedValue(0);
  const iconScale = useSharedValue(1);

  useEffect(() => {
    cancelAnimation(textOpacity);
    cancelAnimation(iconOpacity);
    cancelAnimation(iconScale);

    textOpacity.value = 0;
    iconOpacity.value = 0;
    iconScale.value = 1;

    textOpacity.value = withTiming(1, {
      duration: TEXT_FADE_DURATION,
      easing: MATERIAL_EASING.standard,
    });

    iconOpacity.value = withDelay(
      TEXT_FADE_DURATION / 2,
      withTiming(
        1,
        {
          duration: ICON_FADE_DURATION,
          easing: MATERIAL_EASING.standard,
        },
        (finished) => {
          if (finished) {
            iconScale.value = withRepeat(
              withSequence(
                withTiming(PULSE_SCALE, {
                  duration: PULSE_DURATION / 4,
                  easing: MATERIAL_EASING.emphasizedAccelerate,
                }),
                withTiming(1, {
                  duration: PULSE_DURATION,
                  easing: MATERIAL_EASING.emphasizedDecelerate,
                }),
              ),
              -1,
              false,
            );
          }
        },
      ),
    );

    return () => {
      cancelAnimation(textOpacity);
      cancelAnimation(iconOpacity);
      cancelAnimation(iconScale);
    };
  }, [icon, subreddit, textOpacity, iconOpacity, iconScale]);

  const textStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
  }));

  const iconAnimatedStyle = useAnimatedStyle(() => ({
    opacity: iconOpacity.value,
    transform: [{ scale: iconScale.value }],
  }));

  return (
    <View style={styles.container}>
      <Animated.View style={textStyle}>
        <Typography variant="displayMediumEmphasized" style={styles.title} onPress={onPress}>
          r/{subreddit}
        </Typography>
      </Animated.View>

      <Animated.View
        style={[
          styles.iconWrapper,
          iconAnimatedStyle,
          { backgroundColor: theme.surfaceContainerHigh },
        ]}>
        <SubredditIcon nsfw={false} size={ICON_SIZE} icon={icon} />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 5,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 20,
    gap: 64,
  },
  title: {
    textAlign: 'center',
  },
  iconWrapper: {
    width: ICON_SIZE,
    height: ICON_SIZE,
    borderRadius: ICON_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
});
