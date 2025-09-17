import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { Stack } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { FlatList, TextInput, View } from 'react-native';
import { Post, RedditApi } from '../../../services/api';
import useTheme from '../../../services/theme/useTheme';
import Typography from '../../components/Typography';
import { Spacing } from '../../tokens';
import SubredditPostItemView from '../feed/components/PostFeedItem';

type Props = {
  subreddit: string;
  initialQuery: string | null;
};

const PostSearch = ({ subreddit, initialQuery }: Props) => {
  const theme = useTheme();
  const [searchText, setSearchText] = useState('');
  const [results, setResults] = useState<Post[]>([]);
  const flatListRef = React.useRef<FlatList>(null);
  const inputRef = useRef<TextInput>(null);

  useFocusEffect(() => inputRef.current?.focus());

  useEffect(() => {
    if (initialQuery) {
      const fetchItems = async () => {
        const searchResults = await new RedditApi().searchSubmissions(
          initialQuery,
          subreddit as string,
          { sort: 'new', t: 'all', restrict_sr: 'on' }
        );
        if (searchResults) {
          setResults(searchResults.items);
        } else {
          setResults([]);
        }
        flatListRef?.current?.scrollToOffset({ animated: true, offset: 0 });
      };
      fetchItems();
    }
  }, [subreddit, initialQuery]);

  const searchSubReddits = async (txt: string) => {
    if (txt && txt.length > 2) {
      const searchResults = await new RedditApi().searchSubmissions(
        initialQuery ? `${initialQuery} ${txt}` : `${txt} subreddit:${subreddit}`,
        subreddit as string,
        { sort: 'new', t: 'all', restrict_sr: 'on' }
      );
      console.log('search', searchResults);
      if (searchResults) {
        setResults(searchResults.items);
      } else {
        setResults([]);
      }
      flatListRef?.current?.scrollToOffset({ animated: true, offset: 0 });
    } else if (initialQuery) {
      const searchResults = await new RedditApi().searchSubmissions(
        initialQuery,
        subreddit as string,
        { sort: 'new', t: 'all', restrict_sr: 'on' }
      );
      if (searchResults) {
        setResults(searchResults.items);
      } else {
        setResults([]);
      }
      flatListRef?.current?.scrollToOffset({ animated: true, offset: 0 });
    } else {
      setResults([]);
    }
  };

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
                  searchSubReddits('');
                }}
                name="close"
                size={24}
                color={
                  searchText.length > 0 ? theme.onSurface : theme.onSurfaceVariant
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
                  console.log('onChangeText', txt);
                  setSearchText(txt);
                  searchSubReddits(txt);
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
      {initialQuery && (
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
      <Typography
        variant="bodyMedium"
        style={{
          marginHorizontal: Spacing.s12,
          marginVertical: Spacing.s8,
        }}>
        Results
      </Typography>
      <FlatList
        ref={flatListRef}
        data={results}
        renderItem={({ item }) => <SubredditPostItemView post={item} theme={theme} />}
        keyExtractor={(item) => item.data.id}
        style={{ flex: 1 }}
        keyboardShouldPersistTaps={'handled'}
      />
    </View>
  );
};

export default PostSearch;
