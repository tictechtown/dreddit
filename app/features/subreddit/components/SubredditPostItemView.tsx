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
    const href = onLinkPress(post);
    if (href.pathname === 'features/full' && href.params) {
      WebBrowser.openBrowserAsync(href.params.uri as string, { createTask: false });
    } else {
      router.push(href);
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

  const hasFlair = post.data.link_flair_text || post.data.pinned || post.data.stickied;

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
        <View style={{ width: '100%' }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: hasFlair ? 'flex-start' : 'flex-end',
            }}>
            <View style={{ rowGap: 0 }}>
              {hasFlair && (
                <FlairTextView
                  flair_text={post.data.link_flair_text}
                  flair_richtext={post.data.link_flair_richtext}
                  flair_background_color={post.data.link_flair_background_color}
                  pinned={post.data.pinned}
                  stickied={post.data.stickied}
                  flair_type={post.data.link_flair_type}
                  over_18={post.data.over_18}
                  containerStyle={{}}
                />
              )}

              <TouchableOpacity onPress={goToUserPage}>
                <Typography variant="overline" style={{ color: Palette.primary }}>
                  {post.data.author} • {timeDifference(post.data.created_utc * 1000, 'en')}
                </Typography>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              onPress={() => {
                router.push({
                  pathname: `features/subreddit/${post.data.subreddit}`,
                  params: {
                    icon: require('../../../../assets/images/subbit.png'),
                  },
                });
              }}>
              <View
                style={{
                  paddingHorizontal: 6,
                  paddingBottom: 2,
                  borderWidth: 1,
                  borderRadius: 4,
                  borderColor: Palette.outlineVariant,
                }}>
                <Typography variant="labelSmall" style={{ color: Palette.onSurfaceVariant }}>
                  {post.data.subreddit}
                </Typography>
              </View>
            </TouchableOpacity>
          </View>
          <Typography
            variant="titleMedium"
            style={{
              flex: 0,
              paddingTop: 2,
            }}>
            {decode(post.data.title)}
          </Typography>
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
