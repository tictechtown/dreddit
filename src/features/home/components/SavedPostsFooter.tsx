import { router } from 'expo-router';
import { TouchableOpacity, View } from 'react-native';
import { useStore } from '@services/store';
import useTheme from '@services/theme/useTheme';
import Typography from '@components/Typography';
import { Spacing } from '@theme/tokens';

const SavedPostsFooter = () => {
  const theme = useTheme();
  const totalSavedPost = useStore((state) => state.savedPosts.length);

  return (
    <TouchableOpacity
      onPress={() => {
        router.push('savedposts');
      }}>
      <View
        style={{
          flex: 1,
          paddingHorizontal: Spacing.s16,
          flexDirection: 'row',
          alignItems: 'center',
          marginVertical: Spacing.s16,
          marginHorizontal: Spacing.s12,
        }}>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-between',
            borderTopColor: theme.outlineVariant,
            borderTopWidth: 1,
            paddingVertical: Spacing.s16,
          }}>
          <Typography variant="bodyLarge">Saved posts</Typography>
          <Typography variant="labelMedium">{totalSavedPost}</Typography>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default SavedPostsFooter;
