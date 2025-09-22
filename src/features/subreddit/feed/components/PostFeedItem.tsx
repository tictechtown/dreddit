import { router } from 'expo-router';
import { decode } from 'html-entities';
import React, { useCallback } from 'react';
import { View, useWindowDimensions } from 'react-native';
import { Post } from '../../../../services/api';
import postCache from '../../../../services/postCache';
import { ColorPalette } from '../../../../colors';
import CarouselView from '../../../../components/CarouselView';
import Typography from '../../../../components/Typography';
import { Spacing } from '../../../../tokens';
import { timeDifference } from '../../../../utils/get-time-difference';
import PostFlairChip from '../../../../components/PostFlairChip';
import PostContentPreview from './PostContentPreview';
import PostFeedItemToolbar from './PostFeedItemToolbar';
import useMediaPressCallback from '../../../../hooks/useMediaPressCallback';
import useGalleryData from '../../../../hooks/useGalleryData';
import { TouchableWithoutFeedback, TouchableOpacity } from 'react-native-gesture-handler';

type Props = {
  post: Post;
  theme: ColorPalette;
  isSaved?: boolean;
  addToSavedPosts?: (post: Post) => void;
  removeFromSavedPosts?: (post: Post) => void;
  onMoreOptions?: (post: Post) => void;
};

const PostFeedItem = ({
  post,
  isSaved,
  addToSavedPosts,
  removeFromSavedPosts,
  theme,
  onMoreOptions,
}: Props) => {
  if (!post?.data) {
    console.log('post', post);
    return null;
  }

  const { width } = useWindowDimensions();

  const [maxGaleryResolutions, galleryCaptions] = useGalleryData(
    post.data.gallery_data,
    post.data.media_metadata
  );

  postCache.setCache(post.data.id, post);

  const onPress = useMediaPressCallback(post, router);

  const goToUserPage = useCallback(() => {
    if ('author' in post.data) {
      router.push({
        pathname: 'user',
        params: { userid: post.data.author },
      });
    }
  }, [post.data.author]);

  const isCrosspost = Array.isArray(post.data.crosspost_parent_list);
  const imageWidth = width - 16 * 2;
  const authorColor = post.data.stickied ? theme['custom-green'] : theme.primary;

  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <View
        style={{
          flex: 1,
          marginVertical: 6,
          paddingHorizontal: Spacing.s16,
          paddingVertical: 10,
          backgroundColor: theme.surface,
        }}>
        <View style={{ width: '100%', rowGap: 4 }}>
          <TouchableOpacity onPress={goToUserPage}>
            <Typography variant="overline" style={{ color: authorColor }}>
              {post.data.author}
              <Typography variant="overline" style={{ color: theme.secondary }}>
                {' '}
                • {timeDifference(post.data.created_utc * 1000, 'en')} • r/
                {post.data.subreddit}
              </Typography>
            </Typography>
          </TouchableOpacity>
          <Typography variant="titleMedium" style={{ fontWeight: '400' }}>
            {decode(post.data.title).trim()}
          </Typography>
          {post.data.link_flair_text && (
            <View style={{ flexDirection: 'row', paddingTop: 4 }}>
              <PostFlairChip
                flair_text={post.data.link_flair_text}
                flair_type={post.data.link_flair_type}
                flair_richtext={post.data.link_flair_richtext}
                flair_background_color={post.data.link_flair_background_color}
                pinned={post.data.pinned}
                stickied={post.data.stickied}
                outlined
                theme={theme}
                onPress={() => {
                  router.push({
                    pathname: 'subreddit/search',
                    params: {
                      subreddit: post.data.subreddit,
                      initialQuery: `flair:"${post.data.link_flair_text}"`,
                    },
                  });
                }}
              />
            </View>
          )}
        </View>

        <View style={{ paddingVertical: Spacing.s16, paddingTop: Spacing.s12 }}>
          <PostContentPreview post={post} imageWidth={imageWidth} theme={theme} />
          {!isCrosspost && maxGaleryResolutions && (
            <CarouselView
              captions={galleryCaptions}
              resolutions={maxGaleryResolutions}
              width={imageWidth}
            />
          )}
        </View>

        <PostFeedItemToolbar
          post={post}
          isSaved={isSaved}
          addToSavedPosts={addToSavedPosts}
          removeFromSavedPosts={removeFromSavedPosts}
          theme={theme}
          onMoreOptions={onMoreOptions}
        />
      </View>
    </TouchableWithoutFeedback>
  );
};

export default React.memo(PostFeedItem);
