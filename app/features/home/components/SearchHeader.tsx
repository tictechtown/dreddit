import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { TouchableNativeFeedback, View } from 'react-native';
import useTheme from '../../../services/theme/useTheme';
import Typography from '../../components/Typography';
import { Spacing } from '../../typography';

const SearchHeader = () => {
  const theme = useTheme();

  return (
    <TouchableNativeFeedback
      style={{ flex: 1 }}
      background={TouchableNativeFeedback.Ripple(theme.surfaceVariant, false)}
      onPress={() => {
        router.push('features/search');
      }}>
      <View
        style={{
          height: 48,
          marginHorizontal: Spacing.small,
          paddingHorizontal: Spacing.regular,
          borderRadius: 32,
          backgroundColor: theme.surfaceContainerHigh,
          alignItems: 'center',
          marginBottom: Spacing.regular,
          flexDirection: 'row',
          columnGap: 16,
        }}>
        <MaterialIcons name="search" size={24} color={theme.onBackground} />

        <Typography variant="bodyLarge">Search Reddit</Typography>
      </View>
    </TouchableNativeFeedback>
  );
};

export default SearchHeader;
