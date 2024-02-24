import { useState } from 'react';
import type { LayoutChangeEvent } from 'react-native';

import type { ImageZoomLayoutState, ImageZoomUseLayoutProps } from '../types';

export const useImageLayout = ({ onLayout }: ImageZoomUseLayoutProps) => {
  const [state, setState] = useState<ImageZoomLayoutState>({
    center: { x: 0, y: 0 },
    imageSize: { width: 0, height: 0 },
    size: { width: 0, height: 0 },
  });

  const onImageLayout = (event: LayoutChangeEvent) => {
    const { x, y, width, height } = event.nativeEvent.layout;

    onLayout?.(event);
    setState({
      center: {
        x: x + width / 2,
        y: y + height / 2,
      },
      imageSize: { width: 0, height: 0 },
      size: {
        width,
        height,
      },
    });
  };

  return { ...state, onImageLayout };
};
