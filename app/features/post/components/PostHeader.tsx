import Markdown from '@ronradtke/react-native-markdown-display';
import { router } from 'expo-router';
import { decode } from 'html-entities';
import React, { useCallback, useMemo } from 'react';
import { Pressable, Text, TouchableOpacity, View, useWindowDimensions } from 'react-native';
import { Post } from '../../../services/api';
import { ColorPalette } from '../../colors';
import CarouselView from '../../components/CarouselView';
import Icons from '../../components/Icons';
import PostKarmaButton from '../../components/PostKarmaButton';
import Typography from '../../components/Typography';
import FlairTextView from '../../subreddit/components/FlairTextView';
import PostPreview from '../../subreddit/components/PostPreview';
import { Spacing } from '../../tokens';
import { timeDifference } from '../../utils';
import { markdownIt, markdownRenderRules, useMarkdownStyle } from '../utils';
import PollOption from './PollOption';

function getDisplaySortOrder(forcedSortOrder: string | null, suggestedSort: string | null): string {
  let sort = forcedSortOrder ?? suggestedSort ?? 'best';
  // confidence is deprecated. Display "best" instead
  if (sort === 'confidence') {
    sort = 'best';
  }

  return sort[0].toLocaleUpperCase() + sort.slice(1);
}

const PostHeader = ({
  post,
  forcedSortOrder,
  onPress,
  onChangeSort,
  theme,
}: {
  post: null | Post;
  forcedSortOrder: string | null;
  onPress: () => void;
  onChangeSort: () => void;
  theme: ColorPalette;
}) => {
  if (!post) {
    return null;
  }
  const dimensions = useWindowDimensions();
  const mdStyle = useMarkdownStyle(theme);

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

  const displayedSortOrder = getDisplaySortOrder(forcedSortOrder, post.data.suggested_sort);

  const authorColor = post.data.stickied ? theme['custom-green'] : theme.primary;

  return (
    <View>
      <View
        style={{
          flexDirection: 'row',
          marginTop: 10,
          marginHorizontal: 12,
          columnGap: 8,
          alignItems: 'center',
        }}>
        <Typography variant="overline" style={{ color: authorColor }}>
          {post.data.author}
        </Typography>
        <FlairTextView
          flair_richtext={post.data.author_flair_richtext}
          flair_text={post.data.author_flair_text}
          stickied={false}
          pinned={false}
          flair_type={post.data.author_flair_type}
          flair_background_color={post.data.author_flair_background_color}
          theme={theme}
        />
        <Typography variant="overline" style={{ color: theme.secondary }}>
          • {timeDifference(post.data.created_utc * 1000)}
        </Typography>
      </View>
      <Typography
        variant="titleMedium"
        style={{
          paddingTop: 4,
          paddingHorizontal: Spacing.s12,
          fontWeight: '400',
        }}>
        {decode(post.data.title)}
      </Typography>
      <View style={{ padding: Spacing.s12, paddingTop: Spacing.s8, flexDirection: 'row' }}>
        {post.data.link_flair_text && (
          <FlairTextView
            flair_text={post.data.link_flair_text}
            flair_type={post.data.link_flair_type}
            flair_richtext={post.data.link_flair_richtext}
            flair_background_color={post.data.link_flair_background_color}
            pinned={post.data.pinned}
            stickied={post.data.stickied}
            outlined
            theme={theme}
          />
        )}
      </View>

      <Pressable onPress={onPress}>
        <View style={{ marginHorizontal: 12 }}>
          <PostPreview post={post} imageWidth={dimensions.width - 24} theme={theme} />
          {maxGaleryResolutions && (
            <CarouselView resolutions={maxGaleryResolutions} width={dimensions.width - 24} />
          )}
        </View>
      </Pressable>

      {post.data.selftext.length > 0 && (
        <View
          style={{
            padding: Spacing.s12,
            margin: Spacing.s12,

            backgroundColor: theme.surfaceContainer,
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

              <Text style={{ color: theme.onSurface, alignSelf: 'flex-end' }}>
                {post.data.poll_data.total_vote_count} votes
              </Text>

              {post.data.poll_data.voting_end_timestamp - Date.now() > 0 ? (
                <Text style={{ color: theme.onSurface }}>Voting still open</Text>
              ) : (
                <Text style={{ color: theme.onSurface }}>
                  Voting closed {timeDifference(post.data.poll_data.voting_end_timestamp)}
                </Text>
              )}
            </View>
          )}
          <Markdown
            markdownit={markdownIt}
            // @ts-ignore
            style={mdStyle}
            onLinkPress={_onLinkPress}
            rules={markdownRenderRules}>
            {decode(post.data.selftext)}
          </Markdown>
        </View>
      )}
      <View
        style={{
          backgroundColor: theme.surface,
          padding: Spacing.s12,
          marginBottom: Spacing.s12,
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        <PostKarmaButton karma={post.data.score} />

        <View style={{ flexDirection: 'row', alignItems: 'center', columnGap: 8 }}>
          <Icons name="question-answer" size={14} color={theme.secondary} />
          <Typography variant="labelMedium" style={{ color: theme.secondary }}>
            {(post.data.num_comments ?? 0).toLocaleString('en-US')}
          </Typography>
          <TouchableOpacity onPress={onChangeSort}>
            <View
              style={{
                flexDirection: 'row',
                borderRadius: 8,
                backgroundColor: theme.secondaryContainer,
                paddingLeft: 16,
                paddingVertical: 6,
                paddingRight: 8,
                columnGap: 8,
                alignItems: 'center',
              }}>
              <Text style={{ fontWeight: 'bold', color: theme.onSurfaceVariant }}>
                {displayedSortOrder}
              </Text>
              <Icons name="arrow-drop-down" color={theme.onSurfaceVariant} size={18} />
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default React.memo(PostHeader);
