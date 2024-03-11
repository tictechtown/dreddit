import { router } from 'expo-router';
import { TouchableOpacity, View } from 'react-native';
import { useStore } from '../../../services/store';
import { Palette } from '../../colors';
import Typography from '../../components/Typography';
import { Spacing } from '../../typography';

const SavedPostsFooter = () => {
  const totalSavedPost = useStore((state) => state.savedPosts.length);

  return (
    <TouchableOpacity
      onPress={() => {
        router.push('features/savedposts');
      }}>
      <View
        style={{
          flex: 1,
          paddingHorizontal: Spacing.regular,
          flexDirection: 'row',
          alignItems: 'center',
          marginVertical: Spacing.regular,
          marginHorizontal: Spacing.small,
        }}>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-between',
            borderTopColor: Palette.outlineVariant,
            borderTopWidth: 1,
            paddingVertical: Spacing.regular,
          }}>
          <Typography variant="bodyLarge">Saved posts</Typography>
          <Typography variant="labelMedium">{totalSavedPost}</Typography>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default SavedPostsFooter;
