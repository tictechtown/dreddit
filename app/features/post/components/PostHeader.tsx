import { MaterialCommunityIcons } from '@expo/vector-icons';
import Markdown from '@ronradtke/react-native-markdown-display';
import { router } from 'expo-router';
import { decode } from 'html-entities';
import React, { useCallback, useMemo } from 'react';
import { Pressable, Text, TouchableOpacity, View, useWindowDimensions } from 'react-native';
import { Post } from '../../../services/api';
import { Palette } from '../../colors';
import CarouselView from '../../components/CarouselView';
import FlairTextView from '../../subreddit/components/FlairTextView';
import PostPreview from '../../subreddit/components/PostPreview';
import { Spacing } from '../../typography';
import { timeDifference } from '../../utils';
import { markdownIt, markdownRenderRules, markdownStyles } from '../utils';
import PollOption from './PollOption';

const PostHeader = ({
  post,
  forcedSortOrder,
  onPress,
  onChangeSort,
}: {
  post: null | Post;
  forcedSortOrder: string | null;
  onPress: () => void;
  onChangeSort: () => void;
}) => {
  if (!post) {
    return null;
  }
  const dimensions = useWindowDimensions();

  const maxGaleryResolutions = useMemo(() => {
    if (!post.data.gallery_data || !post.data.media_metadata) return null;
    const metadata = post.data.media_metadata;
    const mediaIds = post.data.gallery_data.items.map((it) => it.media_id);
    const galeryWithAllResolutions = mediaIds.map((mediaId) => metadata[mediaId].p);
    return galeryWithAllResolutions.map(
      (allResolutions) => allResolutions[allResolutions.length - 1]
    );
  }, [post.data.gallery_data]);

  const _onLinkPress = useCallback((url: string) => {
    if (url && url.startsWith('https://www.reddit.com/r/') && url.includes('/comments/')) {
      // redirect to subredit comment
      const elements = url.replace('://', '/').split('/');
      const commentIndex = elements.findIndex((it) => it === 'comments');
      router.push({
        pathname: `features/post/${elements[commentIndex + 1]}`,
        params: { postid: elements[commentIndex + 1] },
      });
      // some custom logic
      return false;
    }
    if (url && url.startsWith('https://preview.redd.it')) {
      router.push({
        pathname: 'features/media/image',
        params: { uri: url, title: post.data.title },
      });
      return false;
    }

    // return true to open with `Linking.openURL
    // return false to handle it yourself
    return true;
  }, []);

  let displayedSortOrder = forcedSortOrder ?? post.data.suggested_sort ?? 'best';
  // confidence is deprecated. Display "best" instead
  if (displayedSortOrder === 'confidence') {
    displayedSortOrder = 'best';
  }

  return (
    <View>
      <View style={{ flexDirection: 'row', marginLeft: 8 }}>
        <Text
          style={{
            color: Palette.primary,
            fontSize: 16,
            fontWeight: 'bold',
          }}>
          {post.data.author}
        </Text>
        <FlairTextView
          flair_richtext={post.data.author_flair_richtext}
          flair_text={post.data.author_flair_text}
          stickied={false}
          pinned={false}
          flair_type={post.data.author_flair_type}
          flair_background_color={post.data.author_flair_background_color}
          containerStyle={{ marginHorizontal: 4 }}
        />

        <Text style={{ color: Palette.secondary, fontSize: 16, fontWeight: '300' }}>
          • {timeDifference(post.data.created_utc * 1000)}
        </Text>
      </View>
      <Pressable onPress={onPress}>
        <Text
          style={{
            color: Palette.onBackgroundLowest,
            fontSize: 18,
            paddingHorizontal: Spacing.small,
          }}>
          {decode(post.data.title)} ({post.data.domain})
        </Text>
      </Pressable>
      <View style={{ padding: Spacing.small, flexDirection: 'row' }}>
        <View
          style={{
            flex: 0,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: Palette.surfaceVariant,
            borderRadius: 8,
            paddingHorizontal: 6,
            flexDirection: 'row',
            marginRight: Spacing.small,
          }}>
          <MaterialCommunityIcons
            name="arrow-up-down-bold"
            color={Palette.onSurfaceVariant}
            size={16}
          />
          <Text style={{ color: Palette.onSurfaceVariant, fontSize: 16, fontWeight: 'bold' }}>
            {(post.data.ups - post.data.downs).toLocaleString('en-US')}
          </Text>
        </View>
        {post.data.link_flair_text && (
          <FlairTextView
            flair_text={post.data.link_flair_text}
            flair_type={post.data.link_flair_type}
            flair_richtext={post.data.link_flair_richtext}
            flair_background_color={post.data.link_flair_background_color}
            textStyle={{
              color: Palette.onSurfaceVariant,
              fontSize: 14,
              fontWeight: 'bold',
            }}
            pinned={post.data.pinned}
            stickied={post.data.stickied}
            containerStyle={{
              flex: 0,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: Palette.surfaceVariant,
              borderRadius: 8,
              paddingHorizontal: Spacing.small,
              flexDirection: 'row',
            }}
          />
        )}
      </View>

      <PostPreview post={post} imageWidth={dimensions.width} />
      {maxGaleryResolutions && (
        <CarouselView resolutions={maxGaleryResolutions} width={dimensions.width} />
      )}

      {post.data.selftext.length > 0 && (
        <View
          style={{
            borderColor: Palette.outline,
            padding: Spacing.small,
            margin: Spacing.small,
            borderWidth: 1,
            borderRadius: 8,
          }}>
          {post.data.poll_data && (
            <View style={{ marginBottom: 8 }}>
              <View>
                {post.data.poll_data.options.map((opt) => (
                  <PollOption
                    key={opt.id}
                    option={opt}
                    total={post.data.poll_data?.total_vote_count ?? 0}
                  />
                ))}
              </View>

              <Text style={{ color: Palette.onBackgroundLowest, alignSelf: 'flex-end' }}>
                {post.data.poll_data.total_vote_count} votes
              </Text>

              {post.data.poll_data.voting_end_timestamp - Date.now() > 0 ? (
                <Text style={{ color: Palette.onBackgroundLowest }}>Voting still open</Text>
              ) : (
                <Text style={{ color: Palette.onBackgroundLowest }}>
                  Voting closed {timeDifference(post.data.poll_data.voting_end_timestamp)}
                </Text>
              )}
            </View>
          )}
          <Markdown
            markdownit={markdownIt}
            style={markdownStyles}
            onLinkPress={_onLinkPress}
            rules={markdownRenderRules}>
            {decode(post.data.selftext)}
          </Markdown>
        </View>
      )}
      <View
        style={{
          backgroundColor: Palette.background,
          padding: Spacing.small,
          marginBottom: Spacing.small,
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        <Text style={{ color: Palette.onBackground }}>
          {(post.data.num_comments ?? 0).toLocaleString('en-US')} comments
        </Text>
        <View style={{ flexDirection: 'row' }}>
          <Text style={{ color: Palette.onBackground, fontWeight: '300' }}>sorted by </Text>
          <TouchableOpacity onPress={onChangeSort}>
            <Text style={{ fontWeight: 'bold', color: Palette.secondary }}>
              {displayedSortOrder}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default React.memo(PostHeader);
