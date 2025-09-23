import { Stack } from 'expo-router';
import useTheme from '@services/theme/useTheme';
import * as React from 'react';
import { Pressable, View } from 'react-native';
import { DataUsage, useStore } from '@services/store';
import { ColorPalette } from '../../../colors';
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

const DataUsageView = () => {
  const theme = useTheme();
  const { dataUsage, setDataUsage } = useStore((state) => ({
    dataUsage: state.dataUsage,
    setDataUsage: state.setDataUsage,
  }));

  return (
    <View style={{ backgroundColor: theme.background }}>
      <Typography
        variant="headlineMedium"
        style={{ marginTop: 40, paddingHorizontal: 16, marginBottom: 28 }}>
        Data Usage
      </Typography>

      <View>
        <Row
          icon={'data-usage'}
          title={'Highest resolution preview'}
          theme={theme}
          isSelected={dataUsage === DataUsage.All}
          onPress={() => {
            setDataUsage(DataUsage.All);
          }}
        />
        <Row
          icon={'data-usage'}
          title={'Lowest resolution preview'}
          theme={theme}
          isSelected={dataUsage === DataUsage.Reduced}
          onPress={() => {
            setDataUsage(DataUsage.Reduced);
          }}
        />
        <Row
          icon={'data-usage'}
          title={'No Preview'}
          theme={theme}
          isSelected={dataUsage === DataUsage.None}
          onPress={() => {
            setDataUsage(DataUsage.None);
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
      <DataUsageView />
    </View>
  );
}
