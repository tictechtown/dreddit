import { Stack, router } from 'expo-router';
import { decode } from 'html-entities';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { FlatList, Image, Text, TouchableOpacity, View } from 'react-native';
import { Comment, Post, RedditApi, Trophy, User } from '../../services/api';
import useTheme from '../../services/theme/useTheme';
import { ColorPalette } from '../colors';
import IndeterminateProgressBarView from '../components/IndeterminateProgressBarView';
import Tabs from '../components/Tabs';
import Typography from '../components/Typography';
import SubredditPostItemView from '../subreddit/components/SubredditPostItemView';
import { Spacing } from '../tokens';
import { timeDifference } from '../utils';

type Props = {
  userId: string;
};

type CommentOrPostOrTrophy = Comment | Post | Trophy;

const TabView = (props: { sortOrder: string; onSortOrderChanged: (value: string) => void }) => {
  return (
    <Tabs
      selectedTabId={props.sortOrder}
      tabIds={['posts', 'comments', 'trophies']}
      tabNames={['Post', 'Comments', 'Trophies']}
      onPress={props.onSortOrderChanged}
    />
  );
};

const CommentItem = ({
  commentOrPost,
  theme,
}: {
  commentOrPost: CommentOrPostOrTrophy;
  theme: ColorPalette;
}) => {
  const onPress = useCallback(() => {
    if (commentOrPost.kind === 't3') {
      router.push({
        pathname: `features/post/${commentOrPost.data.id}`,
        params: { postid: commentOrPost.data.id },
      });
    } else if (commentOrPost.kind === 't1') {
      router.push({
        pathname: `features/post/${commentOrPost.data.link_id.replace('t3_', '')}`,
        params: { postid: commentOrPost.data.link_id.replace('t3_', '') },
      });
    }
  }, [commentOrPost]);

  if (commentOrPost.kind === 't3') {
    // Post
    return (
      <TouchableOpacity onPress={onPress}>
        <SubredditPostItemView post={commentOrPost} theme={theme} />
      </TouchableOpacity>
    );
  }
  if (commentOrPost.kind === 't1') {
    // Comment
    return (
      <View
        style={{
          flex: 1,
          paddingHorizontal: Spacing.s12,
          paddingBottom: Spacing.s12,
        }}>
        <TouchableOpacity onPress={onPress}>
          <View style={{ flex: 1 }}>
            <Typography variant="headlineSmall">
              {/* @ts-ignore */}
              {decode(commentOrPost.data.link_title)}
            </Typography>
            <Typography variant="bodySmall" style={{ color: theme.onSurfaceVariant }}>
              {commentOrPost.data.subreddit_name_prefixed} •{' '}
              {timeDifference(commentOrPost.data.created_utc * 1000)}
            </Typography>

            <Typography variant="bodyMedium" style={{ color: theme.onSurfaceVariant }}>
              {decode(commentOrPost.data.body)}
            </Typography>
          </View>
        </TouchableOpacity>
      </View>
    );
  }

  if (commentOrPost.kind === 't6') {
    // trophy
    return (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: Spacing.s16,
          paddingVertical: Spacing.s4,
        }}>
        <Image
          style={{ borderRadius: 10, marginRight: Spacing.s16 }}
          width={40}
          height={40}
          source={{
            uri: commentOrPost.data.icon_70.replaceAll('&amp;', '&'),
          }}></Image>
        <Typography variant="bodyLarge">{commentOrPost.data.name}</Typography>
      </View>
    );
  }

  return null;
};

type CommentsData = { data: CommentOrPostOrTrophy[]; isLoaded: boolean };

const UserView = (props: Props) => {
  const theme = useTheme();
  const [commentsData, setCommentsData] = useState<CommentsData>({ data: [], isLoaded: false });
  const [userData, setUserData] = useState<User>();
  const [userTrophies, setUserTrophies] = useState<Trophy[]>();
  const [sortOrder, setSortOrder] = useState<string>('posts'); // posts/comments/trophies

  useEffect(() => {
    const goFetchComments = async () => {
      const data = await new RedditApi().getUserOverview(props.userId, {
        limit: '100',
        include_over_18: 'true',
      });
      // TODO, do something better
      if (data) {
        setCommentsData({ data: data.items, isLoaded: true });
      }
    };
    const goFetchUser = async () => {
      const data = await new RedditApi().getUser(props.userId);
      // TODO, do something better
      if (data) {
        setUserData({ kind: 't2', data });
      }
    };
    const goFetchTrophies = async () => {
      const data = await new RedditApi().getUserTrophies(props.userId);
      // TODO, do something better
      if (data) {
        setUserTrophies(data);
      }
    };

    goFetchComments();
    goFetchUser();
    goFetchTrophies();
  }, [props.userId]);

  const Header = useCallback(() => {
    if (!userData) {
      return (
        <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }}>
          <IndeterminateProgressBarView />
        </View>
      );
    }

    return (
      <View style={{ flex: 1, width: '100%' }}>
        <View style={{ paddingHorizontal: 16, paddingVertical: 16 }}>
          <Image
            style={{ width: 140, height: 140, borderRadius: 70, marginBottom: 10 }}
            source={{
              uri: (!userData.data.pref_show_snoovatar
                ? userData.data.icon_img
                : userData.data.snoovatar_img
              ).replaceAll('&amp;', '&'),
            }}></Image>

          <Typography variant="headlineMedium">{props.userId.trim()}</Typography>
          <View style={{ flexDirection: 'row', marginBottom: 20 }}>
            {userData.data.subreddit.over_18 && (
              <Text style={{ marginRight: Spacing.s12, color: 'red', fontWeight: 'bold' }}>
                NSFW
              </Text>
            )}

            <Typography variant="bodyMedium" style={{ color: theme.onSurfaceVariant }}>
              {userData.data.total_karma.toLocaleString('en-US')} karma •{' '}
              {new Date(userData.data.created_utc * 1000).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </Typography>
          </View>
          {userData.data.subreddit.public_description?.length > 0 && (
            <Typography variant="bodyMedium">
              {decode(userData.data.subreddit.public_description)}
            </Typography>
          )}
        </View>
        <TabView sortOrder={sortOrder} onSortOrderChanged={setSortOrder} />
      </View>
    );
  }, [props.userId, userData, sortOrder]);

  const filteredData = useMemo(() => {
    if (sortOrder === 'posts') {
      return commentsData.data.filter((it) => it.kind === 't3');
    }
    if (sortOrder === 'comments') {
      return commentsData.data.filter((it) => it.kind === 't1');
    }
    if (sortOrder === 'trophies') {
      return userTrophies;
    }
    return [];
  }, [commentsData, userTrophies, sortOrder]);

  return (
    <View
      style={{
        flex: 1,
        width: '100%',
        backgroundColor: theme.surface,
      }}>
      <Stack.Screen options={{ title: props.userId }} />
      <FlatList
        data={filteredData}
        renderItem={({ item }) => <CommentItem commentOrPost={item} theme={theme} />}
        keyExtractor={(item) => item.data.id ?? item.data.name}
        ListHeaderComponent={Header}
        contentContainerStyle={{ rowGap: 10 }}
        ListFooterComponent={() => {
          if (commentsData.isLoaded && filteredData?.length === 0) {
            return (
              <View
                style={{
                  borderColor: theme.outline,
                  padding: Spacing.s12,
                  margin: Spacing.s12,
                  borderWidth: 1,
                  borderRadius: 8,
                }}>
                <Text style={{ color: theme.onSurface }}>
                  No{' '}
                  {sortOrder === 'posts'
                    ? 'post'
                    : sortOrder === 'comments'
                      ? 'comment'
                      : 'trophies'}{' '}
                  sent
                </Text>
              </View>
            );
          }
          return null;
        }}
      />
    </View>
  );
};

export default UserView;
