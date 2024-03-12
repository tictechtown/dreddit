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

export default function Layout() {
  const colorScheme = useColorScheme();
  // If the device is not compatible, it will return a theme based on the fallback source color (optional, default to #6750A4)
  const { theme: schemes } = useMaterial3Theme({ fallbackSourceColor: '#AAC7FF' });

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      {/* @ts-ignore */}
      <ThemeContext.Provider value={schemes[colorScheme ?? 'light']}>
        <ThemeProvider value={convertMD3ToReactNavigation(schemes, colorScheme)}>
          <Stack
            screenOptions={{
              headerStyle: {
                backgroundColor: schemes[colorScheme ?? 'light'].surface,
              },
              headerShadowVisible: false,
              headerTintColor: schemes[colorScheme ?? 'light'].onSurface,
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
