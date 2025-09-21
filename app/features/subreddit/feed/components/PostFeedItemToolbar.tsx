import { router } from 'expo-router';
import React from 'react';
import { TouchableNativeFeedback, TouchableOpacity } from 'react-native-gesture-handler';
import { Share, View } from 'react-native';
import { Post } from '../../../../services/api';
import { ColorPalette } from '../../../colors';
import Icons from '../../../components/Icons';
import PostKarmaButton from '../../../components/PostKarmaButton';
import Typography from '../../../components/Typography';
import * as Haptics from 'expo-haptics';

type Props = {
  post: Post;
  theme: ColorPalette;
  isSaved: boolean | undefined;
  addToSavedPosts: ((post: Post) => void) | undefined;
  removeFromSavedPosts: ((post: Post) => void) | undefined;
  onMoreOptions: ((post: Post) => void) | undefined;
};

const PostCommentButton = ({ comments, theme }: { comments: number; theme: ColorPalette }) => {
  return (
    <View
      style={{
        backgroundColor: theme.secondaryContainer,
        borderRadius: 8,
        paddingVertical: 6,
        paddingHorizontal: 10,
        flexDirection: 'row',
        alignItems: 'center',
        columnGap: 8,
      }}>
      <Icons name="question-answer" size={14} color={theme.onSurface} />
      <Typography variant="labelMedium" style={{ color: theme.onSecondaryContainer }}>
        {comments.toLocaleString('en-US')}
      </Typography>
    </View>
  );
};

const PostFeedItemToolbar = ({
  post,
  theme,
  isSaved,
  addToSavedPosts,
  removeFromSavedPosts,
  onMoreOptions,
}: Props) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
      }}>
      <View
        style={{
          flexDirection: 'row',
          columnGap: 8,
        }}>
        <PostKarmaButton karma={post.data.score} />
        <TouchableOpacity
          hitSlop={20}
          onPress={() => {
            router.push({
              pathname: `features/post/${post.data.id}`,
              params: { postid: post.data.id },
            });
          }}>
          <PostCommentButton comments={post.data.num_comments} theme={theme} />
        </TouchableOpacity>
      </View>

      <View
        style={{
          flexDirection: 'row',
          columnGap: 12,
        }}>
        {/* Share */}
        <TouchableOpacity
          onPress={async () => {
            await Share.share({ message: post.data.url });
            await Haptics.performAndroidHapticsAsync(Haptics.AndroidHaptics.Keyboard_Tap);
          }}
          hitSlop={20}>
          <Icons name="share" size={24} color={theme.onSurfaceVariant} />
        </TouchableOpacity>

        {/* Save */}
        <TouchableNativeFeedback
          background={TouchableNativeFeedback.Ripple(theme.surfaceVariant, true, 20)}
          onPress={async () => {
            if (isSaved) {
              removeFromSavedPosts?.(post);
            } else {
              addToSavedPosts?.(post);
            }
            await Haptics.performAndroidHapticsAsync(Haptics.AndroidHaptics.Keyboard_Tap);
          }}
          hitSlop={20}>
          <View>
            <Icons
              name={isSaved ? 'bookmark' : 'bookmark-outline'}
              size={24}
              color={isSaved ? theme.primary : theme.onSurfaceVariant}
            />
          </View>
        </TouchableNativeFeedback>
        {/* More */}
        {!!onMoreOptions && (
          <TouchableNativeFeedback
            background={TouchableNativeFeedback.Ripple(theme.surfaceVariant, true, 20)}
            onPress={() => {
              onMoreOptions(post);
            }}
            hitSlop={20}>
            <View>
              <Icons name={'more-vert'} size={24} color={theme.onSurfaceVariant} />
            </View>
          </TouchableNativeFeedback>
        )}
      </View>
    </View>
  );
};

export default PostFeedItemToolbar;
