import Ionicons from '@expo/vector-icons/Ionicons';
import { Stack, useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useMemo } from 'react';
import { FlatList, Pressable, View } from 'react-native';
import postCache from '@services/postCache';
import type { SubredditFavorite } from '../../services/store';
import { useStore } from '../../services/store';
import useTheme from '@services/theme/useTheme';
import HomeItem from '@features/home/components/HomeItem';
import SavedPostsFooter from '@features/home/components/SavedPostsFooter';
import SearchHeader from '@features/home/components/SearchHeader';
import { RedditApi } from '@services/api';

const HomePage = () => {
  const theme = useTheme();
  const router = useRouter();
  const [favorites, updateFavorite] = useStore((state) => [state.favorites, state.updateFavorite]);

  useFocusEffect(
    useCallback(() => {
      postCache.clearAll();
    }, []),
  );

  const flatData = useMemo(() => {
    return favorites.sort((a, b) => a.name.localeCompare(b.name));
  }, [favorites]);

  const refreshIcon = useCallback(
    async (favorite: SubredditFavorite) => {
      const subredditData = await new RedditApi().getSubreddit(favorite.name);
      const currentIcon = favorite.icon;
      const potentialNewIcon =
        subredditData.icon_img !== '' ? subredditData.icon_img : subredditData.community_icon;
      if (currentIcon !== potentialNewIcon && potentialNewIcon !== '') {
        console.log('updating icon', { favorite, potentialNewIcon });
        updateFavorite({ ...favorite, icon: potentialNewIcon });
      } else {
        console.log('test', { favorite, potentialNewIcon });
      }
    },
    [updateFavorite],
  );

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.background,
      }}>
      <Stack.Screen
        options={{
          title: 'Home',
          headerRight: () => {
            return (
              <Pressable
                onPressIn={() => {
                  router.push('/settings');
                }}>
                <Ionicons name="settings-sharp" size={24} color={theme.onBackground} />
              </Pressable>
            );
          },
        }}
      />
      <FlatList
        data={flatData}
        ListHeaderComponent={() => <SearchHeader />}
        ListFooterComponent={() => <SavedPostsFooter />}
        renderItem={({ item }) => (
          <HomeItem
            subreddit={item.name}
            description={item.description}
            icon={item.icon}
            onIconNotFoundError={() => {
              refreshIcon(item);
            }}
          />
        )}
        keyExtractor={(item) => item.name}
        style={{ flex: 1 }}
      />
    </View>
  );
};
export default HomePage;
