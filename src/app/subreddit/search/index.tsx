import { Stack, useLocalSearchParams } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, FlatList, TextInput, View } from 'react-native';
import type { Comment, Post } from '@services/api';
import { RedditApi } from '@services/api';
import useTheme from '@services/theme/useTheme';
import Typography from '@components/Typography';
import { Spacing } from '@theme/tokens';
import PostFeedItem from '@features/subreddit/feed/components/PostFeedItem';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import type { ColorPalette } from '@theme/colors';
import FilterChip from '@components/FilterChip';
import useBackdrop from '@hooks/useBackdrop';
import SortOptionsBottomSheet from '@features/post/modals/SortOptionsBottomSheet';

interface Props {
  subreddit: string;
  initialQuery: string | null;
}

type SearchResult = Post | Comment;

const SearchResultItem = (props: { result: SearchResult; theme: ColorPalette }) => {
  if (props.result.kind === 't3') {
    return <PostFeedItem post={props.result} theme={props.theme} />;
  }
};

const SubredditSearchPage = ({ subreddit, initialQuery }: Props) => {
  const theme = useTheme();
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Post[]>([]);
  const flatListRef = React.useRef<FlatList>(null);
  const inputRef = useRef<TextInput>(null);
  const bottomSheetModalRef = React.useRef<BottomSheetModal>(null);

  const [searchSort, setSearchSort] = useState<'relevance' | 'hot' | 'top' | 'new' | 'comments'>(
    'new',
  );

  const [searchRange, setSearchRange] = useState<
    'hour' | 'day' | 'week' | 'month' | 'year' | 'all'
  >('all');

  useFocusEffect(() => {
    setTimeout(() => {
      inputRef.current?.focus();
    }, 200);
  });

  useEffect(() => {
    if (searchText && searchText.length > 2) {
      const fetchItems = async () => {
        setLoading(true);
        const searchResults = await new RedditApi().searchSubmissions(
          initialQuery ? `${initialQuery} ${searchText}` : `${searchText} subreddit:${subreddit}`,
          subreddit as string,
          { sort: searchSort, t: searchRange, restrict_sr: 'on', limit: '100' },
        );
        console.log('search', searchResults);
        if (searchResults) {
          setResults(searchResults.items);
        } else {
          setResults([]);
        }
        setLoading(false);

        flatListRef?.current?.scrollToOffset({ animated: true, offset: 0 });
      };
      fetchItems();
    } else if (initialQuery) {
      const fetchItems = async () => {
        setLoading(true);

        const searchResults = await new RedditApi().searchSubmissions(
          initialQuery,
          subreddit as string,
          { sort: searchSort, t: searchRange, restrict_sr: 'on' },
        );
        if (searchResults) {
          setResults(searchResults.items);
        } else {
          setResults([]);
        }
        setLoading(false);
        flatListRef?.current?.scrollToOffset({ animated: true, offset: 0 });
      };
      fetchItems();
    }
    bottomSheetModalRef.current?.dismiss();
  }, [subreddit, initialQuery, searchText, searchSort, searchRange]);

  useEffect(() => {
    bottomSheetModalRef.current?.dismiss();
  }, [searchSort, searchRange]);

  const renderBackdrop = useBackdrop();

  return (
    <>
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
                  color={searchText.length > 0 ? theme.onSurface : theme.onSurfaceVariant}
                />
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
                    console.log('onChangeText', txt);
                    setSearchText(txt);
                  }}
                  value={searchText}
                  placeholder={`Search r/${subreddit}`}
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
        {!!initialQuery && (
          <View style={{ flexDirection: 'row', marginLeft: Spacing.s8 }}>
            <View
              style={{
                borderColor: theme.outlineVariant,
                borderWidth: 1,
                borderRadius: Spacing.s8,
                paddingHorizontal: Spacing.s8,
                paddingVertical: Spacing.s4,
              }}>
              <Typography variant="labelMedium">{initialQuery}</Typography>
            </View>
          </View>
        )}

        {!!initialQuery ||
          (searchText.length >= 3 && (
            <>
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
                    inputRef.current?.blur();
                    bottomSheetModalRef.current?.present('sort');
                  }}
                />
                <FilterChip
                  value={searchRange}
                  onChange={() => {
                    inputRef.current?.blur();
                    bottomSheetModalRef.current?.present('range');
                  }}
                />
              </View>
            </>
          ))}

        {!!loading && <ActivityIndicator color={theme.primary} />}
        <FlatList
          ref={flatListRef}
          data={results}
          renderItem={({ item }) => <SearchResultItem result={item} theme={theme} />}
          keyExtractor={(item) => item.data.id}
          style={{ flex: 1 }}
          keyboardShouldPersistTaps={'handled'}
        />
      </View>
      <BottomSheetModal
        ref={bottomSheetModalRef}
        index={0}
        maxDynamicContentSize={600}
        backgroundStyle={{ backgroundColor: theme.surfaceContainerLow }}
        handleStyle={{
          backgroundColor: theme.surfaceContainerLow,
          borderTopLeftRadius: 28,
          borderTopRightRadius: 28,
        }}
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

export default function Page() {
  const { subreddit, initialQuery } = useLocalSearchParams();

  return (
    <SubredditSearchPage
      subreddit={subreddit as string}
      initialQuery={initialQuery as string | null}
    />
  );
}
