import { Stack, router } from 'expo-router';
import { decode } from 'html-entities';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { FlatList, Image, Text, TouchableOpacity, View } from 'react-native';
import { Comment, Post, RedditApi, Trophy, User } from '../../services/api';
import { Palette } from '../colors';
import SubredditPostItemView from '../subreddit/components/SubredditPostItemView';
import { Spacing } from '../typography';
import { timeDifference } from '../utils';

type Props = {
  userId: string;
};

type CommentOrPostOrTrophy = Comment | Post | Trophy;

const Tab = ({
  tabId,
  tabName,
  sortOrder,
  onPress,
}: {
  tabId: string;
  tabName: string;
  sortOrder: string;
  onPress: (value: string) => void;
}) => {
  return (
    <TouchableOpacity
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: Spacing.small,
        borderBottomWidth: sortOrder === tabId ? 2 : 0,
        borderBottomColor: Palette.primary,
        flexDirection: 'row',
        paddingTop: Spacing.regular,
      }}
      onPress={() => onPress(tabId)}
      disabled={sortOrder === tabId}>
      <Text
        style={{
          fontSize: 12,
          fontWeight: 'bold',
          color: sortOrder === tabId ? Palette.primary : Palette.onBackgroundLowest,
        }}>
        {tabName}
      </Text>
    </TouchableOpacity>
  );
};

const TabView = (props: { sortOrder: string; onSortOrderChanged: (value: string) => void }) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingHorizontal: Spacing.regular,
      }}>
      <Tab
        tabId={'posts'}
        tabName={'Post'}
        sortOrder={props.sortOrder}
        onPress={props.onSortOrderChanged}
      />
      <Tab
        tabId={'comments'}
        tabName={'Comments'}
        sortOrder={props.sortOrder}
        onPress={props.onSortOrderChanged}
      />
      <Tab
        tabId={'trophies'}
        tabName={'Trophies'}
        sortOrder={props.sortOrder}
        onPress={props.onSortOrderChanged}
      />
    </View>
  );
};

const CommentItem = ({ commentOrPost }: { commentOrPost: CommentOrPostOrTrophy }) => {
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
        <SubredditPostItemView post={commentOrPost} />
      </TouchableOpacity>
    );
  }
  if (commentOrPost.kind === 't1') {
    // Comment
    return (
      <View
        style={{
          flex: 1,
          borderBottomColor: Palette.outline,
          borderBottomWidth: 1,
          paddingHorizontal: Spacing.small,
          paddingVertical: Spacing.xsmall,
        }}>
        <TouchableOpacity onPress={onPress}>
          <View style={{ flex: 1 }}>
            <Text style={{ color: Palette.onBackgroundLowest }}>
              {/* @ts-ignore */}
              {decode(commentOrPost.data.link_title)}
            </Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ color: Palette.onSurfaceVariant }}>
                {commentOrPost.data.subreddit_name_prefixed}
              </Text>

              <Text style={{ color: Palette.onSurfaceVariant }}>
                {timeDifference(commentOrPost.data.created_utc * 1000)}
              </Text>
            </View>
            <Text style={{ color: Palette.onSurfaceVariant }}>
              {decode(commentOrPost.data.body)}
            </Text>
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
          paddingHorizontal: 6,
          paddingVertical: 12,
        }}>
        <Image
          style={{ borderRadius: 16, marginRight: Spacing.regular }}
          width={70}
          height={70}
          source={{
            uri: commentOrPost.data.icon_70.replaceAll('&amp;', '&'),
          }}></Image>
        <Text style={{ color: Palette.onBackgroundLowest, fontSize: 16 }}>
          {commentOrPost.data.name}
        </Text>
      </View>
    );
  }

  return null;
};

type CommentsData = { data: CommentOrPostOrTrophy[]; isLoaded: boolean };

const UserView = (props: Props) => {
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
        <View>
          <Text>Loading avatar</Text>
        </View>
      );
    }

    return (
      <View style={{ flex: 1, width: '100%' }}>
        <Image
          style={{ borderRadius: 64, alignSelf: 'center' }}
          width={128}
          height={128}
          source={{
            uri: (!userData.data.pref_show_snoovatar
              ? userData.data.icon_img
              : userData.data.snoovatar_img
            ).replaceAll('&amp;', '&'),
          }}></Image>
        <View
          style={{
            backgroundColor: Palette.background,
            padding: Spacing.small,
            marginTop: Spacing.small,
          }}>
          <View style={{ flexDirection: 'row' }}>
            {userData.data.subreddit.over_18 && (
              <Text style={{ marginRight: Spacing.small, color: 'red', fontWeight: 'bold' }}>
                NSFW
              </Text>
            )}

            <Text style={{ color: Palette.onBackgroundLowest, fontWeight: '300' }}>
              {userData.data.total_karma.toLocaleString('en-US')} karma •{' '}
              {new Date(userData.data.created_utc * 1000).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </Text>
          </View>
          {userData.data.subreddit.public_description?.length > 0 && (
            <Text style={{ color: Palette.onBackgroundLowest }}>
              {decode(userData.data.subreddit.public_description)}
            </Text>
          )}
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-around',
            backgroundColor: Palette.background,
            paddingBottom: Spacing.small,
          }}>
          <View
            style={{
              backgroundColor: Palette.surfaceVariant,
              borderRadius: 60,
              height: 60,
              paddingHorizontal: Spacing.regular,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text style={{ color: Palette.onSurfaceVariant }}>Post Karma</Text>
            <Text style={{ color: Palette.onSurfaceVariant, fontWeight: 'bold' }}>
              {userData.data.link_karma.toLocaleString('en-US')}
            </Text>
          </View>
          <View
            style={{
              backgroundColor: Palette.surfaceVariant,
              borderRadius: 60,
              height: 60,
              paddingHorizontal: Spacing.regular,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text style={{ color: Palette.onSurfaceVariant }}>Comment Karma</Text>
            <Text style={{ color: Palette.onSurfaceVariant, fontWeight: 'bold' }}>
              {userData.data.comment_karma.toLocaleString('en-US')}
            </Text>
          </View>
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
        backgroundColor: Palette.backgroundLowest,
      }}>
      <Stack.Screen options={{ title: props.userId }} />
      <FlatList
        data={filteredData}
        renderItem={({ item }) => <CommentItem commentOrPost={item} />}
        keyExtractor={(item) => item.data.id ?? item.data.name}
        ListHeaderComponent={Header}
        ListFooterComponent={() => {
          if (commentsData.isLoaded && filteredData?.length === 0) {
            return (
              <View
                style={{
                  borderColor: Palette.outline,
                  padding: Spacing.small,
                  margin: Spacing.small,
                  marginTop: Spacing.large,
                  borderWidth: 1,
                  borderRadius: 8,
                }}>
                <Text style={{ color: Palette.onSurface }}>
                  No {sortOrder === 'posts' ? 'post' : 'comment'} sent
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
