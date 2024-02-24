import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Palette } from '../../colors';
import { Spacing } from '../../typography';

const SortOptions = ({
  currentSort,
  onSortPressed,
}: {
  currentSort: string | null;
  onSortPressed: (value: string) => void;
}) => {
  return (
    <View style={styles.contentContainer}>
      <Text
        style={{
          color: Palette.onBackgroundLowest,
          fontSize: 24,
          marginBottom: Spacing.regular,
        }}>
        Sort options
      </Text>
      <TouchableOpacity
        style={[
          styles.choiceContainer,
          currentSort === 'best' ? styles.selectedChoiceContainer : null,
        ]}
        onPress={() => {
          onSortPressed('best');
        }}>
        <Ionicons name="rocket" size={16} color={Palette.onSurface} />
        <Text style={styles.choice}>Best</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.choiceContainer,
          currentSort === 'top' ? styles.selectedChoiceContainer : null,
        ]}
        onPress={() => {
          onSortPressed('top');
        }}>
        <MaterialIcons name="leaderboard" size={16} color={Palette.onSurface} />
        <Text style={styles.choice}>Top</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.choiceContainer,
          currentSort === 'new' ? styles.selectedChoiceContainer : null,
        ]}
        onPress={() => {
          onSortPressed('new');
        }}>
        <Ionicons name="time-outline" size={16} color={Palette.onSurface} />

        <Text style={styles.choice}>New</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.choiceContainer,
          currentSort === 'controversial' ? styles.selectedChoiceContainer : null,
        ]}
        onPress={() => {
          onSortPressed('controversial');
        }}>
        <MaterialIcons name="question-answer" size={16} color={Palette.onSurface} />
        <Text style={styles.choice}>Controversial</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.choiceContainer,
          currentSort === 'random' ? styles.selectedChoiceContainer : null,
        ]}
        onPress={() => {
          onSortPressed('random');
        }}>
        <Ionicons name="shuffle" size={16} color={Palette.onSurface} />
        <Text style={styles.choice}>Random</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  backgroundStyle: {
    backgroundColor: Palette.surface,
  },
  contentContainer: {
    flex: 1,
    backgroundColor: Palette.surface,
    paddingHorizontal: Spacing.regular,
  },
  choiceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: Palette.surface,
  },
  selectedChoiceContainer: {
    borderRadius: 10,
    borderColor: Palette.secondaryContainer,
  },
  choice: {
    color: Palette.onSurface,
    fontSize: 16,
    marginVertical: Spacing.small,
    marginLeft: Spacing.small,
  },
});

export default SortOptions;
