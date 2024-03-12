import { router } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { decode } from 'html-entities';
import React, { useCallback, useMemo } from 'react';
import { Pressable, TouchableOpacity, View, useWindowDimensions } from 'react-native';
import { Post } from '../../../services/api';
import postCache from '../../../services/postCache';
import { Palette } from '../../colors';
import CarouselView from '../../components/CarouselView';
import Typography from '../../components/Typography';
import { Spacing } from '../../typography';
import { timeDifference } from '../../utils';
import { onLinkPress } from '../utils';
import FlairTextView from './FlairTextView';
import PostPreview from './PostPreview';
import PostToolbar from './PostToolbar';

const SubredditPostItemView = ({
  post,
  isSaved,
  addToSavedPosts,
  removeFromSavedPosts,
}: {
  post: Post;
  isSaved?: boolean;
  addToSavedPosts?: (post: Post) => void;
  removeFromSavedPosts?: (post: Post) => void;
}) => {
  if (!post?.data) {
    console.log('post', post);
    return null;
  }

  const { width } = useWindowDimensions();

  const maxGaleryResolutions = useMemo(() => {
    if (!post.data.gallery_data || !post.data.media_metadata) return null;
    const metadata = post.data.media_metadata;
    const mediaIds = post.data.gallery_data.items.map((it) => it.media_id);
    const galeryWithAllResolutions = mediaIds.map((mediaId) => metadata[mediaId].p).filter(Boolean);
    return galeryWithAllResolutions.map(
      (allResolutions) => allResolutions[allResolutions.length - 1]
    );
  }, [post.data.gallery_data]);

  postCache.setCache(post.data.id, post);

  const onPress = useCallback(() => {
    if (post.data.domain !== 'reddit.com') {
      const href = onLinkPress(post);
      if (href.pathname === 'features/full' && href.params) {
        WebBrowser.openBrowserAsync(href.params.uri as string, { createTask: false });
      } else {
        router.push(href);
      }
    } else {
      // a bit dirty, reddit.com is usually from a previously shared post
      // so we fetch the post (async) to get the redirected url
      // then parse the url to get the final postId
      fetch(post.data.url).then((data) => {
        const postId = data.url.split('comments/')[1].split('/')[0];
        if (postId !== undefined) {
          router.push({
            pathname: `features/post/${postId}`,
            params: { postid: postId },
          });
        } else {
          console.warn('couldnt get postId from url:', data.url);
        }
      });
    }
  }, [post.data.id]);

  const goToUserPage = useCallback(() => {
    if ('author' in post.data) {
      router.push({
        pathname: 'features/user',
        params: { userid: post.data.author },
      });
    }
  }, [post.data.author]);

  const isCrosspost = Array.isArray(post.data.crosspost_parent_list);
  const imageWidth = width - 16 * 2;

  return (
    <Pressable onPress={onPress}>
      <View
        style={{
          flex: 1,
          marginVertical: 6,
          paddingHorizontal: Spacing.regular,
          paddingVertical: 10,
          backgroundColor: Palette.surface,
        }}>
        <View style={{ width: '100%', rowGap: 4 }}>
          <TouchableOpacity onPress={goToUserPage}>
            <Typography variant="overline" style={{ color: Palette.primary }}>
              {post.data.author}
              <Typography variant="overline" style={{ color: Palette.secondary }}>
                {' '}
                • {timeDifference(post.data.created_utc * 1000, 'en')} • r/
                {post.data.subreddit}
              </Typography>
            </Typography>
          </TouchableOpacity>
          <Typography variant="titleMedium">{decode(post.data.title)}</Typography>
          <View style={{ flexDirection: 'row', paddingTop: 4 }}>
            {post.data.link_flair_text && (
              <FlairTextView
                flair_text={post.data.link_flair_text}
                flair_type={post.data.link_flair_type}
                flair_richtext={post.data.link_flair_richtext}
                flair_background_color={post.data.link_flair_background_color}
                textStyle={{
                  color: Palette.onSurfaceVariant,
                  fontSize: 12,
                  fontWeight: 'bold',
                }}
                pinned={post.data.pinned}
                stickied={post.data.stickied}
                containerStyle={{
                  flex: 0,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: Palette.surfaceContainerHigh,
                  borderRadius: Spacing.xsmall,
                  paddingHorizontal: Spacing.xsmall,
                  paddingVertical: Spacing.xxsmall,
                  flexDirection: 'row',
                }}
              />
            )}
          </View>
        </View>

        <View style={{ paddingVertical: Spacing.regular, paddingTop: Spacing.small }}>
          <PostPreview post={post} imageWidth={imageWidth} />
          {!isCrosspost && maxGaleryResolutions && (
            <CarouselView resolutions={maxGaleryResolutions} width={imageWidth} />
          )}
        </View>

        <PostToolbar
          post={post}
          isSaved={isSaved}
          addToSavedPosts={addToSavedPosts}
          removeFromSavedPosts={removeFromSavedPosts}
        />
      </View>
    </Pressable>
  );
};

export default React.memo(SubredditPostItemView);
