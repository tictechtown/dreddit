import Markdown from '@ronradtke/react-native-markdown-display';
import { router } from 'expo-router';
import { decode } from 'html-entities';
import React, { useCallback, useMemo, useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { Comment, RedditMediaMedata } from '../../../services/api';
import { ColorPalette } from '../../colors';
import Typography from '../../components/Typography';
import FlairTextView from '../../subreddit/components/FlairTextView';
import { Spacing } from '../../tokens';
import { timeDifference } from '../../utils';
import { markdownIt, markdownRenderRules, useCommentMarkdownStyle } from '../utils';
import CommentMediaView from './CommentMediaView';

const CommentItem = ({
  comment,
  showGif,
  fetchMoreComments,
  theme,
}: {
  comment: Comment;
  showGif: (value: RedditMediaMedata) => void;
  fetchMoreComments: (commentId: string, childrenIds: string[]) => void;
  theme: ColorPalette;
}) => {
  const mdStyle = useCommentMarkdownStyle(theme);

  const [showModeration, setShowModeration] = useState(false);

  const fetchMore = useCallback(() => {
    if ('children' in comment.data) {
      fetchMoreComments(comment.data.id, comment.data.children);
    }
    // @ts-ignore
  }, [fetchMoreComments, comment.data.id, comment.data.children]);

  const isGifReply = useMemo(() => {
    if (!('media_metadata' in comment.data) || !comment.data.media_metadata) {
      return null;
    }
    const value = Object.values(comment.data.media_metadata)[0];
    return value;
  }, [comment.data]);

  const goToUserPage = useCallback(() => {
    if ('author' in comment.data) {
      if (comment.data.author === 'AutoModerator') {
        setShowModeration((prev) => !prev);
      } else {
        router.push({
          pathname: 'features/user',
          params: { userid: comment.data.author },
        });
      }
    }

    // @ts-ignore
  }, [comment.data.author]);

  const _onLinkPress = useCallback((url: string) => {
    console.log('url pressed', url);
    if (url && url.includes('reddit.com/r/')) {
      // comments
      if (url.includes('/comments/')) {
        // redirect to subredit comment
        const elements = url.replace('://', '/').split('/');
        const commentIndex = elements.findIndex((it) => it === 'comments');
        router.push({
          pathname: `features/post/${elements[commentIndex + 1]}`,
          params: { postid: elements[commentIndex + 1] },
        });
        return false;
      } else if (url.includes('/s/')) {
        // share url (reddit.com/r/<subreddit>/s/<postId>)
        // we go fetch the data then redirect :)
        fetch(url).then((response) => {
          // console.log('headers', response.headers);
          const elements = response.url.replace('://', '/').split('/');
          const commentIndex = elements.findIndex((it) => it === 'comments');
          router.push({
            pathname: `features/post/${elements[commentIndex + 1]}`,
            params: { postid: elements[commentIndex + 1] },
          });
        });
        return false;
      }
    }
    if (url && url.startsWith('https://preview.redd.it')) {
      router.push({
        pathname: 'features/media/image',
        params: { uri: url, title: '' },
      });
      return false;
    }

    // return true to open with `Linking.openURL
    // return false to handle it yourself
    return true;
  }, []);

  if (comment.kind === 'more') {
    return (
      <TouchableOpacity onPress={fetchMore}>
        <View
          style={{
            flexDirection: 'row',
            marginLeft: comment.data.depth
              ? Spacing.s12 + Spacing.s16 * comment.data.depth
              : Spacing.s12,
            marginRight: Spacing.s16,
            marginBottom: Spacing.s8,
          }}>
          <Typography
            variant="labelSmall"
            style={{
              color: theme.primary,
            }}>
            {comment.data.count} more {comment.data.count > 1 ? 'replies' : 'reply'}
          </Typography>
        </View>
      </TouchableOpacity>
    );
  }

  const isAutomoderator = comment.data.author === 'AutoModerator';

  let fontColor = comment.data.is_submitter ? theme.primary : theme.onSurfaceVariant;
  fontColor =
    isAutomoderator || comment.data.distinguished !== null ? theme['custom-green'] : fontColor;
  const opacity = fontColor === theme.onSurfaceVariant ? 0.6 : 1;
  const hasReplies = comment.data.replies !== undefined;

  return (
    <View
      style={{
        paddingRight: Spacing.s16,
        paddingLeft: comment.data.depth
          ? Spacing.s12 + Spacing.s16 * comment.data.depth
          : Spacing.s12,
        marginBottom: hasReplies ? 0 : Spacing.s8,
      }}>
      <View style={{ flexDirection: 'row', columnGap: 4 }}>
        <TouchableOpacity onPress={goToUserPage}>
          <Typography
            variant="labelMedium"
            style={{
              color: fontColor,
              fontWeight: 'bold',
              opacity,
            }}>
            {comment.data.author}
          </Typography>
        </TouchableOpacity>
        <FlairTextView
          flair_richtext={comment.data.author_flair_richtext}
          flair_text={comment.data.author_flair_text}
          stickied={comment.data.stickied}
          pinned={false}
          flair_type={comment.data.author_flair_type}
          flair_background_color={comment.data.author_flair_background_color}
          theme={theme}
        />
        <Typography variant="labelMedium" style={{ color: fontColor, fontWeight: '300', opacity }}>
          • {comment.data.score} {comment.data.score > 1 ? 'points' : 'point'} •{' '}
          {timeDifference(comment.data.created_utc * 1000)}
        </Typography>
      </View>
      <View style={{ marginBottom: Spacing.s4, flex: 0 }}>
        {isAutomoderator && !showModeration ? null : isGifReply ? (
          <CommentMediaView item={isGifReply} showGif={showGif} body={comment.data.body} />
        ) : (
          <Markdown
            markdownit={markdownIt}
            style={mdStyle}
            rules={markdownRenderRules}
            onLinkPress={_onLinkPress}>
            {decode(comment.data.body)}
          </Markdown>
        )}
      </View>
    </View>
  );
};

export default React.memo(CommentItem);
