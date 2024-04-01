import Markdown from '@ronradtke/react-native-markdown-display';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { decode } from 'html-entities';
import queryString from 'query-string';
import { useEffect, useMemo, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { RedditApi, SubReddit, User } from '../../../services/api';
import useTheme from '../../../services/theme/useTheme';
import ItemSeparator from '../../components/ItemSeparator';
import SubredditIcon from '../../components/SubredditIcon';
import Typography from '../../components/Typography';
import { markdownIt, markdownRenderRules, useMarkdownStyle } from '../../post/utils';
import { Spacing } from '../../tokens';

type Wikipage = {
  content_md: string;
  may_revise: boolean;
  reason: string | null;
  revision_date: number;
  revision_id: string;
  revision_by: User;
  content_html: string;
};

const Page = () => {
  const theme = useTheme();
  const mdStyle = useMarkdownStyle(theme);
  const { subreddit } = useLocalSearchParams();
  const [about, setAbout] = useState<null | SubReddit['data']>(null);
  const [wiki, setWiki] = useState<null | Wikipage>(null);

  useEffect(() => {
    async function getAbout() {
      const data = await new RedditApi().getSubreddit(subreddit as string);
      setAbout(data);
    }
    async function getWiki() {
      const data = await new RedditApi().getSubredditWikiPage(subreddit as string, 'index');
      setWiki(data);
    }
    getWiki();
    getAbout();
  }, [subreddit]);

  const subredditIcon = useMemo(() => {
    if (!about) {
      return '';
    }
    if (about.icon_img && about.icon_img.length > 0) {
      return about.icon_img.replaceAll('&amp;', '&');
    }
    if (about.community_icon && about.community_icon.length > 0) {
      return about.community_icon.replaceAll('&amp;', '&');
    }
    return '';
  }, [about]);

  if (!about) {
    return (
      <View>
        <Stack.Screen options={{ title: `r/${subreddit}` }} />
      </View>
    );
  }

  const onLinkPress = (url: string) => {
    if (url.includes(`reddit.com/r/${subreddit}/search`)) {
      // some custom logic
      const qs = queryString.parseUrl(url);
      const initialQuery = qs.query.q;
      router.push({
        pathname: 'features/subreddit/search',
        params: { subreddit, initialQuery },
      });

      return false;
    }
    if (url.includes(`reddit.com/r/${subreddit}/wiki/`)) {
      const paths = url.split('/');
      const commentIndex = paths.findIndex((v) => v === 'wiki');
      const path = paths.slice(commentIndex + 1).join('/');
      router.push({
        pathname: 'features/wiki',
        params: { path: path, subreddit },
      });

      return false;
    }
    if (url.includes(`reddit.com/r/${subreddit}/comments/`)) {
      const paths = url.split('/');
      const commentIndex = paths.findIndex((v) => v === 'comments');

      router.push({
        pathname: `features/post/${paths[commentIndex + 1]}`,
        params: { postid: paths[commentIndex + 1] },
      });
      return false;
    }
    return true;
  };

  return (
    <View style={{ backgroundColor: theme.background }}>
      <Stack.Screen options={{ title: about.display_name_prefixed }} />
      <ScrollView style={{ width: '100%' }}>
        <View style={{ flex: 1, paddingHorizontal: 16, paddingVertical: 16 }}>
          <SubredditIcon icon={subredditIcon} size={140} nsfw={false} />
          <Typography variant="headlineMedium" style={{ marginTop: 10 }}>
            {about.display_name_prefixed}
          </Typography>
          <Typography variant="bodyMedium" style={{ color: theme.onSurfaceVariant, opacity: 0.8 }}>
            {(about.subscribers ?? 0).toLocaleString('en-US')} karma •{' '}
            {new Date(about.created_utc * 1000).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </Typography>
        </View>
        <View
          style={{
            paddingHorizontal: Spacing.s12,
            marginBottom: 50,
            flexDirection: 'column',
            rowGap: Spacing.s16,
          }}>
          {about.public_description && (
            <>
              <Typography variant="bodyMedium">{about.public_description}</Typography>
              <ItemSeparator fullWidth />
            </>
          )}
          <Markdown
            markdownit={markdownIt}
            style={mdStyle}
            rules={markdownRenderRules}
            onLinkPress={onLinkPress}>
            {wiki?.content_md ? decode(wiki?.content_md) : decode(about?.description)}
          </Markdown>
        </View>
      </ScrollView>
    </View>
  );
};

export default Page;
