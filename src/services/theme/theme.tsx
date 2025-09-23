import { createContext } from 'react';
import { ColorPalette, PaletteDark } from '../../colors';
import { Material3Scheme } from '@pchmn/expo-material3-theme';

export const ThemeContext = createContext<ColorPalette>(PaletteDark);

type ExtendedMaterial3Scheme = Material3Scheme & { 'custom-green'?: string };
export type ExtendedMaterial3Theme = {
  light: ExtendedMaterial3Scheme;
  dark: ExtendedMaterial3Scheme;
};
