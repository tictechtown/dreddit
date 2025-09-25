import Slider from '@react-native-community/slider';
import useTheme from '@services/theme/useTheme';
import { useEvent } from 'expo';
import { VideoPlayer } from 'expo-video';

export default function VideoPlayerSlider({ player }: { player: VideoPlayer }) {
  const theme = useTheme();
  const { currentTime } = useEvent(player, 'timeUpdate', {
    currentTime: 0,
    currentLiveTimestamp: 0,
    currentOffsetFromLive: 0,
    bufferedPosition: 0,
  });

  return (
    <Slider
      style={{
        flex: 1,
        width: '100%',
        height: 40,
        borderRadius: 2,
      }}
      tapToSeek={true}
      minimumTrackTintColor={theme.primary}
      maximumTrackTintColor={theme.secondaryContainer}
      thumbTintColor={theme.primary}
      value={player.duration ? currentTime / player.duration : 0}
      onSlidingComplete={async (e) => {
        if (Number.isFinite(player.duration)) {
          player.currentTime = e * player.duration;
        }
      }}
    />
  );
}
