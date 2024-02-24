import { Stack } from 'expo-router';
import * as React from 'react';
import { FlatList, View } from 'react-native';
import { useStore } from '../../services/store';
import { Palette } from '../colors';
import ItemSeparator from '../components/ItemSeparator';
import SubredditPostItemView from '../subreddit/components/SubredditPostItemView';

export default function Page() {
  const [savedPosts, addToSavedPosts, removeFromSavedPosts] = useStore((state) => [
    state.savedPosts,
    state.addToSavedPosts,
    state.removeFromSavedPosts,
  ]);

  const savedPostIds: Record<string, boolean> = React.useMemo(() => {
    var result = savedPosts.reduce(function (map: Record<string, boolean>, obj) {
      map[obj.data.id] = true;
      return map;
    }, {});

    return result;
  }, [savedPosts]);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: Palette.backgroundLowest,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Stack.Screen options={{ title: 'Saved Posts' }} />
      <View
        style={{
          flex: 1,
          backgroundColor: Palette.backgroundLowest,
        }}>
        <FlatList
          data={savedPosts}
          renderItem={({ item }) => (
            <SubredditPostItemView
              post={item}
              isSaved={savedPostIds[item.data.id]}
              addToSavedPosts={addToSavedPosts}
              removeFromSavedPosts={removeFromSavedPosts}
            />
          )}
          ItemSeparatorComponent={ItemSeparator}
          keyExtractor={(item, index) => `${item.data.id}.${index}`}
        />
      </View>
    </View>
  );
}
