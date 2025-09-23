import { Stack } from 'expo-router';
import * as React from 'react';
import useTheme from '@services/theme/useTheme';
import * as Application from 'expo-application';
import { router } from 'expo-router';
import { Pressable, View } from 'react-native';
import { ColorPalette } from '@theme/colors';
import Icons, { IconName } from '@components/Icons';
import Typography from '@components/Typography';

type RowProps = {
  icon: IconName;
  title: string;
  supporting: string;
  theme: ColorPalette;
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
        <Icons name={icon} size={24} color={theme.onSurfaceVariant} />
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

const SettingsPage = () => {
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
            router.push('settings/appTheme');
          }}
        />
        <Row
          icon={'download'}
          title={'Data Usage'}
          supporting={'Customize how picture are loaded'}
          theme={theme}
          onPress={() => {
            router.push('settings/dataUsage');
          }}
        />
        <Row
          icon={'report'}
          title={'Banned Subreddits'}
          supporting={'Customize which subreddits are banned'}
          theme={theme}
          onPress={() => {
            router.push('settings/bannedSubreddits');
          }}
        />
        <Row
          icon={'block'}
          title={'Blocked Users'}
          supporting={'Customize which users are banned'}
          theme={theme}
          onPress={() => {
            router.push('settings/blockedUsers');
          }}
        />

        <Row
          icon={'play-circle-outline'}
          title={'Video Settings'}
          theme={theme}
          supporting={'Customize the in-app video player behavior'}
          onPress={() => {
            router.push('settings/videoPlayer');
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

export default function Page() {
  const theme = useTheme();
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.surface,
      }}>
      <Stack.Screen options={{ title: '' }} />
      <SettingsPage />
    </View>
  );
}
