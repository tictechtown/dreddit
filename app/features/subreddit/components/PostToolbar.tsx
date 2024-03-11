import { MaterialIcons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import React from 'react';
import { Share, TouchableNativeFeedback, TouchableOpacity, View } from 'react-native';
import { Post } from '../../../services/api';
import { Palette } from '../../colors';
import PostKarmaButton from '../../components/PostKarmaButton';
import Typography from '../../components/Typography';

type Props = {
  post: Post;
  isSaved: boolean | undefined;
  addToSavedPosts: ((post: Post) => void) | undefined;
  removeFromSavedPosts: ((post: Post) => void) | undefined;
};

const PostCommentButton = ({ comments }: { comments: number }) => {
  return (
    <View
      style={{
        backgroundColor: Palette.secondaryContainer,
        borderRadius: 8,
        paddingVertical: 6,
        paddingHorizontal: 10,
        flexDirection: 'row',
        alignItems: 'center',
        columnGap: 8,
      }}>
      <MaterialIcons name="question-answer" size={14} color={Palette.onSurface} />
      <Typography variant="labelMedium" style={{ color: Palette.onSecondaryContainer }}>
        {comments.toLocaleString('en-US')}
      </Typography>
    </View>
  );
};

const PostToolbar = ({ post, isSaved, addToSavedPosts, removeFromSavedPosts }: Props) => {
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
              <PostCommentButton comments={post.data.num_comments} />
            </View>
          </TouchableNativeFeedback>
        </Link>
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
          }}
          hitSlop={20}>
          <MaterialIcons name="share" size={24} color={Palette.onSurfaceVariant} />
        </TouchableOpacity>

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
            <MaterialIcons
              name={isSaved ? 'bookmark' : 'bookmark-outline'}
              size={24}
              color={isSaved ? Palette.onSurface : Palette.onSurfaceVariant}
            />
          </View>
        </TouchableNativeFeedback>
        <TouchableNativeFeedback
          background={TouchableNativeFeedback.Ripple(Palette.surfaceVariant, true, 20)}
          onPress={() => {}}
          hitSlop={20}>
          <View>
            <MaterialIcons name={'more-vert'} size={24} color={Palette.onSurfaceVariant} />
          </View>
        </TouchableNativeFeedback>
      </View>

      {/* View Profile?
    <Link
      href={{
        pathname: 'features/user',
        params: { userid: post.data.author },
      }}
      asChild>
      <TouchableOpacity hitSlop={20}>
        <Ionicons name="person" size={24} color={Palette.onSurface} />
      </TouchableOpacity>
    </Link> */}
    </View>
  );
};

export default PostToolbar;
