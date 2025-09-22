import { Stack } from 'expo-router';
import * as React from 'react';
import { FlatList, View } from 'react-native';
import { Post } from '../../services/api';
import { useStore } from '../../services/store';
import useTheme from '../../services/theme/useTheme';
import ItemSeparator from '../../features/components/ItemSeparator';
import SubredditPostItemView from '../../features/subreddit/feed/components/PostFeedItem';
import { Spacing } from '../../features/tokens';

export default function Page() {
  const theme = useTheme();
  const [savedPosts, addToSavedPosts, removeFromSavedPosts] = useStore((state) => [
    state.savedPosts,
    state.addToSavedPosts,
    state.removeFromSavedPosts,
  ]);

  const savedPostIds: Record<string, boolean> = React.useMemo(() => {
    const result = savedPosts.reduce(function (map: Record<string, boolean>, obj) {
      map[obj.data.id] = true;
      return map;
    }, {});

    return result;
  }, [savedPosts]);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.background,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Stack.Screen options={{ title: 'Saved Posts' }} />
      <View
        style={{
          flex: 1,
          backgroundColor: theme.background,
        }}>
        <FlatList
          data={savedPosts}
          renderItem={({ item }) => (
            <SubredditPostItemView
              post={item as Post}
              isSaved={savedPostIds[item.data.id]}
              addToSavedPosts={addToSavedPosts}
              removeFromSavedPosts={removeFromSavedPosts}
              theme={theme}
            />
          )}
          contentContainerStyle={{ paddingBottom: Spacing.s24 }}
          ItemSeparatorComponent={ItemSeparator}
          keyExtractor={(item, index) => `${item.data.id}.${index}`}
        />
      </View>
    </View>
  );
}
