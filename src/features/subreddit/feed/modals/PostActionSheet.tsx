import { router } from 'expo-router';
import { Pressable, View } from 'react-native';
import { Post } from '../../../../services/api';
import { useStore } from '../../../../services/store';
import useTheme from '../../../../services/theme/useTheme';
import { ColorPalette } from '../../../colors';
import Icons, { IconName } from '../../../components/Icons';
import Typography from '../../../components/Typography';
import { onLinkPress } from '../../utils';
import { BottomSheetView } from '@gorhom/bottom-sheet';
import * as WebBrowser from 'expo-web-browser';
import { Spacing } from '../../../tokens';

type RowProps = { icon: IconName; title: string; theme: ColorPalette };

const Row = ({ icon, title, theme }: RowProps) => {
  return (
    <View
      style={{
        height: 42,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        columnGap: 8,
      }}>
      <Icons name={icon} size={24} color={theme.onSurface} />
      <Typography variant="titleSmall">{title}</Typography>
    </View>
  );
};

const PostActionSheet = ({
  post,
  onClose,
}: {
  post: Post;
  onClose: (reason: string | null) => void;
}) => {
  const theme = useTheme();
  const { addToBannedList, addToBlockList } = useStore((state) => ({
    addToBannedList: state.addToBlockedSubreddits,
    addToBlockList: state.addToBlockedUsers,
  }));

  return (
    <BottomSheetView
      style={{
        flex: 1,
        backgroundColor: theme.surfaceContainer,
        paddingBottom: Spacing.s32,
      }}>
      <Pressable
        onPress={() => {
          router.push({ pathname: `subreddit/feed/${post.data.subreddit}` });
          onClose(null);
        }}>
        <Row
          icon={'arrow-outward'}
          title={`View ${post.data.subreddit_name_prefixed}`}
          theme={theme}
        />
      </Pressable>
      {Array.isArray(post.data.crosspost_parent_list) && (
        // TODO - go to the comments for this post instead
        <>
          <Pressable
            onPress={() => {
              router.push(onLinkPress(post));
              onClose(null);
            }}>
            <Row icon={'share'} title={'View Original Post'} theme={theme} />
          </Pressable>
          <Pressable
            onPress={() => {
              router.push({
                pathname: `subreddit/feed/${post.data.crosspost_parent_list![0].subreddit}`,
              });
              onClose(null);
            }}>
            <Row
              icon={'repeat'}
              title={`View ${post.data.crosspost_parent_list![0].subreddit_name_prefixed}`}
              theme={theme}
            />
          </Pressable>
        </>
      )}

      <Pressable
        onPress={() => {
          router.push({ pathname: `user`, params: { userid: post.data.author } });
          onClose(null);
        }}>
        <Row icon={'person'} title={`View ${post.data.author} Profile`} theme={theme} />
      </Pressable>
      <Pressable
        onPress={() => {
          addToBlockList(post.data.author);
          onClose('BLOCKED_USER');
        }}>
        <Row icon={'block'} title={`Block ${post.data.author}`} theme={theme} />
      </Pressable>
      <Pressable
        onPress={() => {
          addToBannedList(post.data.subreddit_name_prefixed);
          onClose('BANNED_SUBREDDIT');
        }}>
        <Row
          icon={'visibility-off'}
          title={`Hide ${post.data.subreddit_name_prefixed}`}
          theme={theme}
        />
      </Pressable>
      <Pressable
        onPress={() => {
          WebBrowser.openBrowserAsync(post.data.url.replaceAll('&amp;', '&'));
        }}>
        <Row icon={'open-in-new'} title={'Open Link with Browser'} theme={theme} />
      </Pressable>

      <Row icon={'image'} title={'View Preview Image'} theme={theme} />
    </BottomSheetView>
  );
};

export default PostActionSheet;
