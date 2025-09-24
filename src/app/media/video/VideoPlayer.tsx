import { MaterialIcons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
  useWindowDimensions,
} from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useStore } from '@services/store';
import Icons from '@components/Icons';
import Typography from '@components/Typography';
import { useKeepAwake } from 'expo-keep-awake';
import { useVideoPlayer, VideoSource, VideoView, VideoViewProps } from 'expo-video';
import { useEvent } from 'expo';
import useTheme from '@services/theme/useTheme';

function formatDurationForDisplay(duration_s: number) {
  if (!Number.isFinite(duration_s)) {
    return '--:--';
  }
  const totalSeconds = duration_s;
  const seconds = String(Math.floor(totalSeconds % 60));
  const minutes = String(Math.floor(totalSeconds / 60));

  return minutes.padStart(1, '0') + ':' + seconds.padStart(2, '0');
}

// Spring Animation
const FAST_SEEK_BASE_SCALE = 0.92;
const FAST_SEEK_PEAK_SCALE = 1.08;
const FAST_SEEK_FADE_IN_DURATION = 120;
const FAST_SEEK_FADE_OUT_DURATION = 220;
const FAST_SEEK_VISIBLE_DELAY = 450;
const FAST_SEEK_SPRING_IN = { damping: 10, stiffness: 260, mass: 0.6 };
const FAST_SEEK_SPRING_OUT = { damping: 20, stiffness: 220, mass: 0.6 };

type Props = Omit<VideoViewProps, 'player'> & {
  source: VideoSource;
  activityIndicator?: any;
  onError?: (errorMsg: string) => void;
};

enum ControlStates {
  Visible,
  Hidden,
}

const VideoPlayer = (props: Props) => {
  // Hooks
  const isMutedAtLaunch = useStore((state) => !state.videoStartSound);
  const theme = useTheme();
  const player = useVideoPlayer(props.source, (player) => {
    player.loop = true;
    player.muted = isMutedAtLaunch;
    player.play();
    player.timeUpdateEventInterval = 0.5;
  });
  useKeepAwake();
  const dimensions = useWindowDimensions();

  // Events
  const { status, error } = useEvent(player, 'statusChange', { status: player.status });
  const { currentTime } = useEvent(player, 'timeUpdate', {
    currentTime: 0,
    currentLiveTimestamp: 0,
    currentOffsetFromLive: 0,
    bufferedPosition: 0,
  });
  const { isPlaying } = useEvent(player, 'playingChange', { isPlaying: player.playing });

  // Refs
  const videoRef = useRef<VideoView>(null);

  // Renanimated
  const controlsOpacityValue = useSharedValue(0);
  const fastForwardOpacityValue = useSharedValue(0);
  const fastRewindOpacityValue = useSharedValue(0);
  const fastForwardScaleValue = useSharedValue(FAST_SEEK_BASE_SCALE);
  const fastRewindScaleValue = useSharedValue(FAST_SEEK_BASE_SCALE);

  const controlsOpacityStyle = useAnimatedStyle(() => {
    return {
      flex: 1,
      opacity: controlsOpacityValue.value,
    };
  }, [controlsOpacityValue]);

  const fastForwardFeedbackStyle = useAnimatedStyle(() => {
    return {
      flex: 1,
      opacity: fastForwardOpacityValue.value,
      transform: [{ scale: fastForwardScaleValue.value }],
    };
  }, [fastForwardOpacityValue, fastForwardScaleValue]);

  const fastRewindFeedbackStyle = useAnimatedStyle(() => {
    return {
      flex: 1,
      opacity: fastRewindOpacityValue.value,
      transform: [{ scale: fastRewindScaleValue.value }],
    };
  }, [fastRewindOpacityValue, fastRewindScaleValue]);

  // Control state hooks
  const [controlsState, setControlsState] = useState(ControlStates.Hidden);
  const controlsStateRef = useRef(ControlStates.Hidden);

  const _setControlsState = useCallback(
    (value: ControlStates) => {
      setControlsState(value);
      controlsStateRef.current = value;
    },
    [setControlsState, controlsStateRef],
  );

  // Effects
  useEffect(() => {
    if (!props.source) {
      props.onError?.('`Source` is a required in `videoProps`');
    }
  }, [props.source]);

  useEffect(() => {
    if (error) {
      props.onError?.(error.message);
    }
  }, [error]);

  // VideoPlayer controls
  const toggleMute = useCallback(() => {
    player.muted = !player.muted;
  }, [player]);

  const togglePlay = async () => {
    if (controlsState === ControlStates.Hidden) {
      return;
    }
    if (!isPlaying) {
      player.play();
    } else {
      player.pause();
    }
  };

  const enterFullScreen = useCallback(async () => {
    await videoRef.current?.enterFullscreen();
  }, [videoRef]);

  const animationToggle = useCallback(() => {
    if (controlsState === ControlStates.Hidden) {
      controlsOpacityValue.value = withTiming(1, undefined, (finished) => {
        if (finished) {
          runOnJS(_setControlsState)(ControlStates.Visible);
        }
      });
    } else if (controlsState === ControlStates.Visible) {
      controlsOpacityValue.value = withTiming(0, undefined, (finished) => {
        if (finished) {
          runOnJS(_setControlsState)(ControlStates.Hidden);
        }
      });
    }
  }, [controlsState]);

  const triggerSeekFeedback = useCallback(
    (direction: 'forward' | 'rewind') => {
      const opacityValue =
        direction === 'forward' ? fastForwardOpacityValue : fastRewindOpacityValue;
      const scaleValue = direction === 'forward' ? fastForwardScaleValue : fastRewindScaleValue;

      opacityValue.value = withSequence(
        withTiming(1, { duration: FAST_SEEK_FADE_IN_DURATION }),
        withDelay(
          FAST_SEEK_VISIBLE_DELAY,
          withTiming(0, { duration: FAST_SEEK_FADE_OUT_DURATION }),
        ),
      );

      scaleValue.value = withSequence(
        withSpring(FAST_SEEK_PEAK_SCALE, FAST_SEEK_SPRING_IN),
        withDelay(
          FAST_SEEK_VISIBLE_DELAY - 150,
          withSpring(FAST_SEEK_BASE_SCALE, FAST_SEEK_SPRING_OUT),
        ),
      );
    },
    [fastForwardOpacityValue, fastRewindOpacityValue, fastForwardScaleValue, fastRewindScaleValue],
  );

  const doubleTapGesture = Gesture.Tap()
    .numberOfTaps(2)
    .onEnd(async (event) => {
      if (event.absoluteX < (1 * dimensions.width) / 3) {
        player.seekBy(-10);
        triggerSeekFeedback('rewind');
      } else if (event.absoluteX > (2 * dimensions.width) / 3) {
        player.seekBy(10);
        triggerSeekFeedback('forward');
      }
    })
    .runOnJS(true);

  if (error) {
    return <></>;
  }

  return (
    <>
      {status === 'loading' && (
        <View
          style={{
            backgroundColor: theme.scrim,
            width: '100%',
            height: '100%',
            justifyContent: 'center',
          }}>
          {
            <ActivityIndicator
              {...props.activityIndicator}
              color={theme.onBackground}
              animating
              size="large"
            />
          }
        </View>
      )}
      <Animated.View
        style={[
          {
            flex: 1,
            width: '100%',
          },
        ]}>
        <VideoView
          ref={videoRef}
          style={{
            width: dimensions.width,
            height: dimensions.height - 195,
          }}
          player={player}
          nativeControls={false}
          fullscreenOptions={{ enable: true, orientation: 'landscape' }}
        />
      </Animated.View>
      <GestureDetector gesture={doubleTapGesture}>
        <TouchableWithoutFeedback onPress={animationToggle}>
          <View
            style={{
              ...StyleSheet.absoluteFillObject,
              position: 'absolute',
            }}>
            {/** Fast Rewind */}
            <View
              pointerEvents="none"
              style={{
                position: 'absolute',
                left: 0,
                bottom: 0,
                height: '55%',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Animated.View style={fastRewindFeedbackStyle}>
                <View
                  style={{
                    marginLeft: 16,
                    backgroundColor: theme.secondaryContainer,
                    padding: 24,
                    paddingHorizontal: 24,
                    borderRadius: 48,
                    alignItems: 'center',
                  }}>
                  <Icons name={'replay-10'} size={34} color={theme.onSecondaryContainer} />
                </View>
              </Animated.View>
            </View>
            {/** Fast Forward */}
            <View
              pointerEvents="none"
              style={{
                position: 'absolute',
                right: 0,
                bottom: 0,
                height: '55%',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Animated.View style={fastForwardFeedbackStyle}>
                <View
                  style={{
                    marginRight: 16,
                    backgroundColor: theme.secondaryContainer,
                    padding: 24,
                    paddingHorizontal: 24,
                    borderRadius: 48,
                    alignItems: 'center',
                  }}>
                  <Icons name={'forward-10'} size={34} color={theme.onSecondaryContainer} />
                </View>
              </Animated.View>
            </View>
            {/* Bottom Bar */}
            <Animated.View style={controlsOpacityStyle}>
              {/** Scrim */}
              <LinearGradient
                pointerEvents="none"
                // Background Linear Gradient
                colors={['transparent', theme.scrim]}
                locations={[0, 0.7]}
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: 300,
                }}
              />

              <View
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  marginBottom: 36,
                  paddingVertical: 16,
                  marginHorizontal: 4,
                  gap: 8,
                  backgroundColor: theme.surfaceContainerLowest,
                  borderRadius: 24,
                }}>
                {/* Controls */}
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    paddingHorizontal: 12,
                  }}>
                  {/* Play Button */}
                  <View
                    pointerEvents={controlsState === ControlStates.Visible ? 'auto' : 'none'}
                    style={{
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <MaterialIcons.Button
                      name={
                        status === 'readyToPlay'
                          ? isPlaying
                            ? 'pause'
                            : 'play-arrow'
                          : status === 'loading'
                            ? 'cloud-download'
                            : 'replay'
                      }
                      size={38}
                      hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
                      iconStyle={{
                        marginRight: 20,
                        marginLeft: 20,
                      }}
                      borderRadius={22}
                      backgroundColor={theme.primaryContainer}
                      color={theme.onPrimaryContainer}
                      onPress={togglePlay}
                    />
                  </View>
                  {/* Timing */}
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    <Typography variant="bodyMedium" style={{ color: theme.onSurface }}>
                      {formatDurationForDisplay(currentTime)}
                      <Typography variant="bodyMedium" style={{ color: theme.onSurfaceVariant }}>
                        / {formatDurationForDisplay(player.duration)}
                      </Typography>
                    </Typography>
                  </View>

                  <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
                    {/* Mute Button */}
                    <View
                      pointerEvents={controlsState === ControlStates.Visible ? 'box-none' : 'none'}>
                      <MaterialIcons.Button
                        name={player.muted ? 'volume-off' : 'volume-up'}
                        size={28}
                        hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
                        iconStyle={{ marginRight: 0 }}
                        borderRadius={24}
                        backgroundColor={
                          player.muted ? theme.primaryContainer : theme.secondaryContainer
                        }
                        color={player.muted ? theme.onPrimaryContainer : theme.onSecondaryContainer}
                        onPress={toggleMute}
                      />
                    </View>
                    {/* Full screen */}
                    <MaterialIcons.Button
                      name={'fullscreen'}
                      size={28}
                      hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
                      iconStyle={{ marginRight: 10, marginLeft: 10 }}
                      borderRadius={18}
                      backgroundColor={theme.secondaryContainer}
                      color={theme.onSecondaryContainer}
                      onPress={enterFullScreen}
                    />
                  </View>
                </View>

                {/* Slider */}
                <Slider
                  style={{
                    flex: 1,
                    width: '100%',
                    height: 40,
                    borderRadius: 2,
                  }}
                  tapToSeek={true}
                  minimumTrackTintColor={theme.primary}
                  maximumTrackTintColor={theme.secondaryContainer}
                  thumbTintColor={theme.primary}
                  value={player.duration ? currentTime / player.duration : 0}
                  onSlidingComplete={async (e) => {
                    if (Number.isFinite(player.duration)) {
                      player.currentTime = e * player.duration;
                    }
                  }}
                />
              </View>
            </Animated.View>
          </View>
        </TouchableWithoutFeedback>
      </GestureDetector>
    </>
  );
};

export default VideoPlayer;
