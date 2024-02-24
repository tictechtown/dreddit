import Markdown from '@ronradtke/react-native-markdown-display';
import { Image } from 'expo-image';
import { Link, Stack, router, useLocalSearchParams } from 'expo-router';
import { decode } from 'html-entities';
import queryString from 'query-string';
import { useEffect, useMemo, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { RedditApi, User } from '../../../services/api';
import { Palette } from '../../colors';
import { markdownIt, markdownRenderRules, markdownStyles } from '../../post/utils';
import { Spacing } from '../../typography';

// TODO -merge that with RedditApi t5
type SubredditData = {
  wiki_enabled: boolean;
  display_name: string;
  icon_img: string;
  created: number;
  display_name_prefixed: string;
  accounts_active: number;
  subscribers: number;
  name: string;
  public_description: string;
  community_icon: string;
  banner_background_image: string;
  description: string;
};

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
  const { subreddit } = useLocalSearchParams();
  const [about, setAbout] = useState<null | SubredditData>(null);
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
    // if (url.includes(`/r/${subreddit}`)) {
    //   return false;
    // }

    // return true to open with `Linking.openURL
    // return false to handle it yourself
    return true;
  };

  return (
    <View style={{ backgroundColor: Palette.backgroundLowest }}>
      <Stack.Screen options={{ title: about.display_name_prefixed }} />
      <ScrollView style={{ width: '100%' }}>
        <View style={{ alignItems: 'center', flex: 1 }}>
          <Image
            style={{ width: 128, height: 128, borderRadius: 64, marginVertical: Spacing.small }}
            source={subredditIcon}></Image>
          <Link
            href={{
              pathname: `features/subreddit/${about.display_name}`,
              params: { icon: subredditIcon },
            }}>
            <Text style={{ color: Palette.onBackgroundLowest, fontWeight: 'bold', fontSize: 20 }}>
              {about.display_name_prefixed}
            </Text>
          </Link>
          <View
            style={{
              marginVertical: Spacing.regular,
              width: '100%',
              flexDirection: 'row',
              justifyContent: 'space-evenly',
            }}>
            <View
              style={{
                flex: 1,
                backgroundColor: Palette.secondaryContainer,
                marginLeft: Spacing.regular,
                marginRight: Spacing.small,
                padding: Spacing.regular,
                borderRadius: 16,
                alignItems: 'center',
              }}>
              <Text style={{ color: Palette.onSecondaryContainer, marginBottom: Spacing.small }}>
                Subscribers
              </Text>
              <Text style={{ color: Palette.onBackgroundLowest, fontWeight: 'bold', fontSize: 20 }}>
                {about.subscribers.toLocaleString('en-US')}
              </Text>
            </View>
            <View
              style={{
                flex: 1,
                backgroundColor: Palette.secondaryContainer,
                marginLeft: Spacing.small,
                marginRight: Spacing.regular,
                padding: Spacing.regular,
                borderRadius: 16,
                alignItems: 'center',
              }}>
              <Text style={{ color: Palette.onSecondaryContainer, marginBottom: Spacing.small }}>
                Online
              </Text>
              <Text style={{ color: Palette.onBackgroundLowest, fontWeight: 'bold', fontSize: 20 }}>
                {about.accounts_active.toLocaleString('en-US')}
              </Text>
            </View>
          </View>
        </View>
        <View style={{ paddingHorizontal: Spacing.small, marginBottom: 50 }}>
          <Text style={{ color: Palette.onBackgroundLowest, fontSize: 26, fontWeight: 'bold' }}>
            About
          </Text>
          <Text style={{ color: Palette.onBackgroundLowest, marginBottom: Spacing.large }}>
            {about.public_description}
          </Text>
          <Text style={{ color: Palette.onBackgroundLowest, fontSize: 26, fontWeight: 'bold' }}>
            {wiki?.content_md ? 'Wiki' : 'Description'}
          </Text>
          {wiki?.content_md ? (
            <Markdown
              markdownit={markdownIt}
              style={markdownStyles}
              rules={markdownRenderRules}
              onLinkPress={onLinkPress}>
              {decode(wiki?.content_md)}
            </Markdown>
          ) : (
            <Markdown
              markdownit={markdownIt}
              style={markdownStyles}
              rules={markdownRenderRules}
              onLinkPress={onLinkPress}>
              {decode(about?.description)}
            </Markdown>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default Page;
