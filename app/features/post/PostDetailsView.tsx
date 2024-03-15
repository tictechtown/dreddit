import { BottomSheetModal, BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import Constants from 'expo-constants';
import { Image } from 'expo-image';
import { Stack, useFocusEffect } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  BackHandler,
  FlatList,
  Pressable,
  RefreshControl,
  Share,
  TouchableNativeFeedback,
  TouchableOpacity,
  View,
} from 'react-native';
import PhotoZoom from 'react-native-photo-zoom';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { Comment, Post, RedditApi, RedditMediaMedata } from '../../services/api';
import { useStore } from '../../services/store';
import useTheme from '../../services/theme/useTheme';
import Icons from '../components/Icons';
import IndeterminateProgressBarView from '../components/IndeterminateProgressBarView';
import CommentItem from './components/CommentItem';
import PostHeader from './components/PostHeader';
import SortOptions from './components/SortOptions';
import { flattenComments, getMaxPreview, mergeComments } from './utils';

type Props = {
  postId: string;
  cachedPost?: Post | null;
};

type CommentsAndPost = {
  comments: Comment[]; // flat list, no replies
  rawComments: Comment[];
  post: Post | undefined | null;
  cached?: boolean;
  loading?: boolean;
};

const COMMENT_LIMIT = '100';

const keyExtractor = (item: Comment) => item.data.id;

const PostDetailsView = ({ postId, cachedPost }: Props) => {
  const [queryData, setQueryData] = useState<CommentsAndPost>({
    comments: [],
    rawComments: [],
    post: cachedPost,
    cached: true,
    loading: true,
  });

  const theme = useTheme();
  const [sortOrder, setSortOrder] = useState<string | null>(null);
  const [showingModal, setShowingModal] = useState(false);
  const [refreshLoading, setRefreshLoading] = useState(false);
  const [showMediaItem, setShowMediaItem] = useState<RedditMediaMedata | null>(null);

  const [savedPosts, addToSavedPosts, removeFromSavedPosts] = useStore((state) => [
    state.savedPosts,
    state.addToSavedPosts,
    state.removeFromSavedPosts,
  ]);

  const opacityValue = useSharedValue(0);
  const animatedStyle = useAnimatedStyle(() => {
    return { opacity: opacityValue.value };
  }, []);

  // ref
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const flatListRef = useRef<FlatList>(null);

  // variables
  const snapPoints = useMemo(() => ['25%', '42%'], []);

  // Android: handle back button when media is displayed
  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        if (showMediaItem) {
          setShowMediaItem(null);
          return true;
        } else {
          return false;
        }
      };

      const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => subscription.remove();
    }, [showMediaItem, setShowMediaItem])
  );

  useEffect(() => {
    const goFetch = async () => {
      const searchParams: {
        limit: string;
        include_over_18: string;
        sort?: string;
        threaded: string;
      } = {
        limit: COMMENT_LIMIT,
        include_over_18: 'true',
        threaded: 'false',
      };
      if (sortOrder !== null) {
        searchParams['sort'] = sortOrder;
      }

      const data = await new RedditApi().getSubmissionComments(postId, searchParams);
      // TODO, do something better
      if (data) {
        setQueryData({
          comments: flattenComments(data.comments),
          rawComments: data.comments,
          post: data.submission,
          cached: false,
        });
      }
    };
    goFetch();
  }, [postId, sortOrder]);

  const _onHeaderPressed = useCallback(() => {
    if (queryData.post) {
      WebBrowser.openBrowserAsync(queryData.post.data.url);
    }
  }, [queryData.post?.data.id]);
  const _onChangeSort = useCallback(() => {
    setShowingModal(true);
    opacityValue.value = withTiming(0.6);
    bottomSheetModalRef.current?.present();
  }, [setShowingModal]);

  const Header = useCallback(() => {
    return (
      <PostHeader
        post={queryData.post ?? null}
        forcedSortOrder={sortOrder}
        onPress={_onHeaderPressed}
        onChangeSort={_onChangeSort}
        theme={theme}
      />
    );
  }, [queryData.post?.data.id, getMaxPreview(queryData.post)?.url, sortOrder, theme]);

  const onSortPressed = useCallback((newChoice: string) => {
    setSortOrder(newChoice);
    bottomSheetModalRef.current?.close();
    opacityValue.value = 0;
    setShowingModal(false);
  }, []);

  const refreshData = useCallback(async () => {
    setRefreshLoading(true);

    const searchParams: {
      limit: string;
      include_over_18: string;
      sort?: string;
      v?: string;
      threaded: string;
    } = {
      limit: COMMENT_LIMIT,
      include_over_18: 'true',
      threaded: 'false',
      v: `${Date.now()}`,
    };
    if (sortOrder !== null) {
      searchParams['sort'] = sortOrder;
    }

    const data = await new RedditApi().getSubmissionComments(postId, searchParams);
    if (data) {
      setQueryData({
        comments: flattenComments(data.comments),
        rawComments: data.comments,
        post: data.submission,
        cached: false,
      });
    }

    // scroll to top
    flatListRef.current?.scrollToOffset({ animated: true, offset: 0 });
    setRefreshLoading(false);
  }, []);

  const displayMediaItem = useCallback(
    (gif: RedditMediaMedata) => {
      opacityValue.value = withTiming(0.9);
      setShowMediaItem(gif);
    },
    [opacityValue]
  );

  const fetchMoreComments = useCallback(async (commentId: string, childrenIds: string[]) => {
    const searchParams: {
      limit: string;
      include_over_18: string;
      sort?: string;
      threaded: string;
      comment: string;
      depth: string;
    } = {
      limit: '25',
      include_over_18: 'true',
      threaded: 'false',
      comment: commentId,
      depth: '0',
    };
    if (sortOrder !== null) {
      searchParams['sort'] = sortOrder;
    }

    const api = new RedditApi();
    if (childrenIds.length < 2) {
      const data = await api.getSubmissionComments(postId, searchParams);
      // TODO, do something better
      if (data) {
        setQueryData((oldQuery) => ({
          comments: mergeComments(oldQuery.comments, data.comments),
          rawComments: oldQuery.comments,
          post: data.submission,
          cached: false,
        }));
      }
    } else {
      // TODO - we should keep the "more comments" if we don't load all the comments
      // so ()
      const promises = childrenIds
        .slice(0, 25)
        .map((cId) => api.getSubmissionComments(postId, { ...searchParams, comment: cId }));
      const allData = await Promise.all(promises);
      const data = allData.reduce(
        (prevValue, currentValue) => {
          if (prevValue?.submission === null) {
            prevValue.submission = currentValue?.submission;
          }
          prevValue?.comments.push(currentValue?.comments);
          return prevValue;
        },
        { comments: [], submission: null }
      ) ?? { comments: [], submission: null };
      data.comments = data?.comments.flat();
      setQueryData((oldQuery) => ({
        comments: mergeComments(oldQuery.comments, data.comments),
        rawComments: oldQuery.comments,
        post: data.submission,
        cached: false,
      }));
    }
  }, []);

  const renderItem = useCallback(
    ({ item }: { item: Comment }) => (
      <CommentItem
        comment={item}
        showGif={displayMediaItem}
        fetchMoreComments={fetchMoreComments}
        theme={theme}
      />
    ),
    [displayMediaItem, fetchMoreComments, theme]
  );

  const refreshControl = useMemo(() => {
    return (
      <RefreshControl
        refreshing={refreshLoading}
        onRefresh={refreshData}
        colors={[theme.primary]}
        progressBackgroundColor={theme.background}
      />
    );
  }, [refreshLoading, refreshData, theme]);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.surface,
      }}>
      <Stack.Screen
        options={{
          title: queryData.post?.data.subreddit_name_prefixed ?? '',
          headerRight: () => {
            const isSaved = !!savedPosts.find((sP) => sP.data.id === queryData.post?.data.id);

            const toggleSavedPost = () => {
              if (queryData.post) {
                const post = savedPosts.find((sP) => sP.data.id === queryData.post?.data.id);
                if (post) {
                  removeFromSavedPosts(post);
                } else {
                  addToSavedPosts(queryData.post);
                }
              }
            };

            return (
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  columnGap: 8,
                }}>
                <TouchableOpacity
                  onPress={async () => {
                    await Share.share({ message: queryData?.post?.data.url ?? '' });
                  }}
                  hitSlop={20}>
                  <Icons name="share" size={24} color={theme.onSurfaceVariant} />
                </TouchableOpacity>
                <TouchableNativeFeedback
                  disabled={!queryData}
                  hitSlop={5}
                  onPress={toggleSavedPost}
                  background={TouchableNativeFeedback.Ripple(theme.surfaceVariant, true)}>
                  <View>
                    <Icons
                      name={isSaved ? 'bookmark' : 'bookmark-outline'}
                      size={24}
                      color={theme.onBackground}
                    />
                  </View>
                </TouchableNativeFeedback>
                <TouchableNativeFeedback
                  disabled={true}
                  hitSlop={5}
                  background={TouchableNativeFeedback.Ripple(theme.surfaceVariant, true)}>
                  <View>
                    <Icons name={'search'} size={24} color={theme.onBackground} />
                  </View>
                </TouchableNativeFeedback>
              </View>
            );
          },
        }}
      />
      <FlatList
        ref={flatListRef}
        data={queryData.comments}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        ListHeaderComponent={Header}
        refreshControl={refreshControl}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
      {queryData.loading && <IndeterminateProgressBarView />}
      {showingModal && (
        <Pressable
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            right: 0,
            left: 0,
          }}
          onPress={() => {
            bottomSheetModalRef.current?.close();
            opacityValue.value = 0;
            setShowingModal(false);
          }}>
          <Animated.View
            style={[
              {
                flex: 1,
                backgroundColor: theme.scrim,
              },
              animatedStyle,
            ]}
          />
        </Pressable>
      )}
      {showMediaItem && (
        <Pressable
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            right: 0,
            left: 0,
          }}
          onPress={() => {
            opacityValue.value = 0;
            setShowMediaItem(null);
          }}>
          <Animated.View
            style={[
              {
                flex: 1,
                position: 'absolute',
                top: 0,
                bottom: 0,
                right: 0,
                left: 0,
                backgroundColor: theme.scrim,
              },
              animatedStyle,
            ]}
          />
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            {Constants.appOwnership === 'expo' ? (
              <Image
                source={(showMediaItem.s.gif ?? showMediaItem.s.u).replaceAll('&amp;', '&')}
                contentFit="contain"
                style={{ width: showMediaItem.s.x, height: showMediaItem.s.y, maxWidth: '100%' }}
              />
            ) : (
              <PhotoZoom
                source={{
                  uri: (showMediaItem.s.gif ?? showMediaItem.s.u).replaceAll('&amp;', '&'),
                }}
                style={{ width: '100%', height: '100%' }}
                maximumZoomScale={10}
                androidScaleType="fitCenter"
                // onLoadStart={onLoadStart}
                // onProgress={onProgress}
              />
            )}
          </View>
        </Pressable>
      )}
      <BottomSheetModalProvider>
        <BottomSheetModal
          ref={bottomSheetModalRef}
          index={1}
          snapPoints={snapPoints}
          backgroundStyle={{ backgroundColor: theme.surface }}
          handleStyle={{
            backgroundColor: theme.surface,
            borderTopLeftRadius: 14,
            borderTopRightRadius: 14,
          }}
          handleIndicatorStyle={{
            backgroundColor: theme.onSurface,
          }}>
          <SortOptions
            currentSort={sortOrder ?? queryData.post?.data.suggested_sort ?? 'best'}
            onSortPressed={onSortPressed}
          />
        </BottomSheetModal>
      </BottomSheetModalProvider>
    </View>
  );
};

export default PostDetailsView;
