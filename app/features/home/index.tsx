import Ionicons from '@expo/vector-icons/Ionicons';
import { Link, Stack, useFocusEffect } from 'expo-router';
import React, { useCallback, useMemo } from 'react';
import { FlatList, View } from 'react-native';
import postCache from '../../services/postCache';
import { useStore } from '../../services/store';
import { Palette } from '../colors';
import HomeItem from './components/HomeItem';
import SavedPostsFooter from './components/SavedPostsFooter';
import SearchHeader from './components/SearchHeader';
import { SUBREDDITS } from './fixtures';

const Home = () => {
  const [favorites] = useStore((state) => [state.favorites]);

  useFocusEffect(
    useCallback(() => {
      postCache.clearAll();
    }, [])
  );

  const flatData = useMemo(() => {
    return [...SUBREDDITS, ...favorites].sort((a, b) => a.name.localeCompare(b.name));
  }, [favorites]);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: Palette.background,
      }}>
      <Stack.Screen
        options={{
          title: 'Home',
          headerRight: () => {
            return (
              <Link
                href={{
                  pathname: 'features/settings',
                  params: {},
                }}>
                <Ionicons name="settings-sharp" size={24} color={Palette.onBackground} />
              </Link>
            );
          },
        }}
      />
      <FlatList
        data={flatData}
        ListHeaderComponent={() => <SearchHeader />}
        ListFooterComponent={() => <SavedPostsFooter />}
        renderItem={({ item }) => (
          <HomeItem subreddit={item.name} description={item.description} icon={item.icon} />
        )}
        keyExtractor={(item) => item.name}
        style={{ flex: 1 }}
      />
    </View>
  );
};
export default Home;
