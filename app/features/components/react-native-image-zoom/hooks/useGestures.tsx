import { useCallback, useMemo, useRef } from 'react';
import { Gesture } from 'react-native-gesture-handler';
import {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDecay,
  withTiming,
} from 'react-native-reanimated';

import { clamp } from '../utils/clamp';

import type {
  GestureStateChangeEvent,
  GestureUpdateEvent,
  PanGestureHandlerEventPayload,
  PinchGestureHandlerEventPayload,
} from 'react-native-gesture-handler';

import type { ImageZoomUseGesturesProps } from '../types';

type Size = {
  width: number;
  height: number;
};

const getContainedInitialImageSize = (fullImageSize: Size, containerImageSize: Size): Size => {
  if (containerImageSize.height === 0) {
    return { width: 100, height: 100 };
  }
  console.log('fullImageSize', fullImageSize, 'containerImageSize', containerImageSize);
  const containerAspectRatio = containerImageSize.width / containerImageSize.height;
  const fullImageAspectRatio = fullImageSize.width / fullImageSize.height;
  if (containerImageSize.width / fullImageAspectRatio <= containerImageSize.height) {
    return {
      width: containerImageSize.width,
      height: containerImageSize.width / fullImageAspectRatio,
    };
  }
  return {
    width: containerImageSize.height * fullImageAspectRatio,
    height: containerImageSize.height,
  };
};

const INITIAL_SCALE = 1;

export const useGestures = ({
  center,
  imageSize,
  size,
  minScale = 1,
  maxScale = 5,
  minPanPointers = 1,
  maxPanPointers = 2,
  isPanEnabled = true,
  isPinchEnabled = true,
  onInteractionStart,
  onInteractionEnd,
  onPinchStart,
  onPinchEnd,
  onPanStart,
  onPanEnd,
}: ImageZoomUseGesturesProps) => {
  const isInteracting = useRef(false);
  const isPanning = useRef(false);
  const isPinching = useRef(false);

  const containedImageSize = useMemo(() => {
    return getContainedInitialImageSize(imageSize, size);
  }, [imageSize, size]);

  const initialFocal = { x: useSharedValue(0), y: useSharedValue(0) };
  const focal = { x: useSharedValue(0), y: useSharedValue(0) };
  const translate = { x: useSharedValue(0), y: useSharedValue(0) };
  const initialTranslation = { x: useSharedValue(0), y: useSharedValue(0) };

  const scale = useSharedValue(INITIAL_SCALE);
  const initialScale = useSharedValue(INITIAL_SCALE);

  const _maxScale = useMemo(() => {
    // for very long vertical image, we want the maxScale to be able to fill the width of the phone (+ a little more)
    if (containedImageSize.height > containedImageSize.width) {
      return 20;
    } else {
      return 5;
    }
  }, [maxScale, containedImageSize]);

  const reset = useCallback(() => {
    'worklet';
    scale.value = withTiming(INITIAL_SCALE);
    initialScale.value = INITIAL_SCALE;
    initialFocal.x.value = 0;
    initialFocal.y.value = 0;
    focal.x.value = withTiming(0);
    focal.y.value = withTiming(0);
    initialTranslation.x.value = 0;
    initialTranslation.y.value = 0;
    translate.x.value = withTiming(0);
    translate.y.value = withTiming(0);
  }, [focal.x, focal.y, initialFocal.x, initialFocal.y, scale, translate.x, translate.y]);

  const onInteractionStarted = () => {
    if (!isInteracting.current) {
      isInteracting.current = true;
      onInteractionStart?.();
    }
  };

  const onInteractionEnded = () => {
    if (isInteracting.current && !isPinching.current && !isPanning.current) {
      /**
       * DEVIATION, dont reset when interaction end
       */
      //   reset();
      if (scale.value === INITIAL_SCALE) {
        reset();
      }
      isInteracting.current = false;
      onInteractionEnd?.();
    }
  };

  const onPinchStarted = () => {
    onInteractionStarted();
    isPinching.current = true;
    onPinchStart?.();
  };

  const onPinchEnded = () => {
    isPinching.current = false;
    onPinchEnd?.();
    onInteractionEnded();
  };

  const onPanStarted = () => {
    onInteractionStarted();
    isPanning.current = true;
    onPanStart?.();
  };

  const onPanEnded = () => {
    isPanning.current = false;
    onPanEnd?.();
    onInteractionEnded();
  };

  const panGesture = Gesture.Pan()
    .enabled(isPanEnabled)
    .minPointers(minPanPointers)
    .maxPointers(maxPanPointers)
    .onStart(() => {
      runOnJS(onPanStarted)();
    })
    .onUpdate((event: GestureUpdateEvent<PanGestureHandlerEventPayload>) => {
      translate.x.value = event.translationX + initialTranslation.x.value;
      translate.y.value = event.translationY + initialTranslation.y.value;
    })
    .onEnd((e) => {
      initialTranslation.x.value = translate.x.value;
      initialTranslation.y.value = translate.y.value;

      const clampBoundsX: [number, number] = [
        -(containedImageSize.width * scale.value - containedImageSize.width) / 2 - focal.x.value,
        (containedImageSize.width * scale.value - containedImageSize.width) / 2 - focal.x.value,
      ];
      const clampBoundsY: [number, number] = [
        -(containedImageSize.height * scale.value - containedImageSize.height) / 2 - focal.y.value,
        (containedImageSize.height * scale.value - containedImageSize.height) / 2 - focal.y.value,
      ];
      translate.x.value = withDecay({
        velocity: e.velocityX,
        clamp: clampBoundsX,
        rubberBandEffect: true,
      });
      initialTranslation.x.value = withDecay({
        velocity: e.velocityX,
        clamp: clampBoundsX,
      });
      translate.y.value = withDecay({
        velocity: e.velocityY,
        clamp: clampBoundsY,
        rubberBandEffect: true,
      });
      initialTranslation.y.value = withDecay({
        velocity: e.velocityY,
        clamp: clampBoundsY,
      });

      runOnJS(onPanEnded)();
    });

  const pinchGesture = Gesture.Pinch()
    .enabled(isPinchEnabled)
    .onStart((event: GestureStateChangeEvent<PinchGestureHandlerEventPayload>) => {
      runOnJS(onPinchStarted)();
      initialFocal.x.value = event.focalX;
      initialFocal.y.value = event.focalY;
    })
    .onUpdate((event: GestureUpdateEvent<PinchGestureHandlerEventPayload>) => {
      scale.value = clamp(event.scale * initialScale.value, minScale, _maxScale);
      focal.x.value = (center.x - initialFocal.x.value) * (scale.value - 1);
      focal.y.value = (center.y - initialFocal.y.value) * (scale.value - 1);
    })
    .onEnd((lastEvent) => {
      initialScale.value = scale.value;
      scale.value = withDecay({
        velocity: lastEvent.velocity,
        velocityFactor: 10,
        rubberBandEffect: true,
        clamp: [minScale, _maxScale],
      });
      initialScale.value = withDecay({
        velocity: lastEvent.velocity,
        velocityFactor: 10,
        rubberBandEffect: true,
        clamp: [minScale, _maxScale],
      });

      runOnJS(onPinchEnded)();
    });

  const doubleTapGesture = Gesture.Tap()
    .numberOfTaps(2)
    .onEnd((event) => {
      if (scale.value === INITIAL_SCALE) {
        scale.value = withTiming(2.5);
        initialScale.value = 2.5;
        focal.x.value = withTiming((center.x - event.x) * (2.5 - 1));
        focal.y.value = withTiming((center.y - event.y) * (2.5 - 1));
      } else {
        reset();
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translate.x.value },
      { translateY: translate.y.value },
      { translateX: focal.x.value },
      { translateY: focal.y.value },
      { scale: scale.value },
    ],
  }));

  const gestures = Gesture.Simultaneous(pinchGesture, panGesture, doubleTapGesture);

  return { gestures, animatedStyle };
};
