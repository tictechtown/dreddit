import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { Stack } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { FlatList, StyleSheet, Text, TextInput, View } from 'react-native';
import { Post, RedditApi } from '../../../services/api';
import { Palette } from '../../colors';
import { Spacing } from '../../typography';
import SubredditPostItemView from '../components/SubredditPostItemView';

type Props = {
  subreddit: string;
  initialQuery: string | null;
};

const PostSearch = ({ subreddit, initialQuery }: Props) => {
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
        initialQuery ?? `${searchText} subreddit:${subreddit}`,
        subreddit as string,
        { sort: 'new', t: 'all' }
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
    <View style={{ flex: 1, backgroundColor: Palette.background }}>
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
                  searchText.length > 0 ? Palette.onSurfaceVariant : 'black'
                }></MaterialCommunityIcons>
            );
          },
          headerTitle: () => {
            return (
              <TextInput
                ref={inputRef}
                style={styles.input}
                onChangeText={(txt) => {
                  setSearchText(txt);
                  searchSubReddits(txt);
                }}
                value={searchText}
                placeholder={`Search r/${subreddit}`}
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
      {initialQuery && (
        <View style={{ flexDirection: 'row' }}>
          <View
            style={{
              backgroundColor: Palette.background,
              paddingHorizontal: Spacing.small,
              paddingVertical: Spacing.xsmall,
              borderRadius: 10,
            }}>
            <Text style={{ color: Palette.onBackground }}>{initialQuery}</Text>
          </View>
        </View>
      )}
      <Text
        style={{
          color: Palette.onBackground,
          fontSize: 16,
          marginHorizontal: Spacing.small,
          marginTop: Spacing.regular,
          marginBottom: Spacing.small,
        }}>
        {'Results'}
      </Text>
      <FlatList
        ref={flatListRef}
        data={results}
        renderItem={({ item }) => <SubredditPostItemView post={item} />}
        keyExtractor={(item) => item.data.id}
        style={{ flex: 1 }}
        keyboardShouldPersistTaps={'handled'}
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

export default PostSearch;
