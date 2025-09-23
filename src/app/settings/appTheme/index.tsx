import { Stack } from 'expo-router';
import * as React from 'react';
import { Pressable, View } from 'react-native';
import { useStore } from '@services/store';
import useTheme from '@services/theme/useTheme';
import { ColorPalette } from '@theme/colors';
import Icons, { IconName } from '@components/Icons';
import Typography from '@components/Typography';

type RowProps = {
  icon: IconName;
  title: string;
  theme: ColorPalette;
  isSelected: boolean;
  onPress: () => void;
};

const Row = ({ icon, title, theme, isSelected, onPress }: RowProps) => {
  return (
    <Pressable onPress={onPress}>
      <View
        style={{
          minHeight: 56,
          paddingVertical: 8,
          paddingLeft: 16,
          paddingRight: 24,
          flexDirection: 'row',
          columnGap: 16,
          alignItems: 'center',
        }}>
        <Icons name={icon} size={24} color={theme.onSurfaceVariant} />
        <View style={{ flex: 1 }}>
          <Typography variant="bodyLarge">{title}</Typography>
        </View>
        <Icons
          name={isSelected ? 'radio-button-checked' : 'radio-button-unchecked'}
          size={24}
          color={isSelected ? theme.primary : theme.onSurface}
        />
      </View>
    </Pressable>
  );
};

const AppThemeView = () => {
  const theme = useTheme();
  const store = useStore((state) => ({
    colorScheme: state.colorScheme,
    updateColorScheme: state.updateColorScheme,
  }));

  return (
    <View style={{ backgroundColor: theme.background }}>
      <Typography
        variant="headlineMedium"
        style={{ marginTop: 40, paddingHorizontal: 16, marginBottom: 28 }}>
        Theme
      </Typography>

      <View>
        <Row
          icon={'brightness-medium'}
          title={'Follow OS setting'}
          theme={theme}
          isSelected={store.colorScheme === 'os'}
          onPress={() => {
            store.updateColorScheme('os');
          }}
        />
        <Row
          icon={'light-mode'}
          title={'Light'}
          theme={theme}
          isSelected={store.colorScheme === 'light'}
          onPress={() => {
            store.updateColorScheme('light');
          }}
        />
        <Row
          icon={'dark-mode'}
          title={'Dark'}
          theme={theme}
          isSelected={store.colorScheme === 'dark'}
          onPress={() => {
            store.updateColorScheme('dark');
          }}
        />
        <Row
          icon={'dark-mode'}
          title={'AMOLED Dark'}
          theme={theme}
          isSelected={store.colorScheme === 'amoled'}
          onPress={() => {
            store.updateColorScheme('amoled');
          }}
        />
      </View>
    </View>
  );
};

export default function Page() {
  const theme = useTheme();
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.surface,
      }}>
      <Stack.Screen options={{ title: '' }} />
      <AppThemeView />
    </View>
  );
}
