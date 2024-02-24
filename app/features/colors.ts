// import { argbFromHex, hexFromArgb, themeFromSourceColor } from '@material/material-color-utilities';

// // Get the theme from a hex color
// const theme = themeFromSourceColor(argbFromHex('#4285f4'), [
//   {
//     name: 'darkTheme',
//     value: argbFromHex('#ff0000'),
//     blend: true,
//   },
// ]);

// const scheme = theme.schemes.dark.toJSON();
// for (const key in scheme) {
//   console.log(key, hexFromArgb(scheme[key]));
// }

// Print out the theme as JSON
// console.log(JSON.stringify(theme, null, 2));

export const PaletteDark = {
  primary: '#adc6ff',
  onPrimary: '#002e69',
  primaryContainer: '#004494',
  onPrimaryContainer: '#d8e2ff',
  secondary: '#bfc6dc',
  onSecondary: '#293041',
  secondaryContainer: '#3f4759',
  onSecondaryContainer: '#dbe2f9',
  tertiary: '#debcdf',
  onTertiary: '#402843',
  tertiaryContainer: '#583e5b',
  onTertiaryContainer: '#fbd7fc',
  error: '#ffb4ab',
  onError: '#690005',
  errorContainer: '#93000a',
  onErrorContainer: '#ffb4ab',
  background: '#1b1b1f',
  onBackground: '#e3e2e6',
  surface: '#1b1b1f',
  onSurface: '#e3e2e6',
  surfaceVariant: '#44474f',
  onSurfaceVariant: '#c4c6d0',
  outline: '#8e9099',
  outlineVariant: '#44474f',
  shadow: '#000000',
  scrim: '#000000',
  inverseSurface: '#E6E0E9',
  inverseOnSurface: '#322F35',

  // new
  surfaceTint: '#D0BCFF',
  surfaceContainerHighest: '#36343B',
  surfaceContainerHigh: '#2B2930',
  surfaceContainer: '#211F26',
  surfaceContainerLow: '#1D1B20',
  surfaceContainerLowest: '#0F0D13',

  // should be equivalent to elevation (lowest)
  backgroundLowest: '#0F0D13',
  onBackgroundLowest: '#fff',
};

/* Default Palette Light
export const PaletteLight = {
  primary: '#6750A4',
  onPrimary: '#FFFFFF',
  primaryContainer: '#EADDFF',
  onPrimaryContainer: '#21005D',
  secondary: '#625B71',
  onSecondary: '#FFFFFF',
  secondaryContainer: '#E8DEF8',
  onSecondaryContainer: '#1D192B',
  tertiary: '#7D5260',
  onTertiary: '#FFFFFF',
  tertiaryContainer: '#FFD8E4',
  onTertiaryContainer: '#31111D',
  error: '#B3261E',
  onError: '#FFFFFF',
  errorContainer: '#F9DEDC',
  onErrorContainer: '#410E0B',
  background: '#FFFBFE',
  onBackground: '#1C1B1F',
  surface: '#FEF7FF',
  onSurface: '#1D1B20',
  surfaceVariant: '#E7E0EC',
  onSurfaceVariant: '#49454F',
  outline: '#79747E',
  outlineVariant: '#CAC4D0',
  shadow: '#000000',
  scrim: '#000000',
  inverseSurface: '#322F35',
  inverseOnSurface: '#F5EFF7',

  // new
  surfaceTint: '#6750A4',
  surfaceContainerHighest: '#E6E0E9',
  surfaceContainerHigh: '#ECE6F0',
  surfaceContainer: '#F3EDF7',
  surfaceContainerLow: '#F7F2FA',
  surfaceContainerLowest: '#fff',

  // should be equivalent to elevation (lowest)
  backgroundLowest: '#fff',
  onBackgroundLowest: '#1C1B1F',
};
*/
export const Palette = PaletteDark;
