// import { argbFromHex, themeFromSourceColor } from '@material/material-color-utilities';

// // // Get the theme from a hex color
// const theme = themeFromSourceColor(argbFromHex('#4285f4'), []);

// // const scheme = theme.schemes.dark.toJSON();
// // for (const key in scheme) {
// //   // @ts-ignore
// //   console.log(key, hexFromArgb(scheme[key] as number));
// // }

// // Print out the theme as JSON
// console.log(JSON.stringify(theme, null, 2));

export type ColorPalette = {
  primary: string;
  surfaceTint: string;
  onPrimary: string;
  primaryContainer: string;
  onPrimaryContainer: string;
  secondary: string;
  onSecondary: string;
  secondaryContainer: string;
  onSecondaryContainer: string;
  tertiary: string;
  onTertiary: string;
  tertiaryContainer: string;
  onTertiaryContainer: string;
  error: string;
  onError: string;
  errorContainer: string;
  onErrorContainer: string;
  background: string;
  onBackground: string;
  surface: string;
  onSurface: string;
  surfaceVariant: string;
  onSurfaceVariant: string;
  outline: string;
  outlineVariant: string;
  shadow: string;
  scrim: string;
  inverseSurface: string;
  inverseOnSurface: string;
  inversePrimary: string;
  primaryFixed: string;
  onPrimaryFixed: string;
  primaryFixedDim: string;
  onPrimaryFixedVariant: string;
  secondaryFixed: string;
  onSecondaryFixed: string;
  secondaryFixedDim: string;
  onSecondaryFixedVariant: string;
  tertiaryFixed: string;
  onTertiaryFixed: string;
  tertiaryFixedDim: string;
  onTertiaryFixedVariant: string;
  surfaceDim: string;
  surfaceBright: string;
  surfaceContainerLowest: string;
  surfaceContainerLow: string;
  surfaceContainer: string;
  surfaceContainerHigh: string;
  surfaceContainerHighest: string;
};

export const PaletteDark: ColorPalette = {
  primary: '#AAC7FF',
  surfaceTint: '#AAC7FF',
  onPrimary: '#0A305F',
  primaryContainer: '#284777',
  onPrimaryContainer: '#D6E3FF',
  secondary: '#BEC6DC',
  onSecondary: '#283141',
  secondaryContainer: '#3E4759',
  onSecondaryContainer: '#DAE2F9',
  tertiary: '#DDBCE0',
  onTertiary: '#3F2844',
  tertiaryContainer: '#573E5C',
  onTertiaryContainer: '#FAD8FD',
  error: '#FFB4AB',
  onError: '#690005',
  errorContainer: '#93000A',
  onErrorContainer: '#FFDAD6',
  background: '#111318',
  onBackground: '#E2E2E9',
  surface: '#111318',
  onSurface: '#E2E2E9',
  surfaceVariant: '#44474E',
  onSurfaceVariant: '#C4C6D0',
  outline: '#8E9099',
  outlineVariant: '#44474E',
  shadow: '#000000',
  scrim: '#000000',
  inverseSurface: '#E2E2E9',
  inverseOnSurface: '#2E3036',
  inversePrimary: '#415F91',
  primaryFixed: '#D6E3FF',
  onPrimaryFixed: '#001B3E',
  primaryFixedDim: '#AAC7FF',
  onPrimaryFixedVariant: '#284777',
  secondaryFixed: '#DAE2F9',
  onSecondaryFixed: '#131C2B',
  secondaryFixedDim: '#BEC6DC',
  onSecondaryFixedVariant: '#3E4759',
  tertiaryFixed: '#FAD8FD',
  onTertiaryFixed: '#28132E',
  tertiaryFixedDim: '#DDBCE0',
  onTertiaryFixedVariant: '#573E5C',
  surfaceDim: '#111318',
  surfaceBright: '#37393E',
  surfaceContainerLowest: '#0C0E13',
  surfaceContainerLow: '#191C20',
  surfaceContainer: '#1D2024',
  surfaceContainerHigh: '#282A2F',
  surfaceContainerHighest: '#33353A',
};

/* Default ColorPalette Light*/
export const PaletteLight: ColorPalette = {
  primary: '#415F91',
  surfaceTint: '#415F91',
  onPrimary: '#FFFFFF',
  primaryContainer: '#D6E3FF',
  onPrimaryContainer: '#001B3E',
  secondary: '#565F71',
  onSecondary: '#FFFFFF',
  secondaryContainer: '#DAE2F9',
  onSecondaryContainer: '#131C2B',
  tertiary: '#705575',
  onTertiary: '#FFFFFF',
  tertiaryContainer: '#FAD8FD',
  onTertiaryContainer: '#28132E',
  error: '#BA1A1A',
  onError: '#FFFFFF',
  errorContainer: '#FFDAD6',
  onErrorContainer: '#410002',
  background: '#F9F9FF',
  onBackground: '#191C20',
  surface: '#F9F9FF',
  onSurface: '#191C20',
  surfaceVariant: '#E0E2EC',
  onSurfaceVariant: '#44474E',
  outline: '#74777F',
  outlineVariant: '#C4C6D0',
  shadow: '#000000',
  scrim: '#000000',
  inverseSurface: '#2E3036',
  inverseOnSurface: '#F0F0F7',
  inversePrimary: '#AAC7FF',
  primaryFixed: '#D6E3FF',
  onPrimaryFixed: '#001B3E',
  primaryFixedDim: '#AAC7FF',
  onPrimaryFixedVariant: '#284777',
  secondaryFixed: '#DAE2F9',
  onSecondaryFixed: '#131C2B',
  secondaryFixedDim: '#BEC6DC',
  onSecondaryFixedVariant: '#3E4759',
  tertiaryFixed: '#FAD8FD',
  onTertiaryFixed: '#28132E',
  tertiaryFixedDim: '#DDBCE0',
  onTertiaryFixedVariant: '#573E5C',
  surfaceDim: '#D9D9E0',
  surfaceBright: '#F9F9FF',
  surfaceContainerLowest: '#FFFFFF',
  surfaceContainerLow: '#F3F3FA',
  surfaceContainer: '#EDEDF4',
  surfaceContainerHigh: '#E7E8EE',
  surfaceContainerHighest: '#E2E2E9',
};

// const _palettes = {
//   primary: {
//     '0': '#000000',
//     '5': '#00102B',
//     '10': '#001B3E',
//     '15': '#002551',
//     '20': '#002F64',
//     '25': '#033A77',
//     '30': '#194683',
//     '35': '#285290',
//     '40': '#365E9D',
//     '50': '#5177B8',
//     '60': '#6B91D3',
//     '70': '#86ACF0',
//     '80': '#AAC7FF',
//     '90': '#D6E3FF',
//     '95': '#ECF0FF',
//     '98': '#F9F9FF',
//     '99': '#FDFBFF',
//     '100': '#FFFFFF',
//   },
//   secondary: {
//     '0': '#000000',
//     '5': '#09111E',
//     '10': '#141C29',
//     '15': '#1E2634',
//     '20': '#29313F',
//     '25': '#343C4A',
//     '30': '#3F4756',
//     '35': '#4B5362',
//     '40': '#575E6F',
//     '50': '#707788',
//     '60': '#8991A2',
//     '70': '#A4ABBD',
//     '80': '#BFC6D9',
//     '90': '#DBE2F6',
//     '95': '#ECF0FF',
//     '98': '#F9F9FF',
//     '99': '#FDFBFF',
//     '100': '#FFFFFF',
//   },
//   tertiary: {
//     '0': '#000000',
//     '5': '#1B0A21',
//     '10': '#27142C',
//     '15': '#321F37',
//     '20': '#3D2942',
//     '25': '#49344D',
//     '30': '#553F59',
//     '35': '#614B65',
//     '40': '#6E5772',
//     '50': '#886F8B',
//     '60': '#A288A6',
//     '70': '#BEA2C1',
//     '80': '#DABDDD',
//     '90': '#F7D9FA',
//     '95': '#FFEBFE',
//     '98': '#FFF7FB',
//     '99': '#FFFBFF',
//     '100': '#FFFFFF',
//   },
//   neutral: {
//     '0': '#000000',
//     '5': '#101113',
//     '10': '#1B1B1E',
//     '15': '#252628',
//     '20': '#303033',
//     '25': '#3B3B3E',
//     '30': '#464649',
//     '35': '#525255',
//     '40': '#5E5E61',
//     '50': '#77777A',
//     '60': '#919093',
//     '70': '#ACABAE',
//     '80': '#C7C6C9',
//     '90': '#E3E2E5',
//     '95': '#F2F0F3',
//     '98': '#FAF9FC',
//     '99': '#FDFBFF',
//     '100': '#FFFFFF',
//   },
//   'neutral-variant': {
//     '0': '#000000',
//     '5': '#0E1117',
//     '10': '#191C22',
//     '15': '#23262C',
//     '20': '#2E3037',
//     '25': '#393B42',
//     '30': '#44474D',
//     '35': '#505259',
//     '40': '#5C5E65',
//     '50': '#75777E',
//     '60': '#8E9098',
//     '70': '#A9ABB3',
//     '80': '#C5C6CE',
//     '90': '#E1E2EA',
//     '95': '#EFF0F9',
//     '98': '#F9F9FF',
//     '99': '#FDFBFF',
//     '100': '#FFFFFF',
//   },
// };

export const ColorPalette: ColorPalette = PaletteDark;
