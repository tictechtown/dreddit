import { createContext } from 'react';
import { ColorPalette, PaletteDark } from '../../features/colors';

export const ThemeContext = createContext<ColorPalette>(PaletteDark);
