import { MarkdownIt, RenderRules, hasParents } from '@ronradtke/react-native-markdown-display';
import { Link } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { ScrollView, Share, Text, View } from 'react-native';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import { Comment, Post } from '../../services/api';
import markdownRedditHeadingPlugin from '../../services/markdown/mardownRedditHeading';
import markdownItRedditLink from '../../services/markdown/markdownRedditLink';
import markdownItRedditSpoiler from '../../services/markdown/markdownRedditSpoiler';
import markdownItRedditSupsubscript from '../../services/markdown/markdownSupSubscript';
import { Palette } from '../colors';
import { Spacing } from '../typography';
import { getPreviewImageFromStreaminMe, getPreviewImageFromYoutube } from '../utils';
import PostSpoiler from './PostSpoiler';

export const markdownIt = MarkdownIt({
  linkify: true,
  typographer: true,
})
  .use(markdownRedditHeadingPlugin)
  .use(markdownItRedditSupsubscript)
  .use(markdownItRedditLink)
  .use(markdownItRedditSpoiler);

export const markdownStyles = {
  body: { color: Palette.onBackgroundLowest },
  heading1: {
    fontSize: 26,
    borderBottomWidth: 1,
    borderColor: Palette.surfaceVariant,
    marginTop: Spacing.small,
    paddingBottom: Spacing.small,
    marginBottom: Spacing.small,
    fontWeight: 'bold',
  },
  heading2: {
    fontSize: 20,
    borderBottomWidth: 1,
    borderColor: Palette.surfaceVariant,
    marginTop: Spacing.small,
    paddingBottom: Spacing.small,
    marginBottom: Spacing.small,
    fontWeight: 'bold',
  },
  heading3: {
    marginVertical: Spacing.xsmall,
    fontWeight: 'bold',
  },
  heading4: {
    marginVertical: Spacing.xsmall,
  },
  heading5: {
    marginVertical: Spacing.xsmall,
  },
  heading6: {
    marginVertical: Spacing.xsmall,
  },
  bullet_list: {
    marginVertical: Spacing.small,
  },
  ordered_list: {
    marginVertical: Spacing.small,
  },
  hr: { backgroundColor: Palette.onSurface, marginVertical: Spacing.regular },
  link: { color: Palette.primary },
  paragraph: { marginTop: 0, marginBottom: 0 },
  code_inline: {
    backgroundColor: Palette.surfaceVariant,
  },
  code_block: {
    backgroundColor: Palette.surfaceVariant,
    borderWidth: 0,
    marginVertical: Spacing.xsmall,
  },
  blockquote: {
    backgroundColor: Palette.backgroundLowest,
    borderColor: Palette.surfaceVariant,
    borderLeftWidth: 2,
    marginLeft: 0,
    paddingLeft: 6,
    marginBottom: Spacing.xsmall,
  },
  fence: {
    backgroundColor: Palette.surfaceVariant,
    borderWidth: 0,
    marginVertical: Spacing.xsmall,
  },
};

export const commentMarkdownStyles = {
  ...markdownStyles,
  heading1: {
    fontSize: 18,
    borderColor: Palette.surfaceVariant,
    marginTop: Spacing.small,
    paddingBottom: Spacing.small,
    marginBottom: Spacing.small,
    fontWeight: 'bold',
  },
  heading2: {
    fontSize: 18,
    borderColor: Palette.surfaceVariant,
    marginTop: Spacing.small,
    paddingBottom: Spacing.small,
    marginBottom: Spacing.small,
    fontWeight: 'bold',
  },
};

export function getMaxPreviewByDomain(post: Post | null | undefined) {
  if (!post?.data.preview) return null;
  if (post.data.domain === 'i.redd.it' && !post.data.preview) {
    return post.data.url.replaceAll('&amp;', '&');
  }
  if (post.data.domain === 'youtube.com') {
    return getPreviewImageFromYoutube(post.data.url, post.data.media);
  }
  // if (
  //   (post.data.domain === 'dubz.co' ||
  //     post.data.domain === 'dubz.link' ||
  //     post.data.domain === 'dubz.live') &&
  //   !post.data.preview
  // ) {
  //   return getPreviewImageFromDubz(post.data.url);
  // }

  if (post.data.domain === 'streamin.one' && !post.data.preview) {
    return getPreviewImageFromStreaminMe(post.data.url);
  }

  return getMaxPreview(post)?.url;
}

export function getMaxPreview(post: Post | null | undefined) {
  if (!post?.data.preview) return null;
  const allResolutions = post.data.preview?.images[0].resolutions;
  return allResolutions[allResolutions.length - 1];
}

export const markdownRenderRules: RenderRules = {
  table: (node, children, parent, styles) => {
    // a bit dirty, but we are using a scrollview only if the table contains more than 6 <thead>.<tr>.<th>
    // to determine the type, we look at the end of the key (should be _thead, _tr, _th)
    let shouldUseScrollView = false;
    // @ts-ignore
    if (children[0] != null && children[0].key.endsWith('_thead')) {
      // @ts-ignore
      const totalTH = children[0].props.children[0].props.children.length ?? 0;
      shouldUseScrollView = totalTH > 6;
    }
    if (shouldUseScrollView) {
      return (
        <ScrollView key={node.key} horizontal style={{ flex: 1 }}>
          <View style={styles._VIEW_SAFE_table}>{children}</View>
        </ScrollView>
      );
    } else {
      return <View style={styles._VIEW_SAFE_table}>{children}</View>;
    }
  },
  link: (node, children, parent, styles, onLinkPress) => (
    <Text
      key={node.key}
      style={styles.link}
      onLongPress={async () => {
        ReactNativeHapticFeedback.trigger('effectHeavyClick');
        await Share.share({ message: node.attributes.href.replaceAll('%5C', '') });
      }}
      onPress={() => {
        const link = node.attributes.href.replaceAll('%5C', '');
        if (onLinkPress) {
          const res = onLinkPress(link);
          if (res) {
            WebBrowser.openBrowserAsync(link);
          }
        } else {
          WebBrowser.openBrowserAsync(link);
        }
      }}>
      {children}
    </Text>
  ),
  superscript: (node, children, parent, styles) => (
    <Text
      key={node.key}
      style={{
        ...styles.body,
        fontSize: 10,
        lineHeight: 16,
        textAlignVertical: 'top',
      }}>
      {node.content}
    </Text>
  ),
  superscriptParenthesized: (node, children, parent, styles) => (
    <Text
      key={node.key}
      style={{
        ...styles.body,
        fontSize: 10,
        lineHeight: 16,
        textAlignVertical: 'top',
      }}>
      {node.content}
    </Text>
  ),
  subscript: (node, children, parent, styles) => (
    <Text
      key={node.key}
      style={{
        ...styles.body,
        fontSize: 10,
        lineHeight: 16,
      }}>
      {node.content}
    </Text>
  ),
  subscriptParenthesized: (node, children, parent, styles) => (
    <Text
      key={node.key}
      style={{
        ...styles.body,
        fontSize: 10,
        lineHeight: 16,
      }}>
      {node.content}
    </Text>
  ),
  spoiler: (node) => {
    return <PostSpoiler content={node.content.trim()} />;
  },
  subreddit: (node, children, parent, styles) => {
    let fontSize = undefined;
    for (const heading of [
      'heading1',
      'heading2',
      'heading3',
      'heading4',
      'heading5',
      'heading6',
    ]) {
      if (hasParents(parent, heading)) {
        fontSize = styles[heading].fontSize;
      }
    }
    const subreddit = node.content.replace('/r/', '').replace('r/', '').trim();
    return (
      <Link
        key={node.key}
        href={{
          pathname: `features/subreddit/${subreddit}`,
        }}>
        {' '}
        <Text style={[styles.link, { color: Palette.error, fontSize }]}>{node.content.trim()}</Text>
      </Link>
    );
  },
  reddituser: (node, children, parent, styles) => {
    let fontSize = undefined;
    for (const heading of [
      'heading1',
      'heading2',
      'heading3',
      'heading4',
      'heading5',
      'heading6',
    ]) {
      if (hasParents(parent, heading)) {
        fontSize = styles[heading].fontSize;
      }
    }

    return (
      <Link
        key={node.key}
        href={{
          pathname: 'features/user',
          params: { userid: node.content.replace('/u/', '').replace('u/', '').trim() },
        }}>
        <Text style={[styles.link, { color: Palette.tertiary, fontSize }]}>{node.content}</Text>
      </Link>
    );
  },
};

export function flattenComments(comments: Comment[]): Comment[] {
  return comments;
}

export function mergeComments(oldComments: Comment[], newComments: Comment[]): Comment[] {
  if (newComments.length === 0) {
    return oldComments;
  }
  const result: Comment[] = [...oldComments];
  const index = result.findIndex((c) =>
    Array.isArray(c) ? false : c.data.id === newComments[0].data.id
  );
  if (index > -1 && result[index].kind === 'more') {
    for (const newComment of newComments) {
      newComment.data.depth += result[index].data.depth;
    }
    // @ts-ignore
    result[index] = newComments;
  }

  return result.flat();
}
