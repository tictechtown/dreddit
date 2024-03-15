import { Link } from 'expo-router';
import { View } from 'react-native';
import { Post } from '../../../services/api';
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
        height: 48,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 24,
        columnGap: 24,
      }}>
      <Icons name={icon} size={24} color={theme.onSurface} />
      <Typography variant="bodyMedium">{title}</Typography>
    </View>
  );
};

const PostItemBottomSheet = ({ post }: { post: Post }) => {
  const theme = useTheme();
  return (
    <View>
      <Link
        href={{
          pathname: `features/subreddit/${post.data.subreddit}`,
        }}
        asChild>
        <Row
          icon={'arrow-outward'}
          title={`View ${post.data.subreddit_name_prefixed}`}
          theme={theme}
        />
      </Link>
      <Link
        href={{
          pathname: 'features/user',
          params: { userid: post.data.author },
        }}
        asChild>
        <Row icon={'person'} title={`View ${post.data.author} Profile`} theme={theme} />
      </Link>
      <Row icon={'block'} title={`Block ${post.data.author}`} theme={theme} />
      <Row icon={'report'} title={'Hide Subreddit'} theme={theme} />
      {Array.isArray(post.data.crosspost_parent_list) && (
        // TODO - go to the comments for this post instead
        <Link href={onLinkPress(post)} asChild>
          <Row icon={'verified'} title={'View Original Post'} theme={theme} />
        </Link>
      )}
      <Row icon={'image'} title={'View Preview Image'} theme={theme} />
    </View>
  );
};

export default PostItemBottomSheet;
