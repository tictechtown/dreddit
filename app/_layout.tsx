import { DarkTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router/stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Palette } from './features/colors';

export default function Layout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider value={DarkTheme}>
        <Stack
          screenOptions={{
            headerStyle: {
              backgroundColor: Palette.backgroundLowest,
            },
            headerTintColor: Palette.onBackgroundLowest,
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}>
          <Stack.Screen getId={({ params }) => params?.id} name="features/subreddit/[id]" />
          <Stack.Screen getId={({ params }) => params?.id} name="features/post/[id]" />
        </Stack>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
