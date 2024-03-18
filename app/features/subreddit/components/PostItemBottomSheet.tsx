import { router } from 'expo-router';
import { Pressable, View } from 'react-native';
import { Post } from '../../../services/api';
import { useStore } from '../../../services/store';
import useTheme from '../../../services/theme/useTheme';
import { ColorPalette } from '../../colors';
import Icons, { IconName } from '../../components/Icons';
import Typography from '../../components/Typography';
import { onLinkPress } from '../utils';

type RowProps = {
  icon: IconName;
  title: string;
  theme: ColorPalette;
};

const Row = ({ icon, title, theme }: RowProps) => {
  return (
    <View
      style={{
        height: 42,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        columnGap: 16,
      }}>
      <Icons name={icon} size={16} color={theme.onSurface} />
      <Typography variant="bodyMedium">{title}</Typography>
    </View>
  );
};

const PostItemBottomSheet = ({ post }: { post: Post }) => {
  const theme = useTheme();
  const { addToBannedList, addToBlockList } = useStore((state) => ({
    addToBannedList: state.addToBlockedSubreddits,
    addToBlockList: state.addToBlockedUsers,
  }));

  return (
    <View>
      <Pressable
        onPress={() => {
          router.push({
            pathname: `features/subreddit/${post.data.subreddit}`,
          });
        }}>
        <Row
          icon={'arrow-outward'}
          title={`View ${post.data.subreddit_name_prefixed}`}
          theme={theme}
        />
      </Pressable>
      <Pressable
        onPress={() => {
          router.push({
            pathname: `features/user`,
            params: { userid: post.data.author },
          });
        }}>
        <Row icon={'person'} title={`View ${post.data.author} Profile`} theme={theme} />
      </Pressable>
      <Pressable
        onPress={() => {
          addToBlockList(post.data.author);
        }}>
        <Row icon={'block'} title={`Block ${post.data.author}`} theme={theme} />
      </Pressable>
      <Pressable
        onPress={() => {
          addToBannedList(post.data.subreddit_name_prefixed);
        }}>
        <Row icon={'report'} title={`Hide ${post.data.subreddit_name_prefixed}`} theme={theme} />
      </Pressable>
      {Array.isArray(post.data.crosspost_parent_list) && (
        // TODO - go to the comments for this post instead
        <Pressable
          onPress={() => {
            router.push(onLinkPress(post));
          }}>
          <Row icon={'verified'} title={'View Original Post'} theme={theme} />
        </Pressable>
      )}
      <Row icon={'image'} title={'View Preview Image'} theme={theme} />
    </View>
  );
};

export default PostItemBottomSheet;
