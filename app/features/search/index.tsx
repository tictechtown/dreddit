import { MaterialCommunityIcons } from '@expo/vector-icons';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useFocusEffect } from '@react-navigation/native';
import { Image } from 'expo-image';
import { Link, Stack } from 'expo-router';
import { decode } from 'html-entities';
import React, { useEffect, useRef, useState } from 'react';
import { FlatList, Keyboard, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Post, RedditApi, SubReddit, User } from '../../services/api';
import { Palette } from '../colors';
import FilterChip from '../components/FilterChip';
import SubredditPostItemView from '../subreddit/components/SubredditPostItemView';
import { Spacing } from '../typography';

type Props = {
  onClose: () => void;
};

const defaultSubredditIcon = require('../../../assets/images/subbit.png');

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

const SearchResultSub = (props: { result: SubReddit }) => {
  const data = props.result.data;
  const icon = getSubredditIcon(data.community_icon ?? data.icon);
  return (
    <Link
      href={{
        pathname: `features/subreddit/${data.display_name}`,
        params: { icon: icon },
      }}
      asChild>
      <Pressable style={{ flex: 1, marginHorizontal: 10, marginVertical: Spacing.xsmall }}>
        <View
          style={{
            backgroundColor: Palette.surface,
            borderRadius: 8,
            flex: 1,
            paddingHorizontal: 12,
            paddingVertical: 10,
          }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Image
              style={{
                width: 64,
                height: 64,
                borderRadius: 32,
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
                <Text style={{ color: Palette.onBackground, fontSize: 18, fontWeight: 'bold' }}>
                  {data.display_name_prefixed}
                </Text>
                {data.over18 && <Text style={{ flex: 0, color: Palette.error }}>NSFW</Text>}
              </View>

              <Text style={{ color: Palette.onBackground, fontWeight: '300' }}>
                <Ionicons
                  name="people"
                  size={14}
                  color="grey"
                  style={{ paddingRight: Spacing.small }}
                />
                {(data.subscribers ?? 0).toLocaleString('en-US')} members
              </Text>
              <Text
                style={{ color: Palette.onSurfaceVariant, fontSize: 16, flex: 1 }}
                numberOfLines={1}>
                {decode(data.title)}
              </Text>

              {data.public_description && (
                <Text style={{ color: Palette.onBackground }} numberOfLines={2}>
                  {decode(data.public_description)}
                </Text>
              )}
            </View>
          </View>
        </View>
      </Pressable>
    </Link>
  );
};

const SearchResultUser = (props: { result: User }) => {
  const data = props.result.data;
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
            backgroundColor: Palette.surface,
            borderRadius: 8,
            flex: 1,
            paddingHorizontal: 12,
            paddingVertical: 10,
          }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Image
              style={{
                width: 64,
                height: 64,
                borderRadius: 32,
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
                <Text style={{ color: Palette.onBackground, fontSize: 18, fontWeight: 'bold' }}>
                  {data.name}
                </Text>
                {data.subreddit?.over_18 && (
                  <Text style={{ flex: 0, color: Palette.error }}>NSFW</Text>
                )}
                {data.is_mod && <Text style={{ flex: 0, color: Palette.secondary }}>Mod</Text>}
              </View>

              <Text style={{ color: Palette.onBackground, fontWeight: '300' }}>
                <Ionicons
                  name="people"
                  size={14}
                  color="grey"
                  style={{ paddingRight: Spacing.small }}
                />
                {(data.link_karma + data.comment_karma).toLocaleString('en-US')} karma
              </Text>
              <Text
                style={{ color: Palette.onSurfaceVariant, fontSize: 16, flex: 1 }}
                numberOfLines={1}>
                {new Date(data.created_utc * 1000).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </Text>

              {data.subreddit?.public_description && (
                <Text style={{ color: Palette.onBackground }} numberOfLines={2}>
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

const SearchResultItem = (props: { result: SearchResult }) => {
  const data = props.result.data;

  if (props.result.kind === 't5') {
    return <SearchResultSub result={props.result} />;
  } else if (props.result.kind === 't3') {
    return <SubredditPostItemView post={props.result} />;
  } else {
    return <SearchResultUser result={props.result} />;
  }
};

type SearchResult = SubReddit | User | Post;

enum SearchType {
  Subreddits,
  Users,
  Posts,
}

const HomeSearch = (props: Props) => {
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
    <View style={{ flex: 1 }}>
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
                  searchText.length > 0 ? Palette.onSurfaceVariant : 'black'
                }></MaterialCommunityIcons>
            );
          },
          headerTitle: (props) => {
            return (
              <TextInput
                ref={inputRef}
                style={styles.input}
                onChangeText={(txt) => {
                  setSearchText(txt);
                }}
                value={searchText}
                placeholder="Search Reddit"
                placeholderTextColor={Palette.onSurfaceVariant}
                autoFocus={true}
                autoCapitalize="none"
                cursorColor={Palette.secondary}
                returnKeyType="search"
              />
            );
          },
        }}
      />
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <Text
          style={{
            color: Palette.onBackground,
            fontSize: 16,
            marginHorizontal: Spacing.small,
            marginTop: Spacing.regular,
            marginBottom: Spacing.small,
          }}>
          {searchText.length < 3 ? 'Trending' : ''}
        </Text>
        {searchText.length >= 3 && (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <FilterChip
              filterName={'Subreddits'}
              filterType={SearchType.Subreddits}
              selected={searchType === SearchType.Subreddits}
              onTap={setSearchType}
            />
            <FilterChip
              filterName={'Users'}
              filterType={SearchType.Users}
              selected={searchType === SearchType.Users}
              onTap={setSearchType}
            />
            <FilterChip
              filterName={'Posts'}
              filterType={SearchType.Posts}
              selected={searchType === SearchType.Posts}
              onTap={setSearchType}
            />
          </View>
        )}
      </View>
      <FlatList
        ref={flatListRef}
        data={searchText.length < 3 ? defaultResults : results}
        renderItem={({ item }) => <SearchResultItem result={item} />}
        keyExtractor={(item) => item.data.id}
        style={{ flex: 1 }}
        keyboardShouldPersistTaps={'handled'}
        onScrollBeginDrag={Keyboard.dismiss}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    fontSize: 20,
    color: Palette.onBackground,
  },
});

export default HomeSearch;
