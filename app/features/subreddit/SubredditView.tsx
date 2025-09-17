import { BottomSheetModal, BottomSheetModalProvider } from '@gorhom/bottom-sheet';

import { Stack, router } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  FlatList,
  Pressable,
  RefreshControl,
  Text,
  TouchableNativeFeedback,
  View,
} from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { Post, RedditApi, SubReddit } from '../../services/api';
import { useStore } from '../../services/store';
import useTheme from '../../services/theme/useTheme';
import Icons from '../components/Icons';
import IndeterminateProgressBarView from '../components/IndeterminateProgressBarView';
import ItemSeparator from '../components/ItemSeparator';
import SubredditIcon from '../components/SubredditIcon';
import Tabs from '../components/Tabs';
import ToastView from '../components/ToastView';
import Typography from '../components/Typography';
import ModalOptionRow from './components/ModalOptionRow';
import PostItemBottomSheet from './components/PostItemBottomSheet';
import SubredditPostItemView from './components/SubredditPostItemView';

type Props = { subreddit: string; icon: string | undefined | null };

const keyExtractor = (item: Post, index: number) => `${item.data.id}.${index}`;

const filterPosts = (
  posts: Post[] | undefined,
  blockedUsers: string[],
  bannedSubreddits: string[]
): Post[] => {
  const v = (posts ?? []).filter((p: Post) => {
    return (
      !blockedUsers.includes(p.data.author) &&
      !bannedSubreddits.includes(p.data.subreddit_name_prefixed)
    );
  });
  return v;
};

type SortOrderProps = {
  sortOrder: string;
  onSortOrderChanged: (value: string) => void;
  flairs: string[];
  selectedFlair: string | null;
  onFlairTapped: (value: string) => void;
};

const SortOrderView = (props: SortOrderProps) => {
  return (
    <Tabs
      selectedTabId={props.sortOrder}
      tabIds={['hot', 'top', 'new']}
      tabNames={['Hot', 'Top', 'New']}
      tabIconNames={['local-fire-department', 'leaderboard', 'schedule']}
      onPress={props.onSortOrderChanged}
    />
  );
};

const SortOrderViewMemo = React.memo(SortOrderView);

const SubRedditView = (props: Props) => {
  const theme = useTheme();
  const [sortOrder, setSortOrder] = useState<'hot' | 'new' | 'top'>('hot');

  // hour, day, week, month, year, all
  const [topOrder, setTopOrder] = useState<'day' | 'week' | 'month' | 'year' | 'all'>('all');

  const [subredditData, setSubredditData] = useState<SubReddit['data'] | null>(null);
  const [error, setError] = useState<string | null>(null);
  // toasts
  const [displayUserBlockedToast, setDisplayUserBlockedToast] = useState(false);
  const [displaySubredditBannedToast, setDisplaySubredditBannedToast] = useState(false);

  const [posts, setPosts] = useState<Post[]>([]);
  const [after, setAfter] = useState<string | null>(null);
  const [flairs] = useState<string[]>([]);
  const [selectedFlair, setSelectedFlair] = useState<string | null>(null);
  const [showingModal, setShowingModal] = useState<{
    display: boolean;
    post: Post | null;
    popup: boolean;
  }>({ display: false, post: null, popup: false });

  const [loading, setLoading] = useState(false);
  const [refreshLoading, setRefreshLoading] = useState(false);
  const [favorites, addToFavorites, removeFromFavorite] = useStore((state) => [
    state.favorites,
    state.addToFavorites,
    state.removeFromFavorite,
  ]);

  const [savedPosts, blockedUsers, bannedSubreddits, addToSavedPosts, removeFromSavedPosts] =
    useStore((state) => [
      state.savedPosts,
      state.blockedUsers,
      state.blockedSubreddits,
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

  const opacityValue = useSharedValue(0);
  const animatedStyle = useAnimatedStyle(() => {
    return { opacity: opacityValue.value };
  }, []);

  // ref
  const bottomSheetModalRef = React.useRef<BottomSheetModal>(null);
  const flatListRef = React.useRef<FlatList>(null);
  // variables
  const snapPoints = useMemo(() => ['50%'], []);

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
      setError(null);
      const data = await new RedditApi().getSubmissions(sortOrder, props.subreddit, {
        v: `${Date.now()}`,
        t: topOrder,
      });

      setPosts(filterPosts(data?.posts, blockedUsers, bannedSubreddits));
      setAfter(data?.after);
      if (data === undefined) {
        console.log('data', data);
        setError('error');
      }
    };
    goFetch();
    // scroll to top
    flatListRef.current?.scrollToOffset({ animated: true, offset: 0 });
  }, [props.subreddit, sortOrder, topOrder, blockedUsers, bannedSubreddits]);

  const refreshData = async () => {
    setRefreshLoading(true);
    const data = await new RedditApi().getSubmissions(sortOrder, props.subreddit, {
      v: `${Date.now()}`,
      t: topOrder,
    });
    setPosts(filterPosts(data?.posts, blockedUsers, bannedSubreddits));
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
      setPosts((oldValue) => [
        ...oldValue,
        ...filterPosts(data?.posts, blockedUsers, bannedSubreddits),
      ]);
      setAfter(data?.after);
      // if (props.subreddit !== 'all') {
      //   const allFlairs = getAllUniqueFlairs(data?.posts, flairs);
      //   setFlairs(allFlairs);
      // }
      setLoading(false);
    }
  };

  const toggleSubreddit = useCallback(async () => {
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
  }, [!!subredditData, isFavorite]);

  const searchPosts = useCallback(async () => {
    router.push({ pathname: 'features/subreddit/search', params: { subreddit: props.subreddit } });
  }, [router]);

  const scrollToTop = useCallback(() => {
    flatListRef.current?.scrollToOffset({ animated: true, offset: 0 });
  }, [flatListRef]);

  const showMoreOptions = useCallback(
    (post: Post) => {
      setShowingModal({ display: true, post, popup: false });
      opacityValue.value = withTiming(0.6);
      bottomSheetModalRef.current?.present();
    },
    [setShowingModal]
  );

  const renderItem = useCallback(
    ({ item }: { item: Post }) => {
      return (
        <SubredditPostItemView
          post={item}
          theme={theme}
          isSaved={savedPostIds[item.data.id]}
          addToSavedPosts={addToSavedPosts}
          removeFromSavedPosts={removeFromSavedPosts}
          onMoreOptions={showMoreOptions}
        />
      );
    },
    [savedPosts, theme]
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

  const onSortOrderChanged = useCallback(
    (value: string) => {
      if (value === 'hot' || value == 'new') {
        setSortOrder(value);
      } else {
        setShowingModal({ display: true, post: null, popup: true });
        opacityValue.value = withTiming(0.6);
        // display popup
      }
    },
    [setSortOrder]
  );

  const filteredData = useMemo(() => {
    if (selectedFlair) {
      return posts.filter((p) => p.data.link_flair_text?.includes(selectedFlair));
    }
    return posts;
  }, [selectedFlair, posts]);

  const HeaderTitle = useCallback(
    (_p: any) => {
      return (
        <Pressable onPress={scrollToTop}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'flex-start',
              flexShrink: 1,
              columnGap: 12,
            }}>
            <SubredditIcon size={32} icon={props.icon} nsfw={false} />
            <View style={{ flex: 1 }}>
              <Text
                style={{ color: _p.tintColor, fontWeight: '600', fontSize: 20 }}
                numberOfLines={1}
                ellipsizeMode={'tail'}>
                {props.subreddit}
              </Text>
            </View>
          </View>
        </Pressable>
      );
    },
    [scrollToTop, props.subreddit]
  );

  const HeaderRight = useCallback(() => {
    return (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'flex-end',
          columnGap: 8,
        }}>
        <TouchableNativeFeedback
          onPressIn={() => {
            router.navigate({
              pathname: 'features/subreddit/about',
              params: { subreddit: props.subreddit },
            });
          }}
          hitSlop={5}
          background={TouchableNativeFeedback.Ripple(theme.surfaceVariant, true)}>
          <View>
            <Icons name="info-outline" size={24} color={theme.onSurfaceVariant} />
          </View>
        </TouchableNativeFeedback>
        <TouchableNativeFeedback
          disabled={!subredditData}
          hitSlop={5}
          onPressIn={toggleSubreddit}
          background={TouchableNativeFeedback.Ripple(theme.surfaceVariant, true)}>
          <View>
            <Icons
              name={isFavorite ? 'bookmark' : 'bookmark-outline'}
              size={24}
              color={isFavorite ? theme.primary : theme.onBackground}
            />
          </View>
        </TouchableNativeFeedback>
        <TouchableNativeFeedback
          disabled={!subredditData}
          hitSlop={5}
          onPressIn={searchPosts}
          background={TouchableNativeFeedback.Ripple(theme.surfaceVariant, true)}>
          <View>
            <Icons name={'search'} size={24} color={theme.onSurfaceVariant} />
          </View>
        </TouchableNativeFeedback>
      </View>
    );
  }, [!!subredditData, toggleSubreddit, searchPosts, theme]);

  const screenOptions = useMemo(() => {
    return { title: props.subreddit, headerTitle: HeaderTitle, headerRight: HeaderRight };
  }, [HeaderTitle, HeaderRight, props.subreddit]);

  return (
    <>
      <Stack.Screen options={screenOptions} />

      <View style={{ flex: 1, backgroundColor: theme.surface }}>
        <FlatList
          ref={flatListRef}
          data={filteredData}
          ListHeaderComponent={
            <SortOrderViewMemo
              sortOrder={sortOrder}
              onSortOrderChanged={onSortOrderChanged}
              flairs={flairs}
              selectedFlair={selectedFlair}
              onFlairTapped={onFlairTapped}
            />
          }
          renderItem={renderItem}
          onEndReachedThreshold={2}
          ItemSeparatorComponent={ItemSeparator}
          onEndReached={fetchMoreData}
          keyExtractor={keyExtractor}
          refreshControl={
            <RefreshControl
              refreshing={refreshLoading}
              onRefresh={refreshData}
              colors={[theme.primary]}
              progressBackgroundColor={theme.background}
            />
          }
        />
        {showingModal.display && (
          <Pressable
            style={{ position: 'absolute', top: 0, bottom: 0, right: 0, left: 0 }}
            onPress={() => {
              bottomSheetModalRef.current?.close();
              opacityValue.value = 0;
              setShowingModal({ display: false, post: null, popup: false });
            }}>
            <Animated.View style={[{ flex: 1, backgroundColor: theme.scrim }, animatedStyle]} />
          </Pressable>
        )}

        {posts.length === 0 && (
          <View
            style={{
              flex: 5,
              justifyContent: 'flex-start',
              alignItems: 'center',
              paddingHorizontal: 20,
            }}>
            <SubredditIcon size={128} icon={props.icon} nsfw={false} />
            <Typography
              variant="headlineLarge"
              style={{ color: theme.onBackground, textAlign: 'center' }}
              onPress={scrollToTop}>
              r/{props.subreddit}
            </Typography>
          </View>
        )}

        {error !== null && (
          <View
            style={{
              flex: 5,
              justifyContent: 'flex-start',
              alignItems: 'center',
              paddingHorizontal: 20,
            }}>
            <Typography
              variant="headlineLarge"
              style={{ color: theme.onBackground, textAlign: 'center' }}
              onPress={scrollToTop}>
              Subreddit not found
            </Typography>
          </View>
        )}

        {showingModal.popup && (
          <View
            style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              left: 0,
              right: 0,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                padding: 16,
                marginHorizontal: 16,
                backgroundColor: theme.surfaceContainerHigh,
                borderRadius: 16,
              }}>
              <ModalOptionRow
                onPress={() => {
                  setTopOrder('day');
                  setSortOrder('top');
                  opacityValue.value = 0;
                  setShowingModal({ display: false, post: null, popup: false });
                }}
                title="Last 24h"
              />
              <ModalOptionRow
                onPress={() => {
                  setTopOrder('week');
                  setSortOrder('top');
                  opacityValue.value = 0;
                  setShowingModal({ display: false, post: null, popup: false });
                }}
                title="This Week"
              />
              <ModalOptionRow
                onPress={() => {
                  setTopOrder('month');
                  setSortOrder('top');
                  opacityValue.value = 0;
                  setShowingModal({ display: false, post: null, popup: false });
                }}
                title="This Month"
              />
              <ModalOptionRow
                onPress={() => {
                  setTopOrder('year');
                  setSortOrder('top');
                  opacityValue.value = 0;
                  setShowingModal({ display: false, post: null, popup: false });
                }}
                title="This Year"
              />
              <ModalOptionRow
                onPress={() => {
                  setTopOrder('all');
                  setSortOrder('top');
                  opacityValue.value = 0;
                  setShowingModal({ display: false, post: null, popup: false });
                }}
                title="All Time"
              />
            </View>
          </View>
        )}

        <BottomSheetModalProvider>
          <BottomSheetModal
            ref={bottomSheetModalRef}
            index={1}
            snapPoints={snapPoints}
            backgroundStyle={{ backgroundColor: theme.surfaceContainer }}
            handleStyle={{
              backgroundColor: theme.surfaceContainer,
              borderTopLeftRadius: 14,
              borderTopRightRadius: 14,
            }}
            handleIndicatorStyle={{ backgroundColor: theme.onSurface }}>
            {showingModal.post && (
              <PostItemBottomSheet
                post={showingModal.post}
                onClose={(reason) => {
                  bottomSheetModalRef.current?.close();
                  setShowingModal({ display: false, post: null, popup: false });
                  if (reason === 'BLOCKED_USER') {
                    setDisplayUserBlockedToast(true);
                  } else if (reason === 'BANNED_SUBREDDIT') {
                    setDisplaySubredditBannedToast(true);
                  }
                }}
              />
            )}
          </BottomSheetModal>
        </BottomSheetModalProvider>
      </View>
      {loading && (
        <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }}>
          <IndeterminateProgressBarView />
        </View>
      )}
      <ToastView
        show={displayUserBlockedToast}
        label={'User Blocked'}
        onClose={() => {
          setDisplayUserBlockedToast(false);
        }}
      />
      <ToastView
        show={displaySubredditBannedToast}
        label={'Subreddit Banned'}
        onClose={() => {
          setDisplaySubredditBannedToast(false);
        }}
      />
    </>
  );
};
export default SubRedditView;
