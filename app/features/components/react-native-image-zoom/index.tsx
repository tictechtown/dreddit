/**
 * Fork from @likashefqet/react-native-image-zoom
 */

import React, { useCallback, useState } from 'react';
import { Image, StyleSheet } from 'react-native';
import { GestureDetector } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';

import { useGestures } from './hooks/useGestures';
import { useImageLayout } from './hooks/useImageLayout';

import type { ImageZoomProps } from './types';

const styles = StyleSheet.create({
  image: {
    flex: 1,
  },
});

const ImageZoom: React.FC<ImageZoomProps> = ({
  uri = '',
  minScale,
  maxScale,
  minPanPointers,
  maxPanPointers,
  isPanEnabled,
  isPinchEnabled,
  onInteractionStart,
  onInteractionEnd,
  onPinchStart,
  onPinchEnd,
  onPanStart,
  onPanEnd,
  onLayout,
  onLoadEnd,
  style = {},
  ...props
}) => {
  const { center, size, onImageLayout } = useImageLayout({ onLayout });
  const [imageSize, setImageSize] = useState<{ width: number; height: number }>({
    width: 0,
    height: 0,
  });
  const { animatedStyle, gestures } = useGestures({
    center,
    imageSize,
    size,
    minScale,
    maxScale,
    minPanPointers,
    maxPanPointers,
    isPanEnabled,
    isPinchEnabled,
    onInteractionStart,
    onInteractionEnd,
    onPinchStart,
    onPinchEnd,
    onPanStart,
    onPanEnd,
  });
  const onImageLoadEnd = useCallback(() => {
    Image.getSize(uri, (width, height) => {
      setImageSize({ width, height });
    });
    if (onLoadEnd) {
      onLoadEnd();
    }
  }, [uri]);

  return (
    <GestureDetector gesture={gestures}>
      <Animated.Image
        style={[styles.image, style, animatedStyle]}
        source={{ uri }}
        resizeMode="contain"
        onLayout={onImageLayout}
        onLoadEnd={onImageLoadEnd}
        {...props}
      />
    </GestureDetector>
  );
};

export default ImageZoom;
