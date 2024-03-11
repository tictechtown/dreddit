import { MaterialIcons } from '@expo/vector-icons';
import * as React from 'react';
import { Pressable, View } from 'react-native';
import { Palette } from '../../colors';
import Typography from '../../components/Typography';

type RowProps = {
  icon: string;
  title: string;
  isSelected: boolean;
  onPress: () => void;
};

const Row = ({ icon, title, isSelected, onPress }: RowProps) => {
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
        <MaterialIcons name={icon} size={24} color={Palette.onSurfaceVariant} />
        <View style={{ flex: 1 }}>
          <Typography variant="bodyLarge">{title}</Typography>
        </View>
        <MaterialIcons
          name={isSelected ? 'radio-button-checked' : 'radio-button-unchecked'}
          size={24}
          color={isSelected ? Palette.primary : Palette.onSurface}
        />
      </View>
    </Pressable>
  );
};

const AppThemeView = () => {
  const [selectedOption, setSelectedOption] = React.useState<'os' | 'light' | 'dark' | 'amoled'>(
    'os'
  );

  return (
    <View style={{ backgroundColor: Palette.background }}>
      <Typography
        variant="headlineMedium"
        style={{ marginTop: 40, paddingHorizontal: 16, marginBottom: 28 }}>
        Theme
      </Typography>

      <View>
        <Row
          icon={'brightness-medium'}
          title={'Follow OS setting'}
          isSelected={selectedOption === 'os'}
          onPress={() => {
            setSelectedOption('os');
          }}
        />
        <Row
          icon={'light-mode'}
          title={'Light'}
          isSelected={selectedOption === 'light'}
          onPress={() => {
            setSelectedOption('light');
          }}
        />
        <Row
          icon={'dark-mode'}
          title={'Dark'}
          isSelected={selectedOption === 'dark'}
          onPress={() => {
            setSelectedOption('dark');
          }}
        />
        <Row
          icon={'dark-mode'}
          title={'AMOLED Dark'}
          isSelected={selectedOption === 'amoled'}
          onPress={() => {
            setSelectedOption('amoled');
          }}
        />
      </View>
    </View>
  );
};

export default AppThemeView;
