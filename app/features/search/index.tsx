import { MaterialCommunityIcons } from '@expo/vector-icons';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useFocusEffect } from '@react-navigation/native';
import { Image } from 'expo-image';
import { Link, Stack } from 'expo-router';
import { decode } from 'html-entities';
import React, { useEffect, useRef, useState } from 'react';
import { FlatList, Keyboard, Pressable, Text, TextInput, View } from 'react-native';
import { Post, RedditApi, SubReddit, User } from '../../services/api';
import useTheme from '../../services/theme/useTheme';
import { Palette } from '../colors';
import Tabs from '../components/Tabs';
import Typography from '../components/Typography';
import SubredditPostItemView from '../subreddit/components/SubredditPostItemView';
import { Spacing } from '../typography';

// @ts-ignore
import defaultSubredditIcon = require('../../../assets/images/subbit.png');

function getSubredditIcon(icon: string | undefined): string {
  if (!icon || icon?.length === 0) {
    return defaultSubredditIcon;
  }
  return icon.split('?')[0];
}

function sortResults(results: SubReddit[], searchedTerm: string): SubReddit[] {
  // reddit search returns text from title and description too
  // we surface back the subreddits with a title match

  return results.sort((a, b) => {
    const aTerm = a.data.display_name.toLowerCase().includes(searchedTerm.toLowerCase());
    const bTerm = b.data.display_name.toLowerCase().includes(searchedTerm.toLowerCase());
    if (aTerm && bTerm) {
      return (b.data.subscribers ?? 0) - (a.data.subscribers ?? 0);
    } else if (aTerm) {
      return -1;
    } else if (bTerm) {
      return 1;
    }
    return (b.data.subscribers ?? 0) - (a.data.subscribers ?? 0);
  });
}

function sortUserResults(results: User[]): User[] {
  return results.sort((a, b) => {
    const aTerm = a.data.comment_karma + a.data.link_karma;
    const bTerm = b.data.comment_karma + b.data.link_karma;
    return (bTerm ?? 0) - (aTerm ?? 0);
  });
}

const SearchResultSub = (props: { result: SubReddit; theme: Palette }) => {
  const data = props.result.data;
  const theme = props.theme;
  const icon = getSubredditIcon(data.community_icon ?? data.icon);
  return (
    <Link
      href={{
        pathname: `features/subreddit/${data.display_name}`,
        params: { icon: icon },
      }}
      asChild>
      <Pressable style={{ flex: 1, marginHorizontal: 10, marginVertical: 2 }}>
        <View
          style={{
            backgroundColor: theme.surfaceContainer,
            borderRadius: 8,
            flex: 1,
            paddingHorizontal: 12,
            paddingVertical: 10,
          }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Image
              style={{
                width: 68,
                height: 68,
                borderRadius: 34,
                marginRight: Spacing.regular,
                flex: 0,
              }}
              source={icon}
            />
            <View style={{ flex: 1 }}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                <Typography variant="titleMedium" style={{ fontWeight: 'bold' }}>
                  {data.display_name_prefixed}
                </Typography>

                {data.over18 && <Text style={{ flex: 0, color: theme.error }}>NSFW</Text>}
              </View>
              <View style={{ flexDirection: 'row', columnGap: 4, alignItems: 'center' }}>
                <Ionicons name="people" size={12} color={theme.onSurfaceVariant} />

                <Typography
                  variant="bodySmall"
                  style={{ color: theme.onSurfaceVariant, opacity: 0.8 }}>
                  {(data.subscribers ?? 0).toLocaleString('en-US')} members
                </Typography>
              </View>

              <Typography
                variant="bodyMedium"
                style={{ color: theme.onSurfaceVariant, flex: 1 }}
                numberOfLines={1}>
                {decode(data.title)}
              </Typography>

              {data.public_description && (
                <Typography
                  variant="bodySmall"
                  style={{ color: theme.onSurfaceVariant, opacity: 0.8 }}
                  numberOfLines={2}>
                  {decode(data.public_description)}
                </Typography>
              )}
            </View>
          </View>
        </View>
      </Pressable>
    </Link>
  );
};

const SearchResultUser = (props: { result: User; theme: Palette }) => {
  const data = props.result.data;
  const theme = props.theme;
  const icon = getSubredditIcon(data.icon_img);
  return (
    <Link
      href={{
        pathname: `features/user`,
        params: { userid: data.name },
      }}
      asChild>
      <Pressable style={{ flex: 1, marginHorizontal: 10, marginVertical: Spacing.xsmall }}>
        <View
          style={{
            backgroundColor: theme.surface,
            borderRadius: 8,
            flex: 1,
            paddingHorizontal: 12,
            paddingVertical: 10,
          }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Image
              style={{
                width: 68,
                height: 68,
                borderRadius: 34,
                marginRight: Spacing.regular,
                flex: 0,
              }}
              source={icon}
            />
            <View style={{ flex: 1 }}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                <Typography variant="titleMedium" style={{ fontWeight: 'bold' }}>
                  {data.name}
                </Typography>

                <View style={{ flexDirection: 'row', columnGap: 4 }}>
                  {data.subreddit?.over_18 && (
                    <Text style={{ flex: 0, color: theme.error }}>NSFW</Text>
                  )}
                  {data.is_mod && <Text style={{ flex: 0, color: theme.secondary }}>Mod</Text>}
                </View>
              </View>

              <Typography
                variant="bodySmall"
                style={{ color: theme.onSurfaceVariant, opacity: 0.8 }}>
                {((data.link_karma ?? 0) + (data.comment_karma ?? 0)).toLocaleString('en-US')} karma
                •{' '}
                {new Date(data.created_utc * 1000).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </Typography>

              {data.subreddit?.public_description && (
                <Text style={{ color: theme.onBackground }} numberOfLines={2}>
                  {decode(data.subreddit.public_description)}
                </Text>
              )}
            </View>
          </View>
        </View>
      </Pressable>
    </Link>
  );
};

const SearchResultItem = (props: { result: SearchResult; theme: Palette }) => {
  if (props.result.kind === 't5') {
    return <SearchResultSub result={props.result} theme={props.theme} />;
  } else if (props.result.kind === 't3') {
    return <SubredditPostItemView post={props.result} theme={props.theme} />;
  } else {
    return <SearchResultUser result={props.result} theme={props.theme} />;
  }
};

type SearchResult = SubReddit | User | Post;

enum SearchType {
  Subreddits,
  Users,
  Posts,
}

const HomeSearch = () => {
  const theme = useTheme();
  const [searchText, setSearchText] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [defaultResults, setDefaultResults] = useState<SubReddit[]>([]);
  const [searchType, setSearchType] = useState<SearchType>(SearchType.Subreddits);
  const flatListRef = React.useRef<FlatList>(null);
  const inputRef = useRef<TextInput>(null);

  useFocusEffect(() => inputRef.current?.focus());

  useEffect(() => {
    const fn = async () => {
      const searchResults = await new RedditApi().getPopularSubreddits({
        limit: '10',
        include_over_18: 'false',
      });
      if (searchResults) {
        setDefaultResults(sortResults(searchResults.subreddits, ''));
      } else {
        setDefaultResults([]);
      }
    };
    fn();
  }, []);

  useEffect(() => {
    const searchSubReddits = async (txt: string, searchType: SearchType) => {
      if (txt && txt.length > 2) {
        if (searchType === SearchType.Subreddits) {
          const searchResults = await new RedditApi().searchSubreddits(txt, { sort: 'top' });
          if (searchResults) {
            setResults(sortResults(searchResults.items, txt));
          } else {
            setResults([]);
          }
        } else if (searchType === SearchType.Users) {
          const searchResults = await new RedditApi().searchUsers(txt, { sort: 'top' });
          if (searchResults) {
            setResults(sortUserResults(searchResults.items));
          } else {
            setResults([]);
          }
        } else if (searchType === SearchType.Posts) {
          const searchResults = await new RedditApi().searchSubmissions(txt, undefined, {
            sort: 'top',
          });
          if (searchResults) {
            setResults(searchResults.items);
          } else {
            setResults([]);
          }
        }
        flatListRef?.current?.scrollToOffset({ animated: true, offset: 0 });
      } else {
        setResults([]);
      }
    };

    searchSubReddits(searchText, searchType);
  }, [searchText, searchType]);

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <Stack.Screen
        options={{
          title: '',
          presentation: 'modal',
          headerRight: () => {
            return (
              <MaterialCommunityIcons
                onPress={() => {
                  inputRef.current?.clear();
                  setSearchText('');
                }}
                name="close"
                size={24}
                color={
                  searchText.length > 0 ? theme.onSurfaceVariant : theme.onSurface
                }></MaterialCommunityIcons>
            );
          },
          headerTitle: () => {
            return (
              <TextInput
                ref={inputRef}
                style={{
                  fontSize: 20,
                  color: theme.onBackground,
                }}
                onChangeText={(txt) => {
                  setSearchText(txt);
                }}
                value={searchText}
                placeholder="Search Reddit"
                placeholderTextColor={theme.onSurfaceVariant}
                autoFocus={true}
                autoCapitalize="none"
                cursorColor={theme.secondary}
                returnKeyType="search"
              />
            );
          },
        }}
      />

      {searchText.length < 3 && (
        <View
          style={{
            paddingHorizontal: Spacing.small,
            marginTop: Spacing.regular,
            marginBottom: Spacing.small,
          }}>
          <Typography variant="titleMedium">Trending</Typography>
        </View>
      )}
      {searchText.length >= 3 && (
        <Tabs
          selectedTabId={searchType}
          tabIds={[SearchType.Subreddits, SearchType.Users, SearchType.Posts]}
          tabNames={['Subreddits', 'Users', 'Posts']}
          onPress={setSearchType}
        />
      )}
      <FlatList
        ref={flatListRef}
        data={searchText.length < 3 ? defaultResults : results}
        renderItem={({ item }) => <SearchResultItem result={item} theme={theme} />}
        keyExtractor={(item) => item.data.id}
        style={{ flex: 1 }}
        keyboardShouldPersistTaps={'handled'}
        onScrollBeginDrag={Keyboard.dismiss}
      />
    </View>
  );
};

export default HomeSearch;