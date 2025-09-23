/**
 * Parse token
 *  r/sub
 *  /r/sub
 *  u/reddit_user
 * /u/reddit_user
 */

import type { MarkdownIt } from '@ronradtke/react-native-markdown-display';
import markdownitRegexp from './markdownRegex';

interface Options {
  subreddit: boolean;
  reddituser: boolean;
}

type Tags = Record<keyof Options, { regex: RegExp; name: string }>;

export default function markdownItRedditLink(md: MarkdownIt, options: Options) {
  if (!options) {
    options = {
      subreddit: true,
      reddituser: true,
    };
  }

  const tags: Tags = {
    subreddit: {
      //r/subreddit
      regex: /(^\/?r\/[A-Za-z0-9_-]+| \/?r\/[A-Za-z0-9_-]+)/,
      name: 'a',
    },
    reddituser: {
      //u/reddituser
      regex: /(^\/?u\/[A-Za-z0-9_-]+| \/?u\/[A-Za-z0-9_-]+)/,
      name: 'a',
    },
  };

  const ids = Object.keys(tags);

  const replacer = (tag: any) =>
    function replacer(match: any, _config: any, _pluginOptions: any, env: any) {
      md.disable('image').disable(ids, true);
      const html = md.renderInline(match, env);
      md.enable('image').enable(ids, true);
      return `<${tag}>${html}</${tag}>`;
    };

  ids.forEach((id) => {
    // @ts-ignore
    if (!options[id]) {
      return;
    }
    // @ts-ignore
    const tag = tags[id];
    md.use(markdownitRegexp, { name: id, regex: tag.regex, replace: replacer(tag.name) });
  });
}
