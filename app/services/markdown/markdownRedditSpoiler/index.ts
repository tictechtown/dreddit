/**
 * Parse token
 *  r/sub
 *  /r/sub
 *  u/reddit_user
 * /u/reddit_user
 */

import { MarkdownIt } from '@ronradtke/react-native-markdown-display';
import markdownitRegexp from '../markdownRegex';
import blockquoteRule from './blockquoteRule';

type Options = {
  spoiler: boolean;
};

type Tags = Record<keyof Options, { regex: RegExp; name: string }>;

export default function markdownRedditSpoiler(md: MarkdownIt, options: Options) {
  if (!options)
    options = {
      spoiler: true,
    };

  const tags: Tags = {
    spoiler: {
      // >! !<
      regex: /\>\!([\s\S]+?)\!\</,
      name: 'spoiler',
    },
  };

  const ids = Object.keys(tags);

  const replacer = (tag: any) =>
    function (match: any, _config: any, _pluginOptions: any, env: any) {
      md.disable('image').disable(ids, true);
      const html = md.renderInline(match, env);
      md.enable('image').enable(ids, true);
      return `<${tag}>${html}</${tag}>`;
    };

  ids.forEach((id) => {
    // @ts-ignore
    if (!options[id]) return;
    // @ts-ignore
    const tag = tags[id];
    md.use(markdownitRegexp, { name: id, regex: tag.regex, replace: replacer(tag.name) });
  });

  md.block.ruler.at('blockquote', blockquoteRule);
}
