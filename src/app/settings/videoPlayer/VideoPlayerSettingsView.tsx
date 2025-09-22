import * as React from 'react';
import { Switch, View } from 'react-native';
import { useStore } from '../../../services/store';
import useTheme from '../../../services/theme/useTheme';
import { ColorPalette } from '../../../colors';
import Icons, { IconName } from '../../../features/components/Icons';
import Typography from '../../../features/components/Typography';

type RowProps = {
  icon: IconName;
  title: string;
  theme: ColorPalette;
  isSelected: boolean;
  onPress: (value: boolean) => void;
};

const Row = ({ icon, title, theme, isSelected, onPress }: RowProps) => {
  return (
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
      <Switch
        value={isSelected}
        trackColor={{
          false: theme.surfaceContainerHighest,
          true: theme.primary,
        }}
        thumbColor={isSelected ? theme.onPrimary : theme.outline}
        onValueChange={(newValue) => {
          onPress(newValue);
        }}
      />
    </View>
  );
};

const VideoPlayerSettingsView = () => {
  const theme = useTheme();
  const store = useStore((state) => ({
    videoSoundOn: state.videoStartSound,
    updateVideoSound: state.updateVideoStartSound,
  }));

  return (
    <View style={{ backgroundColor: theme.background }}>
      <Typography
        variant="headlineMedium"
        style={{ marginTop: 40, paddingHorizontal: 16, marginBottom: 28 }}>
        Video Settings
      </Typography>

      <View>
        <Row
          icon={'volume-up'}
          title={'Sound is enabled at start'}
          theme={theme}
          isSelected={store.videoSoundOn}
          onPress={(newState) => {
            store.updateVideoSound(newState);
          }}
        />
      </View>
    </View>
  );
};

export default VideoPlayerSettingsView;
