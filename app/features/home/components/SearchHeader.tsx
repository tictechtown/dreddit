import { router } from 'expo-router';
import { TouchableNativeFeedback, View } from 'react-native';
import useTheme from '../../../services/theme/useTheme';
import Icons from '../../components/Icons';
import Typography from '../../components/Typography';
import { Spacing } from '../../tokens';

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
          marginHorizontal: Spacing.s12,
          paddingHorizontal: Spacing.s16,
          borderRadius: 32,
          backgroundColor: theme.surfaceContainerHigh,
          alignItems: 'center',
          marginBottom: Spacing.s16,
          flexDirection: 'row',
          columnGap: 16,
        }}>
        <Icons name="search" size={24} color={theme.onBackground} />

        <Typography variant="bodyLarge">Search Reddit</Typography>
      </View>
    </TouchableNativeFeedback>
  );
};

export default SearchHeader;
