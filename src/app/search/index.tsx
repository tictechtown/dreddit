import Ionicons from '@expo/vector-icons/Ionicons';
import { Image } from 'expo-image';
import { Link, Stack, useFocusEffect } from 'expo-router';
import { decode } from 'html-entities';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  FlatList,
  Keyboard,
  Platform,
  Pressable,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import type { Post, SubReddit, User } from '@services/api';
import { RedditApi } from '@services/api';
import useTheme from '@services/theme/useTheme';
import type { ColorPalette } from '@theme/colors';
import Icons from '@components/Icons';
import SubredditIcon, { defaultSubredditIcon } from '@components/SubredditIcon';
import Tabs from '@components/Tabs';
import Typography from '@components/Typography';
// TODO
import PostFeedItem from '@features/subreddit/feed/components/PostFeedItem';
import { Spacing } from '@theme/tokens';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import SortOptionsBottomSheet from '@features/post/modals/SortOptionsBottomSheet';
import FilterChip from '@components/FilterChip';
import * as Haptics from 'expo-haptics';
import useBackdrop from '@hooks/useBackdrop';

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

const SearchResultSub = (props: { result: SubReddit; theme: ColorPalette }) => {
  const data = props.result.data;
  const theme = props.theme;
  const icon = getSubredditIcon(data.community_icon ?? data.icon);
  return (
    <Link
      href={{
        pathname: `subreddit/feed/${data.display_name}`,
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
          <View style={{ flexDirection: 'row', alignItems: 'center', columnGap: Spacing.s16 }}>
            <SubredditIcon icon={icon} size={68} nsfw={data.over18} />
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

                {data.over18 && (
                  <Typography variant="bodyMedium" style={{ flex: 0, color: theme.error }}>
                    NSFW
                  </Typography>
                )}
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

const SearchResultUser = (props: { result: User; theme: ColorPalette }) => {
  const data = props.result.data;
  const theme = props.theme;
  const icon = getSubredditIcon(data.icon_img);
  return (
    <Link
      href={{
        pathname: `user`,
        params: { userid: data.name },
      }}
      asChild>
      <Pressable style={{ flex: 1, marginHorizontal: 10, marginVertical: Spacing.s8 }}>
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
                marginRight: Spacing.s16,
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
                    <Typography variant="bodyMedium" style={{ flex: 0, color: theme.error }}>
                      NSFW
                    </Typography>
                  )}
                  {data.is_mod && (
                    <Typography variant="bodyMedium" style={{ flex: 0, color: theme.secondary }}>
                      Mod
                    </Typography>
                  )}
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
                <Typography
                  variant="bodyMedium"
                  style={{ color: theme.onBackground }}
                  numberOfLines={2}>
                  {decode(data.subreddit.public_description)}
                </Typography>
              )}
            </View>
          </View>
        </View>
      </Pressable>
    </Link>
  );
};

const SearchResultItem = (props: { result: SearchResult; theme: ColorPalette }) => {
  if (props.result.kind === 't5') {
    return <SearchResultSub result={props.result} theme={props.theme} />;
  } else if (props.result.kind === 't3') {
    return <PostFeedItem post={props.result} theme={props.theme} />;
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

const HomeSearchContent = ({
  searchText,
  onFocusOut,
}: {
  searchText: string;
  onFocusOut: () => void;
}) => {
  const theme = useTheme();
  const [results, setResults] = useState<{ [k: string]: SearchResult[] }>({});
  const [defaultResults, setDefaultResults] = useState<SubReddit[]>([]);
  const [searchType, setSearchType] = useState<SearchType>(SearchType.Subreddits);
  const flatListRef = React.useRef<FlatList>(null);

  const [searchSort, setSearchSort] = useState<'relevance' | 'hot' | 'top' | 'new' | 'comments'>(
    'top',
  );

  const [searchRange, setSearchRange] = useState<
    'hour' | 'day' | 'week' | 'month' | 'year' | 'all'
  >('all');

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
          const searchResults = await new RedditApi().searchSubreddits(txt, {
            sort: 'top',
            limit: '100',
          });
          if (searchResults) {
            setResults((prev) => ({ ...prev, [txt]: sortResults(searchResults.items, txt) }));
          } else {
            setResults((prev) => ({ ...prev, [txt]: [] }));
          }
        } else if (searchType === SearchType.Users) {
          const searchResults = await new RedditApi().searchUsers(txt, {
            sort: 'top',
            limit: '100',
          });
          if (searchResults) {
            setResults((prev) => ({ ...prev, [txt]: sortUserResults(searchResults.items) }));
          } else {
            setResults((prev) => ({ ...prev, [txt]: [] }));
          }
        } else if (searchType === SearchType.Posts) {
          const searchResults = await new RedditApi().searchSubmissions(txt, undefined, {
            sort: searchSort,
            t: searchRange,
            limit: '100',
          });
          if (searchResults) {
            setResults((prev) => ({ ...prev, [txt]: searchResults.items }));
          } else {
            setResults((prev) => ({ ...prev, [txt]: [] }));
          }
        }
        flatListRef?.current?.scrollToOffset({ animated: true, offset: 0 });
      } else {
        setResults({});
      }
    };

    searchSubReddits(searchText, searchType);
    bottomSheetModalRef.current?.dismiss();
  }, [searchText, searchType, searchSort, searchRange]);

  useEffect(() => {
    bottomSheetModalRef.current?.dismiss();
  }, [searchSort, searchRange]);

  const displayedResults = results[searchText] ?? [];
  const bottomSheetModalRef = React.useRef<BottomSheetModal>(null);

  const renderBackdrop = useBackdrop();

  return (
    <>
      {searchText.length < 3 && (
        <View
          style={{
            paddingHorizontal: Spacing.s12,
            marginTop: Spacing.s16,
            marginBottom: Spacing.s12,
          }}>
          <Typography variant="titleMedium">Trending</Typography>
        </View>
      )}
      {searchText.length >= 3 && (
        <>
          <Tabs
            selectedTabId={searchType}
            tabIds={[SearchType.Subreddits, SearchType.Users, SearchType.Posts]}
            tabNames={['Subreddits', 'Users', 'Posts']}
            onPress={setSearchType}
          />
          {searchType === SearchType.Posts && (
            <View
              style={{
                flexDirection: 'row',
                width: '100%',
                gap: 24,
                paddingHorizontal: 16,
                paddingVertical: 8,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <FilterChip
                value={searchSort}
                onChange={() => {
                  onFocusOut();
                  bottomSheetModalRef.current?.present('sort');
                  Haptics.performAndroidHapticsAsync(Haptics.AndroidHaptics.Keyboard_Tap);
                }}
              />
              <FilterChip
                value={searchRange}
                onChange={() => {
                  onFocusOut();
                  bottomSheetModalRef.current?.present('range');
                  Haptics.performAndroidHapticsAsync(Haptics.AndroidHaptics.Keyboard_Tap);
                }}
              />
            </View>
          )}
        </>
      )}
      <FlatList
        ref={flatListRef}
        data={searchText.length < 3 ? defaultResults : displayedResults}
        renderItem={({ item }) => <SearchResultItem result={item} theme={theme} />}
        keyExtractor={(item) => item.data.id}
        style={{ flex: 1 }}
        keyboardShouldPersistTaps={'handled'}
        onScrollBeginDrag={Keyboard.dismiss}
        contentContainerStyle={{ paddingBottom: Spacing.s24 }}
      />
      <BottomSheetModal
        ref={bottomSheetModalRef}
        index={0}
        backgroundStyle={{ backgroundColor: theme.surfaceContainerLow }}
        handleStyle={{
          backgroundColor: theme.surfaceContainerLow,
          borderTopLeftRadius: 28,
          borderTopRightRadius: 28,
        }}
        maxDynamicContentSize={600}
        backdropComponent={renderBackdrop}
        handleIndicatorStyle={{ backgroundColor: theme.onSurfaceVariant }}>
        {({ data }) =>
          data === 'sort' ? (
            <SortOptionsBottomSheet
              currentSort={searchSort}
              onSortPressed={setSearchSort}
              options={[
                { key: 'relevance', display: 'Relevance', icon: 'rocket' },
                { key: 'hot', display: 'Hot', icon: 'local-fire-department' },
                { key: 'top', display: 'Top', icon: 'leaderboard' },
                { key: 'new', display: 'New', icon: 'access-time' },
                { key: 'comments', display: 'Comments', icon: 'question-answer' },
              ]}
            />
          ) : (
            <SortOptionsBottomSheet
              currentSort={searchRange}
              onSortPressed={setSearchRange}
              title={'Sort Range'}
              options={[
                { key: 'hour', display: 'Hour' },
                { key: 'day', display: 'Day' },
                { key: 'week', display: 'Week' },
                { key: 'month', display: 'Month' },
                { key: 'year', display: 'Year' },
                { key: 'all', display: 'All' },
              ]}
            />
          )
        }
      </BottomSheetModal>
    </>
  );
};

const HomeSearchPage = () => {
  const theme = useTheme();
  const [searchText, setSearchText] = useState('');
  const inputRef = useRef<TextInput>(null);

  useFocusEffect(() => {
    setTimeout(() => {
      inputRef.current?.focus();
    }, 200);
  });

  const headerTitle = useCallback(() => {
    return (
      <TextInput
        ref={inputRef}
        editable
        style={{
          fontSize: 20,
          color: theme.onBackground,
        }}
        onChangeText={setSearchText}
        placeholder="Search Reddit"
        placeholderTextColor={theme.onSurfaceVariant}
        autoCapitalize="none"
        cursorColor={theme.secondary}
        returnKeyType="search"
      />
    );
  }, [inputRef, theme, setSearchText]);

  const headerRight = useCallback(() => {
    return (
      <TouchableOpacity
        onPressIn={() => {
          inputRef.current?.clear();
          setSearchText('');
          inputRef.current?.focus();
        }}>
        <Icons
          name="close"
          size={24}
          color={searchText.length > 0 ? theme.onSurfaceVariant : theme.onSurface}
        />
      </TouchableOpacity>
    );
  }, [searchText.length > 0, inputRef, theme, setSearchText]);

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <Stack.Screen
        options={
          Platform.OS == 'ios'
            ? {
                title: 'Search',
              }
            : {
                title: '',

                headerRight: headerRight,
                headerTitle: headerTitle,
              }
        }
      />
      {Platform.OS === 'ios' && (
        <View style={{ flexDirection: 'row', marginHorizontal: Spacing.s16 }}>
          <TextInput
            ref={inputRef}
            style={{
              fontSize: 20,
              color: theme.onBackground,
              flex: 1,
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

          <Icons
            onPress={() => {
              inputRef.current?.clear();
              setSearchText('');
            }}
            name="close"
            size={24}
            color={searchText.length > 0 ? theme.onSurfaceVariant : theme.onSurface}
          />
        </View>
      )}
      <HomeSearchContent
        searchText={searchText}
        onFocusOut={() => {
          inputRef.current?.blur();
        }}
      />
    </View>
  );
};

export default HomeSearchPage;
