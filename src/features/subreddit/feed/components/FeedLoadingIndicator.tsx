import Typography from '@components/Typography';
import { useEffect, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  Extrapolation,
  cancelAnimation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { Image } from 'expo-image';
import { defaultSubredditIcon, defaultSubredditIconNSFW } from '@components/SubredditIcon';
import useTheme from '@services/theme/useTheme';

interface MorphingSubredditIconProps {
  size: number;
  icon: string | undefined | null;
  nsfw: boolean;
  style: any;
}

const MORPH_INPUT_RANGE = [0, 0.25, 0.5, 0.75, 1] as const;
const MORPH_WIDTH_MULTIPLIERS = [1, 1, 1.25, 0.6, 1] as const;
const MORPH_HEIGHT_MULTIPLIERS = [1, 1, 0.6, 1.25, 1] as const;
const MORPH_RADIUS_MULTIPLIERS = [0.5, 0.1, 0.3, 0.3, 0.5] as const;
const MORPH_SCALE_MULTIPLIERS = [1, 1, 1, 1, 1] as const;
const MORPH_ANIMATION_DURATION = 200;
const MORPH_ANIMATION_DELAY = 500;

const AnimatedImage = Animated.createAnimatedComponent(Image);

const MorphingSubredditIcon = (props: MorphingSubredditIconProps) => {
  const progress = useSharedValue(0);

  const iconSource = useMemo(() => {
    const sanitizedIcon =
      typeof props.icon === 'string' ? props.icon.replaceAll('&amp;', '&') : null;

    const shouldUsePlaceholder = !sanitizedIcon || !sanitizedIcon.startsWith('http');

    return shouldUsePlaceholder
      ? props.nsfw
        ? defaultSubredditIconNSFW
        : defaultSubredditIcon
      : sanitizedIcon;
  }, [props.icon, props.nsfw]);

  useEffect(() => {
    progress.value = withRepeat(
      withSequence(
        withDelay(
          MORPH_ANIMATION_DELAY,
          withTiming(0.25, {
            duration: MORPH_ANIMATION_DURATION,
            easing: Easing.inOut(Easing.ease),
          }),
        ),
        withDelay(
          MORPH_ANIMATION_DELAY,
          withTiming(0.5, {
            duration: MORPH_ANIMATION_DURATION,
            easing: Easing.inOut(Easing.ease),
          }),
        ),
        withDelay(
          MORPH_ANIMATION_DELAY,
          withTiming(0.75, {
            duration: MORPH_ANIMATION_DURATION,
            easing: Easing.inOut(Easing.ease),
          }),
        ),
        withDelay(
          MORPH_ANIMATION_DELAY,
          withTiming(1, {
            duration: MORPH_ANIMATION_DURATION,
            easing: Easing.inOut(Easing.ease),
          }),
        ),
        withDelay(
          MORPH_ANIMATION_DELAY,
          withTiming(0.75, {
            duration: MORPH_ANIMATION_DURATION,
            easing: Easing.inOut(Easing.ease),
          }),
        ),
        withDelay(
          MORPH_ANIMATION_DELAY,
          withTiming(0.5, {
            duration: MORPH_ANIMATION_DURATION,
            easing: Easing.inOut(Easing.ease),
          }),
        ),
        withDelay(
          MORPH_ANIMATION_DELAY,
          withTiming(0.25, {
            duration: MORPH_ANIMATION_DURATION,
            easing: Easing.inOut(Easing.ease),
          }),
        ),
        withDelay(
          MORPH_ANIMATION_DELAY,
          withTiming(0, {
            duration: MORPH_ANIMATION_DURATION,
            easing: Easing.inOut(Easing.ease),
          }),
        ),
      ),
      -1,
      false,
    );

    return () => {
      cancelAnimation(progress);
      progress.value = 0;
    };
  }, [progress]);

  const containerStyle = useAnimatedStyle(() => {
    const width =
      props.size *
      interpolate(progress.value, MORPH_INPUT_RANGE, MORPH_WIDTH_MULTIPLIERS, Extrapolation.CLAMP);
    const height =
      props.size *
      interpolate(progress.value, MORPH_INPUT_RANGE, MORPH_HEIGHT_MULTIPLIERS, Extrapolation.CLAMP);
    const borderRadius =
      props.size *
      interpolate(progress.value, MORPH_INPUT_RANGE, MORPH_RADIUS_MULTIPLIERS, Extrapolation.CLAMP);

    return {
      width,
      height,
      borderRadius,
    };
  }, [props.size]);

  const imageStyle = useAnimatedStyle(() => {
    const scale = interpolate(
      progress.value,
      MORPH_INPUT_RANGE,
      MORPH_SCALE_MULTIPLIERS,
      Extrapolation.CLAMP,
    );

    return {
      transform: [{ scale }],
    };
  });

  return (
    <Animated.View style={[styles.morphingIcon, props.style, containerStyle]}>
      <AnimatedImage
        source={iconSource}
        cachePolicy={'disk'}
        contentFit="cover"
        style={[styles.iconImage, imageStyle]}
      />
    </Animated.View>
  );
};

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
  return (
    <View
      style={{
        flex: 5,
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingHorizontal: 20,
        gap: 32,
      }}>
      <Typography
        variant="displayMediumEmphasized"
        style={{ textAlign: 'center' }}
        onPress={onPress}>
        r/{subreddit}
      </Typography>

      <View
        style={{
          width: 200,
          height: 200,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <MorphingSubredditIcon
          size={200}
          icon={icon}
          nsfw={false}
          style={{ backgroundColor: theme.surfaceContainerHigh }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  morphingIcon: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    alignSelf: 'center',
  },
  iconImage: {
    ...StyleSheet.absoluteFillObject,
  },
});
