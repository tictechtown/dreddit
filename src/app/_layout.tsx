import { Material3Theme, useMaterial3Theme } from '@pchmn/expo-material3-theme';
import { ThemeProvider, DefaultTheme } from '@react-navigation/native';
import { Stack } from 'expo-router/stack';
import { useMemo } from 'react';
import { ColorSchemeName } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ThemeContext } from '@services/theme/theme';
import useColorScheme from '@services/theme/useColorScheme';
import { Edge, SafeAreaView } from 'react-native-safe-area-context';

type RNScheme = {
  dark: boolean;
  fonts: any; // TODO
  colors: {
    primary: string;
    background: string;
    card: string;
    text: string;
    border: string;
    notification: string;
  };
};

function convertMD3ToReactNavigation(
  schemes: Material3Theme,
  colorScheme: ColorSchemeName
): RNScheme {
  const scheme = schemes[colorScheme ?? 'light'];
  return {
    ...DefaultTheme,
    dark: colorScheme === 'dark',
    colors: {
      primary: scheme.primary,
      background: scheme.background,
      card: scheme.surfaceContainer,
      text: scheme.onSurface,
      border: scheme.outline,
      notification: scheme.inverseOnSurface,
    },
  };
}

function convertToAmoledIfNeeded(
  schemes: Material3Theme,
  colorScheme: 'light' | 'dark' | 'amoled'
): { schemes: Material3Theme; color: ColorSchemeName } {
  if (colorScheme === 'amoled') {
    schemes.dark.background = '#000';
    schemes.dark.surface = '#000';
    schemes.dark.surfaceContainerLowest = '#000';
    schemes.dark.surfaceContainerLow = '#000';
    schemes.dark.surfaceContainer = '#000';
    schemes.dark.onSurface = '#fff';
    return { schemes, color: 'dark' };
  }
  return { schemes, color: colorScheme };
}

function useMD3(
  theme: Material3Theme,
  colorScheme: 'light' | 'dark' | 'amoled'
): { schemes: Material3Theme; color: ColorSchemeName; rnScheme: RNScheme } {
  const values = useMemo(() => {
    const { schemes, color } = convertToAmoledIfNeeded(theme, colorScheme);
    const rnScheme = convertMD3ToReactNavigation(schemes, color);

    schemes.dark['custom-green'] = '#b0d18b';
    schemes.light['custom-green'] = '#497D00';

    return { schemes, color, rnScheme };
  }, [theme, colorScheme]);

  return values;
}

const EDGES: Edge[] = [];

export default function Layout() {
  const colorScheme = useColorScheme();
  // If the device is not compatible, it will return a theme based on the fallback source color (optional, default to #6750A4)
  const { theme } = useMaterial3Theme({ fallbackSourceColor: '#AAC7FF' });

  const { schemes, color, rnScheme } = useMD3(theme, colorScheme);

  // const { schemes, color } = convertToAmoledIfNeeded(theme, colorScheme);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      {/* @ts-ignore */}
      <ThemeContext.Provider value={schemes[color ?? 'light']}>
        <ThemeProvider value={rnScheme}>
          <SafeAreaView
            edges={EDGES}
            style={{ flex: 1, backgroundColor: schemes[color ?? 'light'].background }}>
            <Stack
              screenOptions={{
                headerStyle: { backgroundColor: schemes[color ?? 'light'].surface },
                // headerBackTitleVisible: false,
                headerShadowVisible: false,
                headerTitleStyle: { color: schemes[color ?? 'light'].onSurface },
                headerTintColor: schemes[color ?? 'light'].onSurface,
              }}
            />
          </SafeAreaView>
        </ThemeProvider>
      </ThemeContext.Provider>
    </GestureHandlerRootView>
  );
}
