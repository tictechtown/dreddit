import { Material3Theme, useMaterial3Theme } from '@pchmn/expo-material3-theme';
import { ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router/stack';
import { ColorSchemeName } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ThemeContext } from './services/theme/theme';
import useColorScheme from './services/theme/useColorScheme';

function convertMD3ToReactNavigation(
  schemes: Material3Theme,
  colorScheme: ColorSchemeName
): {
  dark: boolean;
  colors: {
    primary: string;
    background: string;
    card: string;
    text: string;
    border: string;
    notification: string;
  };
} {
  const scheme = schemes[colorScheme ?? 'light'];
  return {
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

export default function Layout() {
  const colorScheme = useColorScheme();
  // If the device is not compatible, it will return a theme based on the fallback source color (optional, default to #6750A4)
  const { theme } = useMaterial3Theme({ fallbackSourceColor: '#AAC7FF' });

  const { schemes, color } = convertToAmoledIfNeeded(theme, colorScheme);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      {/* @ts-ignore */}
      <ThemeContext.Provider value={schemes[color ?? 'light']}>
        <ThemeProvider value={convertMD3ToReactNavigation(schemes, color)}>
          <Stack
            screenOptions={{
              headerStyle: {
                backgroundColor: schemes[color ?? 'light'].surface,
              },
              headerShadowVisible: false,
              headerTintColor: schemes[color ?? 'light'].onSurface,
              navigationBarColor: 'transparent',
            }}>
            <Stack.Screen getId={({ params }) => params?.id} name="features/subreddit/[id]" />
            <Stack.Screen getId={({ params }) => params?.id} name="features/post/[id]" />
          </Stack>
        </ThemeProvider>
      </ThemeContext.Provider>
    </GestureHandlerRootView>
  );
}
