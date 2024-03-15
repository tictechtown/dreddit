import * as React from 'react';
import { Pressable, View } from 'react-native';
import { useStore } from '../../../services/store';
import useTheme from '../../../services/theme/useTheme';
import { ColorPalette } from '../../colors';
import Icons, { IconName } from '../../components/Icons';
import Typography from '../../components/Typography';

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
  const store = useStore((state) => ({
    colorScheme: state.colorScheme,
    updateColorScheme: state.updateColorScheme,
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
          title={'Download everything'}
          theme={theme}
          isSelected={store.colorScheme === 'os'}
          onPress={() => {
            // store.updateColorScheme('os');
          }}
        />
        <Row
          icon={'data-usage'}
          title={'Low resolution preview'}
          theme={theme}
          isSelected={store.colorScheme === 'light'}
          onPress={() => {
            // store.updateColorScheme('light');
          }}
        />
        <Row
          icon={'data-usage'}
          title={'No Preview'}
          theme={theme}
          isSelected={store.colorScheme === 'dark'}
          onPress={() => {
            // store.updateColorScheme('dark');
          }}
        />
      </View>
    </View>
  );
};

export default DataUsageView;
