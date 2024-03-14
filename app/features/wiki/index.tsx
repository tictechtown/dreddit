import Markdown from '@ronradtke/react-native-markdown-display';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { decode } from 'html-entities';
import queryString from 'query-string';
import { useEffect, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { RedditApi, User } from '../../services/api';
import useTheme from '../../services/theme/useTheme';
import { markdownIt, markdownRenderRules, useMarkdownStyle } from '../post/utils';
import { Spacing } from '../tokens';

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
  const { subreddit, path } = useLocalSearchParams();
  const [wiki, setWiki] = useState<null | Wikipage>(null);

  useEffect(() => {
    async function getWiki() {
      const data = await new RedditApi().getSubredditWikiPage(subreddit as string, path as string);
      setWiki(data);
    }
    getWiki();
  }, [subreddit]);

  // TODO - refacator that
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
    // if (url.includes(`/r/${subreddit}`)) {
    //   return false;
    // }

    // return true to open with `Linking.openURL
    // return false to handle it yourself
    return true;
  };

  return (
    <View style={{ backgroundColor: theme.surface }}>
      <Stack.Screen options={{ title: subreddit as string }} />
      <ScrollView style={{ width: '100%' }}>
        <View style={{ alignItems: 'center', flex: 1, paddingHorizontal: Spacing.s16 }}>
          {wiki?.content_md && (
            <Markdown
              markdownit={markdownIt}
              style={mdStyle}
              rules={markdownRenderRules}
              onLinkPress={onLinkPress}>
              {decode(wiki?.content_md)}
            </Markdown>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default Page;
