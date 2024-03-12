import { MaterialIcons } from '@expo/vector-icons';
import * as Application from 'expo-application';
import { router } from 'expo-router';
import * as React from 'react';
import { Pressable, View } from 'react-native';
import useTheme from '../../services/theme/useTheme';
import { Palette } from '../colors';
import Typography from '../components/Typography';

type RowProps = {
  icon: string;
  title: string;
  supporting: string;
  theme: Palette;
  onPress: () => void;
};

const Row = ({ icon, title, supporting, theme, onPress }: RowProps) => {
  return (
    <Pressable onPress={onPress}>
      <View
        style={{
          minHeight: 72,
          paddingVertical: 8,
          paddingLeft: 16,
          paddingRight: 24,
          flexDirection: 'row',
          columnGap: 16,
          alignItems: 'center',
        }}>
        <MaterialIcons name={icon} size={24} color={theme.onSurfaceVariant} />
        <View>
          <Typography variant="bodyLarge">{title}</Typography>
          <Typography variant="bodyMedium" style={{ color: theme.onSurfaceVariant }}>
            {supporting}
          </Typography>
        </View>
      </View>
    </Pressable>
  );
};

const SettingsView = () => {
  const theme = useTheme();

  return (
    <View style={{ backgroundColor: theme.background }}>
      <Typography
        variant="headlineMedium"
        style={{ marginTop: 40, marginBottom: 28, paddingHorizontal: 16 }}>
        Settings
      </Typography>

      <View>
        <Row
          icon={'dark-mode'}
          title={'Theme'}
          supporting={'Customize app theme'}
          theme={theme}
          onPress={() => {
            router.push('features/settings/appTheme');
          }}
        />
        <Row
          icon={'download'}
          title={'Data Usage'}
          supporting={'Customize how picture are loaded'}
          theme={theme}
          onPress={() => {
            router.push('features/settings/dataUsage');
          }}
        />
        <Row
          icon={'person'}
          title={'App Info'}
          theme={theme}
          supporting={`${Application.nativeApplicationVersion}#${Application.nativeBuildVersion}`}
          onPress={() => {}}
        />
      </View>
    </View>
  );
};

export default SettingsView;
