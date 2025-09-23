/**
 * Inspired by markdown-it-reddit-supsubscript
 * Parse token
 *  ^superscript ^(superscript),
 * and  ~superscript ~(superscript).
 */

import type { MarkdownIt } from '@ronradtke/react-native-markdown-display';
import markdownitRegexp from './markdownRegex';

interface Options {
  superscriptParenthesized: boolean;
  superscript: boolean;
  subscriptParenthesized: boolean;
  // subscript: boolean;
}

type Tags = Record<keyof Options, { regex: RegExp; name: string }>;

export default function markdownItRedditSupsubscript(md: MarkdownIt, options: Options) {
  if (!options) {
    options = {
      superscriptParenthesized: true,
      superscript: true,
      subscriptParenthesized: true,
      // subscript: true,
    };
  }

  const tags: Tags = {
    superscriptParenthesized: {
      //^(superscript)
      regex: /\^+\(((?:\[[^\]]*\]\([^)]*\)|[\s\S])+?)\)/,
      name: 'sup',
    },
    superscript: {
      //^superscript
      regex: /\^+((?:\[[^\]]*\]\([^)]*\)|[\S])+)/,
      name: 'sup',
    },
    subscriptParenthesized: {
      //~(subscript)
      regex: /~\(((?:\[[^\]]*\]\([^)]*\)|[\s\S])+?)\)/,
      name: 'sub',
    },
    // subscript: {
    //   //~subscript
    //   regex: /\~((?:\[[^\]]*\]\([^)]*\)|[\S])+)/,
    //   name: 'sub',
    // },
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
