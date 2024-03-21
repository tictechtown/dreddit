import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity, View, ViewStyle } from 'react-native';
import useTheme from '../../../services/theme/useTheme';
import Icons from '../../components/Icons';
import Typography from '../../components/Typography';
import { Spacing } from '../../tokens';

const SortOptions = ({
  currentSort,
  onSortPressed,
}: {
  currentSort: string | null;
  onSortPressed: (value: string) => void;
}) => {
  const theme = useTheme();

  const choiceContainer: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: theme.surface,
  };

  const selectedChoiceContainer = {
    borderRadius: 10,
    borderColor: theme.secondaryContainer,
  };

  const choices = {
    marginVertical: Spacing.s12,
    marginLeft: Spacing.s12,
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.surface,
        paddingHorizontal: Spacing.s16,
      }}>
      <Typography
        variant="titleLarge"
        style={{
          marginBottom: Spacing.s16,
        }}>
        Sort options
      </Typography>
      <TouchableOpacity
        style={[choiceContainer, currentSort === 'best' ? selectedChoiceContainer : null]}
        onPress={() => {
          onSortPressed('best');
        }}>
        <Ionicons name="rocket" size={16} color={theme.onSurface} />
        <Typography variant="bodyLarge" style={choices}>
          Best
        </Typography>
      </TouchableOpacity>
      <TouchableOpacity
        style={[choiceContainer, currentSort === 'top' ? selectedChoiceContainer : null]}
        onPress={() => {
          onSortPressed('top');
        }}>
        <Icons name="leaderboard" size={16} color={theme.onSurface} />
        <Typography variant="bodyLarge" style={choices}>
          Top
        </Typography>
      </TouchableOpacity>
      <TouchableOpacity
        style={[choiceContainer, currentSort === 'new' ? selectedChoiceContainer : null]}
        onPress={() => {
          onSortPressed('new');
        }}>
        <Ionicons name="time-outline" size={16} color={theme.onSurface} />

        <Typography variant="bodyLarge" style={choices}>
          New
        </Typography>
      </TouchableOpacity>
      <TouchableOpacity
        style={[choiceContainer, currentSort === 'controversial' ? selectedChoiceContainer : null]}
        onPress={() => {
          onSortPressed('controversial');
        }}>
        <Icons name="question-answer" size={16} color={theme.onSurface} />
        <Typography variant="bodyLarge" style={choices}>
          Controversial
        </Typography>
      </TouchableOpacity>
      <TouchableOpacity
        style={[choiceContainer, currentSort === 'random' ? selectedChoiceContainer : null]}
        onPress={() => {
          onSortPressed('random');
        }}>
        <Icons name="shuffle" size={16} color={theme.onSurface} />
        <Typography variant="bodyLarge" style={choices}>
          Random
        </Typography>
      </TouchableOpacity>
    </View>
  );
};

export default SortOptions;
