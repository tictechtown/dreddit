import { router } from 'expo-router';
import { TouchableNativeFeedback, View } from 'react-native';
import useTheme from '@services/theme/useTheme';
import Icons from '@components/Icons';
import Typography from '@components/Typography';
import { Spacing } from '@theme/tokens';

const SearchHeader = () => {
  const theme = useTheme();

  return (
    <View
      style={{
        marginBottom: Spacing.s16,
        marginHorizontal: Spacing.s12,
        borderRadius: 32,
        overflow: 'hidden',
      }}>
      <TouchableNativeFeedback
        background={TouchableNativeFeedback.Ripple(theme.surfaceVariant, false)}
        onPress={() => {
          router.push('search');
        }}>
        <View
          style={{
            height: 48,
            paddingHorizontal: Spacing.s16,
            borderRadius: 32,
            backgroundColor: theme.surfaceContainerHigh,
            alignItems: 'center',
            flexDirection: 'row',
            columnGap: 16,
          }}>
          <Icons name="search" size={24} color={theme.onBackground} />

          <Typography variant="bodyLarge">Search Reddit</Typography>
        </View>
      </TouchableNativeFeedback>
    </View>
  );
};

export default SearchHeader;
