import { router } from 'expo-router';
import { Text, TouchableOpacity, View } from 'react-native';
import { useStore } from '../../../services/store';
import { Palette } from '../../colors';
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
          paddingVertical: Spacing.regular,
          borderRadius: 8,
          flexDirection: 'row',
          backgroundColor: Palette.surface,
          alignItems: 'center',
          marginVertical: Spacing.regular,
          marginHorizontal: Spacing.small,
        }}>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <Text style={{ color: Palette.onBackground, fontSize: 18, fontWeight: 'bold' }}>
            Saved posts
          </Text>

          <Text style={{ color: Palette.onBackground, fontSize: 18, fontWeight: 'bold' }}>
            {totalSavedPost}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default SavedPostsFooter;
