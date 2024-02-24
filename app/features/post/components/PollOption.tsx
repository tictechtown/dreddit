import { Text, View } from 'react-native';
import { Palette } from '../../colors';
import { Spacing } from '../../typography';

type Props = {
  option: {
    text: string;
    id: string;
    vote_count?: number;
  };
  total: number;
};

const PollOption = (props: Props) => {
  const showVotes = props.option.vote_count !== undefined;

  return (
    <View
      style={{
        marginVertical: 4,
      }}>
      <View
        style={{
          position: 'absolute',
          backgroundColor: Palette.secondaryContainer,
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
          paddingVertical: Spacing.small,
          paddingHorizontal: Spacing.regular,
        }}>
        <Text style={{ color: Palette.onBackgroundLowest }}>{props.option.text}</Text>
        {showVotes && (
          <Text style={{ color: Palette.onBackgroundLowest }}>{props.option.vote_count}</Text>
        )}
      </View>
    </View>
  );
};

export default PollOption;
