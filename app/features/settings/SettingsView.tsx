import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import * as React from 'react';
import { Pressable, View } from 'react-native';
import { Palette } from '../colors';
import Typography from '../components/Typography';

type RowProps = {
  icon: string;
  title: string;
  supporting: string;
  onPress: () => void;
};

const Row = ({ icon, title, supporting, onPress }: RowProps) => {
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
        <MaterialIcons name={icon} size={24} color={Palette.onSurfaceVariant} />
        <View>
          <Typography variant="bodyLarge">{title}</Typography>
          <Typography variant="bodyMedium" style={{ color: Palette.onSurfaceVariant }}>
            {supporting}
          </Typography>
        </View>
      </View>
    </Pressable>
  );
};

const SettingsView = () => {
  return (
    <View style={{ backgroundColor: Palette.background }}>
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
          onPress={() => {
            router.push('features/settings/appTheme');
          }}
        />
        <Row
          icon={'download'}
          title={'Data Usage'}
          supporting={'Customize how picture are loaded'}
          onPress={() => {
            router.push('features/settings/dataUsage');
          }}
        />
        <Row icon={'person'} title={'App Info'} supporting={'v1.0.0'} onPress={() => {}} />
      </View>
    </View>
  );
};

export default SettingsView;
