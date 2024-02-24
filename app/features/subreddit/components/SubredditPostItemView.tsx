import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { Link, router } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { decode } from 'html-entities';
import React, { useCallback, useMemo } from 'react';
import {
  Pressable,
  Share,
  Text,
  TouchableNativeFeedback,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';
import { Post } from '../../../services/api';
import postCache from '../../../services/postCache';
import { Palette } from '../../colors';
import CarouselView from '../../components/CarouselView';
import { Spacing } from '../../typography';
import { timeDifference } from '../../utils';
import { onLinkPress } from '../utils';
import FlairTextView from './FlairTextView';
import PostPreview from './PostPreview';

const SubredditPostItemView = ({
  post,
  hideToolbar,
  isSaved,
  addToSavedPosts,
  removeFromSavedPosts,
}: {
  post: Post;
  hideToolbar?: boolean;
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

  const isCrosspost = Array.isArray(post.data.crosspost_parent_list);
  const imageWidth = hideToolbar ? width - 75 : width - 20;

  return (
    <Pressable onPress={onPress}>
      <View
        style={{
          flex: 1,
          marginHorizontal: 10,
          marginVertical: 5,
          paddingVertical: 5,
          backgroundColor: Palette.backgroundLowest,
        }}>
        {(post.data.link_flair_text || post.data.pinned || post.data.stickied) && (
          <FlairTextView
            flair_text={post.data.link_flair_text}
            flair_richtext={post.data.link_flair_richtext}
            flair_background_color={post.data.link_flair_background_color}
            pinned={post.data.pinned}
            stickied={post.data.stickied}
            flair_type={post.data.link_flair_type}
            over_18={post.data.over_18}
            containerStyle={{ marginLeft: hideToolbar ? 0 : 20 }}
          />
        )}
        <Text
          style={{
            color: Palette.onBackgroundLowest,
            flex: 0,
            marginHorizontal: hideToolbar ? 0 : 20,
            marginVertical: 2,
            fontWeight: 'bold',
          }}>
          {decode(post.data.title)}
        </Text>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'baseline',
            marginLeft: hideToolbar ? 0 : 20,
          }}>
          <View style={{ flexDirection: 'row', marginBottom: 2, alignItems: 'center' }}>
            <Ionicons name="arrow-up" size={14} color="grey" style={{ marginRight: 0 }} />
            <Text style={{ color: Palette.onBackground, fontSize: 12, fontWeight: '300' }}>
              {post.data.ups - post.data.downs}
            </Text>
            <MaterialIcons
              name="question-answer"
              size={14}
              color="grey"
              style={{ marginLeft: 8, marginRight: 2, transform: [{ translateY: 0 }] }}
            />
            <Text style={{ color: Palette.onBackground, fontSize: 12, fontWeight: '300' }}>
              {post.data.num_comments}
            </Text>
          </View>
          <Text style={{ color: Palette.onBackground, fontSize: 12, fontWeight: '300' }}>
            <Ionicons style={{ marginRight: 4 }} name="time-outline" size={12} color="grey" />
            {timeDifference(post.data.created_utc * 1000, 'en')}
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginLeft: hideToolbar ? 0 : 20,
          }}>
          <Text style={{ color: Palette.onBackground, fontSize: 12, fontWeight: '300' }}>
            {post.data.domain}
          </Text>
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
                borderWidth: 1,
                borderRadius: 4,
                paddingHorizontal: Spacing.xsmall,
                paddingBottom: 2,
                backgroundColor: Palette.surfaceVariant,
              }}>
              <Text style={{ color: Palette.onSurface, fontSize: 12 }}>{post.data.subreddit}</Text>
            </View>
          </TouchableOpacity>
        </View>

        {isCrosspost && post.data.crosspost_parent_list !== undefined && (
          <View
            style={{
              borderColor: Palette.onBackground,
              borderWidth: 1,
              borderRadius: 8,
              marginTop: Spacing.small,
              paddingTop: Spacing.xsmall,
              marginHorizontal: Spacing.regular,
            }}>
            <SubredditPostItemView
              post={{ kind: 't3', data: post.data.crosspost_parent_list[0] }}
              hideToolbar
            />
          </View>
        )}

        <PostPreview post={post} imageWidth={imageWidth} />

        {!isCrosspost && maxGaleryResolutions && (
          <CarouselView resolutions={maxGaleryResolutions} width={imageWidth} />
        )}
        {!hideToolbar && (
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingHorizontal: 20,
              marginTop: Spacing.small,
              paddingVertical: Spacing.small,
            }}>
            {/* Share */}
            <TouchableOpacity
              onPress={async () => {
                await Share.share({ message: post.data.url });
              }}
              hitSlop={20}>
              <Ionicons name="share-social" size={24} color={Palette.onBackgroundLowest} />
            </TouchableOpacity>
            {/* View Subreddit */}
            <Link
              href={{
                pathname: 'features/subreddit/about',
                params: { subreddit: post.data.subreddit },
              }}
              asChild>
              <TouchableOpacity hitSlop={20}>
                <Ionicons
                  name="information-circle-outline"
                  size={26}
                  color={Palette.onBackgroundLowest}
                />
              </TouchableOpacity>
            </Link>

            {/* Save */}
            <TouchableNativeFeedback
              background={TouchableNativeFeedback.Ripple(Palette.surfaceVariant, true, 20)}
              onPress={async () => {
                if (isSaved) {
                  removeFromSavedPosts?.(post);
                } else {
                  addToSavedPosts?.(post);
                }
              }}
              hitSlop={20}>
              <View>
                <Ionicons
                  name={isSaved ? 'star' : 'star-outline'}
                  size={24}
                  color={isSaved ? Palette.primary : Palette.onBackgroundLowest}
                />
              </View>
            </TouchableNativeFeedback>

            {/* Comment */}
            <Link
              href={{
                pathname: `features/post/${post.data.id}`,
                params: { postid: post.data.id },
              }}
              asChild>
              <TouchableNativeFeedback
                hitSlop={20}
                background={TouchableNativeFeedback.Ripple(Palette.surfaceVariant, true, 20)}>
                <View>
                  <MaterialIcons
                    name="question-answer"
                    size={24}
                    color={Palette.onBackgroundLowest}
                  />
                </View>
              </TouchableNativeFeedback>
            </Link>
            {/* View Profile? */}
            <Link
              href={{
                pathname: 'features/user',
                params: { userid: post.data.author },
              }}
              asChild>
              <TouchableOpacity hitSlop={20}>
                <Ionicons name="person" size={24} color={Palette.onBackgroundLowest} />
              </TouchableOpacity>
            </Link>
          </View>
        )}
      </View>
    </Pressable>
  );
};

export default React.memo(SubredditPostItemView);
