import { View } from 'react-native';
import useTheme from '@services/theme/useTheme';
import Typography from '@components/Typography';
import { Spacing } from '@theme/tokens';

interface Props {
  option: {
    text: string;
    id: string;
    vote_count?: number;
  };
  total: number;
}

const PollOption = (props: Props) => {
  const theme = useTheme();
  const showVotes = props.option.vote_count !== undefined;

  return (
    <View
      style={{
        marginVertical: 4,
      }}>
      <View
        style={{
          position: 'absolute',
          backgroundColor: theme.secondaryContainer,
          borderRadius: 4,
          top: 0,
          bottom: 0,
          width: `${
            showVotes ? Math.round(100 * ((props.option.vote_count ?? 0) / props.total)) : 100
          }%`,
        }}></View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingVertical: Spacing.s12,
          paddingHorizontal: Spacing.s16,
        }}>
        <Typography variant="bodyMedium">{props.option.text}</Typography>
        {showVotes && <Typography variant="bodyMedium">{props.option.vote_count}</Typography>}
      </View>
    </View>
  );
};

export default PollOption;
