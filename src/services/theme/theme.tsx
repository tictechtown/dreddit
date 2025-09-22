import { createContext } from 'react';
import { ColorPalette, PaletteDark } from '../../colors';

export const ThemeContext = createContext<ColorPalette>(PaletteDark);
