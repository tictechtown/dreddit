import Ionicons from '@expo/vector-icons/Ionicons';
import { Image } from 'expo-image';
import { Link, Stack, router } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  FlatList,
  Pressable,
  RefreshControl,
  Text,
  TouchableNativeFeedback,
  TouchableOpacity,
  View,
} from 'react-native';
import { Post, RedditApi } from '../../services/api';
import { useStore } from '../../services/store';
import { Palette } from '../colors';
import IndeterminateProgressBarView from '../components/IndeterminateProgressBarView';
import ItemSeparator from '../components/ItemSeparator';
import { Spacing } from '../typography';
import SortTab from './components/SortTab';
import SubredditPostItemView from './components/SubredditPostItemView';
import { getAllUniqueFlairs } from './utils';

type Props = {
  subreddit: string;
  icon: string | undefined | null;
};

// TODO - merge that with t5 RedditApi
type SubredditData = {
  id: string;
  title: string;
  wiki_enabled: boolean;
  display_name: string;
  icon_img: string;
  created: number;
  display_name_prefixed: string;
  accounts_active: number;
  subscribers: number;
  name: string;
  public_description: string;
  community_icon: string;
  banner_background_image: string;
  description: string;
};

const keyExtractor = (item: Post, index: number) => `${item.data.id}.${index}`;

const SortOrderView = (props: {
  sortOrder: string;
  onSortOrderChanged: (value: 'hot' | 'top' | 'new') => void;
  flairs: string[];
  selectedFlair: string | null;
  onFlairTapped: (value: string) => void;
}) => {
  const _renderFlair = useCallback(
    ({ item }: { item: string }) => {
      return (
        <TouchableOpacity onPress={() => props.onFlairTapped(item)}>
          <View
            style={{
              flex: 0,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor:
                item === props.selectedFlair ? Palette.surfaceVariant : Palette.surface,
              borderRadius: 8,
              borderWidth: 1,
              borderColor: Palette.surfaceVariant,
              paddingHorizontal: Spacing.small,
              paddingVertical: Spacing.xsmall,
              marginRight: Spacing.small,
            }}>
            <Text style={{ color: Palette.onBackground, fontSize: 11 }}>{item}</Text>
          </View>
        </TouchableOpacity>
      );
    },
    [props.flairs, props.selectedFlair, props.onFlairTapped]
  );

  return (
    <>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-around',
          paddingHorizontal: Spacing.regular,
          paddingVertical: Spacing.small,
        }}>
        <SortTab
          tabId={'hot'}
          tabIconName={'local-fire-department'}
          tabSelectedId={props.sortOrder}
          onPress={props.onSortOrderChanged}
        />
        <SortTab
          tabId={'top'}
          tabIconName={'leaderboard'}
          tabSelectedId={props.sortOrder}
          onPress={props.onSortOrderChanged}
        />
        <SortTab
          tabId={'new'}
          tabIconName={'schedule'}
          tabSelectedId={props.sortOrder}
          onPress={props.onSortOrderChanged}
        />
      </View>
      {props.flairs?.length > 0 && (
        <View style={{ marginTop: Spacing.small, marginBottom: Spacing.regular }}>
          <FlatList
            horizontal
            data={props.flairs}
            renderItem={_renderFlair}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingLeft: Spacing.small }}
          />
        </View>
      )}
    </>
  );
};

const SortOrderViewMemo = React.memo(SortOrderView);

const SubRedditView = (props: Props) => {
  const [sortOrder, setSortOrder] = useState<'hot' | 'new' | 'top'>('hot');
  const [subredditData, setSubredditData] = useState<SubredditData | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [after, setAfter] = useState<string | null>(null);
  const [flairs, setFlairs] = useState<string[]>([]);
  const [selectedFlair, setSelectedFlair] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [refreshLoading, setRefreshLoading] = useState(false);
  const [favorites, addToFavorites, removeFromFavorite] = useStore((state) => [
    state.favorites,
    state.addToFavorites,
    state.removeFromFavorite,
  ]);

  const [savedPosts, addToSavedPosts, removeFromSavedPosts] = useStore((state) => [
    state.savedPosts,
    state.addToSavedPosts,
    state.removeFromSavedPosts,
  ]);

  const savedPostIds: Record<string, boolean> = useMemo(() => {
    const result = savedPosts.reduce(function (map: Record<string, boolean>, obj) {
      map[obj.data.id] = true;
      return map;
    }, {});

    return result;
  }, [savedPosts]);

  const flatListRef = React.useRef<FlatList>(null);

  const isFavorite = favorites.map((f) => f.name).includes(props.subreddit);

  useEffect(() => {
    const goFetch = async () => {
      const data = await new RedditApi().getSubreddit(props.subreddit);
      setSubredditData(data);
    };
    goFetch();
  }, [props.subreddit]);

  useEffect(() => {
    const goFetch = async () => {
      const data = await new RedditApi().getSubmissions(sortOrder, props.subreddit, {
        v: `${Date.now()}`,
        t: 'all',
      });

      if (props.subreddit !== 'all') {
        const allFlairs = getAllUniqueFlairs(data?.posts, flairs);
        setFlairs(allFlairs);
      }
      setPosts(data?.posts ?? []);
      setAfter(data?.after);
    };
    goFetch();
    // scroll to top
    flatListRef.current?.scrollToOffset({ animated: true, offset: 0 });
  }, [props.subreddit, sortOrder]);

  const refreshData = async () => {
    setRefreshLoading(true);
    const data = await new RedditApi().getSubmissions(sortOrder, props.subreddit, {
      v: `${Date.now()}`,
    });
    if (props.subreddit !== 'all') {
      const allFlairs = getAllUniqueFlairs(data?.posts, flairs);
      setFlairs(allFlairs);
    }
    setPosts(data?.posts ?? []);
    setAfter(data?.after);
    // scroll to top
    flatListRef.current?.scrollToOffset({ animated: true, offset: 0 });
    setRefreshLoading(false);
  };

  const fetchMoreData = async () => {
    if (!loading && posts.length > 0) {
      setLoading(true);
      const options = after ? { after } : undefined;
      const data = await new RedditApi().getSubmissions(sortOrder, props.subreddit, options);
      setPosts((oldValue) => [...oldValue, ...(data?.posts ?? [])]);
      setAfter(data?.after);
      if (props.subreddit !== 'all') {
        const allFlairs = getAllUniqueFlairs(data?.posts, flairs);
        setFlairs(allFlairs);
      }
      setLoading(false);
    }
  };

  const toggleSubreddit = async () => {
    if (!subredditData) {
      return;
    }
    const entry = {
      id: subredditData.id,
      name: subredditData.display_name,
      icon: subredditData.icon_img !== '' ? subredditData.icon_img : subredditData.community_icon,
      title: subredditData.title,
      description: subredditData?.public_description,
    };

    if (isFavorite) {
      // remove it
      removeFromFavorite(entry);
    } else {
      // add it
      addToFavorites(entry);
    }
  };

  const searchPosts = async () => {
    router.push({ pathname: 'features/subreddit/search', params: { subreddit: props.subreddit } });
  };

  const scrollToTop = useCallback(() => {
    flatListRef.current?.scrollToOffset({ animated: true, offset: 0 });
  }, [flatListRef]);

  const renderItem = useCallback(
    ({ item }: { item: Post }) => {
      return (
        <SubredditPostItemView
          post={item}
          isSaved={savedPostIds[item.data.id]}
          addToSavedPosts={addToSavedPosts}
          removeFromSavedPosts={removeFromSavedPosts}
        />
      );
    },
    [savedPosts]
  );

  const onFlairTapped = useCallback(
    (value: string) => {
      if (selectedFlair === value) {
        setSelectedFlair(null);
      } else {
        setSelectedFlair(value);
      }
    },
    [selectedFlair, setSelectedFlair]
  );

  const filteredData = useMemo(() => {
    if (selectedFlair) {
      return posts.filter((p) => p.data.link_flair_text?.includes(selectedFlair));
    }
    return posts;
  }, [selectedFlair, posts]);

  return (
    <>
      <Stack.Screen
        options={{
          title: props.subreddit,
          headerTitle: (_p) => {
            return (
              <Pressable onPress={scrollToTop}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    marginRight: 280,
                    flexShrink: 1,
                  }}>
                  <Image
                    style={{ width: 32, height: 32, borderRadius: 16, marginRight: 12 }}
                    source={
                      props.icon?.startsWith('http')
                        ? props.icon
                        : require('../../../assets/images/subbit.png')
                    }
                  />
                  <View style={{ flexShrink: 1 }}>
                    <Text
                      style={{
                        color: _p.tintColor,
                        fontWeight: '600',
                        fontSize: 20,
                      }}
                      numberOfLines={1}
                      ellipsizeMode={'tail'}>
                      {props.subreddit}
                    </Text>
                  </View>
                </View>
              </Pressable>
            );
          },

          headerRight: () => {
            return (
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                }}>
                <Link
                  href={{
                    pathname: 'features/subreddit/about',
                    params: { subreddit: props.subreddit },
                  }}
                  asChild>
                  <TouchableNativeFeedback
                    hitSlop={5}
                    background={TouchableNativeFeedback.Ripple(Palette.surfaceVariant, true)}>
                    <View style={{ marginLeft: Spacing.regular }}>
                      <Ionicons
                        name="information-circle-outline"
                        size={26}
                        color={Palette.onBackgroundLowest}
                      />
                    </View>
                  </TouchableNativeFeedback>
                </Link>
                <TouchableNativeFeedback
                  disabled={!subredditData}
                  hitSlop={5}
                  onPress={toggleSubreddit}
                  background={TouchableNativeFeedback.Ripple(Palette.surfaceVariant, true)}>
                  <View style={{ marginLeft: Spacing.regular }}>
                    <Ionicons
                      name={isFavorite ? 'bookmark' : 'bookmark-outline'}
                      size={24}
                      color={Palette.onBackgroundLowest}
                    />
                  </View>
                </TouchableNativeFeedback>
                <TouchableNativeFeedback
                  disabled={!subredditData}
                  hitSlop={5}
                  onPress={searchPosts}
                  background={TouchableNativeFeedback.Ripple(Palette.surfaceVariant, true)}>
                  <View style={{ marginLeft: Spacing.regular }}>
                    <Ionicons name={'search'} size={24} color={Palette.onBackgroundLowest} />
                  </View>
                </TouchableNativeFeedback>
              </View>
            );
          },
        }}
      />

      <View
        style={{
          flex: 1,
          backgroundColor: Palette.backgroundLowest,
        }}>
        <FlatList
          ref={flatListRef}
          data={filteredData}
          ListHeaderComponent={
            <SortOrderViewMemo
              sortOrder={sortOrder}
              onSortOrderChanged={setSortOrder}
              flairs={flairs}
              selectedFlair={selectedFlair}
              onFlairTapped={onFlairTapped}
            />
          }
          renderItem={renderItem}
          onEndReachedThreshold={2}
          onEndReached={fetchMoreData}
          ItemSeparatorComponent={ItemSeparator}
          keyExtractor={keyExtractor}
          refreshControl={
            <RefreshControl
              refreshing={refreshLoading}
              onRefresh={refreshData}
              colors={[Palette.primary]}
              progressBackgroundColor={Palette.background}
            />
          }
        />

        {posts.length === 0 && (
          <View
            style={{
              flex: 5,
              justifyContent: 'flex-start',
              alignItems: 'center',
              paddingHorizontal: 20,
            }}>
            <Image
              style={{ width: 128, height: 128, borderRadius: 64 }}
              source={
                props.icon?.startsWith('http')
                  ? props.icon
                  : require('../../../assets/images/subbit.png')
              }
            />
            <Text
              style={{
                color: Palette.onBackgroundLowest,
                fontWeight: '600',
                fontSize: 36,
                textAlign: 'center',
              }}
              onPress={scrollToTop}>
              r/{props.subreddit}
            </Text>
          </View>
        )}
      </View>
      {loading && (
        <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }}>
          <IndeterminateProgressBarView />
        </View>
      )}
    </>
  );
};
export default SubRedditView;
