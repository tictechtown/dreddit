import { createContext } from 'react';
import type { ColorPalette } from '@theme/colors';
import { PaletteDark } from '@theme/colors';
import type { Material3Scheme } from '@pchmn/expo-material3-theme';

export const ThemeContext = createContext<ColorPalette>(PaletteDark);

type ExtendedMaterial3Scheme = Material3Scheme & { 'custom-green'?: string };
export interface ExtendedMaterial3Theme {
  light: ExtendedMaterial3Scheme;
  dark: ExtendedMaterial3Scheme;
}
