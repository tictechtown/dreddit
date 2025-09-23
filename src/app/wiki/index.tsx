import Markdown from '@ronradtke/react-native-markdown-display';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { decode } from 'html-entities';
import queryString from 'query-string';
import { useEffect, useState } from 'react';
import { ScrollView, View } from 'react-native';
import type { User } from '@services/api';
import { RedditApi } from '@services/api';
import useTheme from '@services/theme/useTheme';
import { markdownIt, markdownRenderRules, useMarkdownStyle } from '@features/post/utils';
import { Spacing } from '@theme/tokens';

interface Wikipage {
  content_md: string;
  may_revise: boolean;
  reason: string | null;
  revision_date: number;
  revision_id: string;
  revision_by: User;
  content_html: string;
}

const Page = () => {
  const theme = useTheme();
  const mdStyle = useMarkdownStyle(theme);
  const { subreddit, path } = useLocalSearchParams();
  const [wiki, setWiki] = useState<undefined | Wikipage>(undefined);

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
      const initialQuery = qs.query.q?.toString() ?? '';
      router.push({
        pathname: 'subreddit/search',
        params: { subreddit, initialQuery },
      });

      return false;
    }
    if (url.includes(`reddit.com/r/${subreddit}/wiki/`)) {
      const paths = url.split('/');
      const commentIndex = paths.findIndex((v) => v === 'wiki');
      const path = paths.slice(commentIndex + 1).join('/');
      router.push({
        pathname: 'wiki',
        params: { path: path, subreddit },
      });

      return false;
    }
    if (url.includes(`reddit.com/r/${subreddit}/comments/`)) {
      const paths = url.split('/');
      const commentIndex = paths.findIndex((v) => v === 'comments');

      router.push({
        pathname: `post/${paths[commentIndex + 1]}`,
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
              // @ts-ignore
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
