import Markdown from '@ronradtke/react-native-markdown-display';
import { router } from 'expo-router';
import { decode } from 'html-entities';
import React, { useCallback, useMemo } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Comment, RedditMediaMedata } from '../../../services/api';
import { Palette } from '../../colors';
import FlairTextView from '../../subreddit/components/FlairTextView';
import { Spacing } from '../../typography';
import { timeDifference } from '../../utils';
import { markdownIt, markdownRenderRules, markdownStyles } from '../utils';
import CommentMediaView from './CommentMediaView';

const CommentItem = ({
  comment,
  showGif,
  fetchMoreComments,
}: {
  comment: Comment;
  showGif: (value: RedditMediaMedata) => void;
  fetchMoreComments: (commentId: string, childrenIds: string[]) => void;
}) => {
  const fetchMore = useCallback(() => {
    fetchMoreComments(comment.data.id, comment.data.children);
  }, [fetchMoreComments, comment.data.id, comment.data.children]);

  const isGifReply = useMemo(() => {
    if (!('media_metadata' in comment.data) || !comment.data.media_metadata) {
      return null;
    }
    const value = Object.values(comment.data.media_metadata)[0];
    return value;
  }, [comment.data]);

  const goToUserPage = useCallback(() => {
    router.push({
      pathname: 'features/user',
      params: { userid: comment.data.author },
    });
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
        <Text
          style={{
            color: Palette.secondary,
            fontSize: 10,
            paddingLeft: comment.data.depth ? Spacing.regular * comment.data.depth : Spacing.xsmall,
            marginBottom: Spacing.small,
          }}>
          Load {comment.data.count} more {comment.data.count > 1 ? 'comments' : 'comment'}
        </Text>
      </TouchableOpacity>
    );
  }

  let fontColor = comment.data.is_submitter ? Palette.primary : 'grey';
  fontColor =
    comment.data.author === 'AutoModerator' || comment.data.distinguished !== null
      ? '#aed285'
      : fontColor;

  const hasReplies = comment.data.replies !== undefined;

  return (
    <View
      style={{
        paddingRight: Spacing.xsmall,
        paddingLeft: comment.data.depth ? Spacing.regular * comment.data.depth : Spacing.xsmall,
        marginBottom: hasReplies ? 0 : Spacing.small,
      }}>
      <View style={{ flexDirection: 'row' }}>
        <TouchableOpacity onPress={goToUserPage}>
          <Text
            style={{
              color: fontColor,
              fontSize: 12,
              fontWeight: 'bold',
            }}>
            {comment.data.author}
          </Text>
        </TouchableOpacity>
        <FlairTextView
          flair_richtext={comment.data.author_flair_richtext}
          flair_text={comment.data.author_flair_text}
          stickied={comment.data.stickied}
          pinned={false}
          flair_type={comment.data.author_flair_type}
          flair_background_color={comment.data.author_flair_background_color}
          containerStyle={{ marginLeft: 4 }}
        />
        <Text style={{ color: fontColor, fontSize: 12, fontWeight: '300' }}>
          {' '}
          • {comment.data.score} {comment.data.score > 1 ? 'points' : 'point'} •{' '}
        </Text>
        <Text style={{ color: fontColor, fontSize: 12, fontWeight: '300' }}>
          {timeDifference(comment.data.created_utc * 1000)}
        </Text>
      </View>
      <View style={{ marginBottom: 8, flex: 0 }}>
        {isGifReply ? (
          <CommentMediaView item={isGifReply} showGif={showGif} body={comment.data.body} />
        ) : (
          <Markdown
            markdownit={markdownIt}
            style={markdownStyles}
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
