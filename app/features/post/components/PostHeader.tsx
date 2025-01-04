import Markdown from '@ronradtke/react-native-markdown-display';
import { router } from 'expo-router';
import { decode } from 'html-entities';
import React, { useCallback } from 'react';
import { Pressable, TouchableOpacity, View, useWindowDimensions } from 'react-native';
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
import useGalleryData from '../../../hooks/useGalleryData';

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
  onMediaPress,
  onChangeSort,
  theme,
}: {
  post: null | Post;
  forcedSortOrder: string | null;
  onMediaPress: () => void;
  onChangeSort: () => void;
  theme: ColorPalette;
}) => {
  if (!post) {
    return null;
  }
  const dimensions = useWindowDimensions();
  const mdStyle = useMarkdownStyle(theme);

  const [maxGaleryResolutions, galleryCaptions] = useGalleryData(
    post.data.gallery_data,
    post.data.media_metadata
  );

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
    <View style={{ rowGap: Spacing.s12 }}>
      <View style={{ rowGap: Spacing.s4 }}>
        {/* subHeader */}
        <View
          style={{
            flexDirection: 'row',
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
        {/* Header */}
        <Typography
          variant="titleMedium"
          style={{
            paddingHorizontal: Spacing.s12,
            fontWeight: '400',
          }}>
          {decode(post.data.title).trim()}
        </Typography>
        {/* Flair */}
        {post.data.link_flair_text && (
          <View
            style={{
              paddingHorizontal: Spacing.s12,
              paddingTop: Spacing.s4,
              flexDirection: 'row',
            }}>
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
          </View>
        )}
      </View>
      {/* Image */}
      <Pressable onPress={onMediaPress}>
        <View style={{ marginHorizontal: 12 }}>
          <PostPreview post={post} imageWidth={dimensions.width - 24} theme={theme} />
          {maxGaleryResolutions && (
            <CarouselView
              captions={galleryCaptions}
              resolutions={maxGaleryResolutions}
              width={dimensions.width - 24}
            />
          )}
        </View>
      </Pressable>
      {/* Description */}
      {post.data.selftext.length > 0 && (
        <View
          style={{
            padding: Spacing.s12,
            marginHorizontal: Spacing.s12,

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

              <Typography variant="bodyMedium" style={{ alignSelf: 'flex-end' }}>
                {post.data.poll_data.total_vote_count} votes
              </Typography>

              {post.data.poll_data.voting_end_timestamp - Date.now() > 0 ? (
                <Typography variant="bodyMedium">Voting still open</Typography>
              ) : (
                <Typography variant="bodyMedium">
                  Voting closed {timeDifference(post.data.poll_data.voting_end_timestamp)}
                </Typography>
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
      {/* Bottom Bar */}
      <View
        style={{
          backgroundColor: theme.surface,
          paddingHorizontal: Spacing.s12,
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
                paddingLeft: 12,
                paddingVertical: 6,
                paddingRight: 4,
                columnGap: 2,
                alignItems: 'center',
              }}>
              <Typography
                variant="bodyMedium"
                style={{ fontWeight: 'bold', color: theme.onSurfaceVariant }}>
                {displayedSortOrder}
              </Typography>
              <Icons name="arrow-drop-down" color={theme.onSurfaceVariant} size={18} />
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default React.memo(PostHeader);
