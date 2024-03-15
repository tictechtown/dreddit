import { Ionicons } from '@expo/vector-icons';
import { Text, TouchableOpacity, View, ViewStyle } from 'react-native';
import useTheme from '../../../services/theme/useTheme';
import Icons from '../../components/Icons';
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
    color: theme.onSurface,
    fontSize: 16,
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
      <Text
        style={{
          color: theme.onBackground,
          fontSize: 24,
          marginBottom: Spacing.s16,
        }}>
        Sort options
      </Text>
      <TouchableOpacity
        style={[choiceContainer, currentSort === 'best' ? selectedChoiceContainer : null]}
        onPress={() => {
          onSortPressed('best');
        }}>
        <Ionicons name="rocket" size={16} color={theme.onSurface} />
        <Text style={choices}>Best</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[choiceContainer, currentSort === 'top' ? selectedChoiceContainer : null]}
        onPress={() => {
          onSortPressed('top');
        }}>
        <Icons name="leaderboard" size={16} color={theme.onSurface} />
        <Text style={choices}>Top</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[choiceContainer, currentSort === 'new' ? selectedChoiceContainer : null]}
        onPress={() => {
          onSortPressed('new');
        }}>
        <Ionicons name="time-outline" size={16} color={theme.onSurface} />

        <Text style={choices}>New</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[choiceContainer, currentSort === 'controversial' ? selectedChoiceContainer : null]}
        onPress={() => {
          onSortPressed('controversial');
        }}>
        <Icons name="question-answer" size={16} color={theme.onSurface} />
        <Text style={choices}>Controversial</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[choiceContainer, currentSort === 'random' ? selectedChoiceContainer : null]}
        onPress={() => {
          onSortPressed('random');
        }}>
        <Icons name="shuffle" size={16} color={theme.onSurface} />
        <Text style={choices}>Random</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SortOptions;
