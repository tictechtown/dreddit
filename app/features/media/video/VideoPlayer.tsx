import { MaterialIcons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import {
  AVPlaybackStatus,
  ResizeMode,
  Video,
  VideoFullscreenUpdate,
  VideoFullscreenUpdateEvent,
  VideoProps,
  VideoReadyForDisplayEvent,
} from 'expo-av';
import * as ScreenOrientation from 'expo-screen-orientation';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableNativeFeedback,
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
  withTiming,
} from 'react-native-reanimated';
import { PaletteDark } from '../../colors';
import { Spacing } from '../../tokens';

type Props = VideoProps & { activityIndicator?: any };

const getMinutesSecondsFromMilliseconds = (ms: number) => {
  const totalSeconds = ms / 1000;
  const seconds = String(Math.floor(totalSeconds % 60));
  const minutes = String(Math.floor(totalSeconds / 60));

  return minutes.padStart(1, '0') + ':' + seconds.padStart(2, '0');
};

enum PlaybackStates {
  Loading,
  Buffering,
  Playing,
  Paused,
  Ended,
  Error,
}

enum ControlStates {
  Visible,
  Hidden,
}

const VideoPlayer = (props: Props) => {
  const videoRef = useRef<Video>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const dimensions = useWindowDimensions();
  const [playbackInstanceInfo, setPlaybackInstanceInfo] = useState({
    position: 0,
    duration: 0,
    state: PlaybackStates.Loading,
    isMuted: true,
    readyToDisplay: false,
    videoOrientation: 'landscape',
  });
  const [errorMessage, setErrorMessage] = useState('');
  const controlsOpacityValue = useSharedValue(0);
  const fastFowardOpacityValue = useSharedValue(0);
  const fastRewindOpacityValue = useSharedValue(0);
  // this is to take care of the weird stutter on 1st frame
  const videoPlayerOpacityValue = useSharedValue(0);

  const [controlsState, setControlsState] = useState(ControlStates.Hidden);
  const controlsStateRef = useRef(ControlStates.Hidden);
  const playbackStateRef = useRef(PlaybackStates.Loading);

  const _setControlsState = useCallback(
    (value: ControlStates) => {
      setControlsState(value);
      controlsStateRef.current = value;
    },
    [setControlsState, controlsStateRef]
  );

  // cleanup VideoPlayer when exiting screen
  useEffect(() => {
    return () => {
      if (videoRef.current) {
        videoRef.current.setStatusAsync({
          shouldPlay: false,
        });
      }
    };
  }, []);

  // Update State when source changes
  useEffect(() => {
    if (!props.source) {
      console.error(
        '[VideoPlayer] `Source` is a required in `videoProps`. ' +
          'Check https://docs.expo.io/versions/latest/sdk/video/#usage'
      );
      setErrorMessage('`Source` is a required in `videoProps`');
      setPlaybackInstanceInfo({
        ...playbackInstanceInfo,
        state: PlaybackStates.Error,
        readyToDisplay: false,
      });
      playbackStateRef.current = PlaybackStates.Error;
    } else {
      setPlaybackInstanceInfo({ ...playbackInstanceInfo, state: PlaybackStates.Playing });
      playbackStateRef.current = PlaybackStates.Playing;
    }
  }, [props.source]);

  const controlsOpacityStyle = useAnimatedStyle(() => {
    return {
      flex: 1,
      opacity: controlsOpacityValue.value,
    };
  }, [controlsOpacityValue]);

  const fastForwardOpacityStyle = useAnimatedStyle(() => {
    return {
      flex: 1,
      opacity: fastFowardOpacityValue.value,
    };
  }, [fastFowardOpacityValue]);

  const fastRewindOpacityStyle = useAnimatedStyle(() => {
    return {
      flex: 1,
      opacity: fastRewindOpacityValue.value,
    };
  }, [fastRewindOpacityValue]);

  const updatePlaybackCallback = (status: AVPlaybackStatus) => {
    if (status.isLoaded) {
      const newState =
        status.positionMillis === status.durationMillis
          ? PlaybackStates.Ended
          : status.isBuffering && (status?.playableDurationMillis ?? 0) <= status.positionMillis
            ? PlaybackStates.Buffering
            : status.shouldPlay
              ? PlaybackStates.Playing
              : PlaybackStates.Paused;
      setPlaybackInstanceInfo({
        ...playbackInstanceInfo,
        position: status.positionMillis,
        duration: status.durationMillis || 0,
        isMuted: status.isMuted,
        state: newState,
      });
      playbackStateRef.current = newState;
      if (status.didJustFinish && controlsState === ControlStates.Hidden && !status.isLooping) {
        animationToggle();
      }
    } else {
      if (status.isLoaded === false && status.error) {
        const errorMsg = `Encountered a fatal error during playback: ${status.error}`;
        setErrorMessage(errorMsg);
        setPlaybackInstanceInfo({
          ...playbackInstanceInfo,
          state: PlaybackStates.Error,
        });
      }
    }
  };

  const toggleMute = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.setIsMutedAsync(!playbackInstanceInfo.isMuted);
      setPlaybackInstanceInfo({ ...playbackInstanceInfo, isMuted: !playbackInstanceInfo.isMuted });
    }
  }, [playbackInstanceInfo]);

  const togglePlay = async () => {
    if (controlsState === ControlStates.Hidden) {
      return;
    }
    const shouldPlay = playbackInstanceInfo.state !== PlaybackStates.Playing;
    if (videoRef.current !== null) {
      await videoRef.current.setStatusAsync({
        shouldPlay,
        ...(playbackInstanceInfo.state === PlaybackStates.Ended && { positionMillis: 0 }),
      });
      const newState =
        playbackInstanceInfo.state === PlaybackStates.Playing
          ? PlaybackStates.Paused
          : PlaybackStates.Playing;
      setPlaybackInstanceInfo({
        ...playbackInstanceInfo,
        state: newState,
      });
      playbackStateRef.current = newState;
      if (shouldPlay) {
        animationToggle();
      }
    }
  };

  const updateReadyForDisplay = useCallback(
    (event: VideoReadyForDisplayEvent) => {
      console.log('updateReadyForDisplay', event);
      setPlaybackInstanceInfo({
        ...playbackInstanceInfo,
        readyToDisplay: true,
        videoOrientation: event.naturalSize.orientation,
      });
      videoPlayerOpacityValue.value = withTiming(1);
    },
    [playbackInstanceInfo]
  );

  const onFullscreenUpdate = useCallback(
    async ({ fullscreenUpdate }: VideoFullscreenUpdateEvent) => {
      if (
        fullscreenUpdate === VideoFullscreenUpdate.PLAYER_DID_PRESENT &&
        playbackInstanceInfo.videoOrientation === 'landscape'
      ) {
        await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
      } else if (fullscreenUpdate === VideoFullscreenUpdate.PLAYER_WILL_DISMISS) {
        await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);
      }
    },
    [playbackInstanceInfo.videoOrientation]
  );

  const enterFullScreen = useCallback(async () => {
    await videoRef.current?.presentFullscreenPlayer();
  }, [videoRef]);

  const animationToggle = useCallback(() => {
    if (controlsState === ControlStates.Hidden) {
      controlsOpacityValue.value = withTiming(1, undefined, (finished) => {
        if (finished) {
          runOnJS(_setControlsState)(ControlStates.Visible);
        }
      });

      if (!timerRef.current) {
        timerRef.current = setTimeout(() => {
          if (
            playbackStateRef.current === PlaybackStates.Playing &&
            controlsStateRef.current === ControlStates.Visible
          ) {
            controlsOpacityValue.value = withTiming(0, undefined, (finished) => {
              if (finished) {
                runOnJS(_setControlsState)(ControlStates.Hidden);
              }
            });
          }
          if (timerRef.current) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
          }
        }, 1500);
      }
    } else if (controlsState === ControlStates.Visible) {
      controlsOpacityValue.value = withTiming(0, undefined, (finished) => {
        if (finished) {
          runOnJS(_setControlsState)(ControlStates.Hidden);
        }
      });
    }
  }, [controlsState]);

  const videoPlayerOpacityStyle = useAnimatedStyle(() => {
    return {
      opacity: videoPlayerOpacityValue.value,
    };
  });

  const doubleTapGesture = Gesture.Tap().numberOfTaps(2);

  doubleTapGesture.onStart(async (event) => {
    if (event.absoluteX < (1 * dimensions.width) / 3) {
      const position = playbackInstanceInfo.position - 10 * 1000; // - 10 sec
      if (videoRef.current) {
        await videoRef.current.setStatusAsync({
          positionMillis: position,
          shouldPlay: true,
        });
      }
      setPlaybackInstanceInfo({
        ...playbackInstanceInfo,
        position,
      });
      fastRewindOpacityValue.value = withSequence(withTiming(1), withDelay(500, withTiming(0)));
    } else if (event.absoluteX > (2 * dimensions.width) / 3) {
      const position = playbackInstanceInfo.position + 10 * 1000; // + 10 sec
      if (videoRef.current) {
        await videoRef.current.setStatusAsync({
          positionMillis: position,
          shouldPlay: true,
        });
      }
      setPlaybackInstanceInfo({
        ...playbackInstanceInfo,
        position,
      });
      fastFowardOpacityValue.value = withSequence(withTiming(1), withDelay(500, withTiming(0)));
    }
  });

  if (playbackInstanceInfo.state === PlaybackStates.Error) {
    return (
      <View
        style={{
          backgroundColor: PaletteDark.scrim,
          width: '100%',
          height: '100%',
        }}>
        <View
          style={{
            flex: 0,
            position: 'absolute',
            bottom: 20,
            left: 0,
            right: 0,
            paddingHorizontal: 20,
            paddingVertical: 10,
            backgroundColor: PaletteDark.errorContainer,
            borderRadius: 10,
            flexDirection: 'row',
          }}>
          <MaterialIcons name="error" size={36} color={PaletteDark.onErrorContainer} />
          <Text style={{ color: PaletteDark.onErrorContainer, marginLeft: Spacing.s16 }}>
            {errorMessage}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <>
      {playbackInstanceInfo.state === PlaybackStates.Loading ||
        (playbackInstanceInfo.state === PlaybackStates.Playing &&
          playbackInstanceInfo.duration === 0 && (
            <View
              style={{
                backgroundColor: PaletteDark.scrim,
                width: '100%',
                height: '100%',
                justifyContent: 'center',
              }}>
              {
                <ActivityIndicator
                  {...props.activityIndicator}
                  color={PaletteDark.onBackground}
                  animating
                  size="large"
                />
              }
            </View>
          ))}
      <Animated.View
        style={[
          {
            flex: 1,
            width: '100%',
          },
          videoPlayerOpacityStyle,
        ]}>
        <Video
          ref={videoRef}
          style={props.style}
          source={props.source}
          onFullscreenUpdate={onFullscreenUpdate}
          resizeMode={ResizeMode.CONTAIN}
          isLooping={true}
          isMuted={true}
          shouldPlay
          onPlaybackStatusUpdate={updatePlaybackCallback}
          onReadyForDisplay={updateReadyForDisplay}
        />
      </Animated.View>
      <GestureDetector gesture={doubleTapGesture}>
        <TouchableWithoutFeedback onPress={animationToggle}>
          <View
            style={{
              ...StyleSheet.absoluteFillObject,
              position: 'absolute',
            }}>
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
              <Animated.View style={fastRewindOpacityStyle}>
                <View
                  style={{
                    marginLeft: 16,
                    backgroundColor: PaletteDark.onSurface,
                    padding: 16,
                    paddingHorizontal: 24,
                    borderRadius: 48,
                    opacity: 0.9,
                    alignItems: 'center',
                  }}>
                  <MaterialIcons name={'fast-rewind'} size={25} color={PaletteDark.surface} />
                  <Text>10s</Text>
                </View>
              </Animated.View>
            </View>
            <View
              style={{
                position: 'absolute',
                right: 0,
                bottom: 0,
                height: '55%',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Animated.View style={fastForwardOpacityStyle}>
                <View
                  style={{
                    marginRight: 16,
                    backgroundColor: PaletteDark.onSurface,
                    padding: 16,
                    paddingHorizontal: 24,
                    borderRadius: 48,
                    opacity: 0.9,
                    alignItems: 'center',
                  }}>
                  <MaterialIcons name={'fast-forward'} size={25} color={PaletteDark.surface} />
                  <Text>10s</Text>
                </View>
              </Animated.View>
            </View>
            <Animated.View style={controlsOpacityStyle}>
              <View
                pointerEvents={controlsState === ControlStates.Visible ? 'auto' : 'none'}
                style={{
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <TouchableNativeFeedback
                  background={TouchableNativeFeedback.Ripple(PaletteDark.surfaceVariant, true)}
                  onPress={togglePlay}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View
                      style={{
                        backgroundColor: PaletteDark.onSurface,
                        padding: 16,
                        borderRadius: 48,
                        opacity: 0.9,
                      }}>
                      <MaterialIcons
                        name={
                          playbackInstanceInfo.state === PlaybackStates.Playing
                            ? 'pause'
                            : playbackInstanceInfo.state === PlaybackStates.Paused
                              ? 'play-arrow'
                              : playbackInstanceInfo.state === PlaybackStates.Ended
                                ? 'replay'
                                : 'cloud-download'
                        }
                        size={34}
                        color={PaletteDark.surface}
                      />
                    </View>
                  </View>
                </TouchableNativeFeedback>
              </View>

              <View
                style={{
                  position: 'absolute',
                  bottom: 0,
                  backgroundColor: PaletteDark.scrim,
                  opacity: 0.8,
                  borderRadius: 10,
                  paddingVertical: 10,
                  paddingBottom: 30,
                  paddingHorizontal: 10,
                  width: '100%',
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingBottom: 10,
                  }}>
                  <Text style={{ color: PaletteDark.onBackground }}>
                    {getMinutesSecondsFromMilliseconds(playbackInstanceInfo.position)} /{' '}
                    {getMinutesSecondsFromMilliseconds(playbackInstanceInfo.duration)}
                  </Text>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'flex-end',
                      flex: 1,
                    }}>
                    <MaterialIcons.Button
                      name={playbackInstanceInfo.isMuted ? 'volume-off' : 'volume-up'}
                      size={24}
                      hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
                      iconStyle={{ marginRight: 0 }}
                      borderRadius={24}
                      backgroundColor={PaletteDark.surfaceVariant}
                      color={PaletteDark.onSurface}
                      onPress={toggleMute}
                    />
                    <View style={{ marginLeft: 10, marginRight: 10 }} />
                    <MaterialIcons.Button
                      name={'fullscreen'}
                      size={24}
                      hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
                      iconStyle={{ marginRight: 0 }}
                      borderRadius={24}
                      backgroundColor={PaletteDark.surfaceVariant}
                      color={PaletteDark.onSurface}
                      onPress={enterFullScreen}
                    />
                  </View>
                </View>
                <Slider
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  style={{ flex: 1, borderColor: 'white', borderWidth: 1 }}
                  minimumTrackTintColor={PaletteDark.onSurface}
                  thumbTintColor={PaletteDark.onSurface}
                  value={
                    playbackInstanceInfo.duration
                      ? playbackInstanceInfo.position / playbackInstanceInfo.duration
                      : 0
                  }
                  onSlidingStart={() => {
                    if (playbackInstanceInfo.state === PlaybackStates.Playing) {
                      togglePlay();
                      setPlaybackInstanceInfo({
                        ...playbackInstanceInfo,
                        state: PlaybackStates.Paused,
                      });
                      playbackStateRef.current = PlaybackStates.Paused;
                    }
                  }}
                  onSlidingComplete={async (e) => {
                    const position = e * playbackInstanceInfo.duration;
                    if (videoRef.current) {
                      await videoRef.current.setStatusAsync({
                        positionMillis: position,
                        shouldPlay: true,
                      });
                    }
                    setPlaybackInstanceInfo({
                      ...playbackInstanceInfo,
                      position,
                    });
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
