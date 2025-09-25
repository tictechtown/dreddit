import Typography from '@components/Typography';
import useTheme from '@services/theme/useTheme';
import { useEvent } from 'expo';
import { VideoPlayer } from 'expo-video';
import { View } from 'react-native';

function formatDurationForDisplay(duration_s: number) {
  if (!Number.isFinite(duration_s)) {
    return '--:--';
  }
  const totalSeconds = duration_s;
  const seconds = String(Math.floor(totalSeconds % 60));
  const minutes = String(Math.floor(totalSeconds / 60));

  return minutes.padStart(1, '0') + ':' + seconds.padStart(2, '0');
}

export default function VideoPlayerTiming({ player }: { player: VideoPlayer }) {
  const theme = useTheme();
  const { currentTime } = useEvent(player, 'timeUpdate', {
    currentTime: 0,
    currentLiveTimestamp: 0,
    currentOffsetFromLive: 0,
    bufferedPosition: 0,
  });

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
      }}>
      <Typography variant="bodyMedium" style={{ color: theme.onSurface }}>
        {formatDurationForDisplay(currentTime)}
        <Typography variant="bodyMedium" style={{ color: theme.onSurfaceVariant }}>
          / {formatDurationForDisplay(player.duration)}
        </Typography>
      </Typography>
    </View>
  );
}
