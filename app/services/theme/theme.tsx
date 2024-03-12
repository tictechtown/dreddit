import { createContext } from 'react';
import { Palette, PaletteDark } from '../../features/colors';

export const ThemeContext = createContext<Palette>(PaletteDark);
